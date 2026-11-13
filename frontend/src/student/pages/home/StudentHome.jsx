import React, { useState, useEffect } from 'react';
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
  LucideReceipt,
  LucideUser,
  LucideGraduationCap,
  LucideCalendar
} from 'lucide-react';
import { authApi } from '../../../services/api/authApi';
import { studentApi } from '../../../services/api/studentApi';

export default function StudentHome() {
  const navigate = useNavigate();
  const currentUser = authApi.getCurrentUser() || { name: 'Ali Khan', student_id: '1234' };
  const [studentData, setStudentData] = useState({
    name: currentUser.name || 'Ali Khan',
    course: currentUser.course || 'IELTS Academic',
    created_at: currentUser.created_at || '2025-04-12',
    student_id: currentUser.student_id || '1234'
  });

  useEffect(() => {
    const studentIdentifier = currentUser.id || currentUser.student_id;
    if (studentIdentifier) {
      studentApi.getStudentById(studentIdentifier)
        .then(profile => {
          if (profile) {
            setStudentData(prev => ({
              ...prev,
              name: profile.name || prev.name,
              course: profile.course || prev.course,
              created_at: profile.created_at || prev.created_at,
              student_id: profile.student_id || prev.student_id
            }));
          }
        })
        .catch(() => {});
    }
  }, []);

  const formatJourneyDate = (dateVal) => {
    if (!dateVal) return 'April 2025';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return dateVal;
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateVal;
    }
  };

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
              Welcome, {studentData.name} 👋
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Monitor your IELTS mock scores across Listening, Reading, Writing, and Speaking, check attendance, and view tuition fee details.
          </p>
        </div>

        {/* Visual Badge - Official Student Academic Profile */}
        <div className="relative z-10 w-full sm:w-auto flex-shrink-0 flex items-center justify-center">
          <div className="w-full sm:w-72 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4 sm:p-4.5 shadow-xl flex flex-col gap-3">
            {/* User Name & Active Status */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-500/25 text-blue-200 border border-blue-400/30 flex items-center justify-center flex-shrink-0">
                  <LucideUser className="w-4 h-4 text-blue-200" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="text-[10px] uppercase tracking-wider text-blue-200/90 font-semibold leading-tight">
                    Candidate
                  </div>
                  <div className="text-sm font-bold text-white truncate">
                    {studentData.name}
                  </div>
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-400/30 flex items-center gap-1.5 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            </div>

            <div className="h-px bg-white/10 w-full" />

            {/* Course & Journey Start Information */}
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-wider text-blue-200/80 font-medium flex items-center gap-1">
                  <LucideGraduationCap className="w-3 h-3 text-blue-300" />
                  Course
                </span>
                <p className="text-xs font-bold text-white truncate" title={studentData.course}>
                  {studentData.course || 'IELTS Academic'}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-wider text-blue-200/80 font-medium flex items-center gap-1">
                  <LucideCalendar className="w-3 h-3 text-blue-300" />
                  Journey Start
                </span>
                <p className="text-xs font-bold text-white truncate">
                  {formatJourneyDate(studentData.created_at)}
                </p>
              </div>
            </div>
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
