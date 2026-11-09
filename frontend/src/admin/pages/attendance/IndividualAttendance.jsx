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
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
          <Link to="/admin/dashboard" className="hover:text-slate-600 transition-colors">Dashboard</Link>
          <LucideChevronRight className="w-3 h-3" />
          <Link to="/admin/attendance" className="hover:text-slate-600 transition-colors">Attendance</Link>
          <LucideChevronRight className="w-3 h-3" />
          <span className="text-blue-600">Individual History</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Individual Attendance</h1>
      </div>

      {/* Student Summary Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-brand-900 shadow-2xs">
            <LucideUser className="w-5 h-5 text-brand-900" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">{student.name}</h2>
            <p className="text-[11px] font-mono font-semibold text-slate-500 mt-0.5">
              Unique ID: {student.student_id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-6">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sessions</span>
            <span className="text-xl font-bold text-slate-900">{totalSessions}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Present</span>
            <span className="text-xl font-bold text-emerald-600">{presentCount}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rate</span>
            <span className="text-xl font-bold text-blue-600">{attendanceRate}%</span>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-3.5 sm:p-4 border-b border-slate-100">
          <h3 className="text-sm sm:text-base font-bold text-slate-900">Complete Historical Record</h3>
          <p className="text-xs text-slate-500 mt-0.5">Comprehensive attendance logs preserved in database</p>
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
                    No attendance records logged yet for this student.
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
            onClick={() => navigate('/admin/attendance')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <LucideArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Attendance</span>
          </button>
        </div>
      </div>
    </div>
  );
}
