from rest_framework import permissions

class IsAdminRole(permissions.BasePermission):
    """
    Allows access only to authenticated Admin users.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.role == 'admin' or request.user.is_superuser)
        )

class IsStudentOwnerOrAdmin(permissions.BasePermission):
    """
    Allows access to Admin or the specific Student owner.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin' or request.user.is_superuser:
            return True
        # Check student ownership
        if hasattr(obj, 'student'):
            return obj.student == request.user.student_profile
        return obj == request.user.student_profile

def student_has_access(user, target_student):
    """
    Returns True if user is Admin, or if user is the student owning target_student.
    Returns False if unauthenticated or if a student attempts to access another student's data.
    """
    if not user or not user.is_authenticated:
        return False
    if user.role == 'admin' or user.is_superuser:
        return True
    if user.role == 'student':
        return user.student_profile_id == target_student.id
    return False

def is_admin_user(user):
    return bool(user and user.is_authenticated and (user.role == 'admin' or user.is_superuser))


