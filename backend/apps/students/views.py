from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q, Sum
from .models import Student
from .serializers import StudentSerializer
try:
    from apps.performance.models import IELTSTest
    from apps.finance.models import Payment
except ImportError:
    from backend.apps.performance.models import IELTSTest
    from backend.apps.finance.models import Payment

class StudentListCreateView(APIView):
    def get(self, request):
        if request.user.is_authenticated and request.user.role == 'student':
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
        if request.user.is_authenticated and request.user.role == 'student':
            return Response({'error': 'Students cannot create new student records.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            student = serializer.save()
            return Response(StudentSerializer(student).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StudentDetailView(APIView):
    def get_object(self, pk):
        try:
            if str(pk).isdigit():
                return Student.objects.filter(Q(id=int(pk)) | Q(student_id=str(pk))).first()
            return Student.objects.filter(student_id=str(pk)).first()
        except Exception:
            return None

    def get(self, request, pk):
        student = self.get_object(pk)
        if not student:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.is_authenticated and request.user.role == 'student':
            if request.user.student_profile_id != student.id:
                return Response({'error': 'Access denied: You can only view your own profile.'}, status=status.HTTP_403_FORBIDDEN)

        return Response(StudentSerializer(student).data)

    def patch(self, request, pk):
        if request.user.is_authenticated and request.user.role == 'student':
            return Response({'error': 'Students cannot modify student records.'}, status=status.HTTP_403_FORBIDDEN)

        student = self.get_object(pk)
        if not student:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = StudentSerializer(student, data=request.data, partial=True)
        if serializer.is_valid():
            updated = serializer.save()
            return Response(StudentSerializer(updated).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if request.user.is_authenticated and request.user.role == 'student':
            return Response({'error': 'Students cannot delete student records.'}, status=status.HTTP_403_FORBIDDEN)

        student = self.get_object(pk)
        if not student:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        student.delete()
        return Response({'success': True, 'message': 'Student deleted successfully'})

class DashboardStatsView(APIView):
    def get(self, request):
        if request.user.is_authenticated and request.user.role == 'student':
            return Response({'error': 'Students cannot access administrative dashboard statistics.'}, status=status.HTTP_403_FORBIDDEN)

        total_students = Student.objects.count()
        total_tests = IELTSTest.objects.count()
        total_payments = Payment.objects.aggregate(total=Sum('amount'))['total'] or 0
        return Response({
            'totalStudents': total_students,
            'totalTests': total_tests,
            'totalPayments': float(total_payments),
        })
