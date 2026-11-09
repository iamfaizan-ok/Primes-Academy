from rest_framework import serializers
from .models import User
from apps.students.models import Student

class AdminLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class StudentLoginSerializer(serializers.Serializer):
    name = serializers.CharField()
    student_id = serializers.CharField(max_length=4)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'role']

