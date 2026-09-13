import React, { useState, useEffect } from 'react';
import { Calculator, Target, Home, Laptop, Shield, Briefcase, GraduationCap, Plus, Trash2, TrendingUp } from 'lucide-react';
import { formatCurrency, DEFAULT_GOALS } from '../lib/calculations';

export default function WhatIfCalculator({
  totalLost = 0,
  currency = 'NGN',
  customGoals = [],
  onAddCustomGoal,
  onDeleteCustomGoal,
}) {
  const [lossAmount, setLossAmount] = useState(totalLost > 0 ? totalLost : 450000);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newCategory, setNewCategory] = useState('Personal');

  // Update default when totalLost changes from props
  useEffect(() => {
    if (totalLost > 0) {
      setLossAmount(totalLost);
    }
  }, [totalLost]);

  const allGoals = [...DEFAULT_GOALS, ...(customGoals || [])];

  const getIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'housing': return Home;
      case 'tech & career': return Laptop;
      case 'security': return Shield;
      case 'entrepreneurship': return Briefcase;
      case 'education': return GraduationCap;
      default: return Target;
    }
  };

  const handleCreateGoal = (e) => {
    e.preventDefault();
    const targetNum = parseFloat(newTarget);
    if (!newTitle.trim() || isNaN(targetNum) || targetNum <= 0) return;

    onAddCustomGoal({
      title: newTitle.trim(),
      targetAmount: targetNum,
      category: newCategory,
      description: 'Your personal recovery goal',
    });

    setNewTitle('');
    setNewTarget('');
    setIsAddingGoal(false);
  };

  // 5-year compound growth calculation at 12% per year
  const compoundFiveYears = Math.round(lossAmount * Math.pow(1 + 0.12, 5));
  const compoundGain = Math.max(0, compoundFiveYears - lossAmount);

  return (
    <div className="space-y-6">
      {/* Header & Interactive Lost Amount Control */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Calculator className="w-3.5 h-3.5" />
              <span>Opportunity Cost Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              What-If Opportunity Calculator
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Every amount lost to a bookmaker was real life potential traded away. See what that exact money could have purchased or built instead.
            </p>
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium mr-1">Presets:</span>
            {[50000, 150000, 450000, 1000000].map((preset) => (
              <button
                key={preset}
                onClick={() => setLossAmount(preset)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  lossAmount === preset
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {formatCurrency(preset, currency)}
              </button>
            ))}
            {totalLost > 0 && (
              <button
                onClick={() => setLossAmount(totalLost)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
              >
                My Actual Loss ({formatCurrency(totalLost, currency)})
              </button>
            )}
          </div>
        </div>

        {/* Input & Range Slider */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Lost Amount Being Evaluated
              </label>
              <div className="text-3xl sm:text-4xl font-black text-white font-['Plus_Jakarta_Sans'] tracking-tight">
                {formatCurrency(lossAmount, currency)}
              </div>
            </div>

            <div className="w-full sm:w-72">
              <input
                type="range"
                min="10000"
                max="2500000"
                step="10000"
                value={lossAmount}
                onChange={(e) => setLossAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>{formatCurrency(10000, currency)}</span>
                <span>{formatCurrency(2500000, currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compounding Future Wealth Projection Card */}
      <div className="glass-card rounded-2xl p-5 border border-blue-500/30 bg-gradient-to-r from-blue-950/20 via-slate-900/60 to-slate-900/40">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-blue-400">
              The Real Cost: Future Compounding Value
            </span>
            <p className="text-sm font-semibold text-white mt-0.5">
              If this {formatCurrency(lossAmount, currency)} was invested safely in treasury bills / mutual funds (at 12% p.a.):
            </p>
            <div className="mt-2 flex flex-wrap items-baseline gap-2">
              <span className="text-2xl font-extrabold text-blue-400 font-['Plus_Jakarta_Sans']">
                {formatCurrency(compoundFiveYears, currency)}
              </span>
              <span className="text-xs text-slate-400">
                in 5 years (+{formatCurrency(compoundGain, currency)} pure interest gained, without risking a single bet)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Coverage Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>What this {formatCurrency(lossAmount, currency)} could have covered:</span>
          </h3>

          <button
            onClick={() => setIsAddingGoal(!isAddingGoal)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            <span>Add Custom Goal</span>
          </button>
        </div>

        {/* Custom Goal Form Drawer */}
        {isAddingGoal && (
          <form onSubmit={handleCreateGoal} className="glass-card p-4 rounded-xl border border-slate-700 mb-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              required
              placeholder="Goal Title (e.g. Emergency Fund)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-slate-900 text-white px-3 py-2 rounded-lg border border-slate-800 text-xs focus:outline-none focus:border-blue-500"
            />
            <input
              type="number"
              required
              min="1000"
              placeholder="Target Amount"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              className="bg-slate-900 text-white px-3 py-2 rounded-lg border border-slate-800 text-xs focus:outline-none focus:border-blue-500"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="bg-slate-900 text-white px-3 py-2 rounded-lg border border-slate-800 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="Personal">Personal Life</option>
              <option value="Tech & Career">Tech & Career</option>
              <option value="Security">Safety & Family</option>
              <option value="Entrepreneurship">Business</option>
            </select>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg py-2 transition-colors"
              >
                Save Goal
              </button>
              <button
                type="button"
                onClick={() => setIsAddingGoal(false)}
                className="px-3 bg-slate-800 text-slate-400 text-xs rounded-lg hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allGoals.map((goal) => {
            const Icon = getIcon(goal.category);
            const target = Number(goal.targetAmount) || 1;
            const percentage = Math.round((lossAmount / target) * 100);
            const isFullyFunded = percentage >= 100;
            const units = (lossAmount / target).toFixed(1);

            return (
              <div
                key={goal.id}
                className={`glass-card p-5 rounded-2xl border transition-all duration-200 relative ${
                  isFullyFunded
                    ? 'border-blue-500/40 bg-gradient-to-b from-blue-950/15 to-transparent shadow-lg shadow-blue-500/5'
                    : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2.5 rounded-xl ${isFullyFunded ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                        {goal.category}
                      </span>
                      <h4 className="text-sm font-bold text-white leading-tight">
                        {goal.title}
                      </h4>
                    </div>
                  </div>

                  {onDeleteCustomGoal && goal.id.startsWith('goal-') && (
                    <button
                      onClick={() => onDeleteCustomGoal(goal.id)}
                      className="text-slate-500 hover:text-red-400 p-1"
                      title="Delete goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                  {goal.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-800/60">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-semibold text-slate-400">Target Cost:</span>
                    <span className="text-xs font-bold text-slate-200">
                      {formatCurrency(target, currency)}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-xs font-semibold text-slate-400">Coverage:</span>
                    <span className={`text-xs font-extrabold ${isFullyFunded ? 'text-blue-400' : 'text-slate-300'}`}>
                      {percentage}% {isFullyFunded ? `(${units}x Fully Paid)` : 'Funded'}
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFullyFunded
                          ? 'bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-400'
                          : 'bg-gradient-to-r from-slate-600 to-slate-400'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(3, percentage))}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
