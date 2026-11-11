from django.contrib import admin
from .models import Student

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('student_id', 'name', 'created_at')
    search_fields = ('name', 'student_id')
    ordering = ('-created_at',)
    readonly_fields = ('student_id', 'created_at')
