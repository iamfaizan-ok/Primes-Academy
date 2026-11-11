from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({'status': 'ok', 'service': 'Primes Academy API'})

urlpatterns = [
    path('', health_check, name='health-check'),
    path('health/', health_check, name='health-check-alt'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/', include('apps.students.urls')),
    path('api/', include('apps.performance.urls')),
    path('api/', include('apps.attendance.urls')),
    path('api/', include('apps.finance.urls')),
]
