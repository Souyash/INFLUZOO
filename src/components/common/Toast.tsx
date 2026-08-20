import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-violet-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/40 bg-emerald-950/90 text-emerald-100',
    info: 'border-violet-500/40 bg-violet-950/90 text-violet-100',
    warning: 'border-amber-500/40 bg-amber-950/90 text-amber-100',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md transition-all ${borders[toast.type]}`}
      >
        {icons[toast.type]}
        <p className="text-sm font-medium pr-2">{toast.message}</p>
      </div>
    </div>
  );
};
