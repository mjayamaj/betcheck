import React, { useState } from 'react';
import { AlertTriangle, ArrowRight, X, HelpCircle } from 'lucide-react';

export default function ChasingLossAlert({ detectorResult }) {
  const [dismissed, setDismissed] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  if (!detectorResult || !detectorResult.isChasing || dismissed) {
    return null;
  }

  return (
    <div className="glass-card rounded-2xl p-5 border border-amber-500/40 bg-gradient-to-r from-amber-950/20 via-slate-900/40 to-red-950/20 shadow-xl shadow-amber-500/5 relative overflow-hidden animate-fadeIn">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-wider uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Pattern Detected
              </span>
              <span className="text-xs text-slate-400">Purely Informational</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white mt-1">
              ⚠️ {detectorResult.message}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              {detectorResult.advice}
            </p>

            {/* Educational insight drawer */}
            {showExplanation ? (
              <div className="mt-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-300 space-y-2">
                <p className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" /> What is "Loss Chasing"?
                </p>
                <p>
                  When sportsbooks or slots cause an unexpected loss, our brains release cortisol and urgency. We instinctively feel the fastest way to stop the emotional pain is to stake a larger amount on the next bet.
                </p>
                <p className="text-slate-400">
                  Statistically, this compounds losses exponentially. Walking away for just 24 hours allows rational prefrontal cortex control to return.
                </p>
                <button
                  onClick={() => setShowExplanation(false)}
                  className="text-[11px] font-semibold text-blue-400 hover:underline pt-1 block"
                >
                  Hide explanation
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowExplanation(true)}
                className="mt-2 text-xs font-semibold text-amber-400/90 hover:text-amber-300 hover:underline flex items-center gap-1"
              >
                Why does this happen? (Psychology of chasing)
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Dismiss banner */}
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-500 hover:text-slate-300 p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
          title="Dismiss warning"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
