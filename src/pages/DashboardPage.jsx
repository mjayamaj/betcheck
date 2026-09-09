import React from 'react';
import { DollarSign, Calendar, TrendingDown, ArrowUpRight, Plus, Layers } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import StreakBanner from '../components/StreakBanner';
import ChasingLossAlert from '../components/ChasingLossAlert';
import LimitsTracker from '../components/LimitsTracker';
import { CumulativeLossChart, PlatformBreakdown, ReasonBreakdown } from '../components/Charts';
import { formatCurrency } from '../lib/calculations';

export default function DashboardPage({
  stats,
  chasingData,
  limitsData,
  entries,
  currency = 'NGN',
  onOpenLogModal,
  onOpenSettings,
  setActiveTab,
}) {
  return (
    <div className="space-y-6 pb-20 md:pb-10">
      {/* 1. Chasing Losses Alert Banner (Appears whenever pattern is detected) */}
      <ChasingLossAlert detectorResult={chasingData} />

      {/* 2. Bet-Free Streak & Money Kept Away Banner */}
      <StreakBanner stats={stats} currency={currency} />

      {/* 3. At-a-Glance Primary Financial Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Net Loss"
          value={formatCurrency(stats.totalLost, currency)}
          subValue={stats.netPnL < 0 ? `Unrecovered capital` : `Even / In profit`}
          icon={TrendingDown}
          variant={stats.totalLost > 0 ? 'danger' : 'wellness'}
          tooltip="Total stake minus returns across all logged sessions."
        />

        <MetricCard
          title="Total Staked"
          value={formatCurrency(stats.totalStaked, currency)}
          subValue={`Across ${stats.totalBets} recorded sessions`}
          icon={DollarSign}
          variant="neutral"
          tooltip="Gross volume put at risk with sportsbooks."
        />

        <MetricCard
          title="Sessions Logged"
          value={`${stats.totalBets} ${stats.totalBets === 1 ? 'Session' : 'Sessions'}`}
          subValue={`Across ${stats.bettingDaysCount} active betting ${stats.bettingDaysCount === 1 ? 'day' : 'days'}`}
          icon={Layers}
          variant="wellness"
          tooltip="Total sports betting sessions recorded in your private history."
        />

        <MetricCard
          title="Total Won / Returns"
          value={formatCurrency(stats.totalWon, currency)}
          subValue={`Win rate: ${stats.winRate}% of sessions`}
          icon={ArrowUpRight}
          variant="wellness"
          tooltip="Gross payouts returned by bookmakers."
        />
      </div>

      {/* Secondary Metrics (Betting Days, Avg Loss Per Session, Avg Weekly Loss, Monthly Loss) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Betting Days"
          value={`${stats.bettingDaysCount} Days`}
          subValue="Unique active betting days"
          icon={Calendar}
          variant="neutral"
          tooltip="Calendar days where at least 1 bet was placed."
        />

        <MetricCard
          title="Avg Loss / Session"
          value={formatCurrency(stats.totalBets > 0 ? Math.round(stats.totalLost / stats.totalBets) : 0, currency)}
          subValue="Typical loss per betting run"
          variant="warning"
        />

        <MetricCard
          title="Avg Weekly Loss"
          value={formatCurrency(stats.avgWeeklyLoss, currency)}
          subValue="Calculated over active weeks"
          variant="warning"
        />

        <MetricCard
          title="Avg Monthly Loss"
          value={formatCurrency(stats.avgMonthlyLoss, currency)}
          subValue="Typical monthly cash outflow"
          variant="warning"
        />
      </div>

      {/* 4. Personal Limits Tracker */}
      <LimitsTracker
        limitsData={limitsData}
        currency={currency}
        onOpenSettings={onOpenSettings}
      />

      {/* 5. Loss Curve and Visual Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CumulativeLossChart entries={entries} currency={currency} />
        <PlatformBreakdown entries={entries} currency={currency} />
      </div>

      {/* 6. Emotional Reasons Breakdown */}
      <ReasonBreakdown entries={entries} />

      {/* 7. Recent Sessions Quick List */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
                Recent Betting Sessions
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 text-xs font-bold font-mono">
                {entries.length} {entries.length === 1 ? 'Session Logged' : 'Sessions Logged'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Latest recorded activities in BetCheck</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('history')}
              className="text-xs font-semibold text-blue-400 hover:underline"
            >
              View All ({entries.length})
            </button>
            <button
              onClick={onOpenLogModal}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Session</span>
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          {entries.length === 0 ? (
            <div className="text-center py-10 glass-card rounded-xl border border-slate-800/60 text-slate-400 text-xs space-y-2">
              <Layers className="w-8 h-8 text-slate-600 mx-auto stroke-[1.5]" />
              <p className="font-semibold text-slate-300">No betting sessions logged yet.</p>
              <p className="text-slate-500 max-w-sm mx-auto">
                Click the "Log Session" button above to record your first entry. Every honest entry helps reveal the true cost of betting.
              </p>
              <button
                onClick={onOpenLogModal}
                className="mt-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Your First Session</span>
              </button>
            </div>
          ) : (
            entries.slice(0, 5).map((entry) => {
              const stake = Number(entry.amount_staked) || 0;
              const returned = Number(entry.amount_returned) || 0;
              const isWin = returned > stake;
              const isLost = returned < stake;
              const net = returned - stake;

              return (
                <div
                  key={entry.id}
                  className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isWin
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {isWin ? '+' : '-'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{entry.platform}</span>
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {entry.bet_type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span>{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        {entry.reason && (
                          <>
                            <span>•</span>
                            <span className="text-amber-400/90">{entry.reason}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-sm font-black font-mono ${
                        isWin ? 'text-blue-400' : 'text-red-400'
                      }`}
                    >
                      {isWin ? `+${formatCurrency(returned - stake, currency)}` : `-${formatCurrency(stake - returned, currency)}`}
                    </div>
                    <span className="text-[10px] text-slate-500">
                      Staked: {formatCurrency(stake, currency)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
