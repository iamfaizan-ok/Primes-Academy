from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, login, logout
from .models import User
try:
    from apps.students.models import Student
    from apps.accounts.tokens import generate_auth_token
except ImportError:
    from backend.apps.students.models import Student
    from backend.apps.accounts.tokens import generate_auth_token
from .serializers import AdminLoginSerializer, StudentLoginSerializer, UserSerializer

class AdminLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'error': 'Invalid request data'}, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email'].strip().lower()
        password = serializer.validated_data['password']

        user = authenticate(request, username=email, password=password)
        if not user or (user.role != 'admin' and not user.is_superuser):
            return Response(
                {'error': 'Invalid administrator email or password.'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        login(request, user)
        # Cryptographically signed auth token
        token = generate_auth_token(user, 'admin')
        return Response({
            'success': True,
            'token': token,
            'user': {
                'id': user.id,
                'email': user.email,
                'role': 'admin',
                'name': 'Administrator'
            }
        })

class StudentLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = StudentLoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'error': 'Name and 4-digit ID are required'}, status=status.HTTP_400_BAD_REQUEST)

        name = serializer.validated_data['name'].strip()
        student_id = serializer.validated_data['student_id'].strip()

        # Exact case-insensitive match on Student in PostgreSQL
        try:
            student = Student.objects.get(student_id=student_id, name__iexact=name)
        except Student.DoesNotExist:
            return Response(
                {'error': 'Invalid Student Name or Student ID. Only registered students can sign in.'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Get or create backing user account for authenticated session
        user, _ = User.objects.get_or_create(
            username=f"student_{student.student_id}",
            defaults={
                'email': f"student_{student.student_id}@primesacademy.local",
                'role': 'student',
                'student_profile': student
            }
        )
        if user.student_profile != student:
            user.student_profile = student
            user.save()

        login(request, user)
        # Cryptographically signed auth token
        token = generate_auth_token(user, 'student')

        return Response({
            'success': True,
            'token': token,
            'student': {
                'id': student.id,
                'student_id': student.student_id,
                'name': student.name,
                'course': getattr(student, 'course', 'IELTS Academic'),
                'created_at': student.created_at.strftime('%Y-%m-%d') if getattr(student, 'created_at', None) else None,
                'role': 'student'
            }
        })

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'success': True, 'message': 'Logged out successfully'})

class MeView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({'authenticated': False}, status=status.HTTP_401_UNAUTHORIZED)

        data = {
            'authenticated': True,
            'role': request.user.role,
            'email': request.user.email,
        }
        if request.user.student_profile:
            data['student'] = {
                'id': request.user.student_profile.id,
                'student_id': request.user.student_profile.student_id,
                'name': request.user.student_profile.name,
            }
        return Response(data)
