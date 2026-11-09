from rest_framework import serializers
from .models import IELTSTest
try:
    from apps.students.serializers import StudentSerializer
except ImportError:
    from backend.apps.students.serializers import StudentSerializer

class IELTSTestSerializer(serializers.ModelSerializer):
    day_name = serializers.ReadOnlyField()

    class Meta:
        model = IELTSTest
        fields = [
            'id', 'student', 'test_number', 'listening', 'reading', 
            'writing', 'speaking', 'overall_band', 'test_date', 
            'day_name', 'created_at'
        ]
        read_only_fields = ['id', 'student', 'test_number', 'overall_band', 'created_at']

