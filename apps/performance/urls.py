from django.urls import path
from .views import StudentPerformanceView, StudentTestDetailView

urlpatterns = [
    path('performance/<str:studentId>/', StudentPerformanceView.as_view(), name='student-performance'),
    path('performance/<str:studentId>/tests/', StudentPerformanceView.as_view(), name='student-test-create'),
    path('performance/<str:studentId>/tests/<int:testId>/', StudentTestDetailView.as_view(), name='student-test-detail'),
]

