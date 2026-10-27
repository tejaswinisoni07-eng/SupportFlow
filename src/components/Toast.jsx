import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const { message, type } = toast;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />,
    info: <Info className="w-4 h-4 text-indigo-500 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-white text-emerald-950',
    error: 'border-rose-200 bg-white text-rose-950',
    info: 'border-indigo-200 bg-white text-indigo-950',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-in max-w-sm">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-2xl shadow-xl border ${borders[type] || borders.info}`}>
        {icons[type] || icons.info}
        <span className="text-xs sm:text-sm font-semibold">{message}</span>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
