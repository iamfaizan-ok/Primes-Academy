from django.core.signing import TimestampSigner, BadSignature, SignatureExpired

signer = TimestampSigner(salt='primes-academy-cryptographic-auth-2026')

def generate_auth_token(user, role):
    """
    Generate a tamper-proof, cryptographically signed token containing user ID and role.
    """
    payload = {
        'uid': user.id,
        'role': role,
    }
    if hasattr(user, 'student_profile_id') and user.student_profile_id:
        payload['sid'] = user.student_profile_id
    return signer.sign_object(payload)

def verify_auth_token(token_str, max_age=86400 * 30):
    """
    Verify and unsign a cryptographic auth token.
    Returns payload dictionary if valid, None if tampered, forged, or expired.
    Default max_age: 30 days.
    """
    if not token_str or not isinstance(token_str, str):
        return None
    try:
        return signer.unsign_object(token_str, max_age=max_age)
    except (BadSignature, SignatureExpired, Exception):
        return None

