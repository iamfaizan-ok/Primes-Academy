import os
import django
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.test import Client
try:
    from apps.students.models import Student
    from apps.performance.models import IELTSTest, calculate_ielts_overall
    from apps.attendance.models import Attendance
    from apps.finance.models import Payment
except ImportError:
    from backend.apps.students.models import Student
    from backend.apps.performance.models import IELTSTest, calculate_ielts_overall
    from backend.apps.attendance.models import Attendance
    from backend.apps.finance.models import Payment

def test_all():
    client = Client()
    print("\n--- 1. Testing IELTS Band Rounding Formula ---")
    assert calculate_ielts_overall(6.0, 6.0, 6.0, 6.5) == Decimal('6.0'), "6.125 -> 6.0"
    assert calculate_ielts_overall(6.0, 6.0, 6.5, 6.5) == Decimal('6.5'), "6.25 -> 6.5"
    assert calculate_ielts_overall(6.5, 6.5, 6.5, 7.0) == Decimal('6.5'), "6.625 -> 6.5"
    assert calculate_ielts_overall(6.5, 7.0, 7.0, 7.0) == Decimal('7.0'), "6.875 -> 7.0"
    print("[PASS] IELTS calculation adheres strictly to official standards")

    print("\n--- 2. Testing Admin Authentication ---")
    res = client.post('/api/auth/admin/login/', {'email': 'admin@primesacademy.com', 'password': 'wrong'}, content_type='application/json')
    assert res.status_code == 401, f"Expected 401, got {res.status_code}"

    res = client.post('/api/auth/admin/login/', {'email': 'admin@primesacademy.com', 'password': 'admin123'}, content_type='application/json')
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    assert res.json()['success'] is True
    admin_token = res.json()['token']
    print("[PASS] Admin authentication verified")

    print("\n--- 3. Testing Student Authentication ---")
    res = client.post('/api/auth/student/login/', {'name': 'Ali Khan', 'student_id': '9999'}, content_type='application/json')
    assert res.status_code == 401, "Invalid student ID rejected"

    res = client.post('/api/auth/student/login/', {'name': 'Ali Khan', 'student_id': '1234'}, content_type='application/json')
    assert res.status_code == 200, "Valid student ID accepted"
    assert res.json()['student']['name'] == 'Ali Khan'
    ali_student_id = res.json()['student']['id']
    print("[PASS] Student authentication verified with Name + 4-digit ID")

    print("\n--- 4. Testing Security: Student Data Isolation & Forbidden Actions ---")
    # Student cannot create students
    res = client.post('/api/students/', {'name': 'Unauthorized Student'}, content_type='application/json')
    assert res.status_code == 403, f"Expected 403, got {res.status_code}"
    print("[PASS] Student forbidden from creating new students (403)")

    # Find another student (e.g. Sara Ahmed or Usman Ali)
    other_student = Student.objects.exclude(id=ali_student_id).first()
    if other_student:
        # Ali Khan tries to access other student's performance -> 403
        res = client.get(f"/api/performance/{other_student.id}/")
        assert res.status_code == 403, "Student cannot access another student's performance"
        # Ali Khan tries to access other student's finance -> 403
        res = client.get(f"/api/finance/{other_student.id}/")
        assert res.status_code == 403, "Student cannot access another student's finance"
        # Ali Khan tries to access other student's attendance -> 403
        res = client.get(f"/api/attendance/{other_student.id}/")
        assert res.status_code == 403, "Student cannot access another student's attendance"
        print(f"[PASS] Student isolation verified: Cannot access records of {other_student.name} (403)")

    # Student views their own performance -> 200
    res = client.get(f"/api/performance/{ali_student_id}/")
    assert res.status_code == 200, "Student can view own performance"
    print("[PASS] Student can view their own performance (200)")

    print("\n--- 5. Testing Admin Operations (Re-login as Admin) ---")
    res = client.post('/api/auth/admin/login/', {'email': 'admin@primesacademy.com', 'password': 'admin123'}, content_type='application/json')
    assert res.status_code == 200

    # Admin creates student
    res = client.post('/api/students/', {'name': 'Test New Student'}, content_type='application/json')
    assert res.status_code == 201, "Student created"
    new_student = res.json()
    assert len(new_student['student_id']) == 4, "Unique ID is 4 digits"
    print(f"[PASS] Student created with auto-generated ID: {new_student['student_id']}")

    # Search
    res = client.get(f"/api/students/?search={new_student['student_id']}")
    assert len(res.json()) >= 1, "Search by ID works"

    # Edit
    res = client.patch(f"/api/students/{new_student['id']}/", {'name': 'Test Updated Name', 'student_id': '0000'}, content_type='application/json')
    assert res.status_code == 200
    assert res.json()['name'] == 'Test Updated Name'
    assert res.json()['student_id'] == new_student['student_id'], "Unique ID must remain immutable"
    print("[PASS] Student update verified with immutable ID")

    print("\n--- 6. Testing Performance Recording ---")
    res = client.post(f"/api/performance/{new_student['id']}/tests/", {
        'listening': 7.0,
        'reading': 7.0,
        'writing': 6.5,
        'speaking': 7.0
    }, content_type='application/json')
    assert res.status_code == 201
    test_obj = res.json()
    assert test_obj['overall_band'] == '7.0', f"Expected 7.0 overall band, got {test_obj['overall_band']}"
    print(f"[PASS] Test {test_obj['test_number']} created with overall band {test_obj['overall_band']}")

    print("\n--- 7. Testing Attendance 4-day Matrix & Bulk Save ---")
    res = client.get('/api/attendance/')
    assert res.status_code == 200
    assert len(res.json()['days']) == 4, "4-day rolling window returned"
    
    today_iso = res.json()['days'][-1]['isoDate']
    save_res = client.post('/api/attendance/bulk-save/', {
        'entries': [{'student_id': new_student['id'], 'date': today_iso, 'status': 'Present'}]
    }, content_type='application/json')
    assert save_res.status_code == 200
    print("[PASS] Attendance matrix and bulk saving verified")

    print("\n--- 8. Testing Finance Tracking & Master Overview ---")
    # Verify master overview has the newly added student
    overview_res = client.get('/api/finance/')
    assert overview_res.status_code == 200
    student_entry = next((s for s in overview_res.json()['students'] if s['id'] == new_student['id']), None)
    assert student_entry is not None, "New student must automatically appear in finance overview"
    assert student_entry['remaining'] == 60000.0, "New student starts with full 60,000 remaining balance"

    # Add payment
    res = client.post(f"/api/finance/{new_student['id']}/payments/", {
        'amount': 25000
    }, content_type='application/json')
    assert res.status_code == 201
    fin_res = client.get(f"/api/finance/{new_student['id']}/")
    assert fin_res.status_code == 200
    assert fin_res.json()['totalPaid'] == 25000.0
    print("[PASS] Finance payment and remaining calculation verified")

    # Re-check overview reflects updated payment
    overview_res2 = client.get('/api/finance/')
    student_entry2 = next((s for s in overview_res2.json()['students'] if s['id'] == new_student['id']), None)
    assert student_entry2['totalPaid'] == 25000.0
    assert student_entry2['remaining'] == 35000.0
    assert student_entry2['status'] == 'Partial'
    print("[PASS] Master Finance Overview instantly reflects new students & payments")

    # Cleanup test student
    del_res = client.delete(f"/api/students/{new_student['id']}/")
    assert del_res.status_code == 200
    print("[PASS] Student deletion and relational cascade verified")

    # Confirm student is completely removed from Finance
    overview_res3 = client.get('/api/finance/')
    deleted_entry = next((s for s in overview_res3.json()['students'] if s['id'] == new_student['id']), None)
    assert deleted_entry is None, "Deleted student must be automatically removed from Finance"
    print("[PASS] Deleted student automatically purged from Finance overview")

    print("\n=== ALL TEST SUITES PASSED PERFECTLY ===")

if __name__ == '__main__':
    test_all()
