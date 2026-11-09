from django.urls import path
from .views import FinanceOverviewListView, StudentFinanceView, PaymentDetailView

urlpatterns = [
    path('finance/', FinanceOverviewListView.as_view(), name='finance-overview'),
    path('finance/<str:studentId>/', StudentFinanceView.as_view(), name='student-finance'),
    path('finance/<str:studentId>/payments/', StudentFinanceView.as_view(), name='student-payment-create'),
    path('finance/<str:studentId>/payments/<int:paymentId>/', PaymentDetailView.as_view(), name='student-payment-detail'),
]

