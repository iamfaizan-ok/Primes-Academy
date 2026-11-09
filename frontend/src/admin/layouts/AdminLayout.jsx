import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LucideLayoutDashboard, 
  LucideUsers, 
  LucideCalendarCheck, 
  LucideWallet, 
  LucideLogOut, 
  LucideMenu, 
  LucideX,
  LucideBell,
  LucideChevronDown
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import { authApi } from '../../services/api/authApi';

export default function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await authApi.logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LucideLayoutDashboard },
    { name: 'All Students', path: '/admin/students', icon: LucideUsers },
    { name: 'Attendance', path: '/admin/attendance', icon: LucideCalendarCheck },
    { name: 'Finance Report', path: '/admin/finance', icon: LucideWallet },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-navy-sidebar text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40">
        <Logo size="sm" light />
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:text-white"
          aria-label="Toggle navigation"
        >
          {isMobileMenuOpen ? <LucideX className="w-5 h-5" /> : <LucideMenu className="w-5 h-5" />}
        </button>
      </header>

      {/* Admin Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-60 bg-navy-sidebar text-slate-300 flex flex-col justify-between p-3.5 transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          {/* Logo */}
          <div className="py-3 px-1 border-b border-slate-800/80 mb-4">
            <Logo size="sm" light />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path === '/admin/students' && location.pathname.startsWith('/admin/performance')) ||
                (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
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

        {/* Bottom Section */}
        <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
          <div className="px-3 text-[10px] text-slate-500 font-medium tracking-wide">
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
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200/80 px-6 py-2.5 hidden md:flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2.5 text-xs text-slate-500">
            <span className="font-bold text-slate-800 text-sm">Primes Academy</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-medium">IELTS Management Portal</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button className="relative p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
              <LucideBell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-600 rounded-full" />
            </button>

            {/* Admin Profile */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 pl-2.5 pr-2 py-1 rounded-lg border border-slate-200 hover:border-slate-300 transition-all bg-white cursor-pointer"
              >
                <div className="w-7 h-7 rounded-md bg-brand-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  AD
                </div>
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-semibold text-slate-800 leading-tight">Admin</div>
                  <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Authorized
                  </div>
                </div>
                <LucideChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-800">Admin Account</p>
                    <p className="text-[11px] text-slate-500 truncate">admin@primesacademy.com</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                  >
                    <LucideLogOut className="w-3.5 h-3.5" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 md:p-6 bg-[#f8fafc]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
