import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LucideUserPlus, 
  LucideUser,
  LucideArrowRight, 
  LucideChevronRight, 
  LucideChevronDown,
  LucideSparkles,
  LucideBookOpen,
  LucideShieldCheck
} from 'lucide-react';
import { studentApi } from '../../../services/api/studentApi';
import Alert from '../../../components/common/Alert';

const STANDARD_COURSES = [
  'IELTS Academic',
  'IELTS General Training',
  'PTE Academic',
  'Spoken English & Fluency',
  'Life Skills A1 / B1',
  'Other'
];

const PRESET_FEES = [40000, 50000, 60000, 75000];

export default function AddStudent() {
  const navigate = useNavigate();

  // Form State
  const [name, setName] = useState('');
  const [course, setCourse] = useState('IELTS Academic');
  const [customCourse, setCustomCourse] = useState('');
  const [totalFee, setTotalFee] = useState('60000');
  
  // State
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const finalCourse = course === 'Other' ? (customCourse.trim() || 'Custom Course') : course;
  const parsedFeeNumber = parseFloat(totalFee) || 0;

  // Save student directly to database and navigate immediately to All Students roster
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter the student full name.');
      return;
    }

    if (course === 'Other' && !customCourse.trim()) {
      setError('Please specify the custom course name.');
      return;
    }

    if (isNaN(parsedFeeNumber) || parsedFeeNumber < 0) {
      setError('Please enter a valid course fee amount.');
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        name: name.trim(),
        course: finalCourse,
        total_fee: parsedFeeNumber
      };

      const created = await studentApi.createStudent(payload);

      // Direct instant redirect to All Students page with success flash notification
      navigate('/admin/students', {
        state: { 
          message: `Student "${created.name}" (ID: #${created.student_id}) registered and saved successfully!` 
        }
      });
    } catch (err) {
      setError(err.message || 'Failed to register student. Please check details and try again.');
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-12">
      {/* Breadcrumb Navigation */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
          <Link to="/admin/dashboard" className="hover:text-slate-600 transition-colors">Dashboard</Link>
          <LucideChevronRight className="w-3 h-3 text-slate-300" />
          <Link to="/admin/students" className="hover:text-slate-600 transition-colors">All Students</Link>
          <LucideChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-blue-600">Add Student</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">New Student Admission</h1>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      {/* Professional Registration Form */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden animate-in fade-in duration-200">
        {/* Card Header Bar */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50/70 via-white to-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shadow-2xs">
              <LucideUserPlus className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Student Registration Form
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Fill details to register student and auto-generate unique credentials
              </p>
            </div>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100/80 border border-slate-200 text-[10px] font-semibold text-slate-600">
            <LucideSparkles className="w-3 h-3 text-amber-500" />
            <span>Auto 4-Digit ID</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4.5">
          {/* 1. Student Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Student Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <LucideUser className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Muhammad Ahmad"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* 2. Course Selection (Executive Dropdown) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Enrolled Course / Program <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <LucideBookOpen className="w-4 h-4" />
              </div>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs sm:text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 transition-all shadow-2xs cursor-pointer font-medium"
              >
                {STANDARD_COURSES.map((c) => (
                  <option key={c} value={c}>
                    {c === 'Other' ? '+ Custom / Other Course...' : c}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <LucideChevronDown className="w-4 h-4" />
              </div>
            </div>

            {/* Custom Course Animated Field */}
            {course === 'Other' && (
              <div className="pt-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                <input
                  type="text"
                  required
                  autoFocus
                  value={customCourse}
                  onChange={(e) => setCustomCourse(e.target.value)}
                  placeholder="Type custom course title (e.g. Duolingo English Test)"
                  className="w-full px-3.5 py-2 rounded-xl border border-blue-300 bg-blue-50/20 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 transition-all shadow-2xs"
                />
              </div>
            )}
          </div>

          {/* 3. Total Fee Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Total Agreed Fee (PKR) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] font-medium text-slate-500">
                Initial Remaining: <span className="font-bold text-rose-600">Rs. {parsedFeeNumber.toLocaleString()}</span>
              </span>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                  Rs.
                </span>
              </div>
              <input
                type="number"
                required
                min="0"
                step="500"
                value={totalFee}
                onChange={(e) => setTotalFee(e.target.value)}
                placeholder="60000"
                className="w-full pl-14 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-mono font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 transition-all shadow-2xs"
              />
            </div>

            {/* Presets Segment */}
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="text-[11px] text-slate-400 font-medium mr-1">Presets:</span>
              {PRESET_FEES.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setTotalFee(f.toString())}
                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold transition-all border cursor-pointer ${
                    totalFee === f.toString()
                      ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-2xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  Rs. {f.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Informational Callout */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5 text-xs text-slate-600">
            <LucideShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Upon clicking <span className="font-semibold text-slate-900">Save Student</span>, the record is immediately saved to the database with an auto-generated 4-digit ID and portal account.
            </p>
          </div>

          {/* Actions Footer */}
          <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-100">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => navigate('/admin/students')}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0d1728] via-[#111e38] to-[#162544] hover:from-[#162544] hover:to-[#0d1728] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving Student...</span>
                </>
              ) : (
                <>
                  <span>Save Student</span>
                  <LucideArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
