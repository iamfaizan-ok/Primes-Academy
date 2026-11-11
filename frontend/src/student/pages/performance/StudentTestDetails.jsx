import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  LucideHeadphones, 
  LucideBookOpen, 
  LucidePenTool, 
  LucideMic, 
  LucideChevronRight, 
  LucideArrowLeft, 
  LucideCalendar,
  LucideAward
} from 'lucide-react';
import { performanceApi } from '../../../services/api/performanceApi';
import { authApi } from '../../../services/api/authApi';
import Alert from '../../../components/common/Alert';

export default function StudentTestDetails() {
  const { testId } = useParams();
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
        const res = await performanceApi.getStudentTest(studentIdentifier, testId);
        setData(res);
      } catch (err) {
        setError(err.message || 'Failed to load test details.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [studentIdentifier, testId]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <div className="inline-block w-8 h-8 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mb-2" />
        <p className="text-sm">Loading test details...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Alert type="error" message={error || 'Test not found'} />
        <button
          onClick={() => navigate('/student/performance')}
          className="mt-4 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 inline-flex items-center gap-2 cursor-pointer"
        >
          <LucideArrowLeft className="w-4 h-4" />
          <span>Back to Performance</span>
        </button>
      </div>
    );
  }

  const { test } = data;

  const modules = [
    { title: 'Listening', score: test.listening, icon: LucideHeadphones, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Reading', score: test.reading, icon: LucideBookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Writing', score: test.writing, icon: LucidePenTool, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Speaking', score: test.speaking, icon: LucideMic, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Breadcrumb & Navigation */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
          <Link to="/student/home" className="hover:text-slate-600 transition-colors">Home</Link>
          <LucideChevronRight className="w-3.5 h-3.5" />
          <Link to="/student/performance" className="hover:text-slate-600 transition-colors">Performance</Link>
          <LucideChevronRight className="w-3.5 h-3.5" />
          <span className="text-blue-600">Test {test.test_number}</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Test {test.test_number} Score Breakdown
        </h1>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
          <span>Official assessment record</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <LucideCalendar className="w-3.5 h-3.5" />
            Date: {test.test_date} | Day: {test.day_name || 'Saturday'}
          </span>
        </p>
      </div>

      {/* 4 Modules & Overall Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div 
                key={m.title}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col items-center justify-center text-center"
              >
                <div className={`w-12 h-12 rounded-2xl ${m.bg} ${m.color} flex items-center justify-center mb-3 shadow-sm`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{m.title}</span>
                <span className="text-2xl font-extrabold text-slate-900 mt-2">{Number(m.score).toFixed(1)}</span>
              </div>
            );
          })}
        </div>

        {/* Laurel Overall Card */}
        <div className="md:col-span-4 bg-gradient-to-br from-[#111e38] via-[#0d1728] to-[#0a1220] rounded-3xl p-8 text-white shadow-xl shadow-brand-900/10 flex flex-col items-center justify-center text-center relative overflow-hidden border border-slate-800">
          <div className="w-32 h-32 rounded-full border-2 border-dashed border-amber-400/30 flex items-center justify-center relative mb-2">
            <div className="text-center">
              <span className="text-xs uppercase tracking-widest text-blue-300 font-bold block">Overall</span>
              <span className="text-4xl font-black text-white tracking-tight mt-1 block">
                {Number(test.overall_band).toFixed(1)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-amber-300/90 font-medium">
            <LucideAward className="w-4 h-4" />
            <span>IELTS Band Score</span>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="pt-4">
        <button
          onClick={() => navigate('/student/performance')}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
        >
          <LucideArrowLeft className="w-4 h-4" />
          <span>Back to Performance</span>
        </button>
      </div>
    </div>
  );
}
