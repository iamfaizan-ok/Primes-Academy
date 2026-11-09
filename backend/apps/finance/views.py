from decimal import Decimal
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum, Q
from .models import Payment
from .serializers import PaymentSerializer
try:
    from apps.students.models import Student
    from apps.students.serializers import StudentSerializer
    from apps.accounts.permissions import student_has_access
except ImportError:
    from backend.apps.students.models import Student
    from backend.apps.students.serializers import StudentSerializer
    from backend.apps.accounts.permissions import student_has_access

STANDARD_ACADEMY_FEE = Decimal('60000.00')

class FinanceOverviewListView(APIView):
    """
    Returns an academy-wide finance summary and student-by-student financial status.
    Accessible to Administrators.
    """
    def get(self, request):
        if request.user.is_authenticated and request.user.role == 'student':
            return Response({'error': 'Students cannot view master finance overview.'}, status=status.HTTP_403_FORBIDDEN)

        search = request.query_params.get('search', '').strip()
        students_qs = Student.objects.all().order_by('name')
        if search:
            students_qs = students_qs.filter(
                Q(name__icontains=search) | Q(student_id__icontains=search)
            )

        students_data = []
        total_collected = Decimal('0.00')

        for student in students_qs:
            payments = Payment.objects.filter(student=student)
            paid = payments.aggregate(Sum('amount'))['amount__sum'] or Decimal('0.00')
            total_collected += paid
            remaining = max(Decimal('0.00'), STANDARD_ACADEMY_FEE - paid)
            last_payment = payments.order_by('-payment_date', '-created_at').first()

            if paid >= STANDARD_ACADEMY_FEE:
                status_label = 'Paid in Full'
            elif paid > 0:
                status_label = 'Partial'
            else:
                status_label = 'Pending'

            students_data.append({
                'id': student.id,
                'student_id': student.student_id,
                'name': student.name,
                'totalPaid': float(paid),
                'remaining': float(remaining),
                'paymentsCount': payments.count(),
                'lastPaymentDate': last_payment.payment_date.strftime('%d-%m-%Y') if last_payment else None,
                'status': status_label,
            })

        total_students_count = Student.objects.count()
        total_receivable = total_students_count * STANDARD_ACADEMY_FEE
        total_remaining = max(Decimal('0.00'), total_receivable - total_collected)

        return Response({
            'summary': {
                'totalCollected': float(total_collected),
                'totalReceivable': float(total_receivable),
                'totalRemaining': float(total_remaining),
                'totalStudents': total_students_count,
            },
            'students': students_data
        })

class StudentFinanceView(APIView):
    def get_student(self, student_id):
        try:
            if str(student_id).isdigit():
                return Student.objects.filter(Q(id=int(student_id)) | Q(student_id=str(student_id))).first()
            return Student.objects.filter(student_id=str(student_id)).first()
        except Exception:
            return None

    def get(self, request, studentId):
        student = self.get_student(studentId)
        if not student:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

        if not student_has_access(request.user, student):
            return Response({'error': 'Access denied: You can only view your own finance records.'}, status=status.HTTP_403_FORBIDDEN)

        payments = Payment.objects.filter(student=student).order_by('-payment_date', '-created_at')
        total_paid = payments.aggregate(Sum('amount'))['amount__sum'] or Decimal('0.00')
        remaining = max(Decimal('0.00'), STANDARD_ACADEMY_FEE - total_paid)

        return Response({
            'student': StudentSerializer(student).data,
            'payments': PaymentSerializer(payments, many=True).data,
            'totalPaid': float(total_paid),
            'remaining': float(remaining)
        })

    def post(self, request, studentId):
        if request.user.is_authenticated and request.user.role == 'student':
            return Response({'error': 'Students cannot record tuition payments.'}, status=status.HTTP_403_FORBIDDEN)

        student = self.get_student(studentId)
        if not student:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

        amount = request.data.get('amount')
        try:
            amount_dec = Decimal(str(amount))
            if amount_dec <= 0:
                raise ValueError()
        except:
            return Response({'error': 'A valid positive payment amount is required.'}, status=status.HTTP_400_BAD_REQUEST)

        payment = Payment.objects.create(
            student=student,
            amount=amount_dec
        )
        return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)

class PaymentDetailView(APIView):
    def patch(self, request, studentId, paymentId):
        if request.user.is_authenticated and request.user.role == 'student':
            return Response({'error': 'Students cannot modify payments.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            if str(studentId).isdigit():
                student = Student.objects.filter(Q(id=int(studentId)) | Q(student_id=str(studentId))).first()
            else:
                student = Student.objects.filter(student_id=str(studentId)).first()

            if not student:
                return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

            payment = Payment.objects.filter(student=student, id=paymentId).first()
            if not payment:
                return Response({'error': 'Payment record not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception:
            return Response({'error': 'Payment record not found'}, status=status.HTTP_404_NOT_FOUND)

        amount = request.data.get('amount')
        try:
            amount_dec = Decimal(str(amount))
            if amount_dec <= 0:
                raise ValueError()
        except:
            return Response({'error': 'A valid positive amount is required.'}, status=status.HTTP_400_BAD_REQUEST)

        payment.amount = amount_dec
        payment.save()
        return Response(PaymentSerializer(payment).data)
