from django.urls import path
from .views import AdminLoginView, StudentLoginView, LogoutView, MeView

urlpatterns = [
    path('admin/login/', AdminLoginView.as_view(), name='admin-login'),
    path('student/login/', StudentLoginView.as_view(), name='student-login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', MeView.as_view(), name='auth-me'),
]

