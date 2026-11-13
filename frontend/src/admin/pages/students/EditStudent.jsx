import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  LucideUserCheck, 
  LucideArrowRight, 
  LucideChevronRight, 
  LucideLock,
  LucideBookOpen,
  LucideCreditCard
} from 'lucide-react';
import { studentApi } from '../../../services/api/studentApi';
import Alert from '../../../components/common/Alert';

const PRESET_COURSES = [
  'IELTS Academic',
  'IELTS General Training',
  'Spoken English & Fluency',
  'PTE Academic',
  'Life Skills A1 / B1'
];

export default function EditStudent() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [course, setCourse] = useState('IELTS Academic');
  const [customCourse, setCustomCourse] = useState('');
  const [totalFee, setTotalFee] = useState('60000');
  const [student_id, setStudentId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function loadStudent() {
      try {
        setLoadingInitial(true);
        const student = await studentApi.getStudentById(studentId);
        setName(student.name || '');
        setStudentId(student.student_id || '');
        if (student.course) {
          if (PRESET_COURSES.includes(student.course)) {
            setCourse(student.course);
            setCustomCourse('');
          } else {
            setCourse('Other');
            setCustomCourse(student.course);
          }
        }
        if (student.total_fee) {
          setTotalFee(student.total_fee.toString());
        }
      } catch (err) {
        setError(err.message || 'Failed to load student details');
      } finally {
        setLoadingInitial(false);
      }
    }
    loadStudent();
  }, [studentId]);

  const finalCourse = course === 'Other' ? (customCourse.trim() || 'Custom Course') : course;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Student name is required.');
      return;
    }

    const parsedFee = parseFloat(totalFee);
    if (isNaN(parsedFee) || parsedFee < 0) {
      setError('Please enter a valid total fee amount.');
      return;
    }

    try {
      setIsLoading(true);
      await studentApi.updateStudent(studentId, {
        name: name.trim(),
        course: finalCourse,
        total_fee: parsedFee
      });
      setSuccess('Student details updated successfully!');
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
    <div className="w-full max-w-2xl mx-auto space-y-5 sm:space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          <Link to="/admin/dashboard" className="hover:text-slate-600 transition-colors">Dashboard</Link>
          <LucideChevronRight className="w-3.5 h-3.5" />
          <Link to="/admin/students" className="hover:text-slate-600 transition-colors">All Students</Link>
          <LucideChevronRight className="w-3.5 h-3.5" />
          <span className="text-blue-600 font-bold">Edit</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Edit Student</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Modify registered student details and course enrollment</p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} />}

      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 sm:p-6">
        <div className="text-center max-w-sm mx-auto mb-5">
          <div className="w-10 h-10 mx-auto rounded-lg bg-blue-50 text-blue-900 border border-blue-100 flex items-center justify-center mb-2.5 shadow-2xs">
            <LucideUserCheck className="w-5 h-5 text-brand-900" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Update Student Information</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">Student ID is fixed and permanent</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-3.5">
          {/* Student ID (Read-only) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Student ID
            </label>
            <div className="relative">
              <input
                type="text"
                disabled
                value={student_id}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-100 text-slate-500 font-mono text-xs cursor-not-allowed"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
                <LucideLock className="w-3.5 h-3.5" />
              </div>
            </div>
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

          {/* Course */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <LucideBookOpen className="w-3 h-3 text-blue-600" />
              <span>Course / Program</span>
            </label>
            <div className="flex flex-wrap gap-1 mb-1.5">
              {PRESET_COURSES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => { setCourse(c); setCustomCourse(''); }}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold border cursor-pointer ${
                    course === c 
                      ? 'bg-blue-900 text-white border-blue-900' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCourse('Other')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold border cursor-pointer ${
                  course === 'Other' 
                    ? 'bg-blue-900 text-white border-blue-900' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                }`}
              >
                Custom...
              </button>
            </div>
            {course === 'Other' && (
              <input
                type="text"
                required
                value={customCourse}
                onChange={(e) => setCustomCourse(e.target.value)}
                placeholder="Enter custom course name..."
                className="w-full px-3 py-1.5 rounded-lg border border-blue-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1.5 focus:ring-blue-600"
              />
            )}
          </div>

          {/* Total Fee */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <LucideCreditCard className="w-3 h-3 text-emerald-600" />
              <span>Total Course Fee (PKR)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                Rs.
              </div>
              <input
                type="number"
                min="0"
                step="500"
                value={totalFee}
                onChange={(e) => setTotalFee(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 font-mono font-bold text-xs sm:text-sm focus:outline-none focus:ring-1.5 focus:ring-blue-600 focus:bg-white focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-lg bg-[#0d1728] hover:bg-[#1a2942] active:bg-[#09101c] text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer min-h-[44px]"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Update Student</span>
                  <LucideArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/students')}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors min-h-[44px] cursor-pointer"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
