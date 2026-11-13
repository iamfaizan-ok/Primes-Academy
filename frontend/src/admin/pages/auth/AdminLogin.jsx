import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LucideShield, 
  LucideMail, 
  LucideLock, 
  LucideEye, 
  LucideEyeOff, 
  LucideArrowRight, 
  LucideArrowLeft,
  LucideGraduationCap,
  LucideCheckCircle2,
  LucideCode2
} from 'lucide-react';
import { authApi } from '../../../services/api/authApi';
import Alert from '../../../components/common/Alert';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('primes_auth_token');
    const role = localStorage.getItem('primes_user_role');
    if (token && role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide both Admin email and password.');
      return;
    }

    try {
      setIsLoading(true);
      await authApi.adminLogin(email.trim(), password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-3.5 sm:p-6 md:p-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px] border border-slate-200/60">
        
        {/* Left Branding Section (Deep Navy) */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#0d1728] via-[#111e38] to-[#0a1322] text-white p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background architectural pattern */}
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

            <div className="mt-8 sm:mt-12 space-y-3 sm:space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/20">
                <LucideShield className="w-3.5 h-3.5" />
                Administrative Gateway
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Excellence in <br />
                <span className="text-blue-400">IELTS Education</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
                Authorized administrative login only.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-6 mt-6 md:mt-0 border-t border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <LucideCheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Protected Administrator Environment</span>
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

        {/* Right Form Section */}
        <div className="md:col-span-7 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            {/* Header with Shield */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 border border-blue-100 text-blue-900 flex items-center justify-center mb-4 shadow-sm">
                <LucideShield className="w-7 h-7 text-brand-900" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Admin Login</h2>
              <p className="text-sm text-slate-500 mt-1">Secure Access Only</p>
            </div>

            {error && (
              <div className="mb-6">
                <Alert type="error" message={error} onClose={() => setError('')} />
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <LucideMail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <LucideLock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <LucideEyeOff className="w-4 h-4" /> : <LucideEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Login Submit Button */}
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

            {/* Back to Student Login */}
            <div className="mt-8 text-center pt-6 border-t border-slate-100">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-900 transition-colors"
              >
                <LucideArrowLeft className="w-4 h-4" />
                <span>Back to Student Login</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

