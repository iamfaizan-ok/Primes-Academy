import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LucideSearch, 
  LucideChevronRight, 
  LucideCheck, 
  LucideX, 
  LucideSave, 
  LucideArrowLeft, 
  LucideExternalLink
} from 'lucide-react';
import { attendanceApi } from '../../../services/api/attendanceApi';
import Alert from '../../../components/common/Alert';

export default function AttendanceReport() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [days, setDays] = useState([]);
  const [attendanceState, setAttendanceState] = useState({});
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const fetchAttendance = async (query = '') => {
    try {
      setLoading(true);
      const res = await attendanceApi.getAttendanceMatrix(query);
      setDays(res.days);
      setStudents(res.matrix.map(m => m.student));

      const stateMap = {};
      res.matrix.forEach(item => {
        Object.entries(item.records).forEach(([date, status]) => {
          stateMap[`${item.student.id}_${date}`] = status;
        });
      });
      setAttendanceState(stateMap);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to load attendance.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance(search);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAttendance(search);
  };

  const toggleStatus = (studentId, date) => {
    const key = `${studentId}_${date}`;
    const current = attendanceState[key] || 'Present';
    const next = current === 'Present' ? 'Absent' : 'Present';
    setAttendanceState(prev => ({
      ...prev,
      [key]: next
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const entries = [];
      Object.entries(attendanceState).forEach(([key, status]) => {
        const [studentId, date] = key.split('_');
        entries.push({
          student_id: Number(studentId),
          date,
          status
        });
      });

      await attendanceApi.saveBulkAttendance(entries);
      setAlert({ type: 'success', message: 'Attendance records saved successfully in database!' });
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to save attendance.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
          <Link to="/admin/dashboard" className="hover:text-slate-600 transition-colors">Dashboard</Link>
          <LucideChevronRight className="w-3 h-3" />
          <span className="text-blue-600">Attendance</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Attendance Report</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Four-day rolling attendance grid with interactive status selection
        </p>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Main Container Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Search Bar Header */}
        <div className="p-3 sm:p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <LucideSearch className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Name or ID..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/60 text-xs sm:text-sm focus:outline-none focus:ring-1.5 focus:ring-blue-600 focus:bg-white focus:border-transparent transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#0d1728] to-[#162544] hover:from-[#111e38] text-white text-xs font-semibold transition-all cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Quick Legend */}
          <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <LucideCheck className="w-2.5 h-2.5 stroke-[3]" />
              </span>
              <span className="text-xs">Present</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                <LucideX className="w-2.5 h-2.5 stroke-[3]" />
              </span>
              <span className="text-xs">Absent</span>
            </div>
          </div>
        </div>

        {/* 4-Day Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-[#f8fafc] text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-4 w-60">Student</th>
                {days.map((day) => (
                  <th key={day.isoDate} className="py-2.5 px-4 text-center">
                    <div className="font-bold text-slate-800 text-xs">
                      {day.shortDay}
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal">
                      {day.dateStr}
                    </div>
                    {day.isToday && (
                      <span className="inline-block mt-0.5 text-[9px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 font-bold uppercase tracking-tight">
                        Today
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <div className="inline-block w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mb-1.5" />
                    <p className="text-xs">Loading attendance...</p>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400 text-xs">
                    No students found.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Link
                            to={`/admin/attendance/${student.id}`}
                            className="font-bold text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1.5 text-xs sm:text-sm"
                            title="View Individual History"
                          >
                            <span>{student.name}</span>
                            <LucideExternalLink className="w-3 h-3 text-slate-400" />
                          </Link>
                          <span className="text-[11px] font-mono text-slate-400">ID: {student.student_id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Rolling Day Columns */}
                    {days.map((day) => {
                      const key = `${student.id}_${day.isoDate}`;
                      const status = attendanceState[key] || 'Present';
                      const isPresent = status === 'Present';

                      return (
                        <td key={day.isoDate} className="py-2.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => toggleStatus(student.id, day.isoDate)}
                            className={`w-7 h-7 rounded-full inline-flex items-center justify-center transition-all cursor-pointer ${
                              isPresent
                                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 shadow-2xs'
                                : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 shadow-2xs'
                            }`}
                            title={`Click to toggle: currently ${status}`}
                          >
                            {isPresent ? (
                              <LucideCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                            ) : (
                              <LucideX className="w-3.5 h-3.5 stroke-[2.5]" />
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with Back and Save Attendance Buttons */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <LucideArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#0d1728] to-[#162544] hover:from-[#111e38] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-60"
          >
            {isSaving ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <LucideSave className="w-3.5 h-3.5" />
            )}
            <span>Save Attendance</span>
          </button>
        </div>
      </div>
    </div>
  );
}
