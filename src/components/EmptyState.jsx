import React from 'react';
import { Shield, Plus, PlayCircle, Sliders, Lock, Sparkles, TrendingDown } from 'lucide-react';

export default function EmptyState({ onOpenLogModal, onLoadDemo, onOpenSettings }) {
  return (
    <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden text-center max-w-3xl mx-auto my-4">
      {/* Background ambient light */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Shield Icon Badge */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 p-0.5 shadow-xl shadow-blue-500/20 mx-auto flex items-center justify-center">
          <div className="w-full h-full bg-[#0B0F19] rounded-[22px] flex items-center justify-center">
            <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400 stroke-[1.8]" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Clean Slate Sanctuary</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
            Your Recovery Journey Begins Here
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            You have zero recorded betting sessions. BetCheck does not encourage gambling; it gives you the cold financial clarity to take your life and hard-earned money back.
          </p>
        </div>

        {/* 3 Step Recovery Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 text-left">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h3 className="text-xs font-bold text-white">Set Guardrails First</h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              Establish unbreakable daily and weekly spending limits before making any bets.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h3 className="text-xs font-bold text-white">Log With Honesty</h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              Record every stake and emotional trigger. Seeing cold reality breaks cognitive traps.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h3 className="text-xs font-bold text-white">100% Private</h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              All entries stay safely in your device storage. Zero tracking, zero ad cookies.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenLogModal}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Log Your First Session</span>
          </button>

          <button
            onClick={onLoadDemo}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700/80 flex items-center justify-center gap-2 transition-colors"
          >
            <PlayCircle className="w-4 h-4 text-blue-400" />
            <span>Explore Demo Data Mode</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Configure Limits</span>
          </button>
        </div>
      </div>
    </div>
  );
}
