import React, { useState } from 'react';
import { 
  Shield, 
  Plus, 
  User, 
  LogOut, 
  Layers, 
  Flame, 
  Menu, 
  X, 
  LayoutDashboard, 
  History, 
  Calculator, 
  FileText, 
  Sliders, 
  Mail,
  Palette,
  Check
} from 'lucide-react';
import { CURRENCIES } from '../lib/calculations';

const THEMES = [
  { id: 'sapphire', name: 'Sapphire', color: '#3B82F6' },
  { id: 'indigo', name: 'Indigo', color: '#6366F1' },
  { id: 'cyan', name: 'Cyan', color: '#06B6D4' },
  { id: 'amber', name: 'Amber', color: '#F59E0B' },
  { id: 'emerald', name: 'Emerald', color: '#10B981' },
];

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
  theme = 'sapphire',
  setTheme,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand & Logo */}
        <div 
          onClick={() => handleNavClick('dashboard')} 
          className="flex items-center space-x-2.5 cursor-pointer group flex-shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform flex-shrink-0">
            <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
              <Shield className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-['Plus_Jakarta_Sans']">
                Bet<span className="text-blue-400">Check</span>
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/25">
                Recovery
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 hidden md:block font-medium truncate">
              Know what betting is really costing you.
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-slate-800 text-blue-400 shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => handleNavClick('history')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'history'
                ? 'bg-slate-800 text-blue-400 shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Session History
          </button>
          <button
            onClick={() => handleNavClick('calculator')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'calculator'
                ? 'bg-slate-800 text-blue-400 shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            What-If Goals
          </button>
          <button
            onClick={() => handleNavClick('reports')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'reports'
                ? 'bg-slate-800 text-blue-400 shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Reality Check
          </button>
          <button
            onClick={() => handleNavClick('settings')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'settings'
                ? 'bg-slate-800 text-blue-400 shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Limits & Settings
          </button>
        </nav>

        {/* Action Controls & Mobile Menu Trigger */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Quick Sessions Counter Pill (Desktop / Tablet) */}
          {stats && (
            <div 
              onClick={() => handleNavClick('history')}
              title={`${stats.totalBets} total sessions logged`}
              className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 text-slate-300 cursor-pointer hover:border-blue-500/40 hover:text-white transition-all text-xs font-semibold"
            >
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>{stats.totalBets} {stats.totalBets === 1 ? 'Session' : 'Sessions'}</span>
            </div>
          )}

          {/* Quick Streak Counter Pill (Desktop / Tablet) */}
          {stats && stats.streakDays > 0 && (
            <div 
              onClick={() => handleNavClick('dashboard')}
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
              className="bg-slate-900 text-slate-200 border border-slate-700/80 rounded-lg text-xs font-semibold px-2 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer max-w-[76px] sm:max-w-none"
              aria-label="Select currency"
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
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 active:scale-95 transition-all flex-shrink-0"
            title="Log a betting session"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Log Session</span>
          </button>

          {/* Account / Cloud Status (Hidden on mobile header, available in mobile drawer) */}
          <button
            onClick={onOpenAuthModal}
            className="hidden sm:block p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
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

          {/* Sign Out (Hidden on mobile header, in mobile drawer) */}
          <button
            onClick={onSignOut}
            className="hidden sm:block p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-colors"
            title="Sign Out / Lock Session"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700/80 transition-colors active:scale-95 flex-shrink-0"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Out / Dropdown Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B0F19]/98 border-b border-slate-800 px-4 py-5 backdrop-blur-2xl shadow-2xl animate-fadeIn space-y-5">
          {/* Quick status counters */}
          <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-400" />
              <span className="text-slate-300">
                <strong className="text-white">{stats?.totalBets || 0}</strong> Sessions
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-semibold">
                {stats?.streakDays || 0}d Clean
              </span>
            </div>
          </div>

          {/* Navigation Links List */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-1">
              Navigation
            </div>
            {[
              { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'history', label: 'Session History', icon: History },
              { id: 'calculator', label: 'What-If Goals & Calculator', icon: Calculator },
              { id: 'reports', label: 'Weekly Reality Check', icon: FileText },
              { id: 'settings', label: 'Limits & Guardrails', icon: Sliders },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <div className="w-2 h-2 rounded-full bg-blue-400" />}
                </button>
              );
            })}
          </div>

          {/* Theme Selector Drawer */}
          {setTheme && (
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <Palette className="w-3.5 h-3.5 text-blue-400" />
                  <span>Theme Accent</span>
                </div>
                <span className="text-[10px] text-slate-500 uppercase">{theme}</span>
              </div>
              <div className="flex items-center justify-between gap-1.5 p-1.5 bg-slate-900/80 rounded-xl border border-slate-800">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className="flex-1 py-1.5 flex items-center justify-center rounded-lg relative transition-transform hover:scale-105"
                    title={t.name}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shadow"
                      style={{ backgroundColor: t.color }}
                    >
                      {theme === t.id && <Check className="w-3 h-3 text-white stroke-[3]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* User Account & Support Footer */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal();
                }}
                className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white"
              >
                <User className="w-4 h-4 text-blue-400" />
                <span>{user ? user.email : isCloud ? 'Sign In / Account' : 'Guest Mode (Local)'}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignOut();
                }}
                className="flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-300 p-1.5 rounded-lg bg-red-500/10"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit</span>
              </button>
            </div>

            <div className="pt-2 text-center text-xs">
              <a
                href="mailto:support@betcheck.app"
                className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-blue-400 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact support@betcheck.app</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
