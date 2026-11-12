from rest_framework.authentication import BaseAuthentication, SessionAuthentication
try:
    from apps.accounts.models import User
    from apps.students.models import Student
    from apps.accounts.tokens import verify_auth_token
except ImportError:
    from backend.apps.accounts.models import User
    from backend.apps.students.models import Student
    from backend.apps.accounts.tokens import verify_auth_token

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
    1. Cryptographically signed Bearer tokens (tamper-proof, signed with SECRET_KEY).
    2. Active Django session (CSRF-exempt for decoupled SPA API calls).
    """
    def authenticate(self, request):
        # 1. Check Bearer Token in Authorization header
        auth_header = request.headers.get('Authorization') or request.META.get('HTTP_AUTHORIZATION')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ', 1)[1].strip()
            
            # Cryptographically verify the signed token
            payload = verify_auth_token(token)
            if payload and isinstance(payload, dict):
                user_id = payload.get('uid')
                role = payload.get('role')
                if user_id:
                    user = User.objects.filter(id=user_id, role=role).first()
                    if user:
                        return (user, None)

        # 2. Check Session
        session_auth = CsrfExemptSessionAuthentication()
        user_auth_tuple = session_auth.authenticate(request)
        if user_auth_tuple:
            return user_auth_tuple

        return None


