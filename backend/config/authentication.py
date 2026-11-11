from rest_framework.authentication import BaseAuthentication, SessionAuthentication
try:
    from apps.accounts.models import User
    from apps.students.models import Student
except ImportError:
    from backend.apps.accounts.models import User
    from backend.apps.students.models import Student

class CsrfExemptSessionAuthentication(SessionAuthentication):
    """
    SessionAuthentication subclass that does not enforce CSRF checks.
    Used for the decoupled React SPA frontend calling Django API endpoints.
    """
    def enforce_csrf(self, request):
        return

class DualSessionAndTokenAuthentication(BaseAuthentication):
    """
    Unified authentication supporting:
    1. Active Django session (CSRF-exempt for decoupled SPA API calls).
    2. Bearer tokens sent in the Authorization header.
    """
    def authenticate(self, request):
        # 1. Check Bearer Token in Authorization header
        auth_header = request.headers.get('Authorization') or request.META.get('HTTP_AUTHORIZATION')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ', 1)[1].strip()
            if token.startswith('admin_token_'):
                user_id_str = token.replace('admin_token_', '')
                if user_id_str.isdigit():
                    user = User.objects.filter(id=int(user_id_str), role='admin').first()
                    if user:
                        return (user, None)
            elif token.startswith('student_token_'):
                student_id_str = token.replace('student_token_', '')
                if student_id_str.isdigit():
                    student = Student.objects.filter(id=int(student_id_str)).first()
                    if student:
                        try:
                            if hasattr(student, 'user_account') and student.user_account:
                                return (student.user_account, None)
                        except Exception:
                            pass

                        user, _ = User.objects.get_or_create(
                            username=f"student_{student.student_id}",
                            defaults={
                                'email': f"student_{student.student_id}@primesacademy.local",
                                'role': 'student',
                                'student_profile': student
                            }
                        )
                        if user.student_profile_id != student.id:
                            user.student_profile = student
                            user.save(update_fields=['student_profile'])
                        return (user, None)

        # 2. Check Session
        session_auth = CsrfExemptSessionAuthentication()
        user_auth_tuple = session_auth.authenticate(request)
        if user_auth_tuple:
            return user_auth_tuple

        return None


