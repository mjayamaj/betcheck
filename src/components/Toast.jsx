import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const { id, message, type = 'info', duration = 3500 } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const config = {
    success: {
      bg: 'bg-[#0F1E1B]/95 border-emerald-500/40 text-emerald-200',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
      icon: CheckCircle2,
      glow: 'shadow-[0_0_24px_rgba(16,185,129,0.25)]',
    },
    error: {
      bg: 'bg-[#201115]/95 border-red-500/40 text-red-200',
      iconBg: 'bg-red-500/20 text-red-400',
      icon: AlertCircle,
      glow: 'shadow-[0_0_24px_rgba(239,68,68,0.25)]',
    },
    info: {
      bg: 'bg-[#10192C]/95 border-blue-500/40 text-blue-200',
      iconBg: 'bg-blue-500/20 text-blue-400',
      icon: Info,
      glow: 'shadow-[0_0_24px_rgba(59,130,246,0.25)]',
    },
  }[type] || {
    bg: 'bg-slate-900/95 border-slate-700 text-slate-200',
    iconBg: 'bg-slate-800 text-slate-400',
    icon: Info,
    glow: 'shadow-lg',
  };

  const Icon = config.icon;

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 pointer-events-none transition-all duration-300 animate-slideDown">
      <div
        className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border backdrop-blur-xl ${config.bg} ${config.glow} shadow-2xl transition-all`}
        role="alert"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${config.iconBg}`}>
            <Icon className="w-4 h-4 stroke-[2.2]" />
          </div>
          <p className="text-xs sm:text-sm font-semibold tracking-wide truncate sm:whitespace-normal">
            {message}
          </p>
        </div>

        <button
          onClick={() => onClose(id)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
