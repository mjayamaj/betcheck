import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import BetModal from './components/BetModal';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import CalculatorPage from './pages/CalculatorPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

import { storage } from './lib/storage';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { useDocumentTitle } from './lib/useDocumentTitle';
import {
  calculateStats,
  detectChasingLosses,
  evaluateLimits,
  generateWeeklyRealityCheck,
} from './lib/calculations';

export default function App() {
  // Session determination: Landing Page is Login Page unless user is logged in or active guest
  const hasGuestSession = localStorage.getItem('betcheck_is_guest') === 'true';
  const [activeTab, setActiveTab] = useState(hasGuestSession ? 'dashboard' : 'login');

  const [entries, setEntries] = useState([]);
  const [settings, setSettings] = useState({
    currency: 'NGN',
    daily_limit: 15000,
    weekly_limit: 50000,
    monthly_limit: 150000,
  });
  const [goals, setGoals] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Global Toast Notifications
  const [toast, setToast] = useState(null);
  const triggerToast = (message, type = 'info', duration = 3500) => {
    setToast({ id: Date.now(), message, type, duration });
  };

  // Dynamic Page Titles and Meta Descriptions per view
  useDocumentTitle(activeTab);

  // Theme Accent Palette (Defaults to Electric Sapphire)
  const [theme, setTheme] = useState(() => localStorage.getItem('betcheck_theme') || 'sapphire');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('betcheck_theme', theme);
  }, [theme]);

  // URL Hash Navigation & 404 Routing Support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (!hash) return;
      const validTabs = ['login', 'dashboard', 'history', 'calculator', 'reports', 'settings'];
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
      } else {
        setActiveTab('404');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    if (window.location.hash) {
      handleHashChange();
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTab = (tabId) => {
    setActiveTab(tabId);
    if (tabId !== '404') {
      window.location.hash = tabId;
    }
  };

  // Modals
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [editEntry, setEditEntry] = useState(null);

  // Load initial data
  const loadData = async () => {
    try {
      const [fetchedEntries, fetchedSettings, fetchedGoals] = await Promise.all([
        storage.getEntries(),
        storage.getSettings(),
        storage.getGoals(),
      ]);
      setEntries(fetchedEntries || []);
      setSettings(fetchedSettings || { currency: 'NGN' });
      setGoals(fetchedGoals || []);
    } catch (err) {
      console.error('Failed to load BetCheck data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Check Supabase auth if configured
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          setUser(user);
          navigateTab('dashboard');
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        if (currentUser) {
          navigateTab('dashboard');
        }
        loadData();
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const currency = settings?.currency || 'NGN';

  // Real-time calculations
  const stats = calculateStats(entries);
  const chasingData = detectChasingLosses(entries);
  const limitsData = evaluateLimits(entries, settings);
  const weeklyData = generateWeeklyRealityCheck(entries, stats.totalLost);

  // Auth & Session Handlers
  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem('betcheck_is_guest', 'false');
    triggerToast(`Welcome back, ${loggedInUser.email || 'User'}!`, 'success');
    navigateTab('dashboard');
  };

  const handleContinueAsGuest = async () => {
    localStorage.setItem('betcheck_is_guest', 'true');
    const currentLocal = localStorage.getItem('betcheck_entries');
    if (!currentLocal) {
      storage.clearAllData();
      setEntries([]);
    } else {
      await loadData();
    }
    triggerToast('Operating in 100% private local guest mode.', 'info');
    navigateTab('dashboard');
  };

  const handleLoadDemoAndEnter = async () => {
    storage.resetDemoData();
    await loadData();
    localStorage.setItem('betcheck_is_guest', 'true');
    triggerToast('Realistic sample demo data loaded.', 'success');
    navigateTab('dashboard');
  };

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('betcheck_is_guest');
    triggerToast('Session ended. Private records locked.', 'info');
    navigateTab('login');
  };

  // Entry CRUD Handlers
  const handleSaveEntry = async (entryData) => {
    try {
      if (entryData.id) {
        await storage.updateEntry(entryData.id, entryData);
        triggerToast('Betting session updated successfully.', 'success');
      } else {
        await storage.addEntry(entryData);
        triggerToast('New betting session recorded successfully.', 'success');
      }
      await loadData();
    } catch (err) {
      console.error('Failed to save entry:', err);
      triggerToast('Failed to save session. Please try again.', 'error');
    } finally {
      setEditEntry(null);
    }
  };

  const handleEditEntry = (entry) => {
    setEditEntry(entry);
    setIsLogModalOpen(true);
  };

  const handleDeleteEntry = async (id) => {
    await storage.deleteEntry(id);
    triggerToast('Session removed from records.', 'info');
    await loadData();
  };

  // Settings Handlers
  const handleSaveSettings = async (newSettings) => {
    const updated = await storage.updateSettings(newSettings);
    setSettings(updated);
    triggerToast('Guardrail limits saved successfully.', 'success');
  };

  const handleCurrencyChange = async (newCurrency) => {
    const updated = await storage.updateSettings({ ...settings, currency: newCurrency });
    setSettings(updated);
    triggerToast(`Currency changed to ${newCurrency}.`, 'info');
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    triggerToast(`Theme palette updated to ${newTheme}.`, 'info');
  };

  // Goals Handlers
  const handleAddGoal = async (goal) => {
    await storage.addGoal(goal);
    const updated = await storage.getGoals();
    setGoals(updated);
    triggerToast(`Goal "${goal.title}" added to What-If engine.`, 'success');
  };

  const handleDeleteGoal = async (id) => {
    await storage.deleteGoal(id);
    const updated = await storage.getGoals();
    setGoals(updated);
    triggerToast('Custom goal removed.', 'info');
  };

  // Export / Import / Reset Handlers
  const handleExportData = () => {
    const backup = {
      version: 1,
      exportDate: new Date().toISOString(),
      entries,
      settings,
      goals,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `betcheck-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('Backup file downloaded successfully.', 'success');
  };

  const handleImportData = async (backup) => {
    if (backup.entries) {
      localStorage.setItem('betcheck_entries', JSON.stringify(backup.entries));
    }
    if (backup.settings) {
      localStorage.setItem('betcheck_settings', JSON.stringify(backup.settings));
    }
    if (backup.goals) {
      localStorage.setItem('betcheck_goals', JSON.stringify(backup.goals));
    }
    await loadData();
    triggerToast('Backup restored successfully!', 'success');
  };

  const handleResetDemoData = async () => {
    storage.resetDemoData();
    await loadData();
    triggerToast('Realistic sample demo data loaded.', 'success');
  };

  const handleClearAllData = async () => {
    storage.clearAllData();
    await loadData();
    triggerToast('All data cleared. Clean slate active.', 'info');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-white font-sans">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-3 border-blue-500/20 border-t-blue-400 rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Loading BetCheck Sanctuary...</p>
        </div>
      </div>
    );
  }

  // 1. PRIMARY LANDING PAGE: Dedicated Login Portal
  if (activeTab === 'login') {
    return (
      <>
        <Toast toast={toast} onClose={() => setToast(null)} />
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onContinueAsGuest={handleContinueAsGuest}
          onLoadDemoAndEnter={handleLoadDemoAndEnter}
          currency={currency}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200 overflow-x-hidden w-full max-w-[100vw]">
      {/* Toast Notification Container */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Top Navbar */}
      <Navbar
        stats={stats}
        currency={currency}
        onCurrencyChange={handleCurrencyChange}
        onOpenLogModal={() => {
          setEditEntry(null);
          setIsLogModalOpen(true);
        }}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
        user={user}
        isCloud={isSupabaseConfigured}
        activeTab={activeTab}
        setActiveTab={navigateTab}
        theme={theme}
        setTheme={handleThemeChange}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-12 min-w-0">
        {activeTab === 'dashboard' && (
          <DashboardPage
            stats={stats}
            chasingData={chasingData}
            limitsData={limitsData}
            entries={entries}
            currency={currency}
            onOpenLogModal={() => {
              setEditEntry(null);
              setIsLogModalOpen(true);
            }}
            onOpenSettings={() => navigateTab('settings')}
            onLoadDemo={handleResetDemoData}
            onEditEntry={handleEditEntry}
            onDeleteEntry={handleDeleteEntry}
            setActiveTab={navigateTab}
          />
        )}

        {activeTab === 'history' && (
          <HistoryPage
            entries={entries}
            currency={currency}
            onOpenLogModal={() => {
              setEditEntry(null);
              setIsLogModalOpen(true);
            }}
            onEditEntry={handleEditEntry}
            onDeleteEntry={handleDeleteEntry}
          />
        )}

        {activeTab === 'calculator' && (
          <CalculatorPage
            totalLost={stats.totalLost}
            currency={currency}
            customGoals={goals}
            onAddCustomGoal={handleAddGoal}
            onDeleteCustomGoal={handleDeleteGoal}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsPage
            weeklyData={weeklyData}
            currency={currency}
            onSaveReflection={(note) => {
              triggerToast('Commitment note saved to private journal.', 'success');
            }}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsPage
            settings={settings}
            onSaveSettings={handleSaveSettings}
            currency={currency}
            onCurrencyChange={handleCurrencyChange}
            onResetDemoData={handleResetDemoData}
            onClearAllData={handleClearAllData}
            onExportData={handleExportData}
            onImportData={handleImportData}
            theme={theme}
            setTheme={handleThemeChange}
            onSignOut={handleSignOut}
            user={user}
          />
        )}

        {/* 404 Page or Unrecognized Tab */}
        {activeTab === '404' && (
          <NotFoundPage setActiveTab={navigateTab} />
        )}

        {!['dashboard', 'history', 'calculator', 'reports', 'settings', '404'].includes(activeTab) && (
          <NotFoundPage setActiveTab={navigateTab} />
        )}
      </main>

      {/* Mobile Ergonomic Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={navigateTab}
        onOpenLogModal={() => {
          setEditEntry(null);
          setIsLogModalOpen(true);
        }}
      />

      {/* Bet/Loss Logger CRUD Modal */}
      <BetModal
        isOpen={isLogModalOpen}
        onClose={() => {
          setIsLogModalOpen(false);
          setEditEntry(null);
        }}
        onSave={handleSaveEntry}
        editEntry={editEntry}
        currency={currency}
      />

      {/* Authentication & Security Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        setUser={setUser}
        onExportData={handleExportData}
        onSignOutComplete={handleSignOut}
      />
    </div>
  );
}
