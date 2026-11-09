from django.urls import path
from .views import StudentListCreateView, StudentDetailView, DashboardStatsView

urlpatterns = [
    path('students/', StudentListCreateView.as_view(), name='student-list-create'),
    path('students/<str:pk>/', StudentDetailView.as_view(), name='student-detail'),
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
]

