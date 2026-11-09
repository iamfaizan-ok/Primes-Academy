import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LucideChevronRight, 
  LucideArrowLeft, 
  LucideCheck, 
  LucideX
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
      <div className="py-14 text-center text-slate-400">
        <div className="inline-block w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mb-1.5" />
        <p className="text-xs">Loading attendance records...</p>
      </div>
    );
  }

  const history = data?.history || [];
  const total = history.length;
  const present = history.filter(h => h.status === 'Present').length;
  const rate = total > 0 ? ((present / total) * 100).toFixed(0) : '0';

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
          <Link to="/student/home" className="hover:text-slate-600 transition-colors">Home</Link>
          <LucideChevronRight className="w-3 h-3" />
          <span className="text-blue-600">Attendance</span>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 px-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-2xs flex items-center gap-1 text-xs font-semibold cursor-pointer"
            title="Go Back 1 Step"
          >
            <LucideArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Attendance Record</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">Full historical log of your class attendance</p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Sessions</span>
          <span className="text-2xl font-bold text-slate-900 mt-0.5 block">{total}</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Present</span>
          <span className="text-2xl font-bold text-emerald-600 mt-0.5 block">{present}</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Attendance Rate</span>
          <span className="text-2xl font-bold text-blue-600 mt-0.5 block">{rate}%</span>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-3.5 sm:p-4 border-b border-slate-100">
          <h3 className="text-sm sm:text-base font-bold text-slate-900">Historical Attendance Entries</h3>
          <p className="text-xs text-slate-500 mt-0.5">Verified daily by class instructor</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-[#f8fafc] text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Day</th>
                <th className="py-2.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-10 text-center text-slate-400 text-xs">
                    No attendance records found yet.
                  </td>
                </tr>
              ) : (
                history.map((record) => {
                  const isPresent = record.status === 'Present';
                  return (
                    <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-4 font-semibold text-slate-900">
                        {record.formatted_date || record.date}
                      </td>
                      <td className="py-2.5 px-4 text-slate-500">
                        {record.day_name}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          isPresent 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {isPresent ? (
                            <LucideCheck className="w-3 h-3 stroke-[2.5]" />
                          ) : (
                            <LucideX className="w-3 h-3 stroke-[2.5]" />
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

        <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={() => navigate('/student/home')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <LucideArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}
