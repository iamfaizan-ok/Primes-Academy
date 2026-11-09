import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import AdminLayout from '../admin/layouts/AdminLayout';
import AdminLogin from '../admin/pages/auth/AdminLogin';
import AdminDashboard from '../admin/pages/dashboard/AdminDashboard';
import StudentList from '../admin/pages/students/StudentList';
import AddStudent from '../admin/pages/students/AddStudent';
import EditStudent from '../admin/pages/students/EditStudent';
import PerformanceOverview from '../admin/pages/performance/PerformanceOverview';
import TestDetails from '../admin/pages/performance/TestDetails';
import AddTest from '../admin/pages/performance/AddTest';
import EditTest from '../admin/pages/performance/EditTest';
import AttendanceReport from '../admin/pages/attendance/AttendanceReport';
import IndividualAttendance from '../admin/pages/attendance/IndividualAttendance';
import FinanceReport from '../admin/pages/finance/FinanceReport';
import AddAmount from '../admin/pages/finance/AddAmount';
import EditPayment from '../admin/pages/finance/EditPayment';

// Auth Guard for Admin routes
function ProtectedAdminRoute({ children }) {
  const role = localStorage.getItem('primes_user_role');
  const token = localStorage.getItem('primes_auth_token');

  // Allow easy development browsing or check role === 'admin'
  if (!token || role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

export const adminRouteElements = (
  <>
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route
      path="/admin"
      element={
        <ProtectedAdminRoute>
          <AdminLayout />
        </ProtectedAdminRoute>
      }
    >
      <Route index element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="students" element={<StudentList />} />
      <Route path="students/add" element={<AddStudent />} />
      <Route path="students/edit/:studentId" element={<EditStudent />} />
      <Route path="performance" element={<PerformanceOverview />} />
      <Route path="performance/:studentId" element={<PerformanceOverview />} />
      <Route path="performance/:studentId/test/:testId" element={<TestDetails />} />
      <Route path="performance/:studentId/add-test" element={<AddTest />} />
      <Route path="performance/:studentId/test/:testId/edit" element={<EditTest />} />
      <Route path="attendance" element={<AttendanceReport />} />
      <Route path="attendance/:studentId" element={<IndividualAttendance />} />
      <Route path="finance" element={<FinanceReport />} />
      <Route path="finance/:studentId" element={<FinanceReport />} />
      <Route path="finance/:studentId/add" element={<AddAmount />} />
      <Route path="finance/:studentId/edit/:paymentId" element={<EditPayment />} />
    </Route>
  </>
);

