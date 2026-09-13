import { useEffect } from 'react';

const PAGE_METADATA = {
  login: {
    title: 'Sign In & Welcome | BetCheck — Private Financial Recovery',
    description: 'BetCheck is your private accountability sanctuary to uncover what sports betting is really costing you and regain financial control.',
  },
  dashboard: {
    title: 'Dashboard | BetCheck — Financial Reality & Overview',
    description: 'Live overview of sports betting spend, unrecovered losses, active streak days, and cognitive chasing-losses alerts.',
  },
  history: {
    title: 'Session History | BetCheck — Private Activity Log',
    description: 'Complete, unfiltered chronological log of sports betting sessions, stakes, returns, and emotional triggers.',
  },
  calculator: {
    title: 'What-If Calculator | BetCheck — Opportunity Cost Engine',
    description: 'Evaluate betting losses against real-world life assets, rent, laptops, tuition, and 5-year compounding investments.',
  },
  reports: {
    title: 'Weekly Reality Check | BetCheck — Accountability Report',
    description: 'Weekly accountability review detailing 12-month loss projections, bet-free days, and personal recovery commitments.',
  },
  settings: {
    title: 'Limits & Settings | BetCheck — Personal Guardrails',
    description: 'Configure unbreakable daily, weekly, and monthly spending guardrails, select color themes, and manage local data backups.',
  },
  '404': {
    title: '404 Page Not Found | BetCheck — Sanctuary Intact',
    description: 'The requested view or link could not be found. Return to your private BetCheck dashboard.',
  },
};

export function useDocumentTitle(activeTab) {
  useEffect(() => {
    const meta = PAGE_METADATA[activeTab] || PAGE_METADATA.dashboard;
    document.title = meta.title;

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', meta.description);
    }

    // Update OpenGraph title and description
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', meta.title);
    }
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', meta.description);
    }
  }, [activeTab]);
}
