import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LucideHome, 
  LucideTrendingUp, 
  LucideCalendarCheck, 
  LucideCreditCard, 
  LucideBookOpen,
  LucideLogOut, 
  LucideMenu, 
  LucideX,
  LucideChevronDown,
  LucideIdCard,
  LucideUser
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import { authApi } from '../../services/api/authApi';

export default function StudentLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const currentUser = authApi.getCurrentUser() || { name: 'Student', student_id: '1234' };

  const handleLogout = async () => {
    await authApi.logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', path: '/student/home', icon: LucideHome },
    { name: 'Performance', path: '/student/performance', icon: LucideTrendingUp },
    { name: 'Attendance', path: '/student/attendance', icon: LucideCalendarCheck },
    { name: 'Finance', path: '/student/finance', icon: LucideCreditCard },
    { name: 'Modules', path: '/student/modules', icon: LucideBookOpen },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-navy-sidebar text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40">
        <Logo size="sm" light />
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white"
        >
          {isMobileMenuOpen ? <LucideX className="w-5 h-5" /> : <LucideMenu className="w-5 h-5" />}
        </button>
      </header>

      {/* Student Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-60 bg-navy-sidebar text-slate-300 flex flex-col justify-between p-4 transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          {/* Logo */}
          <div className="py-3 px-1 border-b border-slate-800/80 mb-5">
            <Logo size="sm" light />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${isActive 
                      ? 'bg-blue-600 text-white font-semibold shadow-sm' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Student Profile & Logout */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2">
          <div className="px-3 py-2 rounded-lg bg-slate-800/50 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              {currentUser.name ? currentUser.name.charAt(0) : 'S'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-blue-300 font-medium">Student</p>
            </div>
          </div>

          <div className="px-3 pt-1 text-[10px] text-slate-500 font-medium tracking-wide">
            Developed by <span className="text-slate-300 font-semibold">M.Faizan ..</span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
          >
            <LucideLogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="bg-white border-b border-slate-200/80 px-6 py-2.5 hidden md:flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2.5 text-xs text-slate-500">
            <span className="font-bold text-slate-800 text-sm">Primes Academy</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-medium">Student Academic Portal</span>
          </div>

          {/* Interactive Top-Right Corner Student Badge */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="px-2.5 py-1 rounded-lg bg-blue-50/80 hover:bg-blue-100/70 border border-blue-200/70 flex items-center gap-2 transition-all cursor-pointer group shadow-2xs"
              title="Click to view student profile & ID"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-900">{currentUser.name}</span>
              <LucideChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-blue-700 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Short Profile Box Modal / Dropdown */}
            {isProfileOpen && (
              <>
                {/* Click outside to close (side pa click karna pa back ho jaye) */}
                <div 
                  className="fixed inset-0 z-40 cursor-default" 
                  onClick={() => setIsProfileOpen(false)} 
                />

                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200/90 p-4 z-50 animate-in fade-in zoom-in-95">
                  {/* Student Header */}
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-blue-500/20">
                      {currentUser.name ? currentUser.name.charAt(0) : 'S'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900 truncate leading-tight">{currentUser.name}</p>
                      <span className="inline-block text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 mt-1">
                        Active Student
                      </span>
                    </div>
                  </div>

                  {/* Student ID & Details Details */}
                  <div className="py-3 space-y-2.5">
                    <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-slate-500 font-medium">Student ID</span>
                      <span className="font-mono font-bold text-blue-700 bg-white px-2.5 py-0.5 rounded-md border border-blue-200/80 shadow-2xs">
                        {currentUser.student_id}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs px-1 text-slate-500">
                      <span>Program</span>
                      <span className="font-semibold text-slate-800">IELTS Academic</span>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-2.5 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <LucideLogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="flex-1 p-5 md:p-6 bg-[#f8fafc]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
