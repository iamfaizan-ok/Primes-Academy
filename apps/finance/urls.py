from django.urls import path
from .views import FinanceOverviewListView, StudentFinanceView, PaymentDetailView

urlpatterns = [
    path('finance/', FinanceOverviewListView.as_view(), name='finance-overview'),
    path('finance/<str:student_id>/', StudentFinanceView.as_view(), name='student-finance'),
    path('finance/<str:student_id>/payments/', StudentFinanceView.as_view(), name='student-payment-create'),
    path('finance/<str:student_id>/payments/<int:payment_id>/', PaymentDetailView.as_view(), name='student-payment-detail'),
]

