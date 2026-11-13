import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LucideChevronRight, 
  LucideArrowLeft, 
  LucideCheckCircle2, 
  LucideWallet,
  LucideCalendar
} from 'lucide-react';
import { financeApi } from '../../../services/api/financeApi';
import { authApi } from '../../../services/api/authApi';
import Alert from '../../../components/common/Alert';

export default function StudentFinance() {
  const navigate = useNavigate();
  const currentUser = authApi.getCurrentUser() || { id: 1, name: 'Ali Khan', student_id: '1234' };
  const studentIdentifier = currentUser.id || currentUser.student_id || 1;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await financeApi.getStudentFinance(studentIdentifier);
        setData(res);
      } catch (err) {
        setError(err.message || 'Failed to load your finance details.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [studentIdentifier]);

  if (loading) {
    return (
      <div className="py-14 text-center text-slate-400">
        <div className="inline-block w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mb-1.5" />
        <p className="text-xs">Loading fee payment records...</p>
      </div>
    );
  }

  const payments = data?.payments || [];
  const totalPaid = data?.totalPaid || 0;
  const remaining = data?.remaining || 0;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 sm:space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          <Link to="/student/home" className="hover:text-slate-600 transition-colors">Home</Link>
          <LucideChevronRight className="w-3.5 h-3.5" />
          <span className="text-blue-600 font-bold">Finance</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-xs flex items-center gap-2 text-sm font-semibold cursor-pointer"
            title="Go Back 1 Step"
          >
            <LucideArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">My Finance</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">Official statement of tuition fees and paid installments</p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Top Metric Cards - Senior Executive Standard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Fee */}
        <div className="bg-white rounded-xl p-4 sm:p-4.5 border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Agreed Course Fee</span>
            <span className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 block tracking-tight">
              Rs. {Number(data?.totalFee || 60000).toLocaleString()}
            </span>
          </div>
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-xs shrink-0">
            <LucideWallet className="w-5 h-5" />
          </div>
        </div>

        {/* Total Paid */}
        <div className="bg-white rounded-xl p-4 sm:p-4.5 border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Paid</span>
            <span className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1 block tracking-tight">
              Rs. {Number(totalPaid).toLocaleString()}
            </span>
          </div>
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-xs shrink-0">
            <LucideCheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Remaining Balance */}
        <div className="bg-white rounded-xl p-4 sm:p-4.5 border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Remaining Balance</span>
            <span className="text-xl sm:text-2xl font-bold text-amber-600 mt-1 block tracking-tight">
              Rs. {Number(remaining).toLocaleString()}
            </span>
          </div>
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shadow-xs shrink-0">
            <LucideWallet className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Payment History Table - Senior Executive Standard */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Payment History</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Verified installments logged in database</p>
          </div>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full">
            Course: {data?.student?.course || 'IELTS Academic'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-[#f8fafc] text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-5 w-1/2">Payment Date</th>
                <th className="py-3.5 px-5 w-1/4">Day</th>
                <th className="py-3.5 px-5 w-1/4 text-right">Amount Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                      <LucideWallet className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">No payment installments recorded yet</p>
                    <p className="text-xs text-slate-400 mt-1">When tuition payments are received by the administration, they will appear here with date and receipt.</p>
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-slate-800 text-sm">
                      <div className="flex items-center gap-2">
                        <LucideCalendar className="w-4 h-4 text-slate-400" />
                        <span>{p.payment_date}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-slate-600 text-sm font-medium">
                      {p.day_name}
                    </td>
                    <td className="py-3.5 px-5 text-right font-bold text-slate-900 text-sm font-mono">
                      Rs. {Number(p.amount).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={() => navigate('/student/home')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs cursor-pointer"
          >
            <LucideArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}
