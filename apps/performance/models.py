from decimal import Decimal
import math
from django.db import models
from django.utils import timezone

def calculate_ielts_overall(l, r, w, s):
    avg = float(l + r + w + s) / 4.0
    floor_val = math.floor(avg)
    frac = avg - floor_val
    if frac < 0.25:
        return Decimal(f"{floor_val:.1f}")
    elif frac < 0.75:
        return Decimal(f"{floor_val + 0.5:.1f}")
    else:
        return Decimal(f"{floor_val + 1:.1f}")

def get_current_date():
    return timezone.localdate()

class IELTSTest(models.Model):
    student = models.ForeignKey(
        'students.Student', 
        on_delete=models.CASCADE, 
        related_name='tests'
    )
    test_number = models.PositiveIntegerField()
    listening = models.DecimalField(max_digits=3, decimal_places=1)
    reading = models.DecimalField(max_digits=3, decimal_places=1)
    writing = models.DecimalField(max_digits=3, decimal_places=1)
    speaking = models.DecimalField(max_digits=3, decimal_places=1)
    overall_band = models.DecimalField(max_digits=3, decimal_places=1)
    test_date = models.DateField(default=get_current_date)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['test_number']
        unique_together = ('student', 'test_number')

    def __str__(self):
        return f"{self.student.name} - Test {self.test_number} ({self.overall_band})"

    def save(self, *args, **kwargs):
        self.overall_band = calculate_ielts_overall(
            self.listening, self.reading, self.writing, self.speaking
        )
        if not self.test_number:
            existing = IELTSTest.objects.filter(student=self.student)
            max_num = existing.aggregate(models.Max('test_number'))['test_number__max'] or 0
            self.test_number = max_num + 1
        super().save(*args, **kwargs)

    @property
    def day_name(self):
        return self.test_date.strftime('%A')
