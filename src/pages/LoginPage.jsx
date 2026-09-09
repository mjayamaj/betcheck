import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Mail, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Flame, 
  TrendingDown, 
  Sliders, 
  Zap,
  PlayCircle
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { formatCurrency } from '../lib/calculations';

export default function LoginPage({
  onLoginSuccess,
  onContinueAsGuest,
  onLoadDemoAndEnter,
  currency = 'NGN',
}) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Interactive slider teaser
  const [teaserAmount, setTeaserAmount] = useState(350000);
  const rentMonths = (teaserAmount / 70000).toFixed(1);
  const compoundFiveYears = Math.round(teaserAmount * Math.pow(1.12, 5));


  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured || !supabase) {
      // Local fallback mode
      onContinueAsGuest(email || 'Guest User');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        const { data, error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
          },
        });
        if (signUpErr) throw signUpErr;
        setMessage('Account created! Please check your email inbox to verify your account.');
      } else {
        const { data, error: signInErr } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInErr) throw signInErr;
        setMessage('Welcome back! Logging you in...');
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 600);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200 relative overflow-hidden">
      {/* Ambient background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[450px] h-[450px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Warning Banner */}
      <div className="w-full bg-[#101726]/80 border-b border-slate-800/80 py-2 px-4 text-center text-xs text-slate-400">
        <span className="text-blue-400 font-bold">100% Non-Gambling:</span> BetCheck does not offer odds, predictions, or affiliate links. It is your private sanctuary to regain financial freedom.
      </div>

      {/* Navigation / Header */}
      <header className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/25">
            <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div>
            <span className="font-black text-2xl tracking-tight text-white font-['Plus_Jakarta_Sans']">
              Bet<span className="text-blue-400">Check</span>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onContinueAsGuest()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
          >
            <span>Skip to Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Login / Hero Split Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Column: Mission, Value Proposition & Eye-Opener */}
        <div className="flex-1 text-center lg:text-left space-y-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Financial Clarity & Habit Recovery</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans'] leading-[1.12]">
            Know what betting is <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-200">
              really costing you.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            The private accountability web app for anyone ready to curb or quit sports betting. 
            Track cold reality, break dopamine cycles, eliminate loss-chasing, and protect your hard-earned cash.
          </p>

          {/* Quick Feature Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="glass-card p-3.5 rounded-xl border border-slate-800/80 text-left">
              <Flame className="w-4 h-4 text-blue-400 mb-1.5" />
              <div className="text-xs font-bold text-white">Bet-Free Streak</div>
              <div className="text-[11px] text-slate-400">Track clean days & money kept</div>
            </div>
            <div className="glass-card p-3.5 rounded-xl border border-slate-800/80 text-left">
              <TrendingDown className="w-4 h-4 text-amber-400 mb-1.5" />
              <div className="text-xs font-bold text-white">Loss-Chasing Alert</div>
              <div className="text-[11px] text-slate-400">Pattern detector warns early</div>
            </div>
            <div className="glass-card p-3.5 rounded-xl border border-slate-800/80 text-left col-span-2 sm:col-span-1">
              <Sliders className="w-4 h-4 text-cyan-400 mb-1.5" />
              <div className="text-xs font-bold text-white">Hard Limits</div>
              <div className="text-[11px] text-slate-400">Uncompromising boundaries</div>
            </div>
          </div>
        </div>

        {/* Right Column: High-End Auth Portal Card */}
        <div className="w-full max-w-md">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800/90 shadow-2xl shadow-black/50 relative overflow-hidden">
            {/* Top Auth Tab Toggle */}
            <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setError(null);
                  setMessage(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  !isSignUp
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setError(null);
                  setMessage(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  isSignUp
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Status alerts */}
            {message && (
              <div className="mb-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-blue-400" />
                <span>{message}</span>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}


            {/* Auth Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#101726] text-white pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-700/80 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  {!isSignUp && (
                    <span className="text-[11px] text-slate-500 hover:text-blue-400 cursor-pointer">
                      Forgot password?
                    </span>
                  )}
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#101726] text-white pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-700/80 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>{isSignUp ? 'Create My Private Account' : 'Sign In to Dashboard'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <span className="relative px-3 bg-[#101726] text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                Or explore without signing up
              </span>
            </div>

            {/* Quick One-Click Guest / Instant Demo Access */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onLoadDemoAndEnter()}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 font-bold text-xs border border-blue-500/30 flex items-center justify-center gap-2 transition-colors group"
              >
                <PlayCircle className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                <span>Enter Live Demo Mode (Sample Data)</span>
              </button>

              <button
                type="button"
                onClick={() => onContinueAsGuest()}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white font-medium text-xs border border-slate-700/60 flex items-center justify-center gap-2 transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-slate-400" />
                <span>Continue as Private Guest (Clean Slate)</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500 text-center mt-4">
              Guest mode stores 100% of data locally on your device. Zero cloud sync unless you sign in.
            </p>
          </div>
        </div>
      </main>

      {/* Interactive Opportunity Cost Teaser Section */}
      <section className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800/80">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Quick Reality Check</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 font-['Plus_Jakarta_Sans']">
              What has betting diverted from your life?
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Move the slider to see what betting funds would have bought instead:
            </p>
          </div>

          <div className="mt-6 max-w-md mx-auto space-y-3">
            <div className="text-center">
              <span className="text-3xl font-black text-white font-['Plus_Jakarta_Sans']">
                {formatCurrency(teaserAmount, currency)}
              </span>
            </div>

            <input
              type="range"
              min="50000"
              max="1500000"
              step="25000"
              value={teaserAmount}
              onChange={(e) => setTeaserAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />

            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>{formatCurrency(50000, currency)}</span>
              <span>{formatCurrency(1500000, currency)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800/80">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-xs text-slate-400">Could have paid</span>
              <div className="text-2xl font-bold text-blue-400 mt-1">
                {rentMonths} Months
              </div>
              <span className="text-xs text-slate-400">of stress-free apartment rent</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-xs text-slate-400">Compounded in 5 years (at 12%)</span>
              <div className="text-2xl font-bold text-cyan-300 mt-1">
                {formatCurrency(compoundFiveYears, currency)}
              </div>
              <span className="text-xs text-slate-400">in safe, dividend-paying assets</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-4 text-center text-xs text-slate-500 border-t border-slate-800/60 relative z-10">
        <p>© {new Date().getFullYear()} BetCheck. Built for personal accountability, financial awareness, and recovery.</p>
        <p className="mt-1 text-slate-600">
          Strictly non-gambling: No betting odds, no bookmaker links, no promotional codes.
        </p>
      </footer>
    </div>
  );
}
