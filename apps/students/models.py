import random
from django.db import models, transaction

class Student(models.Model):
    student_id = models.CharField(max_length=4, unique=True, db_index=True)
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.student_id})"

    @classmethod
    def generate_unique_student_id(cls):
        """
        Generate a unique 4-digit numeric ID with database uniqueness enforcement.
        """
        for _ in range(1000):
            candidate = f"{random.randint(1000, 9999)}"
            if not cls.objects.filter(student_id=candidate).exists():
                return candidate
        raise ValueError("Exhausted 4-digit unique student ID space.")
