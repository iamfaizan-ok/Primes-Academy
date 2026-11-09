from rest_framework import serializers
from .models import Attendance

class AttendanceSerializer(serializers.ModelSerializer):
    day_name = serializers.ReadOnlyField()
    formatted_date = serializers.SerializerMethodField()

    class Meta:
        model = Attendance
        fields = ['id', 'student', 'attendance_date', 'status', 'day_name', 'formatted_date', 'created_at']

    def get_formatted_date(self, obj):
        return obj.attendance_date.strftime('%d-%m-%Y')

