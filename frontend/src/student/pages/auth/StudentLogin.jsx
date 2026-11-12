import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LucideGraduationCap, 
  LucideUser, 
  LucideKeyRound, 
  LucideArrowRight, 
  LucideShield,
  LucideCheckCircle2,
  LucideSparkles,
  LucideCode2,
  LucideMail
} from 'lucide-react';
import { authApi } from '../../../services/api/authApi';
import Alert from '../../../components/common/Alert';

export default function StudentLogin() {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('primes_auth_token');
    const role = localStorage.getItem('primes_user_role');
    if (token && role === 'student') {
      navigate('/student/home', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !studentId.trim()) {
      setError('Please provide both your registered Student Name and 4-digit Unique ID.');
      return;
    }

    try {
      setIsLoading(true);
      await authApi.studentLogin(name.trim(), studentId.trim());
      navigate('/student/home');
    } catch (err) {
      setError(err.message || 'Invalid Student Name or ID. Please contact academy admin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px] border border-slate-200/60">
        
        {/* Left Branding Panel (Navy Deep) */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#0d1728] via-[#111e38] to-[#0a1322] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle geometric pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#94b3d5_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3.5 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
                <LucideGraduationCap className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white leading-tight">Primes Academy</h1>
                <p className="text-xs text-blue-200 uppercase tracking-widest font-semibold mt-0.5">Learn · Prepare · Excel</p>
              </div>
            </div>

            <div className="mt-12 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/20">
                <LucideSparkles className="w-3.5 h-3.5" />
                Student Academic Portal
              </span>
              <h2 className="text-3xl font-extrabold text-white leading-tight">
                Your Trusted <br />
                <span className="text-blue-400">IELTS Partner</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
                Easily check your IELTS test scores, daily attendance, and fee details in one place.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <LucideCheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>Official Primes Academy System</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
              <LucideCode2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <span>Developed by <strong className="text-slate-200 font-medium">M. Faizan</strong></span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <a 
                href="mailto:iamf4faizan@gmail.com" 
                className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1 hover:underline ml-0 sm:ml-0.5"
                title="Contact Developer via Email"
              >
                <LucideMail className="w-3 h-3 text-blue-400" />
                <span>iamf4faizan@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 border border-blue-100 text-blue-900 flex items-center justify-center mb-4 shadow-sm">
                <LucideGraduationCap className="w-7 h-7 text-brand-900" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Student Login</h2>
              <p className="text-sm text-slate-500 mt-1">Access your academic record</p>
            </div>

            {error && (
              <div className="mb-6">
                <Alert type="error" message={error} onClose={() => setError('')} />
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Student Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Student Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <LucideUser className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter student name"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Student Unique ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Student Unique ID (4 digits)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <LucideKeyRound className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Enter 4-digit ID"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 font-mono text-sm placeholder:font-sans placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-xl bg-[#0d1728] hover:bg-[#1a2942] active:bg-[#09101c] text-white font-medium text-sm shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Login</span>
                    <LucideArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs uppercase font-semibold text-slate-400">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Admin Login Button */}
            <Link
              to="/admin/login"
              className="w-full py-3 px-6 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <LucideShield className="w-4 h-4 text-blue-600" />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

