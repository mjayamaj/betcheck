import React from 'react';
import { AlertCircle, Sliders, Shield, AlertOctagon } from 'lucide-react';
import { formatCurrency } from '../lib/calculations';

export default function LimitsTracker({ limitsData, currency = 'NGN', onOpenSettings }) {
  const {
    dailySpent = 0,
    weeklySpent = 0,
    monthlySpent = 0,
    dailyLimit,
    weeklyLimit,
    monthlyLimit,
    alerts = [],
  } = limitsData || {};

  const limitsConfig = [
    {
      period: 'Today',
      spent: dailySpent,
      limit: dailyLimit,
      type: 'daily',
    },
    {
      period: 'This Week (7 Days)',
      spent: weeklySpent,
      limit: weeklyLimit,
      type: 'weekly',
    },
    {
      period: 'This Month (30 Days)',
      spent: monthlySpent,
      limit: monthlyLimit,
      type: 'monthly',
    },
  ];

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
            <Shield className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Personal Spending Limits</h3>
            <p className="text-xs text-slate-400">Self-imposed accountability barriers</p>
          </div>
        </div>

        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-blue-400 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Configure Limits</span>
          </button>
        )}
      </div>

      {/* Critical Limit Reached Warnings - NEVER OFFER A BYPASS */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/50 flex items-start gap-3 shadow-inner"
            >
              <AlertOctagon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-red-300 text-sm">
                  ⚠️ You've reached your personal {alert.period} limit. Consider taking a break.
                </p>
                <p className="text-red-200/80 mt-0.5">
                  You set a strict boundary of {formatCurrency(alert.limit, currency)} for this {alert.period}. 
                  You have logged {formatCurrency(alert.spent, currency)}. Honor your commitment to yourself.
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Limits Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        {limitsConfig.map((item, idx) => {
          const hasLimit = Boolean(item.limit && item.limit > 0);
          const percent = hasLimit ? Math.min(100, Math.round((item.spent / item.limit) * 100)) : 0;
          const isExceeded = hasLimit && item.spent >= item.limit;
          const isWarning = hasLimit && percent >= 75 && !isExceeded;

          let barColor = 'from-blue-600 to-cyan-400';
          let textColor = 'text-blue-400';
          if (isExceeded) {
            barColor = 'from-red-600 to-rose-500';
            textColor = 'text-red-400 font-bold';
          } else if (isWarning) {
            barColor = 'from-amber-600 to-yellow-400';
            textColor = 'text-amber-400';
          }

          return (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">{item.period}</span>
                {hasLimit ? (
                  <span className={`text-[11px] font-semibold ${textColor}`}>
                    {percent}% {isExceeded && 'EXCEEDED'}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500 italic">No limit set</span>
                )}
              </div>

              <div>
                <div className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">
                  {formatCurrency(item.spent, currency)}
                  {hasLimit && (
                    <span className="text-xs font-normal text-slate-400 ml-1">
                      / {formatCurrency(item.limit, currency)}
                    </span>
                  )}
                </div>
              </div>

              {hasLimit ? (
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(3, percent)}%` }}
                  />
                </div>
              ) : (
                <button
                  onClick={onOpenSettings}
                  className="text-[11px] text-blue-400/80 hover:text-blue-300 underline block"
                >
                  Set a limit to protect savings
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
