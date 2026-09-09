import React, { useState } from 'react';
import { Calendar, TrendingDown, PenLine, CheckCircle2, Download } from 'lucide-react';
import { formatCurrency } from '../lib/calculations';

export default function WeeklyRealityCheck({
  weeklyData,
  currency = 'NGN',
  onSaveReflection,
}) {
  const [reflectionText, setReflectionText] = useState('');
  const [savedNote, setSavedNote] = useState(false);

  const {
    weekRange = 'Past 7 Days',
    amountSpent = 0,
    amountLost = 0,
    daysBetOn = 0,
    betFreeDays = 7,
    biggestSingleLoss = 0,
    projectedAnnualLoss = 0,
    sessionsCount = 0,
  } = weeklyData || {};

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (onSaveReflection && reflectionText.trim()) {
      onSaveReflection(reflectionText.trim());
    }
    setSavedNote(true);
    setTimeout(() => setSavedNote(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Reality Check Header */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Weekly Accountability Report</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Weekly Reality Check
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Period: <span className="text-slate-200 font-semibold">{weekRange}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Sobering Summary Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Amount Spent</span>
            <div className="text-xl sm:text-2xl font-black text-white mt-1 font-['Plus_Jakarta_Sans']">
              {formatCurrency(amountSpent, currency)}
            </div>
            <span className="text-[11px] text-slate-500">{sessionsCount} sessions logged</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-red-900/30">
            <span className="text-[11px] font-semibold text-red-400 uppercase">Amount Lost</span>
            <div className="text-xl sm:text-2xl font-black text-red-400 mt-1 font-['Plus_Jakarta_Sans']">
              {formatCurrency(amountLost, currency)}
            </div>
            <span className="text-[11px] text-slate-500">Net unrecovered funds</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Days Bet On</span>
            <div className="text-xl sm:text-2xl font-black text-white mt-1 font-['Plus_Jakarta_Sans']">
              {daysBetOn} <span className="text-xs font-normal text-slate-400">/ 7 Days</span>
            </div>
            <span className="text-[11px] text-blue-400 font-medium">
              {betFreeDays} clean, bet-free days
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-amber-900/30">
            <span className="text-[11px] font-semibold text-amber-400 uppercase">Biggest Single Loss</span>
            <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1 font-['Plus_Jakarta_Sans']">
              {formatCurrency(biggestSingleLoss, currency)}
            </div>
            <span className="text-[11px] text-slate-500">In a single session</span>
          </div>
        </div>
      </div>

      {/* The 12-Month Projected Loss Eye-Opener */}
      <div className="glass-card rounded-2xl p-6 border border-red-500/30 bg-gradient-to-r from-red-950/20 via-slate-900/60 to-slate-900/40 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0 text-red-400">
            <TrendingDown className="w-6 h-6" />
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded border border-red-500/20">
                12-Month Long-Term Projection
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white">
              If this weekly pattern continues, you will lose{' '}
              <span className="text-red-400 underline decoration-red-500/40 font-black">
                {formatCurrency(projectedAnnualLoss, currency)}
              </span>{' '}
              over the next year.
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Bookmakers thrive on small weekly bleeding because our brains don’t naturally calculate 52 weeks of compounding drain. 
              Seeing this annual total clearly breaks the illusion.
            </p>
          </div>
        </div>
      </div>

      {/* "What Could That Money Do Instead?" Reflection Prompt */}
      <div className="glass-card rounded-2xl p-6 border border-blue-500/20 bg-slate-900/40 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
            <PenLine className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              What could that {formatCurrency(amountLost > 0 ? amountLost : 35000, currency)} do instead?
            </h3>
            <p className="text-xs text-slate-400">
              Transform regret into constructive intention. Write a reminder to your future self.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveNote} className="space-y-3">
          <textarea
            rows={3}
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder="Instead of giving this money to bookmakers, I will use my next paycheck to pay rent ahead of time, buy healthy food, or invest in..."
            className="w-full bg-slate-900 text-white p-3.5 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600 resize-none"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {savedNote && (
                <span className="text-blue-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Note saved to your private journal
                </span>
              )}
            </span>

            <button
              type="submit"
              disabled={!reflectionText.trim()}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors shadow-lg shadow-blue-600/20"
            >
              Commit To Future Self
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
