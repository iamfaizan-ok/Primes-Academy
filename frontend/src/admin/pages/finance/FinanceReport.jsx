import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  LucideSearch, 
  LucideChevronRight, 
  LucidePlus, 
  LucideEdit, 
  LucideTrash2,
  LucideWallet, 
  LucideCreditCard, 
  LucideCheckCircle2,
  LucideArrowLeft,
  LucideUsers,
  LucideEye,
  LucideTrendingUp,
  LucideCalendar,
  LucideAlertCircle
} from 'lucide-react';
import { financeApi } from '../../../services/api/financeApi';
import Alert from '../../../components/common/Alert';
import ConfirmModal from '../../../components/common/ConfirmModal';

export default function FinanceReport() {
  const { studentId: paramStudentId } = useParams();
  const navigate = useNavigate();

  // Overview state
  const [overview, setOverview] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'Paid in Full' | 'Partial' | 'Pending'
  const [loadingOverview, setLoadingOverview] = useState(true);

  // Individual student statement state
  const [selectedStudentId, setSelectedStudentId] = useState(paramStudentId || null);
  const [studentFinance, setStudentFinance] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(false);

  const [alert, setAlert] = useState(null);
  const [deletePaymentModal, setDeletePaymentModal] = useState({ isOpen: false, payment: null });
  const [isDeletingPayment, setIsDeletingPayment] = useState(false);

  const handleDeletePayment = async () => {
    if (!deletePaymentModal.payment || !studentFinance?.student) return;
    try {
      setIsDeletingPayment(true);
      await financeApi.deletePayment(studentFinance.student.id, deletePaymentModal.payment.id);
      setAlert({ type: 'success', message: 'Payment record deleted successfully.' });
      setDeletePaymentModal({ isOpen: false, payment: null });
      const data = await financeApi.getStudentFinance(studentFinance.student.id);
      setStudentFinance(data);
      fetchOverview(search);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to delete payment.' });
    } finally {
      setIsDeletingPayment(false);
    }
  };

  // Sync route param with selected student
  useEffect(() => {
    setSelectedStudentId(paramStudentId || null);
  }, [paramStudentId]);

  // Load Academy-Wide Finance Overview
  const fetchOverview = async (query = '') => {
    try {
      setLoadingOverview(true);
      const data = await financeApi.getFinanceOverview(query);
      setOverview(data);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to load finance overview' });
    } finally {
      setLoadingOverview(false);
    }
  };

  useEffect(() => {
    fetchOverview(search);
  }, []);

  // Load Individual Student Finance when selected
  useEffect(() => {
    if (!selectedStudentId) {
      setStudentFinance(null);
      return;
    }

    async function loadIndividual(id) {
      try {
        setLoadingStudent(true);
        const data = await financeApi.getStudentFinance(id);
        setStudentFinance(data);
      } catch (err) {
        setAlert({ type: 'error', message: err.message || 'Failed to load student finance details' });
      } finally {
        setLoadingStudent(false);
      }
    }

    loadIndividual(selectedStudentId);
  }, [selectedStudentId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOverview(search);
  };

  const handleSelectStudent = (id) => {
    setSelectedStudentId(id);
    navigate(`/admin/finance/${id}`);
  };

  const handleBackToOverview = () => {
    setSelectedStudentId(null);
    navigate('/admin/finance');
    fetchOverview(search);
  };

  // Filter students in table
  const filteredStudents = overview?.students ? overview.students.filter(s => {
    if (statusFilter === 'ALL') return true;
    return s.status === statusFilter;
  }) : [];

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
            <Link to="/admin/dashboard" className="hover:text-slate-600 transition-colors">Dashboard</Link>
            <LucideChevronRight className="w-3 h-3" />
            <Link to="/admin/finance" onClick={handleBackToOverview} className="hover:text-slate-600 transition-colors">Finance</Link>
            {selectedStudentId && studentFinance?.student && (
              <>
                <LucideChevronRight className="w-3 h-3" />
                <span className="text-blue-600 font-bold">{studentFinance.student.name}</span>
              </>
            )}
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Finance Report</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {selectedStudentId 
              ? `Individual fee ledger & payment history for ${studentFinance?.student?.name || 'student'}`
              : 'Academy-wide fee tracking, total collections, and student payment statuses'}
          </p>
        </div>

        {selectedStudentId ? (
          <button
            onClick={handleBackToOverview}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-2xs transition-all cursor-pointer self-start sm:self-auto"
          >
            <LucideArrowLeft className="w-3.5 h-3.5" />
            <span>All Students Finance</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live PostgreSQL Records
            </span>
          </div>
        )}
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* TOP 3 METRICS SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Collected */}
        <div className="bg-white rounded-xl p-4 sm:p-4.5 border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Collected</p>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
              Rs. {Number(overview?.summary?.totalCollected || 0).toLocaleString()}
            </h2>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
              <LucideTrendingUp className="w-3 h-3" />
              Tuition payments received
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-xs">
            <LucideCheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Total Pending / Remaining */}
        <div className="bg-white rounded-xl p-4 sm:p-4.5 border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Receivables</p>
            <h2 className="text-xl sm:text-2xl font-bold text-amber-700 mt-0.5">
              Rs. {Number(overview?.summary?.totalRemaining || 0).toLocaleString()}
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Out of Rs. {Number(overview?.summary?.totalReceivable || 0).toLocaleString()} expected
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shadow-xs">
            <LucideWallet className="w-5 h-5" />
          </div>
        </div>

        {/* Total Students in Finance */}
        <div className="bg-white rounded-xl p-4 sm:p-4.5 border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Registered Students</p>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
              {overview?.summary?.totalStudents || 0}
            </h2>
            <p className="text-[11px] text-blue-600 font-semibold mt-0.5">
              Standard Fee: Rs. 60,000 / student
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-xs">
            <LucideUsers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* VIEW 1: INDIVIDUAL STUDENT DETAIL VIEW (MATCHING EXACT REFERENCE DESIGN) */}
      {selectedStudentId && (
        <div>
          {loadingStudent ? (
            <div className="py-14 text-center text-slate-400 bg-white rounded-xl border border-slate-200/90 shadow-sm">
              <div className="inline-block w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mb-1.5" />
              <p className="text-xs">Loading student payment statement...</p>
            </div>
          ) : studentFinance?.student ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* Left Student Finance Summary Card */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Student Account</span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">{studentFinance.student.name}</h2>
                  <p className="text-xs font-mono font-semibold text-blue-600 mt-0.5">
                    (ID: {studentFinance.student.student_id})
                  </p>
                </div>

                {/* Total Paid Badge */}
                <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-between shadow-2xs">
                  <div>
                    <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Total Paid</p>
                    <h3 className="text-xl sm:text-2xl font-bold text-emerald-900 mt-0.5">
                      Rs. {Number(studentFinance.totalPaid).toLocaleString()}
                    </h3>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <LucideCheckCircle2 className="w-5 h-5" />
                  </div>
                </div>

                {/* Remaining Balance Badge */}
                <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200/70 flex items-center justify-between shadow-2xs">
                  <div>
                    <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">Remaining</p>
                    <h3 className="text-xl sm:text-2xl font-bold text-amber-900 mt-0.5">
                      Rs. {Number(studentFinance.remaining).toLocaleString()}
                    </h3>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                    <LucideWallet className="w-5 h-5" />
                  </div>
                </div>

                {/* Student Switcher Dropdown */}
                {overview?.students && overview.students.length > 1 && (
                  <div className="pt-2 border-t border-slate-100">
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Switch to another student:
                    </label>
                    <select
                      value={selectedStudentId}
                      onChange={(e) => handleSelectStudent(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1.5 focus:ring-blue-600 focus:bg-white"
                    >
                      {overview.students.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} (ID: {s.student_id}) — Paid: Rs. {Number(s.totalPaid).toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Right Payment History Table */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
                <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">Payment History</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Recorded fee installment transactions</p>
                  </div>

                  <button
                    onClick={() => navigate(`/admin/finance/${studentFinance.student.id}/add`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#0d1728] to-[#162544] hover:from-[#111e38] text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                  >
                    <LucidePlus className="w-3.5 h-3.5" />
                    <span>Add Amount</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm text-slate-700">
                    <thead className="bg-[#f8fafc] text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="py-2.5 px-4">Date</th>
                        <th className="py-2.5 px-4">Amount</th>
                        <th className="py-2.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentFinance.payments.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="py-10 text-center text-slate-400">
                            <LucideCreditCard className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
                            <p className="font-semibold text-slate-700 text-xs">No Payments Recorded Yet</p>
                            <p className="text-[11px] text-slate-400 mt-0.5 max-w-sm mx-auto">
                              This student has not submitted any installments. Click "Add Amount" above to log a payment.
                            </p>
                            <button
                              onClick={() => navigate(`/admin/finance/${studentFinance.student.id}/add`)}
                              className="mt-3 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
                            >
                              <LucidePlus className="w-3 h-3" />
                              <span>Add First Installment</span>
                            </button>
                          </td>
                        </tr>
                      ) : (
                        studentFinance.payments.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-2.5 px-4 font-medium text-slate-800">
                              <div className="flex items-center gap-1.5">
                                <LucideCalendar className="w-3.5 h-3.5 text-slate-400" />
                                <span>{p.payment_date}</span>
                              </div>
                              <span className="block text-[10px] text-slate-400 font-normal pl-5">
                                {p.day_name}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 font-bold text-slate-900 text-xs sm:text-sm">
                              Rs. {Number(p.amount).toLocaleString()}
                            </td>
                            <td className="py-2.5 px-4 text-right">
                              <div className="inline-flex items-center gap-1 justify-end">
                                <button
                                  onClick={() => navigate(`/admin/finance/${studentFinance.student.id}/edit/${p.id}`)}
                                  className="px-2.5 py-1 rounded-md text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all cursor-pointer inline-flex items-center gap-1 text-xs font-medium"
                                  title="Edit Payment"
                                >
                                  <LucideEdit className="w-3 h-3" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => setDeletePaymentModal({ isOpen: true, payment: p })}
                                  className="p-1.5 rounded-md text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all cursor-pointer inline-flex items-center"
                                  title="Delete Payment"
                                >
                                  <LucideTrash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center bg-white rounded-xl border border-slate-200/90">
              <LucideAlertCircle className="w-6 h-6 text-rose-500 mx-auto mb-1.5" />
              <p className="font-semibold text-slate-800 text-xs">Student not found.</p>
              <button
                onClick={handleBackToOverview}
                className="mt-2.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
              >
                Back to All Students
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: MASTER FINANCE DIRECTORY OF ALL STUDENTS */}
      {!selectedStudentId && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden space-y-3">
          {/* Search, Filter Tabs & Header */}
          <div className="p-3.5 sm:p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">Student Fee Management</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every student added to the academy is automatically synchronized here
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <LucideSearch className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    fetchOverview(e.target.value);
                  }}
                  placeholder="Search by name or ID..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/60 text-xs focus:outline-none focus:ring-1.5 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#0d1728] to-[#162544] text-white text-xs font-semibold shadow-2xs cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>

          {/* Status Filter Tabs */}
          <div className="px-4 flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'ALL', label: 'All Students' },
              { id: 'Paid in Full', label: 'Paid in Full' },
              { id: 'Partial', label: 'Partial Installment' },
              { id: 'Pending', label: 'No Payment Yet' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Master Table of All Students */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-700">
              <thead className="bg-[#f8fafc] text-[11px] font-bold text-slate-500 uppercase tracking-wider border-y border-slate-100">
                <tr>
                  <th className="py-2.5 px-4 w-12">#</th>
                  <th className="py-2.5 px-4">Student</th>
                  <th className="py-2.5 px-4">Unique ID</th>
                  <th className="py-2.5 px-4">Total Paid</th>
                  <th className="py-2.5 px-4">Remaining Balance</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingOverview ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="inline-block w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mb-1.5" />
                      <p className="text-xs">Loading student finance directory...</p>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400">
                      <LucideUsers className="w-7 h-7 text-slate-300 mx-auto mb-1.5" />
                      <p className="font-semibold text-slate-700 text-xs">No Students Found</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {statusFilter !== 'ALL'
                          ? `No students found with status "${statusFilter}".`
                          : search
                          ? `No student matched "${search}".`
                          : 'Add students in the "All Students" section to track finance.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s, idx) => (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="py-2.5 px-4 text-xs text-slate-400 font-semibold">
                        {idx + 1}
                      </td>

                      {/* Student Name */}
                      <td className="py-2.5 px-4">
                        <button
                          onClick={() => handleSelectStudent(s.id)}
                          className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-left flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm"
                        >
                          <span>{s.name}</span>
                        </button>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {s.paymentsCount > 0 
                            ? `${s.paymentsCount} installment${s.paymentsCount > 1 ? 's' : ''} (Last: ${s.lastPaymentDate})` 
                            : 'No payments made'}
                        </span>
                      </td>

                      {/* Unique ID */}
                      <td className="py-2.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                          {s.student_id}
                        </span>
                      </td>

                      {/* Total Paid */}
                      <td className="py-2.5 px-4 font-bold text-emerald-600 text-xs sm:text-sm">
                        Rs. {Number(s.totalPaid).toLocaleString()}
                      </td>

                      {/* Remaining Balance */}
                      <td className="py-2.5 px-4 font-bold text-amber-700 text-xs sm:text-sm">
                        Rs. {Number(s.remaining).toLocaleString()}
                      </td>

                      {/* Status Badge */}
                      <td className="py-2.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          s.status === 'Paid in Full'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : s.status === 'Partial'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {s.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleSelectStudent(s.id)}
                            className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium transition-colors inline-flex items-center gap-1 cursor-pointer"
                            title="View statement and payment history"
                          >
                            <LucideEye className="w-3 h-3" />
                            <span>Statement</span>
                          </button>

                          <button
                            onClick={() => navigate(`/admin/finance/${s.id}/add`)}
                            className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors inline-flex items-center gap-1 cursor-pointer"
                            title="Add tuition installment"
                          >
                            <LucidePlus className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Payment Confirm Modal */}
      <ConfirmModal
        isOpen={deletePaymentModal.isOpen}
        title="Delete Payment Record"
        message={`Are you sure you want to delete the payment of Rs. ${Number(deletePaymentModal.payment?.amount || 0).toLocaleString()} (Date: ${deletePaymentModal.payment?.payment_date})?`}
        confirmText="Confirm Delete"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={isDeletingPayment}
        onConfirm={handleDeletePayment}
        onClose={() => setDeletePaymentModal({ isOpen: false, payment: null })}
      />
    </div>
  );
}
