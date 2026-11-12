import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  LucideHeadphones, 
  LucideBookOpen, 
  LucidePenTool, 
  LucideMic, 
  LucideChevronRight, 
  LucideArrowLeft, 
  LucideEdit,
  LucideTrash2,
  LucideCalendar,
  LucideAward
} from 'lucide-react';
import { performanceApi } from '../../../services/api/performanceApi';
import Alert from '../../../components/common/Alert';
import ConfirmModal from '../../../components/common/ConfirmModal';

export default function TestDetails() {
  const { studentId, testId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await performanceApi.getStudentTest(studentId, testId);
        setData(res);
      } catch (err) {
        setError(err.message || 'Failed to load test details.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [studentId, testId]);

  const handleDeleteTest = async () => {
    try {
      setIsDeleting(true);
      await performanceApi.deleteTest(studentId, testId);
      navigate(`/admin/performance/${studentId}`);
    } catch (err) {
      setError(err.message || 'Failed to delete test record.');
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-14 text-center text-slate-400">
        <div className="inline-block w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mb-1.5" />
        <p className="text-xs">Loading test details...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <Alert type="error" message={error || 'Test not found'} />
        <button
          onClick={() => navigate(`/admin/performance/${studentId}`)}
          className="mt-3 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5 cursor-pointer"
        >
          <LucideArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Performance</span>
        </button>
      </div>
    );
  }

  const { student, test } = data;

  const modules = [
    { title: 'Listening', score: test.listening, icon: LucideHeadphones, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Reading', score: test.reading, icon: LucideBookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Writing', score: test.writing, icon: LucidePenTool, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Speaking', score: test.speaking, icon: LucideMic, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
            <Link to="/admin/dashboard" className="hover:text-slate-600 transition-colors">Dashboard</Link>
            <LucideChevronRight className="w-3 h-3" />
            <Link to={`/admin/performance/${student.id}`} className="hover:text-slate-600 transition-colors">Performance</Link>
            <LucideChevronRight className="w-3 h-3" />
            <span className="text-blue-600">Test {test.test_number}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Test {test.test_number} Details
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
            <span className="font-semibold text-slate-700">{student.name}</span> (ID: {student.student_id})
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-500">
              <LucideCalendar className="w-3 h-3" />
              Date: {test.test_date} | Day: {test.day_name || 'Saturday'}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            title="Delete this test assessment"
          >
            <LucideTrash2 className="w-3.5 h-3.5" />
            <span>Delete Test</span>
          </button>
          <button
            onClick={() => navigate(`/admin/performance/${student.id}/test/${test.id}/edit`)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0d1728] hover:bg-[#1a2942] active:bg-[#09101c] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <LucideEdit className="w-3.5 h-3.5" />
            <span>Edit Test</span>
          </button>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div 
                key={m.title}
                className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-sm flex flex-col items-center justify-center text-center hover:border-slate-300 transition-all"
              >
                <div className={`w-10 h-10 rounded-lg ${m.bg} ${m.color} flex items-center justify-center mb-2 shadow-2xs`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{m.title}</span>
                <span className="text-xl font-bold text-slate-900 mt-1">{Number(m.score).toFixed(1)}</span>
              </div>
            );
          })}
        </div>

        <div className="md:col-span-4 bg-gradient-to-br from-[#111e38] via-[#0d1728] to-[#0a1220] rounded-xl p-5 text-white shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden border border-slate-800">
          <div className="w-24 h-24 rounded-full border border-dashed border-amber-400/40 flex items-center justify-center relative mb-1.5">
            <div className="text-center">
              <span className="text-[10px] uppercase tracking-widest text-blue-300 font-bold block">Overall</span>
              <span className="text-2xl font-black text-white tracking-tight mt-0.5 block">
                {Number(test.overall_band).toFixed(1)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-300/90 font-medium">
            <LucideAward className="w-3.5 h-3.5" />
            <span>IELTS Band Score</span>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="pt-2">
        <button
          onClick={() => navigate(`/admin/performance/${student.id}`)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
        >
          <LucideArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Performance</span>
        </button>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title={`Delete Test ${test.test_number}`}
        message={`Are you sure you want to permanently delete Test ${test.test_number} for "${student.name}"? This action cannot be undone.`}
        confirmText="Confirm Delete"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteTest}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
