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
    from apps.accounts.permissions import student_has_access, is_admin_user
except ImportError:
    from backend.apps.students.models import Student
    from backend.apps.students.serializers import StudentSerializer
    from backend.apps.accounts.permissions import student_has_access, is_admin_user

STANDARD_ACADEMY_FEE = Decimal('60000.00')
ERROR_STUDENT_NOT_FOUND = 'Student not found'
ERROR_PAYMENT_NOT_FOUND = 'Payment record not found'

def resolve_student(student_id):
    try:
        val = str(student_id).strip()
        if len(val) == 4 and val.isdigit():
            student = Student.objects.filter(student_id=val).first()
            if student:
                return student
        if val.isdigit():
            student = Student.objects.filter(id=int(val)).first()
            if student:
                return student
        return Student.objects.filter(student_id=val).first()
    except Exception:
        return None

class FinanceOverviewListView(APIView):
    """
    Returns an academy-wide finance summary and student-by-student financial status.
    Accessible to Administrators.
    """
    def get(self, request):
        if not is_admin_user(request.user):
            return Response(
                {'error': 'Administrator authentication required to view finance overview.'}, 
                status=status.HTTP_401_UNAUTHORIZED if not request.user.is_authenticated else status.HTTP_403_FORBIDDEN
            )

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
        return resolve_student(student_id)

    def get(self, request, student_id):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

        student = self.get_student(student_id)
        if not student:
            return Response({'error': ERROR_STUDENT_NOT_FOUND}, status=status.HTTP_404_NOT_FOUND)

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

    def post(self, request, student_id):
        if not is_admin_user(request.user):
            return Response(
                {'error': 'Administrator authentication required to record payments.'}, 
                status=status.HTTP_401_UNAUTHORIZED if not request.user.is_authenticated else status.HTTP_403_FORBIDDEN
            )

        student = self.get_student(student_id)
        if not student:
            return Response({'error': ERROR_STUDENT_NOT_FOUND}, status=status.HTTP_404_NOT_FOUND)

        amount = request.data.get('amount')
        try:
            amount_dec = Decimal(str(amount))
            if amount_dec <= 0:
                raise ValueError()
        except (ValueError, TypeError, ArithmeticError):
            return Response({'error': 'A valid positive payment amount is required.'}, status=status.HTTP_400_BAD_REQUEST)

        create_kwargs = {'student': student, 'amount': amount_dec}
        date_val = request.data.get('payment_date')
        if date_val:
            create_kwargs['payment_date'] = date_val

        payment = Payment.objects.create(**create_kwargs)
        return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)

class PaymentDetailView(APIView):
    def patch(self, request, student_id, payment_id):
        if not is_admin_user(request.user):
            return Response(
                {'error': 'Administrator authentication required to modify payments.'}, 
                status=status.HTTP_401_UNAUTHORIZED if not request.user.is_authenticated else status.HTTP_403_FORBIDDEN
            )

        student = resolve_student(student_id)
        if not student:
            return Response({'error': ERROR_STUDENT_NOT_FOUND}, status=status.HTTP_404_NOT_FOUND)

        payment = Payment.objects.filter(student=student, id=payment_id).first()
        if not payment:
            return Response({'error': ERROR_PAYMENT_NOT_FOUND}, status=status.HTTP_404_NOT_FOUND)

        amount = request.data.get('amount')
        if amount is not None:
            try:
                amount_dec = Decimal(str(amount))
                if amount_dec <= 0:
                    raise ValueError()
                payment.amount = amount_dec
            except (ValueError, TypeError, ArithmeticError):
                return Response({'error': 'A valid positive amount is required.'}, status=status.HTTP_400_BAD_REQUEST)

        payment_date = request.data.get('payment_date')
        if payment_date:
            payment.payment_date = payment_date

        payment.save()
        return Response(PaymentSerializer(payment).data)

    def delete(self, request, student_id, payment_id):
        if not is_admin_user(request.user):
            return Response(
                {'error': 'Administrator authentication required to delete payments.'}, 
                status=status.HTTP_401_UNAUTHORIZED if not request.user.is_authenticated else status.HTTP_403_FORBIDDEN
            )

        student = resolve_student(student_id)
        if not student:
            return Response({'error': ERROR_STUDENT_NOT_FOUND}, status=status.HTTP_404_NOT_FOUND)

        payment = Payment.objects.filter(student=student, id=payment_id).first()
        if not payment:
            return Response({'error': ERROR_PAYMENT_NOT_FOUND}, status=status.HTTP_404_NOT_FOUND)

        payment.delete()
        return Response({'success': True, 'message': 'Payment record deleted successfully'})
