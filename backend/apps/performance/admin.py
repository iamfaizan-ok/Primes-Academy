from django.contrib import admin
from .models import IELTSTest

@admin.register(IELTSTest)
class IELTSTestAdmin(admin.ModelAdmin):
    list_display = ('student', 'test_number', 'test_date', 'overall_band', 'listening', 'reading', 'writing', 'speaking')
    list_filter = ('overall_band', 'test_date')
    search_fields = ('student__name', 'student__student_id')
    ordering = ('-test_date', 'student', 'test_number')
    readonly_fields = ('overall_band', 'created_at')
