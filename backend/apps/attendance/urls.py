from django.urls import path
from .views import AttendanceMatrixView, BulkAttendanceSaveView, StudentAttendanceDetailView

urlpatterns = [
    path('attendance/', AttendanceMatrixView.as_view(), name='attendance-matrix'),
    path('attendance/bulk-save/', BulkAttendanceSaveView.as_view(), name='attendance-bulk-save'),
    path('attendance/<str:studentId>/', StudentAttendanceDetailView.as_view(), name='student-attendance-detail'),
]

