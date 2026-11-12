import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LucideUsers, 
  LucideFileSpreadsheet, 
  LucideWallet, 
  LucideArrowRight,
  LucideCalendarCheck
} from 'lucide-react';
import { studentApi } from '../../../services/api/studentApi';
import Alert from '../../../components/common/Alert';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTests: 0,
    totalPayments: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await studentApi.getDashboardStats();
        if (data) {
          setStats({
            totalStudents: data.totalStudents || 0,
            totalTests: data.totalTests || 0,
            totalPayments: data.totalPayments || 0,
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to load dashboard statistics');
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Top Welcome Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 text-xs mt-0.5">Welcome back, Admin</p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* 3 Metric Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Students */}
        <div className="bg-white rounded-xl p-4 sm:p-4.5 border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Students</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{stats.totalStudents}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-xs">
            <LucideUsers className="w-5 h-5" />
          </div>
        </div>

        {/* Total Tests */}
        <div className="bg-white rounded-xl p-4 sm:p-4.5 border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Tests</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{stats.totalTests}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-xs">
            <LucideFileSpreadsheet className="w-5 h-5" />
          </div>
        </div>

        {/* Total Payments */}
        <div className="bg-white rounded-xl p-4 sm:p-4.5 border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Payments</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
              Rs. {Number(stats.totalPayments).toLocaleString()}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shadow-xs">
            <LucideWallet className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main 3 Clickable Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: All Student Report */}
        <div
          onClick={() => navigate('/admin/students')}
          className="group cursor-pointer rounded-xl p-5 bg-white border border-slate-200/90 shadow-xs hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 border border-blue-100/80 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 group-hover:scale-105 transition-all duration-200 shadow-2xs">
              <LucideUsers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                All Student Report
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage students & performance
              </p>
            </div>
          </div>
          <div className="flex justify-end items-center pt-3 mt-3 border-t border-slate-100">
            <span className="text-xs text-slate-400 group-hover:text-blue-600 flex items-center gap-1 font-semibold transition-colors">
              <span>Open</span>
              <LucideArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
            </span>
          </div>
        </div>

        {/* Card 2: Attendance */}
        <div
          onClick={() => navigate('/admin/attendance')}
          className="group cursor-pointer rounded-xl p-5 bg-white border border-slate-200/90 shadow-xs hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100/80 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 group-hover:scale-105 transition-all duration-200 shadow-2xs">
              <LucideCalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Attendance
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                View & manage attendance
              </p>
            </div>
          </div>
          <div className="flex justify-end items-center pt-3 mt-3 border-t border-slate-100">
            <span className="text-xs text-slate-400 group-hover:text-emerald-700 flex items-center gap-1 font-semibold transition-colors">
              <span>Open</span>
              <LucideArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
            </span>
          </div>
        </div>

        {/* Card 3: Finance Report */}
        <div
          onClick={() => navigate('/admin/finance')}
          className="group cursor-pointer rounded-xl p-5 bg-white border border-slate-200/90 shadow-xs hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 border border-amber-100/80 flex items-center justify-center mb-3 group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-600 group-hover:scale-105 transition-all duration-200 shadow-2xs">
              <LucideWallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                Finance Report
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Track payments & balances
              </p>
            </div>
          </div>
          <div className="flex justify-end items-center pt-3 mt-3 border-t border-slate-100">
            <span className="text-xs text-slate-400 group-hover:text-amber-700 flex items-center gap-1 font-semibold transition-colors">
              <span>Open</span>
              <LucideArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
