from django.urls import path
from .views import StudentPerformanceView, StudentTestDetailView

urlpatterns = [
    path('performance/<str:student_id>/', StudentPerformanceView.as_view(), name='student-performance'),
    path('performance/<str:student_id>/tests/', StudentPerformanceView.as_view(), name='student-test-create'),
    path('performance/<str:student_id>/tests/<int:test_id>/', StudentTestDetailView.as_view(), name='student-test-detail'),
]

