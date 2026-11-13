import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LucideTrendingUp, 
  LucideCalendarCheck, 
  LucideWallet, 
  LucideArrowRight,
  LucideBookOpen,
  LucideSparkles,
  LucideAward,
  LucideClock,
  LucideReceipt
} from 'lucide-react';
import { authApi } from '../../../services/api/authApi';

export default function StudentHome() {
  const navigate = useNavigate();
  const currentUser = authApi.getCurrentUser() || { name: 'Ali Khan', student_id: '1234' };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 sm:space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#0d1728] via-[#12203a] to-[#1a3158] text-white p-6 sm:p-7 shadow-sm border border-slate-800/80 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-blue-200 border border-white/10 mb-3">
            <LucideSparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>IELTS Academic Portal</span>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welcome, {currentUser.name} 👋
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Monitor your IELTS mock scores across Listening, Reading, Writing, and Speaking, check attendance, and view tuition fee details.
          </p>
        </div>

        {/* Visual Badge - Official Student Status */}
        <div className="relative z-10 w-full md:w-auto flex-shrink-0 flex items-center justify-center">
          <div className="w-36 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 p-3.5 flex flex-col items-center justify-center text-center shadow-lg">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center mb-2">
              <LucideAward className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase tracking-wider text-blue-200 font-semibold">Student ID</span>
            <span className="text-sm font-mono font-bold text-white">#{currentUser.student_id || '1234'}</span>
            <span className="text-[10px] text-emerald-300 mt-1 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </span>
          </div>
        </div>
      </div>

      {/* 3 Main Clickable Navigation Cards - Substantial & Executive */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Performance */}
        <div
          onClick={() => navigate('/student/performance')}
          className="group cursor-pointer rounded-xl p-5 sm:p-6 bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-400 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200">
                <LucideTrendingUp className="w-6 h-6" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-400 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                <span>View</span>
                <LucideArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            <div className="mt-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Performance
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-normal">
                Continuous mock tests & band breakdown
              </p>
            </div>
          </div>

          <div className="pt-3.5 mt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400 font-medium">
            <LucideAward className="w-4 h-4 text-blue-500" />
            <span>L, R, W, S Modules & Overall Band</span>
          </div>
        </div>

        {/* Card 2: Attendance */}
        <div
          onClick={() => navigate('/student/attendance')}
          className="group cursor-pointer rounded-xl p-5 sm:p-6 bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-400 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-200">
                <LucideCalendarCheck className="w-6 h-6" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-400 group-hover:text-emerald-600 transition-colors flex items-center gap-1">
                <span>View</span>
                <LucideArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            <div className="mt-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Attendance
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-normal">
                Daily classroom presence & consistency
              </p>
            </div>
          </div>

          <div className="pt-3.5 mt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400 font-medium">
            <LucideClock className="w-4 h-4 text-emerald-500" />
            <span>Present / Absent Log & Rates</span>
          </div>
        </div>

        {/* Card 3: Finance */}
        <div
          onClick={() => navigate('/student/finance')}
          className="group cursor-pointer rounded-xl p-5 sm:p-6 bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-amber-400 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:bg-amber-600 group-hover:text-white transition-all duration-200">
                <LucideWallet className="w-6 h-6" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-400 group-hover:text-amber-600 transition-colors flex items-center gap-1">
                <span>View</span>
                <LucideArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            <div className="mt-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                Finance
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-normal">
                Tuition fee statement & payment history
              </p>
            </div>
          </div>

          <div className="pt-3.5 mt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400 font-medium">
            <LucideReceipt className="w-4 h-4 text-amber-500" />
            <span>Installments & Paid Balance</span>
          </div>
        </div>
      </div>
    </div>
  );
}
