import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  LucideArrowRight, 
  LucideChevronRight, 
  LucideAward,
  LucideHeadphones,
  LucideBookOpen,
  LucidePenTool,
  LucideMic
} from 'lucide-react';
import { performanceApi } from '../../../services/api/performanceApi';
import { calculateOverallBand, IELTS_BAND_OPTIONS } from '../../../utils/ielts';
import Alert from '../../../components/common/Alert';

export default function EditTest() {
  const { studentId, testId } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [testNumber, setTestNumber] = useState('');
  const [listening, setListening] = useState('7.0');
  const [reading, setReading] = useState('7.0');
  const [writing, setWriting] = useState('6.5');
  const [speaking, setSpeaking] = useState('7.0');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoadingInitial(true);
        const res = await performanceApi.getStudentTest(studentId, testId);
        setStudent(res.student);
        setTestNumber(res.test.test_number);
        setListening(Number(res.test.listening).toFixed(1));
        setReading(Number(res.test.reading).toFixed(1));
        setWriting(Number(res.test.writing).toFixed(1));
        setSpeaking(Number(res.test.speaking).toFixed(1));
      } catch (err) {
        setError(err.message || 'Failed to load test details.');
      } finally {
        setLoadingInitial(false);
      }
    }
    load();
  }, [studentId, testId]);

  const liveOverallBand = calculateOverallBand(listening, reading, writing, speaking);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setIsLoading(true);
      const updated = await performanceApi.updateTest(studentId, testId, {
        listening: parseFloat(listening),
        reading: parseFloat(reading),
        writing: parseFloat(writing),
        speaking: parseFloat(speaking),
      });
      setSuccess(`Test ${updated.test_number} updated successfully! New Overall Band: ${updated.overall_band}`);
      setTimeout(() => {
        navigate(`/admin/performance/${studentId}/test/${testId}`);
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to update test');
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="py-14 text-center text-slate-400">
        <div className="inline-block w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mb-1.5" />
        <p className="text-xs">Loading test data...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 sm:space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          <Link to="/admin/dashboard" className="hover:text-slate-600 transition-colors">Dashboard</Link>
          <LucideChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to={`/admin/performance/${studentId}`} className="hover:text-slate-600 transition-colors">Performance</Link>
          <LucideChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to={`/admin/performance/${studentId}/test/${testId}`} className="hover:text-slate-600 transition-colors">Test {testNumber}</Link>
          <LucideChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-blue-600 font-bold">Edit</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Edit Test {testNumber}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Modifying scores for <span className="font-semibold text-slate-800">{student?.name}</span> (ID: {student?.student_id})
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} />}

      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 sm:p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Module Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Listening */}
            <div className="p-3 rounded-lg border border-slate-200/80 bg-slate-50/50">
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                <LucideHeadphones className="w-3.5 h-3.5 text-blue-600" />
                <span>Listening</span>
              </label>
              <select
                value={listening}
                onChange={(e) => setListening(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1.5 focus:ring-blue-600"
              >
                {IELTS_BAND_OPTIONS.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Reading */}
            <div className="p-3 rounded-lg border border-slate-200/80 bg-slate-50/50">
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                <LucideBookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Reading</span>
              </label>
              <select
                value={reading}
                onChange={(e) => setReading(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1.5 focus:ring-blue-600"
              >
                {IELTS_BAND_OPTIONS.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Writing */}
            <div className="p-3 rounded-lg border border-slate-200/80 bg-slate-50/50">
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                <LucidePenTool className="w-3.5 h-3.5 text-emerald-600" />
                <span>Writing</span>
              </label>
              <select
                value={writing}
                onChange={(e) => setWriting(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1.5 focus:ring-blue-600"
              >
                {IELTS_BAND_OPTIONS.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Speaking */}
            <div className="p-3 rounded-lg border border-slate-200/80 bg-slate-50/50">
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                <LucideMic className="w-3.5 h-3.5 text-amber-600" />
                <span>Speaking</span>
              </label>
              <select
                value={speaking}
                onChange={(e) => setSpeaking(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1.5 focus:ring-blue-600"
              >
                {IELTS_BAND_OPTIONS.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Automatic Calculated Overall Preview Box */}
          <div className="bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50 rounded-lg p-3.5 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand-900 text-white flex items-center justify-center shadow-2xs">
                <LucideAward className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Automatic IELTS Band Calculation</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Standard official formula: Average of all 4 modules rounded to nearest 0.5
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Calculated Overall</span>
              <span className="text-2xl font-bold text-brand-900">{liveOverallBand.toFixed(1)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => navigate(`/admin/performance/${studentId}/test/${testId}`)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer min-h-[44px]"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#0d1728] hover:bg-[#1a2942] active:bg-[#09101c] text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer min-h-[44px]"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Update Test</span>
                  <LucideArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
