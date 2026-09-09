import React from 'react';
import { Shield, Plus, User, LogOut } from 'lucide-react';
import { CURRENCIES } from '../lib/calculations';

export default function Navbar({
  stats,
  currency,
  onCurrencyChange,
  onOpenLogModal,
  onOpenAuthModal,
  onSignOut,
  user,
  isCloud,
  activeTab,
  setActiveTab,
  theme,
  setTheme,
}) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
              <Shield className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white font-['Plus_Jakarta_Sans']">
                Bet<span className="text-blue-400">Check</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/25">
                Recovery
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block font-medium">
              Know what betting is really costing you.
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-slate-800 text-blue-400 shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'history'
                ? 'bg-slate-800 text-blue-400 shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Session History
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'calculator'
                ? 'bg-slate-800 text-blue-400 shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            What-If Goals
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'reports'
                ? 'bg-slate-800 text-blue-400 shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Reality Check
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'settings'
                ? 'bg-slate-800 text-blue-400 shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Limits & Settings
          </button>
        </nav>

        {/* Actions (Streak Badge, Sessions Badge, Currency, Log Bet, Auth, Sign Out) */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {/* Quick Sessions Counter Pill */}
          {stats && (
            <div 
              onClick={() => setActiveTab('history')}
              title={`${stats.totalBets} total sessions logged`}
              className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 text-slate-300 cursor-pointer hover:border-blue-500/40 hover:text-white transition-all text-xs font-semibold"
            >
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>{stats.totalBets} {stats.totalBets === 1 ? 'Session' : 'Sessions'}</span>
            </div>
          )}

          {/* Quick Streak Counter Pill */}
          {stats && stats.streakDays > 0 && (
            <div 
              onClick={() => setActiveTab('dashboard')}
              title={`${stats.streakDays} consecutive days without placing a bet`}
              className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 cursor-pointer hover:bg-blue-500/20 transition-all text-xs font-semibold"
            >
              <Flame className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>{stats.streakDays}d Clean</span>
            </div>
          )}

          {/* Currency Dropdown */}
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="bg-slate-900 text-slate-200 border border-slate-700/80 rounded-lg text-xs font-semibold px-2 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {Object.entries(CURRENCIES).map(([code, item]) => (
                <option key={code} value={code} className="bg-slate-900 text-white">
                  {item.symbol} {code}
                </option>
              ))}
            </select>
          </div>

          {/* Log Session Button */}
          <button
            onClick={onOpenLogModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden xs:inline">Log Session</span>
          </button>

          {/* Account / Cloud Status */}
          <button
            onClick={onOpenAuthModal}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            title={user ? `Signed in as ${user.email}` : isCloud ? 'Sign In / Account' : 'Guest Mode (Local Storage)'}
          >
            <div className="relative">
              <User className="w-4 h-4" />
              <span 
                className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                  user ? 'bg-blue-400 ring-2 ring-[#0B0F19]' : 'bg-amber-400 ring-2 ring-[#0B0F19]'
                }`} 
              />
            </div>
          </button>

          {/* Sign Out / Exit Session Button */}
          <button
            onClick={onSignOut}
            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-colors"
            title="Sign Out / Lock Session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
