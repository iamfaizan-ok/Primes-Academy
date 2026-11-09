from django.db import models
from django.utils import timezone

def get_current_date():
    return timezone.localdate()

class Payment(models.Model):
    student = models.ForeignKey(
        'students.Student',
        on_delete=models.CASCADE,
        related_name='payments'
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField(default=get_current_date)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-payment_date', '-created_at']

    def __str__(self):
        return f"{self.student.name} - Rs. {self.amount} ({self.payment_date})"

    @property
    def day_name(self):
        return self.payment_date.strftime('%A')
