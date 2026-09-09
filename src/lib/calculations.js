/**
 * BetCheck Financial & Psychological Analytics Engine
 */

export const CURRENCIES = {
  NGN: { symbol: '₦', code: 'NGN', label: 'Nigerian Naira (₦)', rate: 1 },
  USD: { symbol: '$', code: 'USD', label: 'US Dollar ($)', rate: 1 / 1500 },
  GBP: { symbol: '£', code: 'GBP', label: 'British Pound (£)', rate: 1 / 1950 },
  EUR: { symbol: '€', code: 'EUR', label: 'Euro (€)', rate: 1 / 1650 },
  KES: { symbol: 'KSh', code: 'KES', label: 'Kenyan Shilling (KSh)', rate: 1 / 11.5 },
  GHS: { symbol: 'GH₵', code: 'GHS', label: 'Ghanaian Cedi (GH₵)', rate: 1 / 105 },
  ZAR: { symbol: 'R', code: 'ZAR', label: 'South African Rand (R)', rate: 1 / 82 },
};

/**
 * Format currency with proper commas and symbol
 */
export function formatCurrency(amount, currencyCode = 'NGN') {
  const num = Number(amount) || 0;
  const config = CURRENCIES[currencyCode] || CURRENCIES.NGN;
  return `${config.symbol}${Math.abs(num).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

/**
 * Calculate comprehensive summary statistics from bet entries
 */
export function calculateStats(entries = []) {
  if (!entries || entries.length === 0) {
    return {
      totalStaked: 0,
      totalWon: 0,
      totalLost: 0,
      netPnL: 0,
      totalDeposited: 0,
      totalWithdrawn: 0,
      bettingDaysCount: 0,
      avgWeeklyLoss: 0,
      avgMonthlyLoss: 0,
      streakDays: 0,
      savedDuringStreak: 0,
      biggestSingleLoss: 0,
      winRate: 0,
      totalBets: 0,
    };
  }

  let totalStaked = 0;
  let totalWon = 0;
  let biggestSingleLoss = 0;
  let winsCount = 0;
  const uniqueDays = new Set();

  // Sort chronologically ascending for analysis
  const sortedEntries = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));

  sortedEntries.forEach((entry) => {
    const stake = Number(entry.amount_staked) || 0;
    const returned = Number(entry.amount_returned) || 0;
    totalStaked += stake;
    totalWon += returned;

    if (returned > stake) {
      winsCount += 1;
    }

    const netSession = stake - returned;
    if (netSession > biggestSingleLoss) {
      biggestSingleLoss = netSession;
    }

    const dayKey = new Date(entry.date).toISOString().split('T')[0];
    uniqueDays.add(dayKey);
  });

  const netPnL = totalWon - totalStaked;
  const totalLost = netPnL < 0 ? Math.abs(netPnL) : 0;
  const totalBets = entries.length;
  const winRate = totalBets > 0 ? Math.round((winsCount / totalBets) * 100) : 0;
  const bettingDaysCount = uniqueDays.size;

  // Approximate deposited / withdrawn
  const totalDeposited = totalStaked;
  const totalWithdrawn = totalWon;

  // Calculate day span
  const firstDate = new Date(sortedEntries[0].date);
  const lastDate = new Date(sortedEntries[sortedEntries.length - 1].date);
  const daySpan = Math.max(1, Math.round((lastDate - firstDate) / (1000 * 60 * 60 * 24)));
  const weekSpan = Math.max(1, daySpan / 7);
  const monthSpan = Math.max(1, daySpan / 30);

  const avgWeeklyLoss = totalLost > 0 ? Math.round(totalLost / weekSpan) : 0;
  const avgMonthlyLoss = totalLost > 0 ? Math.round(totalLost / monthSpan) : 0;
  const avgDailyLoss = totalLost > 0 ? Math.round(totalLost / daySpan) : 0;

  // Calculate Bet-Free Streak: Days since the last logged bet
  const now = new Date();
  const mostRecentBetDate = new Date(sortedEntries[sortedEntries.length - 1].date);
  const diffMs = now - mostRecentBetDate;
  const streakDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  // Money kept away from betting during the streak:
  // Baseline daily loss * streak days
  const baselineDailyLoss = avgDailyLoss > 0 ? avgDailyLoss : 2500;
  const savedDuringStreak = streakDays * baselineDailyLoss;

  return {
    totalStaked,
    totalWon,
    totalLost,
    netPnL,
    totalDeposited,
    totalWithdrawn,
    bettingDaysCount,
    avgWeeklyLoss,
    avgMonthlyLoss,
    avgDailyLoss,
    streakDays,
    savedDuringStreak,
    biggestSingleLoss,
    winRate,
    totalBets,
  };
}

/**
 * Chasing-Losses Detector:
 * Flags when recent sessions show escalating stakes after losses.
 * Example: "⚠️ You may be chasing your losses — your last 3 sessions grew larger after losses."
 */
export function detectChasingLosses(entries = []) {
  if (!entries || entries.length < 2) {
    return { isChasing: false, message: null, count: 0 };
  }

  // Sort ascending by date
  const sorted = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
  const recent = sorted.slice(-5); // inspect up to last 5 sessions

  let escalatingLossCount = 0;
  let prevStake = null;

  for (let i = 0; i < recent.length; i++) {
    const entry = recent[i];
    const stake = Number(entry.amount_staked) || 0;
    const returned = Number(entry.amount_returned) || 0;
    const isLoss = returned < stake;

    if (isLoss) {
      if (prevStake !== null && stake > prevStake) {
        escalatingLossCount++;
      } else if (prevStake === null) {
        escalatingLossCount = 1;
      }
      prevStake = stake;
    } else {
      // A winning session resets or dampens the direct escalation sequence
      escalatingLossCount = 0;
      prevStake = null;
    }
  }

  if (escalatingLossCount >= 2) {
    return {
      isChasing: true,
      count: escalatingLossCount + 1,
      message: `You may be chasing your losses — your last ${escalatingLossCount + 1} sessions grew larger after losses.`,
      advice: 'Escalating stakes to recover past losses is a classic cognitive trap. Consider pausing for at least 24 hours to reset your perspective.',
    };
  }

  return { isChasing: false, message: null, count: 0 };
}

/**
 * Check limits compliance against daily, weekly, and monthly spending
 */
export function evaluateLimits(entries = [], limits = {}) {
  const { daily_limit, weekly_limit, monthly_limit } = limits;
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  let dailySpent = 0;
  let weeklySpent = 0;
  let monthlySpent = 0;

  entries.forEach((e) => {
    const d = new Date(e.date);
    const stake = Number(e.amount_staked) || 0;

    if (d.toISOString().split('T')[0] === todayStr) {
      dailySpent += stake;
    }
    if (d >= oneWeekAgo) {
      weeklySpent += stake;
    }
    if (d >= oneMonthAgo) {
      monthlySpent += stake;
    }
  });

  const alerts = [];

  if (daily_limit && dailySpent >= daily_limit) {
    alerts.push({
      period: 'day',
      type: 'daily',
      spent: dailySpent,
      limit: Number(daily_limit),
      message: "⚠️ You've reached your personal daily limit. Consider taking a break.",
    });
  }

  if (weekly_limit && weeklySpent >= weekly_limit) {
    alerts.push({
      period: 'week',
      type: 'weekly',
      spent: weeklySpent,
      limit: Number(weekly_limit),
      message: "⚠️ You've reached your personal weekly limit. Consider taking a break.",
    });
  }

  if (monthly_limit && monthlySpent >= monthly_limit) {
    alerts.push({
      period: 'month',
      type: 'monthly',
      spent: monthlySpent,
      limit: Number(monthly_limit),
      message: "⚠️ You've reached your personal monthly limit. Consider taking a break.",
    });
  }

  return {
    dailySpent,
    weeklySpent,
    monthlySpent,
    dailyLimit: Number(daily_limit) || null,
    weeklyLimit: Number(weekly_limit) || null,
    monthlyLimit: Number(monthly_limit) || null,
    alerts,
    isExceeded: alerts.length > 0,
  };
}

/**
 * Generate Weekly Reality Check report for the last 7 days
 */
export function generateWeeklyRealityCheck(entries = [], baselineTotalLost = 0) {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const weekEntries = entries.filter((e) => new Date(e.date) >= sevenDaysAgo);

  let amountSpent = 0;
  let amountReturned = 0;
  let biggestSingleLoss = 0;
  const bettingDays = new Set();

  weekEntries.forEach((e) => {
    const stake = Number(e.amount_staked) || 0;
    const ret = Number(e.amount_returned) || 0;
    amountSpent += stake;
    amountReturned += ret;

    const net = stake - ret;
    if (net > biggestSingleLoss) {
      biggestSingleLoss = net;
    }

    bettingDays.add(new Date(e.date).toISOString().split('T')[0]);
  });

  const amountLost = Math.max(0, amountSpent - amountReturned);
  const daysBetOn = bettingDays.size;
  const betFreeDays = 7 - daysBetOn;

  // 12-month projection if this weekly rate continues:
  // Use current weekly loss, or if this week had zero, use historical weekly average
  const projectedAnnualLoss = amountLost > 0 ? amountLost * 52 : Math.round((baselineTotalLost / 4) * 12);

  return {
    weekRange: `${sevenDaysAgo.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
    amountSpent,
    amountLost,
    daysBetOn,
    betFreeDays,
    biggestSingleLoss,
    projectedAnnualLoss,
    sessionsCount: weekEntries.length,
  };
}

/**
 * Predefined What-If comparison life goals
 */
export const DEFAULT_GOALS = [
  {
    id: 'rent',
    title: 'Yearly House Rent (Decent 2-Bedroom)',
    targetAmount: 850000,
    category: 'Housing',
    icon: 'home',
    description: 'A full year of safe, comfortable accommodation without rent anxiety.',
  },
  {
    id: 'laptop',
    title: 'M3 MacBook Air / High-End Workstation',
    targetAmount: 650000,
    category: 'Tech & Career',
    icon: 'laptop',
    description: 'A powerhouse machine to learn software engineering, design, or remote freelancing.',
  },
  {
    id: 'emergency',
    title: '3-Month Emergency Safety Fund',
    targetAmount: 450000,
    category: 'Security',
    icon: 'shield',
    description: 'Peace of mind knowing urgent medical or living expenses are fully covered.',
  },
  {
    id: 'business',
    title: 'Small Business / Trading Startup Capital',
    targetAmount: 500000,
    category: 'Entrepreneurship',
    icon: 'briefcase',
    description: 'Seed capital to launch an e-commerce store, pos agency, or retail trade.',
  },
  {
    id: 'tuition',
    title: 'Tuition / Professional Tech Certifications',
    targetAmount: 280000,
    category: 'Education',
    icon: 'graduation-cap',
    description: 'Investment in career growth that generates real, compounding lifetime income.',
  },
  {
    id: 'groceries',
    title: 'Full Household Food & Provisions (6 Months)',
    targetAmount: 360000,
    category: 'Living',
    icon: 'shopping-cart',
    description: 'Complete nutritional security and stress-free grocery shopping for half a year.',
  },
];
