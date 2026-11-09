from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Avg, Q
from .models import IELTSTest
from .serializers import IELTSTestSerializer
try:
    from apps.students.models import Student
    from apps.students.serializers import StudentSerializer
    from apps.accounts.permissions import student_has_access
except ImportError:
    from backend.apps.students.models import Student
    from backend.apps.students.serializers import StudentSerializer
    from backend.apps.accounts.permissions import student_has_access

class StudentPerformanceView(APIView):
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

    def post(self, request, studentId):
        if request.user.is_authenticated and request.user.role == 'student':
            return Response({'error': 'Students cannot record or modify test scores.'}, status=status.HTTP_403_FORBIDDEN)

        student = self.get_student(studentId)
        if not student:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = IELTSTestSerializer(data=request.data)
        if serializer.is_valid():
            test = serializer.save(student=student)
            return Response(IELTSTestSerializer(test).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StudentTestDetailView(APIView):
    def get_student(self, student_id):
        try:
            if str(student_id).isdigit():
                return Student.objects.filter(Q(id=int(student_id)) | Q(student_id=str(student_id))).first()
            return Student.objects.filter(student_id=str(student_id)).first()
        except Exception:
            return None

    def get_test(self, student, test_id):
        try:
            return IELTSTest.objects.filter(student=student, id=test_id).first()
        except Exception:
            return None

    def get(self, request, studentId, testId):
        student = self.get_student(studentId)
        if not student:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

        if not student_has_access(request.user, student):
            return Response({'error': 'Access denied: You can only view your own test details.'}, status=status.HTTP_403_FORBIDDEN)

        test = self.get_test(student, testId)
        if not test:
            return Response({'error': 'Test not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            'student': StudentSerializer(student).data,
            'test': IELTSTestSerializer(test).data
        })

    def patch(self, request, studentId, testId):
        if request.user.is_authenticated and request.user.role == 'student':
            return Response({'error': 'Students cannot modify test records.'}, status=status.HTTP_403_FORBIDDEN)

        student = self.get_student(studentId)
        if not student:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        test = self.get_test(student, testId)
        if not test:
            return Response({'error': 'Test not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = IELTSTestSerializer(test, data=request.data, partial=True)
        if serializer.is_valid():
            updated = serializer.save()
            return Response(IELTSTestSerializer(updated).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
