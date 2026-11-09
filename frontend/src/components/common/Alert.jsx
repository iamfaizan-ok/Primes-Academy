import React from 'react';
import { LucideCheckCircle, LucideAlertCircle, LucideX } from 'lucide-react';

export default function Alert({ type = 'success', message, onClose }) {
  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-sm transition-all shadow-sm ${
      isSuccess 
        ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
        : 'bg-rose-50 border-rose-200 text-rose-800'
    }`}>
      <div className="flex items-center gap-3">
        {isSuccess ? (
          <LucideCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
        ) : (
          <LucideAlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
        )}
        <span className="font-medium">{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="p-1 hover:opacity-75 transition-opacity">
          <LucideX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

