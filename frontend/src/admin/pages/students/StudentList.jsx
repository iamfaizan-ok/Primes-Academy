import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LucidePlus, 
  LucideSearch, 
  LucideEdit, 
  LucideTrash2, 
  LucideChevronRight, 
  LucideUser,
  LucideActivity,
  LucideCalendar,
  LucideCreditCard
} from 'lucide-react';
import { studentApi } from '../../../services/api/studentApi';
import ConfirmModal from '../../../components/common/ConfirmModal';
import Alert from '../../../components/common/Alert';

export default function StudentList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, student: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (location.state?.message) {
      setAlert({ type: 'success', message: location.state.message });
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const fetchStudents = async (query = '') => {
    try {
      setLoading(true);
      const data = await studentApi.getStudents(query);
      setStudents(data);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to load students' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(search);
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    setCurrentPage(1);
    fetchStudents(val);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.student) return;
    try {
      setIsDeleting(true);
      await studentApi.deleteStudent(deleteModal.student.id);
      setAlert({ type: 'success', message: `Student "${deleteModal.student.name}" deleted successfully.` });
      setDeleteModal({ isOpen: false, student: null });
      fetchStudents(search);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to delete student' });
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPages = Math.ceil(students.length / itemsPerPage) || 1;
  const paginatedStudents = students.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
            <Link to="/admin/dashboard" className="hover:text-slate-600 transition-colors">Dashboard</Link>
            <LucideChevronRight className="w-3 h-3" />
            <span className="text-blue-600">All Students</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">All Students</h1>
        </div>

        <button
          onClick={() => navigate('/admin/students/add')}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#0d1728] to-[#162544] hover:from-[#111e38] hover:to-[#1b2f56] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          <LucidePlus className="w-3.5 h-3.5" />
          <span>Add New Student</span>
        </button>
      </div>

      {alert && (
        <Alert 
          type={alert.type} 
          message={alert.message} 
          onClose={() => setAlert(null)} 
        />
      )}

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Search Bar Header */}
        <div className="p-3 sm:p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <LucideSearch className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by Name or ID..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/60 text-xs sm:text-sm focus:outline-none focus:ring-1.5 focus:ring-blue-600 focus:bg-white focus:border-transparent transition-all"
            />
          </div>

          <div className="text-xs font-medium text-slate-500">
            Showing <span className="font-bold text-slate-800">{students.length}</span> registered students
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-[#f8fafc] text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-4 w-12">#</th>
                <th className="py-2.5 px-4">Name</th>
                <th className="py-2.5 px-4">Unique ID</th>
                <th className="py-2.5 px-4 text-center">Quick Links</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-slate-400">
                    <div className="inline-block w-5 h-5 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mb-1.5" />
                    <p className="text-xs">Loading students...</p>
                  </td>
                </tr>
              ) : paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-slate-500">
                    <LucideUser className="w-7 h-7 text-slate-300 mx-auto mb-1.5" />
                    <p className="font-semibold text-slate-800 text-xs">No Students Found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {search ? `No student matched "${search}".` : 'Add your first student to get started.'}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student, idx) => (
                  <tr 
                    key={student.id} 
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="py-2.5 px-4 text-xs font-semibold text-slate-400">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">
                        {student.name}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium border border-blue-100 text-[10px]">
                          {student.course || 'IELTS Academic'}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                        {student.student_id}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1">
                        <Link
                          to={`/admin/performance/${student.id}`}
                          title="View Performance"
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors flex items-center gap-1"
                        >
                          <LucideActivity className="w-3 h-3" />
                          <span>Tests</span>
                        </Link>
                        <Link
                          to={`/admin/attendance/${student.id}`}
                          title="View Attendance History"
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors flex items-center gap-1"
                        >
                          <LucideCalendar className="w-3 h-3" />
                          <span>Attendance</span>
                        </Link>
                        <Link
                          to={`/admin/finance/${student.id}`}
                          title="View Finance & Payments"
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors flex items-center gap-1"
                        >
                          <LucideCreditCard className="w-3 h-3" />
                          <span>Finance</span>
                        </Link>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        {/* Edit Button (Blue) */}
                        <button
                          onClick={() => navigate(`/admin/students/edit/${student.id}`)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
                          title="Edit Student"
                        >
                          <LucideEdit className="w-3.5 h-3.5" />
                        </button>
                        {/* Delete Button (Red) */}
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, student })}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                          title="Delete Student"
                        >
                          <LucideTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-3 border-t border-slate-100 flex items-center justify-end gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                  currentPage === pg
                    ? 'bg-brand-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {pg}
              </button>
            ))}
            {currentPage < totalPages && (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="w-8 h-8 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all"
              >
                &gt;
              </button>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Student"
        message={`Are you sure you want to permanently delete "${deleteModal.student?.name}" (ID: ${deleteModal.student?.student_id})? All associated test results, attendance and payment records will be removed.`}
        confirmText="Confirm Delete"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteModal({ isOpen: false, student: null })}
      />
    </div>
  );
}
