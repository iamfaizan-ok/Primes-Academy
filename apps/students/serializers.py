from django.db import IntegrityError
from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'student_id', 'name', 'created_at']
        read_only_fields = ['id', 'student_id', 'created_at']

    def create(self, validated_data):
        for _ in range(10):
            try:
                unique_id = Student.generate_unique_student_id()
                return Student.objects.create(
                    student_id=unique_id,
                    **validated_data
                )
            except IntegrityError:
                continue
        raise serializers.ValidationError({"student_id": "Could not generate a unique student ID. Please try again."})

    def update(self, instance, validated_data):
        # Enforce that student_id cannot be changed
        instance.name = validated_data.get('name', instance.name)
        instance.save()
        return instance

