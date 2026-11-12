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
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
          <Link to="/student/home" className="hover:text-slate-600 transition-colors">Home</Link>
          <LucideChevronRight className="w-3 h-3" />
          <span className="text-blue-600">Finance</span>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 px-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-2xs flex items-center gap-1 text-xs font-semibold cursor-pointer"
            title="Go Back 1 Step"
          >
            <LucideArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">My Finance</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">Official statement of tuition fees and paid installments</p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Total Fee */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-xs shrink-0">
            <LucideWallet className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Agreed Course Fee</p>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              Rs. {Number(data?.totalFee || 60000).toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Total Paid */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-xs shrink-0">
            <LucideCheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Paid</p>
            <h2 className="text-lg sm:text-xl font-bold text-emerald-700 mt-0.5">
              Rs. {Number(totalPaid).toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Remaining Balance */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shadow-xs shrink-0">
            <LucideWallet className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Remaining Balance</p>
            <h2 className="text-lg sm:text-xl font-bold text-amber-800 mt-0.5">
              Rs. {Number(remaining).toLocaleString()}
            </h2>
          </div>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">Payment History</h3>
            <p className="text-xs text-slate-500 mt-0.5">Verified installments logged in PostgreSQL</p>
          </div>
          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
            Course: {data?.student?.course || 'IELTS Academic'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-[#f8fafc] text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Day</th>
                <th className="py-2.5 px-4 text-right">Amount Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-10 text-center text-slate-400 text-xs">
                    No payment installments recorded yet.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <LucideCalendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{p.payment_date}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-slate-500">
                      {p.day_name}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-slate-900 text-xs sm:text-sm">
                      Rs. {Number(p.amount).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={() => navigate('/student/home')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <LucideArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}
