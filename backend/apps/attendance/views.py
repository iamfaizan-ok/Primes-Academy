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
    from apps.accounts.permissions import student_has_access
except ImportError:
    from backend.apps.students.models import Student
    from backend.apps.students.serializers import StudentSerializer
    from backend.apps.accounts.permissions import student_has_access

class AttendanceMatrixView(APIView):
    def get(self, request):
        if request.user.is_authenticated and request.user.role == 'student':
            return Response({'error': 'Students cannot view master attendance matrix.'}, status=status.HTTP_403_FORBIDDEN)

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

        matrix = []
        for student in students_qs:
            records = {}
            for day in rolling_days:
                att = Attendance.objects.filter(
                    student=student, 
                    attendance_date=day['isoDate']
                ).first()
                records[day['isoDate']] = att.status if att else 'Present'
            matrix.append({
                'student': StudentSerializer(student).data,
                'records': records
            })

        return Response({
            'days': rolling_days,
            'matrix': matrix
        })

class BulkAttendanceSaveView(APIView):
    def post(self, request):
        if request.user.is_authenticated and request.user.role == 'student':
            return Response({'error': 'Students cannot mark or save attendance.'}, status=status.HTTP_403_FORBIDDEN)

        entries = request.data.get('entries', [])
        if not isinstance(entries, list):
            return Response({'error': 'Expected a list of attendance entries'}, status=status.HTTP_400_BAD_REQUEST)

        for item in entries:
            student_id = item.get('student_id')
            date_str = item.get('date')
            att_status = item.get('status', 'Present')

            try:
                if str(student_id).isdigit():
                    student = Student.objects.filter(Q(id=int(student_id)) | Q(student_id=str(student_id))).first()
                else:
                    student = Student.objects.filter(student_id=str(student_id)).first()

                if student:
                    Attendance.objects.update_or_create(
                        student=student,
                        attendance_date=date_str,
                        defaults={'status': att_status}
                    )
            except Exception:
                continue

        return Response({'success': True, 'message': 'Attendance successfully synchronized.'})

class StudentAttendanceDetailView(APIView):
    def get(self, request, studentId):
        try:
            if str(studentId).isdigit():
                student = Student.objects.filter(Q(id=int(studentId)) | Q(student_id=str(studentId))).first()
            else:
                student = Student.objects.filter(student_id=str(studentId)).first()
        except Exception:
            student = None

        if not student:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

        if not student_has_access(request.user, student):
            return Response({'error': 'Access denied: You can only view your own attendance records.'}, status=status.HTTP_403_FORBIDDEN)

        history = Attendance.objects.filter(student=student).order_by('-attendance_date')
        return Response({
            'student': StudentSerializer(student).data,
            'history': AttendanceSerializer(history, many=True).data
        })
