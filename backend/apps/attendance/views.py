from datetime import timedelta
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from .models import Attendance
from .serializers import AttendanceSerializer
try:
    from apps.students.models import Student
    from apps.students.serializers import StudentSerializer
    from apps.accounts.permissions import student_has_access, is_admin_user
except ImportError:
    from backend.apps.students.models import Student
    from backend.apps.students.serializers import StudentSerializer
    from backend.apps.accounts.permissions import student_has_access, is_admin_user

ERROR_STUDENT_NOT_FOUND = 'Student not found'

def resolve_student(student_id):
    try:
        val = str(student_id).strip()
        if len(val) == 4 and val.isdigit():
            student = Student.objects.filter(student_id=val).first()
            if student:
                return student
        if val.isdigit():
            student = Student.objects.filter(id=int(val)).first()
            if student:
                return student
        return Student.objects.filter(student_id=val).first()
    except Exception:
        return None

class AttendanceMatrixView(APIView):
    def get(self, request):
        if not is_admin_user(request.user):
            return Response(
                {'error': 'Administrator authentication required to view attendance matrix.'}, 
                status=status.HTTP_401_UNAUTHORIZED if not request.user.is_authenticated else status.HTTP_403_FORBIDDEN
            )

        search = request.query_params.get('search', '').strip()
        students_qs = Student.objects.all().order_by('name')
        if search:
            students_qs = students_qs.filter(
                Q(name__icontains=search) | Q(student_id__icontains=search)
            )

        today = timezone.localdate()
        rolling_days = []
        for i in range(3, -1, -1):
            d = today - timedelta(days=i)
            rolling_days.append({
                'dateStr': d.strftime('%d-%m-%Y'),
                'isoDate': d.strftime('%Y-%m-%d'),
                'dayName': d.strftime('%A'),
                'shortDay': d.strftime('%a'),
                'isToday': (i == 0),
            })

        # Efficient batch query for all attendances in rolling window
        start_date = rolling_days[0]['isoDate']
        end_date = rolling_days[-1]['isoDate']
        attendances = Attendance.objects.filter(
            student__in=students_qs,
            attendance_date__range=[start_date, end_date]
        ).values('student_id', 'attendance_date', 'status')

        att_lookup = {
            (a['student_id'], str(a['attendance_date'])): a['status']
            for a in attendances
        }

        matrix = []
        for student in students_qs:
            records = {}
            for day in rolling_days:
                records[day['isoDate']] = att_lookup.get((student.id, day['isoDate']), 'Present')
            matrix.append({
                'student': StudentSerializer(student).data,
                'records': records
            })

        return Response({
            'days': rolling_days,
            'matrix': matrix,
            'isBeforeCutoff': timezone.localtime().hour < 12,
            'cutoffTime': '12:00 PM'
        })

class BulkAttendanceSaveView(APIView):
    def post(self, request):
        if not is_admin_user(request.user):
            return Response(
                {'error': 'Administrator authentication required to record attendance.'}, 
                status=status.HTTP_401_UNAUTHORIZED if not request.user.is_authenticated else status.HTTP_403_FORBIDDEN
            )

        entries = request.data.get('entries', [])
        if not isinstance(entries, list):
            return Response({'error': 'Expected a list of attendance entries'}, status=status.HTTP_400_BAD_REQUEST)

        today = timezone.localdate()
        today_str = today.strftime('%Y-%m-%d')
        now_hour = timezone.localtime().hour

        # Rule: Today's attendance can only be modified until 12:00 PM
        if now_hour >= 12 and not request.data.get('force_override'):
            return Response(
                {'error': "Attendance editing closed: Today's attendance can only be modified until 12:00 PM."},
                status=status.HTTP_400_BAD_REQUEST
            )

        saved_count = 0
        for item in entries:
            student_id = item.get('student_id')
            date_str = item.get('date')
            att_status = item.get('status', 'Present')

            # Rule: Previous attendance cannot be changed
            if date_str != today_str:
                continue

            try:
                student = resolve_student(student_id)
                if student:
                    Attendance.objects.update_or_create(
                        student=student,
                        attendance_date=date_str,
                        defaults={'status': att_status}
                    )
                    saved_count += 1
            except Exception:
                continue

        return Response({
            'success': True, 
            'message': f"Today's attendance successfully saved ({saved_count} records updated. Previous attendance is locked)."
        })

class StudentAttendanceDetailView(APIView):
    def get(self, request, student_id):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

        student = resolve_student(student_id)
        if not student:
            return Response({'error': ERROR_STUDENT_NOT_FOUND}, status=status.HTTP_404_NOT_FOUND)

        if not student_has_access(request.user, student):
            return Response({'error': 'Access denied: You can only view your own attendance records.'}, status=status.HTTP_403_FORBIDDEN)

        history = Attendance.objects.filter(student=student).order_by('-attendance_date')
        return Response({
            'student': StudentSerializer(student).data,
            'history': AttendanceSerializer(history, many=True).data
        })
