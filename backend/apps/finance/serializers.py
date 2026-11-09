from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    day_name = serializers.ReadOnlyField()

    class Meta:
        model = Payment
        fields = ['id', 'student', 'amount', 'payment_date', 'day_name', 'created_at']
        read_only_fields = ['id', 'student', 'created_at']

