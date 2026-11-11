from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q, Sum
from .models import Student
from .serializers import StudentSerializer
try:
    from apps.performance.models import IELTSTest
    from apps.finance.models import Payment
    from apps.accounts.permissions import is_admin_user, student_has_access
except ImportError:
    from backend.apps.performance.models import IELTSTest
    from backend.apps.finance.models import Payment
    from backend.apps.accounts.permissions import is_admin_user, student_has_access

ERROR_STUDENT_NOT_FOUND = 'Student not found'

def resolve_student(pk):
    try:
        val = str(pk).strip()
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

class StudentListCreateView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

        if request.user.role == 'student':
            # Students can only query their own student record
            queryset = Student.objects.filter(id=request.user.student_profile_id)
            serializer = StudentSerializer(queryset, many=True)
            return Response(serializer.data)

        search = request.query_params.get('search', '').strip()
        queryset = Student.objects.all().order_by('name')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(student_id__icontains=search)
            )
        serializer = StudentSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not is_admin_user(request.user):
            return Response(
                {'error': 'Administrator authentication required to create student records.'}, 
                status=status.HTTP_401_UNAUTHORIZED if not request.user.is_authenticated else status.HTTP_403_FORBIDDEN
            )

        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            student = serializer.save()
            return Response(StudentSerializer(student).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StudentDetailView(APIView):
    def get_object(self, pk):
        return resolve_student(pk)

    def get(self, request, pk):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

        student = self.get_object(pk)
        if not student:
            return Response({'error': ERROR_STUDENT_NOT_FOUND}, status=status.HTTP_404_NOT_FOUND)

        if not student_has_access(request.user, student):
            return Response({'error': 'Access denied: You can only view your own profile.'}, status=status.HTTP_403_FORBIDDEN)

        return Response(StudentSerializer(student).data)

    def patch(self, request, pk):
        if not is_admin_user(request.user):
            return Response(
                {'error': 'Administrator authentication required to modify student records.'}, 
                status=status.HTTP_401_UNAUTHORIZED if not request.user.is_authenticated else status.HTTP_403_FORBIDDEN
            )

        student = self.get_object(pk)
        if not student:
            return Response({'error': ERROR_STUDENT_NOT_FOUND}, status=status.HTTP_404_NOT_FOUND)
        serializer = StudentSerializer(student, data=request.data, partial=True)
        if serializer.is_valid():
            updated = serializer.save()
            return Response(StudentSerializer(updated).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not is_admin_user(request.user):
            return Response(
                {'error': 'Administrator authentication required to delete student records.'}, 
                status=status.HTTP_401_UNAUTHORIZED if not request.user.is_authenticated else status.HTTP_403_FORBIDDEN
            )

        student = self.get_object(pk)
        if not student:
            return Response({'error': ERROR_STUDENT_NOT_FOUND}, status=status.HTTP_404_NOT_FOUND)
        student.delete()
        return Response({'success': True, 'message': 'Student deleted successfully'})

class DashboardStatsView(APIView):
    def get(self, request):
        if not is_admin_user(request.user):
            return Response(
                {'error': 'Administrator authentication required.'}, 
                status=status.HTTP_401_UNAUTHORIZED if not request.user.is_authenticated else status.HTTP_403_FORBIDDEN
            )

        total_students = Student.objects.count()
        total_tests = IELTSTest.objects.count()
        total_payments = Payment.objects.aggregate(total=Sum('amount'))['total'] or 0
        return Response({
            'totalStudents': total_students,
            'totalTests': total_tests,
            'totalPayments': float(total_payments),
        })
