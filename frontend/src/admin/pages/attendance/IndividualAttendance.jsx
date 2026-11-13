import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  LucideChevronRight, 
  LucideArrowLeft, 
  LucideCheck, 
  LucideX, 
  LucideUser
} from 'lucide-react';
import { attendanceApi } from '../../../services/api/attendanceApi';
import Alert from '../../../components/common/Alert';

export default function IndividualAttendance() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await attendanceApi.getStudentAttendance(studentId);
        setData(res);
      } catch (err) {
        setError(err.message || 'Failed to load attendance history.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [studentId]);

  if (loading) {
    return (
      <div className="py-14 text-center text-slate-400">
        <div className="inline-block w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mb-1.5" />
        <p className="text-xs">Loading attendance history...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <Alert type="error" message={error || 'Student not found'} />
        <button
          onClick={() => navigate('/admin/attendance')}
          className="mt-3 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5 cursor-pointer"
        >
          <LucideArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Attendance</span>
        </button>
      </div>
    );
  }

  const { student, history } = data;
  const totalSessions = history.length;
  const presentCount = history.filter(h => h.status === 'Present').length;
  const attendanceRate = totalSessions > 0 ? ((presentCount / totalSessions) * 100).toFixed(0) : '0';

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 sm:space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          <Link to="/admin/dashboard" className="hover:text-slate-600 transition-colors">Dashboard</Link>
          <LucideChevronRight className="w-3.5 h-3.5" />
          <Link to="/admin/attendance" className="hover:text-slate-600 transition-colors">Attendance</Link>
          <LucideChevronRight className="w-3.5 h-3.5" />
          <span className="text-blue-600 font-bold">Individual History</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/attendance')}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-xs flex items-center gap-2 text-sm font-semibold cursor-pointer"
            title="Back to Attendance Report"
          >
            <LucideArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Individual Attendance</h1>
        </div>
      </div>

      {/* Student Summary Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
            <LucideUser className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{student.name}</h2>
            <p className="text-xs font-mono font-semibold text-slate-500 mt-0.5">
              Student ID: {student.student_id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 sm:gap-8 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-8">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Sessions</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-0.5 block">{totalSessions}</span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Present</span>
            <span className="text-2xl font-extrabold text-emerald-600 mt-0.5 block">{presentCount}</span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Rate</span>
            <span className="text-2xl font-extrabold text-blue-600 mt-0.5 block">{attendanceRate}%</span>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Complete Historical Record</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Comprehensive attendance logs preserved in database</p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
            Active Student
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-[#f8fafc] text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-5">Date</th>
                <th className="py-3.5 px-5">Day</th>
                <th className="py-3.5 px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-slate-400 text-sm">
                    No attendance records logged yet for this student.
                  </td>
                </tr>
              ) : (
                history.map((record) => {
                  const isPresent = record.status === 'Present';
                  return (
                    <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-5 font-semibold text-slate-900 text-sm">
                        {record.formatted_date || record.date}
                      </td>
                      <td className="py-3.5 px-5 text-slate-600 text-sm font-medium">
                        {record.day_name}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          isPresent 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs' 
                            : 'bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs'
                        }`}>
                          {isPresent ? (
                            <LucideCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                          ) : (
                            <LucideX className="w-3.5 h-3.5 stroke-[2.5]" />
                          )}
                          <span>{record.status}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={() => navigate('/admin/attendance')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <LucideArrowLeft className="w-4 h-4" />
            <span>Back to Attendance</span>
          </button>
        </div>
      </div>
    </div>
  );
}
