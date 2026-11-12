from decimal import Decimal
from django.db import IntegrityError
from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    student_id = serializers.CharField(required=False, max_length=4)
    course = serializers.CharField(required=False, default='IELTS Academic')
    total_fee = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=Decimal('60000.00'))
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Student
        fields = ['id', 'student_id', 'name', 'course', 'total_fee', 'password', 'created_at']
        read_only_fields = ['id', 'created_at']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Ensure password field is available in response for admin registration slip
        data['password'] = getattr(instance, '_registered_password', instance.student_id)
        return data

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        preferred_id = validated_data.pop('student_id', None)

        for _ in range(10):
            try:
                if preferred_id and not Student.objects.filter(student_id=preferred_id).exists():
                    unique_id = preferred_id
                else:
                    unique_id = Student.generate_unique_student_id()

                student = Student.objects.create(
                    student_id=unique_id,
                    **validated_data
                )
                student._registered_password = password if password else unique_id

                # Create backing User account for student
                try:
                    from apps.accounts.models import User
                except ImportError:
                    from backend.apps.accounts.models import User

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
                if password:
                    user.set_password(password)
                user.save()

                return student
            except IntegrityError:
                preferred_id = None
                continue
        raise serializers.ValidationError({"student_id": "Could not generate a unique student ID. Please try again."})

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        instance.name = validated_data.get('name', instance.name)
        if 'course' in validated_data:
            instance.course = validated_data.get('course')
        if 'total_fee' in validated_data:
            instance.total_fee = validated_data.get('total_fee')
        instance.save()

        if password:
            try:
                from apps.accounts.models import User
            except ImportError:
                from backend.apps.accounts.models import User
            user = User.objects.filter(student_profile=instance).first()
            if user:
                user.set_password(password)
                user.save()
        return instance

