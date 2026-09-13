import React, { useState, useMemo } from 'react';
import { Plus, Search, Trash2, Edit3, Calendar } from 'lucide-react';
import { formatCurrency } from '../lib/calculations';

export default function HistoryPage({
  entries,
  currency = 'NGN',
  onOpenLogModal,
  onEditEntry,
  onDeleteEntry,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState('all');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');

  // Distinct platforms
  const platforms = useMemo(() => {
    const set = new Set();
    entries.forEach((e) => e.platform && set.add(e.platform));
    return Array.from(set);
  }, [entries]);

  // Filtered list
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (outcomeFilter !== 'all' && entry.outcome !== outcomeFilter) return false;
      if (reasonFilter !== 'all' && entry.reason !== reasonFilter) return false;
      if (platformFilter !== 'all' && entry.platform !== platformFilter) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const plat = (entry.platform || '').toLowerCase();
        const type = (entry.bet_type || '').toLowerCase();
        const rsn = (entry.reason || '').toLowerCase();
        const note = (entry.notes || '').toLowerCase();
        return plat.includes(query) || type.includes(query) || rsn.includes(query) || note.includes(query);
      }

      return true;
    });
  }, [entries, outcomeFilter, reasonFilter, platformFilter, searchQuery]);

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Plus_Jakarta_Sans']">
              Betting Session Log
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 text-xs font-bold font-mono">
              {entries.length} {entries.length === 1 ? 'Session Total' : 'Sessions Total'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete, unfiltered record of all recorded gambling activity.
          </p>
        </div>

        <button
          onClick={onOpenLogModal}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Log New Session</span>
        </button>
      </div>

      {/* Filters & Search Controls */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by platform, bet type, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 text-white pl-9 pr-3 py-2 rounded-xl border border-slate-800 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Outcome Filter */}
          <div>
            <select
              value={outcomeFilter}
              onChange={(e) => setOutcomeFilter(e.target.value)}
              className="w-full bg-slate-900 text-slate-200 px-3 py-2 rounded-xl border border-slate-800 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">All Outcomes</option>
              <option value="lost">Losses Only</option>
              <option value="won">Wins Only</option>
              <option value="cashed_out">Cashed Out</option>
            </select>
          </div>

          {/* Emotional Reason Filter */}
          <div>
            <select
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              className="w-full bg-slate-900 text-slate-200 px-3 py-2 rounded-xl border border-slate-800 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">All Triggers / Reasons</option>
              <option value="Boredom">Boredom</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Pressure">Pressure</option>
              <option value="Trying to make quick money">Trying to make quick money</option>
              <option value="Trying to recover losses">Trying to recover losses</option>
              <option value="Friends influenced me">Friends influenced me</option>
              <option value="Habit">Habit</option>
            </select>
          </div>

          {/* Platform Filter */}
          <div>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="w-full bg-slate-900 text-slate-200 px-3 py-2 rounded-xl border border-slate-800 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">All Platforms</option>
              {platforms.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results summary counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>
            Showing <strong className="text-white">{filteredEntries.length}</strong> of <strong className="text-blue-400">{entries.length}</strong> {entries.length === 1 ? 'session' : 'sessions'} logged
          </span>
          {(searchQuery || outcomeFilter !== 'all' || reasonFilter !== 'all' || platformFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setOutcomeFilter('all');
                setReasonFilter('all');
                setPlatformFilter('all');
              }}
              className="text-blue-400 hover:underline font-semibold"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Entries List / Cards */}
      <div className="space-y-3">
        {entries.length === 0 ? (
          <div className="glass-card rounded-3xl p-10 text-center border border-slate-800 space-y-4 max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">No Sessions Logged Yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Your private log is clean. When an impulse arises or a bet is placed, record it honestly to reveal cumulative spending habits.
              </p>
            </div>
            <button
              onClick={onOpenLogModal}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/25 inline-flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Log Your First Session</span>
            </button>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center border border-slate-800 space-y-3 max-w-lg mx-auto">
            <p className="text-slate-300 text-sm font-semibold">No betting sessions match your filter criteria.</p>
            <p className="text-xs text-slate-500">Try changing your search terms or resetting the outcome/platform filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setOutcomeFilter('all');
                setReasonFilter('all');
                setPlatformFilter('all');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          filteredEntries.map((entry) => {
            const stake = Number(entry.amount_staked) || 0;
            const returned = Number(entry.amount_returned) || 0;
            const isWin = returned > stake;
            const isLost = returned < stake;
            const netAmount = Math.abs(returned - stake);

            return (
              <div
                key={entry.id}
                className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all shadow-md space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                        isWin
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {isWin ? 'WIN' : 'LOSS'}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-bold text-white">{entry.platform}</span>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {entry.bet_type}
                        </span>
                        {entry.reason && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            Trigger: {entry.reason}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(entry.date).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Financial outcome & Action buttons */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-slate-800/60 pt-2 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <div
                        className={`text-base sm:text-lg font-black font-['Plus_Jakarta_Sans'] ${
                          isWin ? 'text-blue-400' : 'text-red-400'
                        }`}
                      >
                        {isWin ? `+${formatCurrency(netAmount, currency)}` : `-${formatCurrency(netAmount, currency)}`}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Stake: {formatCurrency(stake, currency)}
                        {returned > 0 && ` • Return: ${formatCurrency(returned, currency)}`}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditEntry(entry)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Edit session"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this session record?')) {
                            onDeleteEntry(entry.id);
                          }
                        }}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                        title="Delete session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notes if present */}
                {entry.notes && (
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 italic">
                    "{entry.notes}"
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
