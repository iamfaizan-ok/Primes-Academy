import os
import django
from decimal import Decimal
from datetime import date, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
try:
    from apps.students.models import Student
    from apps.performance.models import IELTSTest
    from apps.attendance.models import Attendance
    from apps.finance.models import Payment
except ImportError:
    from backend.apps.students.models import Student
    from backend.apps.performance.models import IELTSTest
    from backend.apps.attendance.models import Attendance
    from backend.apps.finance.models import Payment

User = get_user_model()

def run():
    print("=== Initializing Primes Academy Database ===")

    # 1. Initialize Single Fixed Administrator
    admin_email = os.getenv('ADMIN_EMAIL', 'admin@primesacademy.com').strip().lower()
    admin_password = os.getenv('ADMIN_PASSWORD', 'admin123')

    admin_user = User.objects.filter(role='admin').first()
    if not admin_user:
        admin_user = User.objects.create_superuser(
            email=admin_email,
            password=admin_password,
            username='admin'
        )
        print(f"[+] Administrator created: {admin_email}")
    else:
        admin_user.email = admin_email
        admin_user.set_password(admin_password)
        admin_user.save()
        print(f"[OK] Administrator verified: {admin_email}")

    # 2. Seed initial Students matching reference image
    s1, _ = Student.objects.get_or_create(student_id='1234', defaults={'name': 'Ali Khan'})
    s2, _ = Student.objects.get_or_create(student_id='5678', defaults={'name': 'Sara Ahmed'})
    s3, _ = Student.objects.get_or_create(student_id='9012', defaults={'name': 'Usman Ali'})
    print("[OK] Students initialized (Ali Khan, Sara Ahmed, Usman Ali)")

    # 3. Seed tests for Ali Khan (ID: 1234)
    if not IELTSTest.objects.filter(student=s1).exists():
        IELTSTest.objects.create(
            student=s1,
            test_number=1,
            listening=Decimal('7.0'),
            reading=Decimal('7.0'),
            writing=Decimal('6.5'),
            speaking=Decimal('7.0'),
            test_date=date(2025, 4, 12)
        )
        IELTSTest.objects.create(
            student=s1,
            test_number=2,
            listening=Decimal('7.5'),
            reading=Decimal('7.5'),
            writing=Decimal('7.0'),
            speaking=Decimal('7.5'),
            test_date=date(2025, 4, 19)
        )
        IELTSTest.objects.create(
            student=s1,
            test_number=3,
            listening=Decimal('7.0'),
            reading=Decimal('7.0'),
            writing=Decimal('7.0'),
            speaking=Decimal('7.0'),
            test_date=date(2025, 4, 26)
        )
        print("[OK] IELTS Tests created for Ali Khan")

    # 4. Seed 4-day rolling attendance
    today = date.today()
    students = [s1, s2, s3]
    statuses = [
        ['Present', 'Present', 'Absent', 'Present'],
        ['Present', 'Absent', 'Present', 'Present'],
        ['Absent', 'Present', 'Present', 'Present'],
    ]
    for s_idx, st in enumerate(students):
        for day_offset in range(4):
            att_date = today - timedelta(days=3 - day_offset)
            st_val = statuses[s_idx][day_offset]
            Attendance.objects.update_or_create(
                student=st,
                attendance_date=att_date,
                defaults={'status': st_val}
            )
    print("[OK] Attendance matrix initialized")

    # 5. Seed Finance for Ali Khan
    if not Payment.objects.filter(student=s1).exists():
        Payment.objects.create(student=s1, amount=Decimal('10000.00'), payment_date=date(2025, 4, 1))
        Payment.objects.create(student=s1, amount=Decimal('5000.00'), payment_date=date(2025, 4, 15))
        print("[OK] Payment records created for Ali Khan")

    print("=== Database Initialization Completed Successfully ===")

if __name__ == '__main__':
    run()
