from django.db import models
from django.utils import timezone

def get_current_date():
    return timezone.localdate()

class Attendance(models.Model):
    STATUS_CHOICES = (
        ('Present', 'Present'),
        ('Absent', 'Absent'),
    )

    student = models.ForeignKey(
        'students.Student',
        on_delete=models.CASCADE,
        related_name='attendance_records'
    )
    attendance_date = models.DateField(default=get_current_date)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Present')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-attendance_date']
        unique_together = ('student', 'attendance_date')
        indexes = [
            models.Index(fields=['student', 'attendance_date']),
        ]

    def __str__(self):
        return f"{self.student.name} - {self.attendance_date} ({self.status})"

    @property
    def day_name(self):
        return self.attendance_date.strftime('%A')
