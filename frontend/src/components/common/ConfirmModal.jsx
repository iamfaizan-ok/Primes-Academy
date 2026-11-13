import React from 'react';
import { LucideAlertTriangle, LucideX } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDestructive = true,
  onConfirm,
  onClose,
  isLoading = false
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col transform transition-all scale-100"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-5 sm:p-6 overflow-y-auto">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className={`p-2.5 sm:p-3 rounded-xl flex-shrink-0 ${
              isDestructive ? 'bg-red-50 text-red-600' : 'bg-brand-50 text-brand-600'
            }`}>
              <LucideAlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">{title}</h3>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">{message}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              aria-label="Close modal"
            >
              <LucideX className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="btn-secondary w-full sm:w-auto"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`w-full sm:w-auto ${isDestructive ? 'btn-danger' : 'btn-primary'}`}
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>{confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

