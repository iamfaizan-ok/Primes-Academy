import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LucideChevronRight, 
  LucideArrowLeft, 
  LucideCheck, 
  LucideX,
  LucideCalendarCheck,
  LucideCheckCircle2,
  LucideClock,
  LucideCalendar
} from 'lucide-react';
import { attendanceApi } from '../../../services/api/attendanceApi';
import { authApi } from '../../../services/api/authApi';
import Alert from '../../../components/common/Alert';

export default function StudentAttendance() {
  const navigate = useNavigate();
  const currentUser = authApi.getCurrentUser() || { id: 1, name: 'Ali Khan', student_id: '1234' };
  const studentIdentifier = currentUser.id || currentUser.student_id || 1;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await attendanceApi.getStudentAttendance(studentIdentifier);
        setData(res);
      } catch (err) {
        setError(err.message || 'Failed to load attendance records.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [studentIdentifier]);

  if (loading) {
    return (
      <div className="py-16 text-center text-slate-400">
        <div className="inline-block w-8 h-8 border-3 border-slate-300 border-t-blue-600 rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium">Loading attendance records...</p>
      </div>
    );
  }

  const history = data?.history || [];
  const total = history.length;
  const present = history.filter(h => h.status === 'Present').length;
  const rate = total > 0 ? ((present / total) * 100).toFixed(0) : '0';

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 sm:space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          <Link to="/student/home" className="hover:text-slate-600 transition-colors">Home</Link>
          <LucideChevronRight className="w-3.5 h-3.5" />
          <span className="text-blue-600 font-bold">Attendance</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-xs flex items-center gap-2 text-sm font-semibold cursor-pointer"
            title="Go Back 1 Step"
          >
            <LucideArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Attendance Record</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">Full historical log of your class attendance</p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Top 3 Metric Stat Cards - Senior Executive Standard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {/* Total Sessions */}
        <div className="bg-white rounded-xl p-4 sm:p-4.5 border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Sessions</span>
            <span className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 block tracking-tight">{total}</span>
          </div>
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-xs shrink-0">
            <LucideCalendarCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Present Sessions */}
        <div className="bg-white rounded-xl p-4 sm:p-4.5 border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Present</span>
            <span className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1 block tracking-tight">{present}</span>
          </div>
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-xs shrink-0">
            <LucideCheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white rounded-xl p-4 sm:p-4.5 border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Attendance Rate</span>
            <span className="text-xl sm:text-2xl font-bold text-blue-600 mt-1 block tracking-tight">{rate}%</span>
          </div>
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shadow-xs shrink-0">
            <LucideClock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Attendance History Table - Senior Executive Standard */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Historical Attendance Entries</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Verified daily by class instructor</p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
            Active Semester
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
                    No attendance records found yet.
                  </td>
                </tr>
              ) : (
                history.map((record) => {
                  const isPresent = record.status === 'Present';
                  return (
                    <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-5 font-semibold text-slate-800 text-sm">
                        <div className="flex items-center gap-2">
                          <LucideCalendar className="w-4 h-4 text-slate-400" />
                          <span>{record.formatted_date || record.date}</span>
                        </div>
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
            onClick={() => navigate('/student/home')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs cursor-pointer"
          >
            <LucideArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}
