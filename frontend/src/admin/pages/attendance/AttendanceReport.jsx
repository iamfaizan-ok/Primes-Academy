import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LucideSearch, 
  LucideChevronRight, 
  LucideCheck, 
  LucideX, 
  LucideSave, 
  LucideArrowLeft, 
  LucideExternalLink,
  LucideLock,
  LucideClock
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

  // Check if current local time is past 12:00 PM (noon)
  const isCutoffPassed = new Date().getHours() >= 12;

  const isDayEditable = (day) => {
    // Rule: Past days are permanently locked
    if (!day || !day.isToday) return false;
    // Rule: Today can only be edited until 12:00 PM
    return !isCutoffPassed;
  };

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

  const toggleStatus = (studentId, day) => {
    if (!isDayEditable(day)) {
      setAlert({
        type: 'error',
        message: day.isToday
          ? "Today's attendance window closed at 12:00 PM and cannot be modified."
          : "Previous attendance records are locked and cannot be modified."
      });
      return;
    }

    const key = `${studentId}_${day.isoDate}`;
    const current = attendanceState[key] || 'Present';
    const next = current === 'Present' ? 'Absent' : 'Present';
    setAttendanceState(prev => ({
      ...prev,
      [key]: next
    }));
  };

  const handleSave = async () => {
    if (isCutoffPassed) {
      setAlert({
        type: 'error',
        message: "Today's attendance window closed at 12:00 PM. Saving is disabled."
      });
      return;
    }

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
      setAlert({ type: 'success', message: "Today's attendance records saved successfully in database!" });
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to save attendance.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 sm:space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
          <Link to="/admin/dashboard" className="hover:text-slate-600 transition-colors">Dashboard</Link>
          <LucideChevronRight className="w-3.5 h-3.5" />
          <span className="text-blue-600 font-bold">Attendance</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Attendance Report</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Four-day rolling attendance grid (Previous days locked, today editable until 12:00 PM)
            </p>
          </div>

          {/* Rule Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              <LucideLock className="w-3 h-3 text-slate-400" />
              <span>Past Days: Locked</span>
            </span>

            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              isCutoffPassed 
                ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {isCutoffPassed ? (
                <>
                  <LucideClock className="w-3 h-3 text-amber-600" />
                  <span>Closed at 12:00 PM</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Today: Editable until 12:00 PM</span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Main Container Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Search Bar Header */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <LucideSearch className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Name or ID..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50/60 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 focus:bg-white transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#0d1728] hover:bg-[#1a2942] active:bg-[#09101c] text-white text-sm font-semibold transition-colors cursor-pointer shadow-xs"
            >
              Search
            </button>
          </form>

          {/* Quick Legend */}
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <LucideCheck className="w-3 h-3 stroke-[3]" />
              </span>
              <span>Present</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                <LucideX className="w-3 h-3 stroke-[3]" />
              </span>
              <span>Absent</span>
            </div>
          </div>
        </div>

        {/* 4-Day Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-[#f8fafc] text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4 w-64">Student</th>
                {days.map((day) => (
                  <th key={day.isoDate} className="py-3.5 px-4 text-center">
                    <div className="font-bold text-slate-800 text-xs sm:text-sm">
                      {day.shortDay}
                    </div>
                    <div className="text-xs text-slate-400 font-normal mt-0.5">
                      {day.dateStr}
                    </div>
                    {day.isToday ? (
                      <span className={`inline-flex items-center gap-1 mt-1 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight ${
                        isCutoffPassed 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isCutoffPassed ? (
                          <>
                            <LucideLock className="w-2.5 h-2.5" />
                            <span>Closed (12 PM)</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Today</span>
                          </>
                        )}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-semibold uppercase tracking-tight" title="Previous days cannot be edited">
                        <LucideLock className="w-2.5 h-2.5" />
                        <span>Locked</span>
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
                    <div className="inline-block w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mb-2" />
                    <p className="text-sm">Loading attendance...</p>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                    No students found.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Link
                            to={`/admin/attendance/${student.id}`}
                            className="font-bold text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1.5 text-sm"
                            title="View Individual History"
                          >
                            <span>{student.name}</span>
                            <LucideExternalLink className="w-3.5 h-3.5 text-slate-400" />
                          </Link>
                          <span className="text-xs font-mono text-slate-400">ID: {student.student_id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Rolling Day Columns */}
                    {days.map((day) => {
                      const key = `${student.id}_${day.isoDate}`;
                      const status = attendanceState[key] || 'Present';
                      const isPresent = status === 'Present';
                      const editable = isDayEditable(day);

                      return (
                        <td key={day.isoDate} className="py-3.5 px-4 text-center">
                          {editable ? (
                            <button
                              type="button"
                              onClick={() => toggleStatus(student.id, day)}
                              className={`w-8 h-8 rounded-full inline-flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                                isPresent
                                  ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                              }`}
                              title={`Click to toggle: currently ${status}`}
                            >
                              {isPresent ? (
                                <LucideCheck className="w-4 h-4 stroke-[2.5]" />
                              ) : (
                                <LucideX className="w-4 h-4 stroke-[2.5]" />
                              )}
                            </button>
                          ) : (
                            <div
                              className={`w-8 h-8 rounded-full inline-flex items-center justify-center mx-auto opacity-75 cursor-not-allowed ${
                                isPresent
                                  ? 'bg-emerald-50/70 text-emerald-600 border border-emerald-200/80'
                                  : 'bg-rose-50/70 text-rose-600 border border-rose-200/80'
                              }`}
                              title={day.isToday ? "Editing closed: Today's attendance window closed at 12:00 PM" : "Locked: Past attendance records cannot be changed"}
                            >
                              {isPresent ? (
                                <LucideCheck className="w-4 h-4 stroke-[2.5]" />
                              ) : (
                                <LucideX className="w-4 h-4 stroke-[2.5]" />
                              )}
                            </div>
                          )}
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
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <LucideArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isCutoffPassed}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold shadow-xs transition-all ${
              isCutoffPassed
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                : 'bg-[#0d1728] hover:bg-[#1a2942] active:bg-[#09101c] text-white cursor-pointer'
            }`}
            title={isCutoffPassed ? "Attendance editing closed after 12:00 PM" : "Save today's attendance changes"}
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <LucideSave className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Saving Changes...' : isCutoffPassed ? 'Attendance Closed (12 PM)' : 'Save Attendance'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
