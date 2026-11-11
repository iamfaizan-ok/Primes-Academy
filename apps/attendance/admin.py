from django.contrib import admin
from .models import Attendance

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('student', 'attendance_date', 'status', 'day_name')
    list_filter = ('status', 'attendance_date')
    search_fields = ('student__name', 'student__student_id')
    ordering = ('-attendance_date',)
    readonly_fields = ('created_at',)
