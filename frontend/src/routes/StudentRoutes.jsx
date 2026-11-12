import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import StudentLayout from '../student/layouts/StudentLayout';
import StudentLogin from '../student/pages/auth/StudentLogin';
import StudentHome from '../student/pages/home/StudentHome';
import StudentPerformance from '../student/pages/performance/StudentPerformance';
import StudentTestDetails from '../student/pages/performance/StudentTestDetails';
import StudentAttendance from '../student/pages/attendance/StudentAttendance';
import StudentFinance from '../student/pages/finance/StudentFinance';

// Auth Guard for Student routes
function ProtectedStudentRoute({ children }) {
  const role = localStorage.getItem('primes_user_role');
  const token = localStorage.getItem('primes_auth_token');

  if (!token || role !== 'student') {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export const studentRouteElements = (
  <>
    <Route path="/login" element={<StudentLogin />} />
    <Route
      path="/student"
      element={
        <ProtectedStudentRoute>
          <StudentLayout />
        </ProtectedStudentRoute>
      }
    >
      <Route index element={<Navigate to="/student/home" replace />} />
      <Route path="home" element={<StudentHome />} />
      <Route path="performance" element={<StudentPerformance />} />
      <Route path="performance/:testId" element={<StudentTestDetails />} />
      <Route path="attendance" element={<StudentAttendance />} />
      <Route path="finance" element={<StudentFinance />} />
    </Route>
  </>
);

