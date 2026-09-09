import React, { useState, useEffect } from 'react';
import { Sliders, Shield, Globe, Download, Upload, RotateCcw, Trash2, HeartHandshake, CheckCircle2, Palette, LogOut } from 'lucide-react';
import { CURRENCIES } from '../lib/calculations';

export default function SettingsPage({
  settings,
  onSaveSettings,
  currency,
  onCurrencyChange,
  onResetDemoData,
  onClearAllData,
  onExportData,
  onImportData,
  theme = 'sapphire',
  setTheme,
  onSignOut,
  user,
}) {
  const [dailyLimit, setDailyLimit] = useState(settings?.daily_limit || '');
  const [weeklyLimit, setWeeklyLimit] = useState(settings?.weekly_limit || '');
  const [monthlyLimit, setMonthlyLimit] = useState(settings?.monthly_limit || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setDailyLimit(settings?.daily_limit || '');
    setWeeklyLimit(settings?.weekly_limit || '');
    setMonthlyLimit(settings?.monthly_limit || '');
  }, [settings]);

  const handleSaveLimits = (e) => {
    e.preventDefault();
    onSaveSettings({
      daily_limit: dailyLimit ? parseFloat(dailyLimit) : null,
      weekly_limit: weeklyLimit ? parseFloat(weeklyLimit) : null,
      monthly_limit: monthlyLimit ? parseFloat(monthlyLimit) : null,
      currency,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          onImportData(parsed);
          alert('Data imported successfully!');
        } catch (err) {
          alert('Invalid JSON backup file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const THEMES = [
    { id: 'sapphire', name: 'Electric Sapphire', color: '#3B82F6', desc: 'Modern FinTech Blue (Default)' },
    { id: 'indigo', name: 'Royal Indigo', color: '#6366F1', desc: 'Deep Tech & SaaS' },
    { id: 'cyan', name: 'Electric Cyan', color: '#06B6D4', desc: 'Vibrant Aqua Clarity' },
    { id: 'amber', name: 'Champagne Amber', color: '#F59E0B', desc: 'Wealth & Titanium' },
    { id: 'emerald', name: 'Emerald Forest', color: '#10B981', desc: 'Classic Sanctuary' },
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Plus_Jakarta_Sans']">
            Settings & Guardrails
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Set unbreakable limits, personalize theme accents, and control your private records.
          </p>
        </div>

        {onSignOut && (
          <button
            onClick={onSignOut}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition-colors self-start sm:self-auto"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock & Sign Out</span>
          </button>
        )}
      </div>

      {/* 1. Theme Color Palette Selector */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">App Color Palette</h3>
            <p className="text-xs text-slate-400">
              Customize the accent colors across charts, badges, and interface buttons
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {THEMES.map((t) => {
            const isSelected = theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme && setTheme(t.id)}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  isSelected
                    ? 'bg-slate-800/90 border-blue-500 ring-2 ring-blue-500/30 shadow-lg'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div
                  className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center shadow-md"
                  style={{ backgroundColor: t.color }}
                >
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{t.name}</div>
                  <div className="text-[10px] text-slate-400">{t.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Personal Spending Limits (Core Rule) */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Personal Spending Limits</h3>
            <p className="text-xs text-slate-400">
              When reached, BetCheck warns you firmly with no option to bypass.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveLimits} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Daily Limit ({CURRENCIES[currency]?.symbol})
              </label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="e.g. 10000 (0 = no limit)"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(e.target.value)}
                className="w-full bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-800 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Weekly Limit ({CURRENCIES[currency]?.symbol})
              </label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="e.g. 50000 (0 = no limit)"
                value={weeklyLimit}
                onChange={(e) => setWeeklyLimit(e.target.value)}
                className="w-full bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-800 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Monthly Limit ({CURRENCIES[currency]?.symbol})
              </label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="e.g. 150000 (0 = no limit)"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(e.target.value)}
                className="w-full bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-800 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              {savedSuccess && (
                <span className="text-blue-400 font-semibold text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Limits updated successfully!
                </span>
              )}
            </div>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-lg shadow-blue-600/20"
            >
              Save Guardrails
            </button>
          </div>
        </form>
      </div>

      {/* 3. Primary Currency Configuration */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
            <Globe className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Default Currency</h3>
            <p className="text-xs text-slate-400">
              Select your currency for financial calculations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {Object.entries(CURRENCIES).map(([code, item]) => (
            <button
              key={code}
              type="button"
              onClick={() => onCurrencyChange(code)}
              className={`p-3 rounded-xl border text-left transition-all ${
                currency === code
                  ? 'bg-blue-500/10 border-blue-500 text-blue-400 font-bold shadow-lg shadow-blue-500/10'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="text-sm font-bold">{item.symbol} {code}</div>
              <div className="text-[10px] text-slate-400 truncate">{item.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Database & Privacy Architecture */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
            <Database className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Database & Security Architecture</h3>
            <p className="text-xs text-slate-400">
              Zero tracking, 100% private local mode or Supabase Row-Level Security
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200">Database Status:</span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                isSupabaseConfigured
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              }`}
            >
              {isSupabaseConfigured ? 'Supabase PostgreSQL RLS Active' : 'Private Local Storage Mode'}
            </span>
          </div>

          <p>
            {isSupabaseConfigured
              ? 'All data is synchronized with your Supabase PostgreSQL instance under strict per-user Row Level Security (RLS).'
              : 'BetCheck is currently saving all entries exclusively in your device\'s local storage. Your records never leave your device.'}
          </p>
        </div>

        {/* Data Backup, Import, and Reset */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onExportData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Backup (JSON)</span>
          </button>

          <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span>Restore Backup (JSON)</span>
            <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
          </label>

          <button
            onClick={() => {
              if (confirm('Reset to realistic sample demonstration data?')) {
                onResetDemoData();
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-300 border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to completely erase all logged betting sessions? This cannot be undone.')) {
                onClearAllData();
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-xs font-bold text-red-400 border border-red-500/30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Data</span>
          </button>
        </div>
      </div>

      {/* 5. Support & Wellness Helplines */}
      <div className="glass-card rounded-2xl p-6 border border-blue-500/20 bg-blue-950/10 shadow-xl space-y-3">
        <div className="flex items-center gap-2.5">
          <HeartHandshake className="w-5 h-5 text-blue-400" />
          <h3 className="text-base font-bold text-white">Confidential Support & Freedom Resources</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Betting addiction is driven by algorithmic dopamine reward loops, not personal weakness. You are not alone, and stepping away is the single highest ROI financial decision you will ever make.
        </p>
        <div className="text-xs text-slate-400 space-y-1 pt-1 font-mono">
          <p>• Gamblers Anonymous: <a href="https://www.gamblersanonymous.org" target="_blank" rel="noreferrer" className="text-blue-400 underline">gamblersanonymous.org</a></p>
          <p>• International Gambling Therapy (24/7 Live Support): <a href="https://www.gamblingtherapy.org" target="_blank" rel="noreferrer" className="text-blue-400 underline">gamblingtherapy.org</a></p>
          <p>• Device Blocking Tools: BetBlocker (<a href="https://betblocker.org" target="_blank" rel="noreferrer" className="text-blue-400 underline">betblocker.org</a>) / Gamban</p>
        </div>
      </div>
    </div>
  );
}
