import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LucideChevronRight, 
  LucideTrendingUp, 
  LucideCalendar, 
  LucideEye,
  LucideFileSpreadsheet,
  LucideHeadphones,
  LucideBookOpen,
  LucidePenTool,
  LucideMic,
  LucideAward,
  LucideX,
  LucideArrowLeft
} from 'lucide-react';
import { performanceApi } from '../../../services/api/performanceApi';
import { authApi } from '../../../services/api/authApi';
import Alert from '../../../components/common/Alert';

export default function StudentPerformance() {
  const navigate = useNavigate();
  const currentUser = authApi.getCurrentUser() || { id: 1, name: 'Ali Khan', student_id: '1234' };
  const studentIdentifier = currentUser.id || currentUser.student_id || 1;
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTestModal, setSelectedTestModal] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await performanceApi.getStudentPerformance(studentIdentifier);
        setData(res);
      } catch (err) {
        setError(err.message || 'Failed to load your performance data.');
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
        <p className="text-xs">Loading your performance metrics...</p>
      </div>
    );
  }

  const tests = data?.tests || [];
  const overallScore = data?.overall_score || '0.0';
  const latestTest = tests.length > 0 ? tests[tests.length - 1] : null;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 sm:space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          <Link to="/student/home" className="hover:text-slate-600 transition-colors">Home</Link>
          <LucideChevronRight className="w-3.5 h-3.5" />
          <span className="text-blue-600 font-bold">Performance</span>
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
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">My Performance</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">Continuous IELTS mock assessment tracking and module breakdown</p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Top 3 Metric Cards - Senior Executive Standard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Card 1: Overall Band */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Band</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                Average Score
              </span>
            </div>
            <span className="text-3xl font-extrabold text-slate-900 mt-1 block leading-tight">{overallScore}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shadow-xs">
            <LucideAward className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Total Mock Tests */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Mock Tests</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
                Recorded Tests
              </span>
            </div>
            <span className="text-3xl font-extrabold text-slate-900 mt-1 block leading-tight">{tests.length}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-xs">
            <LucideFileSpreadsheet className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Latest Test */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Latest Test Band</span>
            {latestTest ? (
              <>
                <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 mt-1 block leading-tight">
                  Test {latestTest.test_number} – <span className="font-mono">{Number(latestTest.overall_band).toFixed(1)}</span>
                </span>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                  <LucideCalendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{latestTest.test_date} ({latestTest.day_name || 'Saturday'})</span>
                </p>
              </>
            ) : (
              <p className="text-xs text-slate-500 mt-1">No tests recorded yet.</p>
            )}
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-xs">
            <LucideTrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Complete Test History Table - Senior Executive Standard */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">All Completed Tests</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Detailed records for every assessment taken</p>
          </div>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full">
            IELTS Assessment Series
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-[#f8fafc] text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-5 w-1/4">Assessment</th>
                <th className="py-3.5 px-5 w-1/4">Date</th>
                <th className="py-3.5 px-5 w-1/5">Day</th>
                <th className="py-3.5 px-5 w-1/6 text-center">Overall Band</th>
                <th className="py-3.5 px-5 w-1/6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                    No tests taken yet.
                  </td>
                </tr>
              ) : (
                tests.map((test) => (
                  <tr key={test.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-slate-800 text-sm">
                      Test {test.test_number}
                    </td>
                    <td className="py-3.5 px-5 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <LucideCalendar className="w-4 h-4 text-slate-400" />
                        <span>{test.test_date}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-sm text-slate-600 font-medium">
                      {test.day_name || 'Saturday'}
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold font-mono bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
                        {test.overall_band}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => setSelectedTestModal(test)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50/80 hover:bg-blue-100 text-blue-700 border border-blue-200/60 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                      >
                        <LucideEye className="w-3.5 h-3.5" />
                        <span>Breakdown</span>
                      </button>
                    </td>
                  </tr>
                ))
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

      {/* Quick View Test Details Modal for Student */}
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

            {/* 4 Modules Grid */}
            <div className="p-5 space-y-4">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Your 4 Modules Score (Band 0 - 9)
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
                  onClick={() => navigate(`/student/performance/${selectedTestModal.id}`)}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LucideEye className="w-3.5 h-3.5" />
                  <span>Full Page View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTestModal(null)}
                  className="w-full sm:w-auto px-4 py-1.5 rounded-lg bg-[#0d1728] hover:bg-[#1a2942] active:bg-[#09101c] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
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
