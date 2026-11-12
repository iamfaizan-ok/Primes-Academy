import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  LucideCreditCard, 
  LucideArrowRight, 
  LucideChevronRight
} from 'lucide-react';
import { financeApi } from '../../../services/api/financeApi';
import { studentApi } from '../../../services/api/studentApi';
import Alert from '../../../components/common/Alert';

export default function AddAmount() {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoadingInitial(true);
        const s = await studentApi.getStudentById(studentId);
        setStudent(s);
      } catch (err) {
        setError(err.message || 'Failed to load student details');
      } finally {
        setLoadingInitial(false);
      }
    }
    load();
  }, [studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      setError('Please enter a valid positive payment amount.');
      return;
    }

    try {
      setIsLoading(true);
      await financeApi.addPayment(studentId, val);
      setSuccess(`Payment of Rs. ${val.toLocaleString()} recorded successfully!`);
      setTimeout(() => {
        navigate(`/admin/finance/${studentId}`);
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to save payment.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="py-14 text-center text-slate-400">
        <div className="inline-block w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mb-1.5" />
        <p className="text-xs">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
          <Link to="/admin/dashboard" className="hover:text-slate-600 transition-colors">Dashboard</Link>
          <LucideChevronRight className="w-3 h-3" />
          <Link to={`/admin/finance/${studentId}`} className="hover:text-slate-600 transition-colors">Finance</Link>
          <LucideChevronRight className="w-3 h-3" />
          <span className="text-blue-600">Add Amount</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Record Fee Payment</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Adding payment transaction for <span className="font-semibold text-slate-800">{student?.name}</span> (ID: {student?.student_id})
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} />}

      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 sm:p-6">
        <div className="text-center max-w-sm mx-auto mb-5">
          <div className="w-10 h-10 mx-auto rounded-lg bg-amber-50 text-amber-900 border border-amber-100 flex items-center justify-center mb-2.5 shadow-2xs">
            <LucideCreditCard className="w-5 h-5 text-amber-700" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Add Fee Installment</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">Transaction date and day are recorded automatically</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Payment Amount (PKR) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-semibold text-xs">
                Rs.
              </div>
              <input
                type="number"
                required
                min="1"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount (e.g. 10000)"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-1.5 focus:ring-blue-600 focus:bg-white focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:flex-1 py-2 px-4 rounded-lg bg-[#0d1728] hover:bg-[#1a2942] active:bg-[#09101c] text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Save Payment</span>
                  <LucideArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/admin/finance/${studentId}`)}
              className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
