import React from 'react';
import { BarChart3, PieChart, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../lib/calculations';

export function CumulativeLossChart({ entries = [], currency = 'NGN' }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 border border-slate-800 text-center py-12">
        <p className="text-xs text-slate-500">No session entries yet to render trend line.</p>
      </div>
    );
  }

  // Sort chronological ascending
  const sorted = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Calculate running cumulative loss
  let runningLoss = 0;
  const points = sorted.map((entry, idx) => {
    const stake = Number(entry.amount_staked) || 0;
    const returned = Number(entry.amount_returned) || 0;
    const net = stake - returned;
    runningLoss += net;
    return {
      index: idx,
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      loss: runningLoss,
    };
  });

  const maxLoss = Math.max(1, ...points.map((p) => p.loss));
  const height = 160;
  const width = 500;
  const padding = 20;

  // Generate SVG path coordinates
  const pathPoints = points.map((pt, i) => {
    const x = padding + (i / Math.max(1, points.length - 1)) * (width - 2 * padding);
    const y = height - padding - (Math.max(0, pt.loss) / maxLoss) * (height - 2 * padding);
    return `${x},${y}`;
  });

  const linePath = `M ${pathPoints.join(' L ')}`;
  const areaPath = `${linePath} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Cumulative Net Loss Curve</h3>
            <p className="text-[11px] text-slate-400">Total unrecovered money over time</p>
          </div>
        </div>
        <span className="text-xs font-bold text-red-400 font-mono">
          Peak: {formatCurrency(maxLoss, currency)}
        </span>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[420px]">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40 overflow-visible">
            <defs>
              <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#1E293B" strokeDasharray="3,3" />
            <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#1E293B" strokeDasharray="3,3" />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" />

            {/* Area */}
            <path d={areaPath} fill="url(#lossGradient)" />

            {/* Stroke Line */}
            <path d={linePath} fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Data point dots */}
            {points.map((pt, i) => {
              const x = padding + (i / Math.max(1, points.length - 1)) * (width - 2 * padding);
              const y = height - padding - (Math.max(0, pt.loss) / maxLoss) * (height - 2 * padding);
              return (
                <g key={i} className="cursor-pointer group">
                  <circle cx={x} cy={y} r="4" fill="#090D16" stroke="#EF4444" strokeWidth="2" />
                  <title>{`${pt.date}: ${formatCurrency(pt.loss, currency)} total loss`}</title>
                </g>
              );
            })}
          </svg>

          {/* X-axis labels */}
          <div className="flex justify-between text-[10px] text-slate-500 mt-2 px-4 font-mono">
            <span>{points[0]?.date}</span>
            {points.length > 2 && <span>{points[Math.floor(points.length / 2)]?.date}</span>}
            <span>{points[points.length - 1]?.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PlatformBreakdown({ entries = [], currency = 'NGN' }) {
  const platformTotals = {};

  entries.forEach((e) => {
    const plat = e.platform || 'Other';
    const stake = Number(e.amount_staked) || 0;
    const returned = Number(e.amount_returned) || 0;
    const loss = Math.max(0, stake - returned);

    if (!platformTotals[plat]) {
      platformTotals[plat] = { loss: 0, stake: 0, count: 0 };
    }
    platformTotals[plat].loss += loss;
    platformTotals[plat].stake += stake;
    platformTotals[plat].count += 1;
  });

  const sortedPlatforms = Object.entries(platformTotals).sort((a, b) => b[1].loss - a[1].loss);
  const totalAllLoss = Object.values(platformTotals).reduce((sum, p) => sum + p.loss, 0) || 1;

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
          <BarChart3 className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Loss By Bookmaker / Platform</h3>
          <p className="text-[11px] text-slate-400">Where your funds leaked the most</p>
        </div>
      </div>

      <div className="space-y-3 pt-1">
        {sortedPlatforms.length === 0 ? (
          <p className="text-xs text-slate-500">No platforms recorded yet.</p>
        ) : (
          sortedPlatforms.slice(0, 5).map(([plat, data]) => {
            const percent = Math.round((data.loss / totalAllLoss) * 100);
            return (
              <div key={plat} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{plat} ({data.count} sessions)</span>
                  <span className="text-red-400 font-mono">
                    {formatCurrency(data.loss, currency)} ({percent}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full"
                    style={{ width: `${Math.max(4, percent)}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export function ReasonBreakdown({ entries = [] }) {
  const reasonCounts = {};

  entries.forEach((e) => {
    const r = e.reason || 'Other';
    reasonCounts[r] = (reasonCounts[r] || 0) + 1;
  });

  const sortedReasons = Object.entries(reasonCounts).sort((a, b) => b[1] - a[1]);
  const total = entries.length || 1;

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
          <PieChart className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Emotional Trigger Distribution</h3>
          <p className="text-[11px] text-slate-400">The psychological roots driving betting urges</p>
        </div>
      </div>

      <div className="space-y-3 pt-1">
        {sortedReasons.length === 0 ? (
          <p className="text-xs text-slate-500">No reasons recorded yet.</p>
        ) : (
          sortedReasons.map(([reason, count]) => {
            const percent = Math.round((count / total) * 100);
            return (
              <div key={reason} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">{reason}</span>
                  <span className="text-slate-400 font-mono">
                    {count} {count === 1 ? 'time' : 'times'} ({percent}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 rounded-full"
                    style={{ width: `${Math.max(4, percent)}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
