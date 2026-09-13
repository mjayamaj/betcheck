import React from 'react';
import { ShieldAlert, ArrowLeft, LayoutDashboard, History, Calculator, Mail } from 'lucide-react';

export default function NotFoundPage({ setActiveTab }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="glass-card max-w-lg w-full rounded-3xl p-8 border border-slate-800 shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-center mx-auto text-red-400 shadow-lg shadow-red-500/10">
            <ShieldAlert className="w-8 h-8 stroke-[1.8]" />
          </div>

          <div className="space-y-1.5">
            <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-slate-200 font-['Plus_Jakarta_Sans']">
              404
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-['Plus_Jakarta_Sans']">
              Page Not Found
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
              You’ve reached a page that doesn’t exist or has moved. Don't worry—your sanctuary and private financial records remain 100% intact.
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-4 space-y-2.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Return to Dashboard</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveTab('history')}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/80 flex items-center justify-center gap-1.5 transition-colors"
              >
                <History className="w-3.5 h-3.5 text-blue-400" />
                <span>Session History</span>
              </button>

              <button
                onClick={() => setActiveTab('calculator')}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/80 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Calculator className="w-3.5 h-3.5 text-blue-400" />
                <span>What-If Goals</span>
              </button>
            </div>

            <a
              href="mailto:support@betcheck.app"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-400 pt-3 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Need help? Contact support@betcheck.app</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
