import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  LucideSearch, 
  LucideChevronRight, 
  LucidePlus, 
  LucideEye, 
  LucideUser, 
  LucideFileSpreadsheet,
  LucideHeadphones,
  LucideBookOpen,
  LucidePenTool,
  LucideMic,
  LucideAward,
  LucideX,
  LucideCalendar,
  LucideEdit,
  LucideArrowLeft
} from 'lucide-react';
import { performanceApi } from '../../../services/api/performanceApi';
import { studentApi } from '../../../services/api/studentApi';
import Alert from '../../../components/common/Alert';

export default function PerformanceOverview() {
  const { studentId: paramStudentId } = useParams();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState(paramStudentId || '');
  const [performanceData, setPerformanceData] = useState(null);
  const [studentsList, setStudentsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [selectedTestModal, setSelectedTestModal] = useState(null);

  useEffect(() => {
    if (paramStudentId) {
      setSelectedStudentId(paramStudentId);
    }
  }, [paramStudentId]);

  useEffect(() => {
    async function init() {
      try {
        const students = await studentApi.getStudents();
        setStudentsList(students);
        if (!paramStudentId && students.length > 0) {
          setSelectedStudentId(students[0].id);
        }
      } catch (err) {
        setAlert({ type: 'error', message: err.message || 'Failed to load students' });
      }
    }
    init();
  }, [paramStudentId]);

  const loadPerformance = async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await performanceApi.getStudentPerformance(id);
      setPerformanceData(data);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to load student performance.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStudentId) {
      loadPerformance(selectedStudentId);
    }
  }, [selectedStudentId]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    try {
      setLoading(true);
      const found = await studentApi.getStudents(search.trim());
      if (found.length > 0) {
        setSelectedStudentId(found[0].id);
        navigate(`/admin/performance/${found[0].id}`);
        setAlert(null);
      } else {
        setAlert({ type: 'error', message: 'Wrong Student ID. Student not found.' });
        setTimeout(() => {
          setAlert(null);
        }, 3000);
      }
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Error finding student.' });
      setTimeout(() => {
        setAlert(null);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Header & Breadcrumb */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
          <Link to="/admin/dashboard" className="hover:text-slate-600 transition-colors">Dashboard</Link>
          <LucideChevronRight className="w-3 h-3" />
          <span className="text-blue-600">Performance</span>
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
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Student Performance</h1>
        </div>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Search Header Bar */}
      <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <LucideSearch className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID or Name..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/60 text-xs sm:text-sm focus:outline-none focus:ring-1.5 focus:ring-blue-600 focus:bg-white focus:border-transparent transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-lg bg-[#0d1728] hover:bg-[#1a2942] active:bg-[#09101c] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        {studentsList.length > 0 && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 font-medium">Select Student:</span>
            <select
              value={selectedStudentId}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                navigate(`/admin/performance/${e.target.value}`);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1.5 focus:ring-blue-600"
            >
              {studentsList.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.student_id})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading && (
        <div className="py-12 text-center text-slate-400">
          <div className="inline-block w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mb-1.5" />
          <p className="text-xs">Loading performance details...</p>
        </div>
      )}

      {/* Student Performance Profile & Test History */}
      {!loading && performanceData?.student && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Student Info Card (Compact & Professional) */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-900 mb-2 shadow-2xs">
              <LucideUser className="w-6 h-6 text-blue-900" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">{performanceData.student.name}</h2>
            <p className="text-[11px] font-mono font-semibold text-slate-500 mt-0.5">
              (ID: {performanceData.student.student_id})
            </p>

            <div className="mt-3.5 pt-3 border-t border-slate-100 w-full">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Overall IELTS</p>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#111e38] to-[#0a1220] text-white shadow-xs">
                <span className="text-xl font-extrabold tracking-tight">{performanceData.overall_score}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Overall aggregate</p>
            </div>
          </div>

          {/* Right Test History Card (Expanded & High Density) */}
          <div className="lg:col-span-9 bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
            <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Test History</h3>
                <p className="text-xs text-slate-500 mt-0.5">Chronological record of official mock assessments</p>
              </div>

              <button
                onClick={() => navigate(`/admin/performance/${performanceData.student.id}/add-test`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1728] hover:bg-[#1a2942] active:bg-[#09101c] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <LucidePlus className="w-3.5 h-3.5" />
                <span>Add New Test</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-700">
                <thead className="bg-[#f8fafc] text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-2.5 px-4">Test</th>
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4">Day</th>
                    <th className="py-2.5 px-4 text-center">Overall</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {performanceData.tests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-400">
                        <LucideFileSpreadsheet className="w-7 h-7 text-slate-300 mx-auto mb-1.5" />
                        <p className="font-semibold text-slate-700 text-xs">No Tests Recorded</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Click "Add New Test" to record the first test.</p>
                      </td>
                    </tr>
                  ) : (
                    performanceData.tests.map((test) => (
                      <tr key={test.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-4 font-bold text-slate-900">
                          Test {test.test_number}
                        </td>
                        <td className="py-2.5 px-4 font-medium text-slate-600">
                          {test.test_date}
                        </td>
                        <td className="py-2.5 px-4 text-slate-500">
                          {test.day_name || 'Saturday'}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200">
                            {test.overall_band}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedTestModal(test)}
                            className="px-2.5 py-1 rounded-md text-blue-600 hover:bg-blue-50 transition-all cursor-pointer inline-flex items-center gap-1 text-xs font-medium"
                            title="View Test Details"
                          >
                            <LucideEye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Test Details Modal ("1 Short Page" Breakdown) */}
      {selectedTestModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          onClick={() => setSelectedTestModal(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0d1728] via-[#111e38] to-[#162544] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-blue-300">
                  <LucideAward className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Test {selectedTestModal.test_number} Breakdown</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30">
                      Band {Number(selectedTestModal.overall_band).toFixed(1)}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-300 flex items-center gap-1.5 mt-0.5">
                    <LucideCalendar className="w-3 h-3 text-slate-400" />
                    <span>{selectedTestModal.test_date} ({selectedTestModal.day_name || 'Saturday'})</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTestModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close"
              >
                <LucideX className="w-4 h-4" />
              </button>
            </div>

            {/* Student Info Bar */}
            <div className="px-5 py-2.5 flex items-center justify-between bg-slate-50/70 border-b border-slate-100 text-xs">
              <span className="text-slate-500 font-medium">Student:</span>
              <span className="font-bold text-slate-900">
                {performanceData?.student?.name} <span className="text-slate-500 font-mono text-[11px]">(ID: {performanceData?.student?.student_id})</span>
              </span>
            </div>

            {/* 4 Modules Grid */}
            <div className="p-5 space-y-4">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  4 Modules Marks (Band 0 - 9)
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Listening */}
                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-100/80 text-blue-600 flex items-center justify-center">
                        <LucideHeadphones className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-500">Listening</p>
                        <p className="text-base font-bold text-slate-900">
                          {Number(selectedTestModal.listening).toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Reading */}
                  <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100/80 text-indigo-600 flex items-center justify-center">
                        <LucideBookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-500">Reading</p>
                        <p className="text-base font-bold text-slate-900">
                          {Number(selectedTestModal.reading).toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Writing */}
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-emerald-600 flex items-center justify-center">
                        <LucidePenTool className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-500">Writing</p>
                        <p className="text-base font-bold text-slate-900">
                          {Number(selectedTestModal.writing).toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Speaking */}
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-100/80 text-amber-600 flex items-center justify-center">
                        <LucideMic className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-500">Speaking</p>
                        <p className="text-base font-bold text-slate-900">
                          {Number(selectedTestModal.speaking).toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overall Band Banner */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#0d1728] to-[#162544] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LucideAward className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-slate-200">Overall IELTS Band:</span>
                </div>
                <span className="text-lg font-black text-white px-2.5 py-0.5 rounded-lg bg-white/10 border border-white/15">
                  {Number(selectedTestModal.overall_band).toFixed(1)}
                </span>
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-1 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/admin/performance/${performanceData.student.id}/test/${selectedTestModal.id}/edit`)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LucideEdit className="w-3.5 h-3.5" />
                  <span>Edit Marks</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTestModal(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#0d1728] hover:bg-[#1a2942] active:bg-[#09101c] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
