from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Avg, Q
from .models import IELTSTest
from .serializers import IELTSTestSerializer
try:
    from apps.students.models import Student
    from apps.students.serializers import StudentSerializer
    from apps.accounts.permissions import student_has_access, is_admin_user
except ImportError:
    from backend.apps.students.models import Student
    from backend.apps.students.serializers import StudentSerializer
    from backend.apps.accounts.permissions import student_has_access, is_admin_user

ERROR_STUDENT_NOT_FOUND = 'Student not found'
ERROR_TEST_NOT_FOUND = 'Test not found'

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

class StudentPerformanceView(APIView):
    def get_student(self, student_id):
        return resolve_student(student_id)

    def get(self, request, student_id):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

        student = self.get_student(student_id)
        if not student:
            return Response({'error': ERROR_STUDENT_NOT_FOUND}, status=status.HTTP_404_NOT_FOUND)

        if not student_has_access(request.user, student):
            return Response({'error': 'Access denied: You can only view your own performance records.'}, status=status.HTTP_403_FORBIDDEN)

        tests = IELTSTest.objects.filter(student=student).order_by('test_number')
        tests_data = IELTSTestSerializer(tests, many=True).data

        if tests.exists():
            avg_score = tests.aggregate(Avg('overall_band'))['overall_band__avg']
            overall_score = f"{float(avg_score):.1f}"
        else:
            overall_score = "0.0"

        return Response({
            'student': StudentSerializer(student).data,
            'tests': tests_data,
            'overall_score': overall_score
        })

    def post(self, request, student_id):
        if not is_admin_user(request.user):
            return Response(
                {'error': 'Administrator authentication required to record test scores.'}, 
                status=status.HTTP_401_UNAUTHORIZED if not request.user.is_authenticated else status.HTTP_403_FORBIDDEN
            )

        student = self.get_student(student_id)
        if not student:
            return Response({'error': ERROR_STUDENT_NOT_FOUND}, status=status.HTTP_404_NOT_FOUND)

        serializer = IELTSTestSerializer(data=request.data)
        if serializer.is_valid():
            test = serializer.save(student=student)
            return Response(IELTSTestSerializer(test).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StudentTestDetailView(APIView):
    def get_student(self, student_id):
        return resolve_student(student_id)

    def get_test(self, student, test_id):
        try:
            return IELTSTest.objects.filter(student=student, id=test_id).first()
        except Exception:
            return None

    def get(self, request, student_id, test_id):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

        student = self.get_student(student_id)
        if not student:
            return Response({'error': ERROR_STUDENT_NOT_FOUND}, status=status.HTTP_404_NOT_FOUND)

        if not student_has_access(request.user, student):
            return Response({'error': 'Access denied: You can only view your own test details.'}, status=status.HTTP_403_FORBIDDEN)

        test = self.get_test(student, test_id)
        if not test:
            return Response({'error': ERROR_TEST_NOT_FOUND}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            'student': StudentSerializer(student).data,
            'test': IELTSTestSerializer(test).data
        })

    def patch(self, request, student_id, test_id):
        if not is_admin_user(request.user):
            return Response(
                {'error': 'Administrator authentication required to modify test records.'}, 
                status=status.HTTP_401_UNAUTHORIZED if not request.user.is_authenticated else status.HTTP_403_FORBIDDEN
            )

        student = self.get_student(student_id)
        if not student:
            return Response({'error': ERROR_STUDENT_NOT_FOUND}, status=status.HTTP_404_NOT_FOUND)
        test = self.get_test(student, test_id)
        if not test:
            return Response({'error': ERROR_TEST_NOT_FOUND}, status=status.HTTP_404_NOT_FOUND)

        serializer = IELTSTestSerializer(test, data=request.data, partial=True)
        if serializer.is_valid():
            updated = serializer.save()
            return Response(IELTSTestSerializer(updated).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, student_id, test_id):
        if not is_admin_user(request.user):
            return Response(
                {'error': 'Administrator authentication required to delete test records.'}, 
                status=status.HTTP_401_UNAUTHORIZED if not request.user.is_authenticated else status.HTTP_403_FORBIDDEN
            )

        student = self.get_student(student_id)
        if not student:
            return Response({'error': ERROR_STUDENT_NOT_FOUND}, status=status.HTTP_404_NOT_FOUND)
        test = self.get_test(student, test_id)
        if not test:
            return Response({'error': ERROR_TEST_NOT_FOUND}, status=status.HTTP_404_NOT_FOUND)

        test.delete()
        return Response({'success': True, 'message': 'Test deleted successfully'})
