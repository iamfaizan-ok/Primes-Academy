from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('student', 'amount', 'payment_date', 'day_name', 'created_at')
    list_filter = ('payment_date',)
    search_fields = ('student__name', 'student__student_id')
    ordering = ('-payment_date', '-created_at')
    readonly_fields = ('created_at',)
