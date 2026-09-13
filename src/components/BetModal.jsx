import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { CURRENCIES } from '../lib/calculations';

const PLATFORMS = [
  'SportyBet',
  'Bet9ja',
  '1xBet',
  'Betway',
  'Stake',
  '10bet',
  'DraftKings',
  'Parimatch',
  'BetKing',
  'Other',
];

const BET_TYPES = [
  'Single',
  'Accumulator',
  'Live / In-Play',
  'Virtual',
  'Casino / Slots',
  'Other',
];

const REASONS = [
  'Boredom',
  'Entertainment',
  'Pressure',
  'Trying to make quick money',
  'Trying to recover losses',
  'Friends influenced me',
  'Habit',
  'Other',
];

export default function BetModal({
  isOpen,
  onClose,
  onSave,
  editEntry = null,
  currency = 'NGN',
}) {
  const [amountStaked, setAmountStaked] = useState('');
  const [outcome, setOutcome] = useState('lost'); // 'lost' | 'won' | 'cashed_out'
  const [amountReturned, setAmountReturned] = useState('');
  const [platform, setPlatform] = useState('SportyBet');
  const [betType, setBetType] = useState('Accumulator');
  const [reason, setReason] = useState('Trying to make quick money');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editEntry) {
      setAmountStaked(editEntry.amount_staked || '');
      setOutcome(editEntry.outcome || 'lost');
      setAmountReturned(editEntry.amount_returned || '');
      setPlatform(editEntry.platform || 'SportyBet');
      setBetType(editEntry.bet_type || 'Accumulator');
      setReason(editEntry.reason || 'Boredom');
      setDate(
        editEntry.date
          ? new Date(editEntry.date).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16)
      );
      setNotes(editEntry.notes || '');
    } else {
      setAmountStaked('');
      setOutcome('lost');
      setAmountReturned('');
      setPlatform('SportyBet');
      setBetType('Accumulator');
      setReason('Boredom');
      setDate(new Date().toISOString().slice(0, 16));
      setNotes('');
    }
    setError('');
  }, [editEntry, isOpen]);

  if (!isOpen) return null;

  const currencySymbol = CURRENCIES[currency]?.symbol || '₦';

  const handleSubmit = (e) => {
    e.preventDefault();
    const stakeNum = parseFloat(amountStaked);
    if (isNaN(stakeNum) || stakeNum <= 0) {
      setError('Please enter a valid stake amount greater than 0.');
      return;
    }

    let returnedNum = 0;
    if (outcome === 'won' || outcome === 'cashed_out') {
      returnedNum = parseFloat(amountReturned);
      if (isNaN(returnedNum) || returnedNum < 0) {
        setError('Please enter the total return amount (payout).');
        return;
      }
    }

    const payload = {
      amount_staked: stakeNum,
      amount_returned: returnedNum,
      outcome,
      platform,
      bet_type: betType,
      reason,
      date: new Date(date).toISOString(),
      notes: notes.trim(),
    };

    if (editEntry?.id) {
      payload.id = editEntry.id;
    }

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-card w-full max-w-lg rounded-2xl border border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-900/50">
          <div>
            <h2 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">
              {editEntry ? 'Edit Betting Session' : 'Log a Betting Session'}
            </h2>
            <p className="text-xs text-slate-400">
              Honest recording is the foundational step to taking back control.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Outcome Toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Session Outcome
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setOutcome('lost');
                  setAmountReturned('0');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  outcome === 'lost'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-lg shadow-red-500/10'
                    : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
              >
                Loss (Lost Full Stake)
              </button>
              <button
                type="button"
                onClick={() => setOutcome('won')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  outcome === 'won'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 shadow-lg shadow-blue-500/10'
                    : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
              >
                Won (Payout Received)
              </button>
              <button
                type="button"
                onClick={() => setOutcome('cashed_out')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  outcome === 'cashed_out'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
              >
                Cashed Out Early
              </button>
            </div>
          </div>

          {/* Amount Staked & Return Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Amount Staked ({currencySymbol}) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 text-sm font-semibold">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  required
                  placeholder="Stake amount"
                  value={amountStaked}
                  onChange={(e) => {
                    setError('');
                    setAmountStaked(e.target.value);
                  }}
                  className="w-full bg-slate-900/90 text-white pl-8 pr-3 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {(outcome === 'won' || outcome === 'cashed_out') && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Total Payout Received ({currencySymbol}) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 text-sm font-semibold">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    required
                    placeholder="Total payout amount"
                    value={amountReturned}
                    onChange={(e) => {
                      setError('');
                      setAmountReturned(e.target.value);
                    }}
                    className="w-full bg-slate-900/90 text-white pl-8 pr-3 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Platform & Bet Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Bookmaker / Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-slate-900/90 text-white px-3 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Bet Type
              </label>
              <select
                value={betType}
                onChange={(e) => setBetType(e.target.value)}
                className="w-full bg-slate-900/90 text-white px-3 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
              >
                {BET_TYPES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Emotional Reason Dropdown (Required prompt spec) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Emotional Trigger / Why did you place this bet?
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-900/90 text-white px-3 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Identifying the impulse behind the bet helps break habitual triggers.
            </p>
          </div>

          {/* Date & Time */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-900/90 text-white px-3 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            />
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Reflection Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="What triggered this bet? (e.g. Felt bored, saw social media slip, wanted to make fast cash)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-900/90 text-white px-3 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600 resize-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/25 active:scale-95 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{editEntry ? 'Update Session' : 'Save Entry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
