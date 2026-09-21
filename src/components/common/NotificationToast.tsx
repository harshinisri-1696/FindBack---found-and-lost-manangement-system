import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let Icon = CheckCircle2;
        let bgClass = 'bg-white border-emerald-500 text-slate-800';
        let iconColor = 'text-emerald-600';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          bgClass = 'bg-white border-red-500 text-slate-800';
          iconColor = 'text-red-600';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          bgClass = 'bg-white border-amber-500 text-slate-800';
          iconColor = 'text-amber-500';
        } else if (toast.type === 'info') {
          Icon = Info;
          bgClass = 'bg-white border-[#4169E1] text-slate-800';
          iconColor = 'text-[#4169E1]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-lg border-l-4 ${bgClass} transition-all transform translate-y-0 opacity-100`}
          >
            <Icon className={`w-5 h-5 ${iconColor} shrink-0 mt-0.5`} />
            <div className="flex-1 text-xs font-medium leading-snug">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
