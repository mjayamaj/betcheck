import React from 'react';
import { Flame, ShieldCheck, Award, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency } from '../lib/calculations';

export default function StreakBanner({ stats, currency = 'NGN' }) {
  const streakDays = stats?.streakDays ?? 0;
  const savedAmount = stats?.savedDuringStreak ?? 0;

  const handleCelebrate = () => {
    // Elegant sapphire, cyan, and gold celebration
    confetti({
      particleCount: 55,
      spread: 65,
      origin: { y: 0.7 },
      colors: ['#3B82F6', '#60A5FA', '#06B6D4', '#F59E0B', '#FFFFFF'],
      disableForReducedMotion: true,
    });
  };

  const milestones = [
    { days: 3, label: '3 Days', title: 'The Circuit Breaker' },
    { days: 7, label: '1 Week', title: 'Clear Head' },
    { days: 14, label: '2 Weeks', title: 'Habit Shift' },
    { days: 30, label: '1 Month', title: 'Financial Clarity' },
    { days: 90, label: '3 Months', title: 'New Normal' },
  ];

  const currentMilestone = milestones.slice().reverse().find(m => streakDays >= m.days);
  const nextMilestone = milestones.find(m => streakDays < m.days);

  return (
    <div className="glass-card rounded-2xl p-6 border border-blue-500/25 bg-gradient-to-r from-blue-950/25 via-slate-900/40 to-cyan-950/20 shadow-xl relative overflow-hidden">
      {/* Background soft ambient glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        {/* Main Streak Counter & Message */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/15">
            <Flame className="w-8 h-8 text-blue-400 fill-blue-400/20" />
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{streakDays === 1 ? '1 Day Bet-Free' : `${streakDays} Days Bet-Free`}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {streakDays > 0 ? (
                <>
                  You’ve kept{' '}
                  <span className="text-blue-400 underline decoration-blue-500/40 underline-offset-4 font-extrabold">
                    {formatCurrency(savedAmount, currency)}
                  </span>{' '}
                  away from betting.
                </>
              ) : (
                'Day 0 — Today is your clean reset and fresh start.'
              )}
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              {streakDays >= 14
                ? "Incredible discipline. Your dopamine baselines are stabilizing and your money is staying safely in your account."
                : streakDays >= 3
                ? "The first few days are the toughest. Every single bet-free hour strengthens your impulse resistance."
                : "Every recovery begins with a conscious decision to withhold your hard-earned funds from sportsbooks."}
            </p>
          </div>
        </div>

        {/* Milestone Badge & Subtle Trigger */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 border-slate-800/80 pt-4 md:pt-0">
          {currentMilestone && (
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-slate-200">
                Unlocked: {currentMilestone.title} ({currentMilestone.label})
              </span>
            </div>
          )}

          {nextMilestone && (
            <span className="text-[11px] text-slate-400">
              Next milestone in {nextMilestone.days - streakDays} days ({nextMilestone.label})
            </span>
          )}

          {streakDays >= 3 && (
            <button
              onClick={handleCelebrate}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 text-xs font-semibold transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Celebrate Streak</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress towards 30-day milestone */}
      <div className="mt-5 pt-4 border-t border-slate-800/60">
        <div className="flex justify-between text-xs text-slate-400 font-medium mb-1.5">
          <span>30-Day Freedom Milestone Target</span>
          <span className="text-blue-400 font-semibold">{Math.min(100, Math.round((streakDays / 30) * 100))}% Complete</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.min(100, Math.max(4, (streakDays / 30) * 100))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
