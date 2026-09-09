import React from 'react';
import { Info } from 'lucide-react';

export default function MetricCard({
  title,
  value,
  subValue,
  icon: Icon,
  variant = 'neutral', // 'neutral' | 'danger' | 'wellness' | 'warning'
  tooltip,
}) {
  const variantStyles = {
    neutral: {
      border: 'border-slate-800/80',
      badge: 'bg-slate-800/80 text-slate-300',
      glow: '',
      text: 'text-white',
    },
    danger: {
      border: 'border-red-900/40 bg-gradient-to-b from-red-950/15 to-transparent',
      badge: 'bg-red-500/10 text-red-400 border border-red-500/20',
      glow: 'shadow-red-500/5',
      text: 'text-red-400',
    },
    wellness: {
      border: 'border-blue-900/40 bg-gradient-to-b from-blue-950/20 to-transparent',
      badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      glow: 'shadow-blue-500/10',
      text: 'text-blue-400',
    },
    warning: {
      border: 'border-amber-900/40 bg-gradient-to-b from-amber-950/15 to-transparent',
      badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      glow: 'shadow-amber-500/5',
      text: 'text-amber-400',
    },
  }[variant];

  return (
    <div className={`glass-card p-5 rounded-2xl ${variantStyles.border} shadow-lg ${variantStyles.glow} relative overflow-hidden transition-all duration-200`}>
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-xl ${variantStyles.badge}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${variantStyles.text} font-['Plus_Jakarta_Sans']`}>
          {value}
        </div>
        {subValue && (
          <p className="text-xs text-slate-400 mt-1 font-medium flex items-center gap-1">
            {subValue}
          </p>
        )}
      </div>

      {tooltip && (
        <div className="mt-2 text-[11px] text-slate-500 border-t border-slate-800/60 pt-2 flex items-center gap-1">
          <Info className="w-3 h-3 flex-shrink-0" />
          <span>{tooltip}</span>
        </div>
      )}
    </div>
  );
}
