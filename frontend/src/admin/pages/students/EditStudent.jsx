import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  LucideUserCheck, 
  LucideArrowRight, 
  LucideChevronRight, 
  LucideLock
} from 'lucide-react';
import { studentApi } from '../../../services/api/studentApi';
import Alert from '../../../components/common/Alert';

export default function EditStudent() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function loadStudent() {
      try {
        setLoadingInitial(true);
        const student = await studentApi.getStudentById(studentId);
        setName(student.name);
        setUniqueId(student.student_id);
      } catch (err) {
        setError(err.message || 'Failed to load student details');
      } finally {
        setLoadingInitial(false);
      }
    }
    loadStudent();
  }, [studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Student name is required.');
      return;
    }

    try {
      setIsLoading(true);
      await studentApi.updateStudent(studentId, { name: name.trim() });
      setSuccess('Student name updated successfully!');
      setTimeout(() => {
        navigate('/admin/students');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to update student');
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="py-14 text-center text-slate-400">
        <div className="inline-block w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mb-1.5" />
        <p className="text-xs">Loading student record...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
          <Link to="/admin/dashboard" className="hover:text-slate-600 transition-colors">Dashboard</Link>
          <LucideChevronRight className="w-3 h-3" />
          <Link to="/admin/students" className="hover:text-slate-600 transition-colors">All Students</Link>
          <LucideChevronRight className="w-3 h-3" />
          <span className="text-blue-600">Edit</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Edit Student</h1>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} />}

      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 sm:p-6">
        <div className="text-center max-w-sm mx-auto mb-5">
          <div className="w-10 h-10 mx-auto rounded-lg bg-blue-50 text-blue-900 border border-blue-100 flex items-center justify-center mb-2.5 shadow-2xs">
            <LucideUserCheck className="w-5 h-5 text-brand-900" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Update Student Information</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">Unique Student ID is fixed and permanent</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-3.5">
          {/* Unique ID (Read-only) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Unique Student ID
            </label>
            <div className="relative">
              <input
                type="text"
                disabled
                value={uniqueId}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-100 text-slate-500 font-mono text-xs cursor-not-allowed"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
                <LucideLock className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Unique IDs cannot be changed to maintain database relational integrity.
            </p>
          </div>

          {/* Student Name */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Student Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter student name"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-1.5 focus:ring-blue-600 focus:bg-white focus:border-transparent transition-all"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-[#0d1728] to-[#162544] hover:from-[#111e38] text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Update Student</span>
                  <LucideArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/students')}
              className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
