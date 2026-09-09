import { supabase, isSupabaseConfigured } from './supabase';
import { DEFAULT_GOALS } from './calculations';

const LOCAL_STORAGE_KEYS = {
  ENTRIES: 'betcheck_entries',
  SETTINGS: 'betcheck_settings',
  GOALS: 'betcheck_goals',
  USER: 'betcheck_guest_user',
};

export function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Realistic seed data that showcases the chasing losses detector, streak, and realistic sports platforms
const INITIAL_DEMO_ENTRIES = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    amount_staked: 5000,
    amount_returned: 12500,
    outcome: 'won',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    platform: 'SportyBet',
    bet_type: 'Accumulator',
    reason: 'Entertainment',
    notes: 'Premier League weekend accumulator',
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    amount_staked: 10000,
    amount_returned: 0,
    outcome: 'lost',
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    platform: 'Bet9ja',
    bet_type: 'Single',
    reason: 'Trying to make quick money',
    notes: 'Champions league clash',
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    amount_staked: 20000,
    amount_returned: 0,
    outcome: 'lost',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    platform: '1xBet',
    bet_type: 'Live / In-Play',
    reason: 'Trying to recover losses',
    notes: 'Doubled stake after Champions League loss',
  },
  {
    id: '44444444-4444-4444-8444-444444444444',
    amount_staked: 40000,
    amount_returned: 0,
    outcome: 'lost',
    date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    platform: 'SportyBet',
    bet_type: 'Virtual',
    reason: 'Trying to recover losses',
    notes: 'Chased previous loss late at night',
  },
  {
    id: '55555555-5555-4555-8555-555555555555',
    amount_staked: 80000,
    amount_returned: 0,
    outcome: 'lost',
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    platform: 'SportyBet',
    bet_type: 'Virtual',
    reason: 'Trying to recover losses',
    notes: 'Major chasing session. Decided to stop.',
  },
];

const INITIAL_SETTINGS = {
  currency: 'NGN',
  daily_limit: 15000,
  weekly_limit: 50000,
  monthly_limit: 150000,
};

export const storage = {
  // Check if connected to Supabase
  isCloud() {
    return isSupabaseConfigured && Boolean(supabase?.auth?.getUser());
  },

  // 1. BET ENTRIES CRUD
  async getEntries() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('bet_entries')
            .select('*')
            .order('date', { ascending: false });

          if (!error && Array.isArray(data)) {
            localStorage.setItem(LOCAL_STORAGE_KEYS.ENTRIES, JSON.stringify(data));
            return data;
          }
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local storage:', err);
      }
    }

    const local = localStorage.getItem(LOCAL_STORAGE_KEYS.ENTRIES);
    if (local === null) {
      return [];
    }
    try {
      return JSON.parse(local);
    } catch {
      return [];
    }
  },

  async addEntry(entry) {
    const isUuid = entry.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(entry.id);
    const generatedId = isUuid ? entry.id : generateUUID();

    const newEntry = {
      ...entry,
      id: generatedId,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const insertPayload = {
            amount_staked: Number(newEntry.amount_staked) || 0,
            amount_returned: Number(newEntry.amount_returned) || 0,
            outcome: newEntry.outcome || 'lost',
            platform: newEntry.platform || 'Other',
            bet_type: newEntry.bet_type || 'Single',
            reason: newEntry.reason || null,
            notes: newEntry.notes || '',
            date: newEntry.date || new Date().toISOString(),
            user_id: user.id,
          };

          const { data, error } = await supabase
            .from('bet_entries')
            .insert([insertPayload])
            .select()
            .single();

          if (error) {
            console.error('Supabase insert failed:', error);
          } else if (data) {
            newEntry.id = data.id;
            newEntry.created_at = data.created_at;
          }
        }
      } catch (err) {
        console.warn('Supabase insert failed, storing locally:', err);
      }
    }

    // Always keep local storage updated in sync
    const entries = await this.getEntries();
    const exists = entries.some((e) => e.id === newEntry.id);
    const updated = exists ? entries : [newEntry, ...entries];
    localStorage.setItem(LOCAL_STORAGE_KEYS.ENTRIES, JSON.stringify(updated));
    return newEntry;
  },

  async updateEntry(id, updatedFields) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from('bet_entries')
            .update(updatedFields)
            .eq('id', id);
          if (error) {
            console.error('Supabase update failed:', error);
          }
        }
      } catch (err) {
        console.warn('Supabase update failed, updating locally:', err);
      }
    }

    const entries = await this.getEntries();
    const updated = entries.map((e) => (e.id === id ? { ...e, ...updatedFields } : e));
    localStorage.setItem(LOCAL_STORAGE_KEYS.ENTRIES, JSON.stringify(updated));
    return updated.find((e) => e.id === id);
  },

  async deleteEntry(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase.from('bet_entries').delete().eq('id', id);
          if (error) console.error('Supabase delete error:', error);
        }
      } catch (err) {
        console.warn('Supabase delete failed, removing locally:', err);
      }
    }

    const entries = await this.getEntries();
    const filtered = entries.filter((e) => e.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEYS.ENTRIES, JSON.stringify(filtered));
    return true;
  },

  // 2. SETTINGS & LIMITS
  async getSettings() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          if (!error && data) return data;
        }
      } catch (err) {
        console.warn('Supabase settings fetch failed:', err);
      }
    }

    const local = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
    if (!local) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    try {
      return { ...INITIAL_SETTINGS, ...JSON.parse(local) };
    } catch {
      return INITIAL_SETTINGS;
    }
  },

  async updateSettings(newSettings) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('profiles')
            .upsert({ id: user.id, ...newSettings, updated_at: new Date().toISOString() });
        }
      } catch (err) {
        console.warn('Supabase settings update failed:', err);
      }
    }

    const current = await this.getSettings();
    const merged = { ...current, ...newSettings };
    localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
    return merged;
  },

  // 3. GOALS
  async getGoals() {
    const local = localStorage.getItem(LOCAL_STORAGE_KEYS.GOALS);
    if (!local) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.GOALS, JSON.stringify(DEFAULT_GOALS));
      return DEFAULT_GOALS;
    }
    try {
      return JSON.parse(local);
    } catch {
      return DEFAULT_GOALS;
    }
  },

  async addGoal(goal) {
    const goals = await this.getGoals();
    const newGoal = {
      ...goal,
      id: generateUUID(),
    };
    const updated = [newGoal, ...goals];
    localStorage.setItem(LOCAL_STORAGE_KEYS.GOALS, JSON.stringify(updated));
    return newGoal;
  },

  async deleteGoal(id) {
    const goals = await this.getGoals();
    const filtered = goals.filter((g) => g.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEYS.GOALS, JSON.stringify(filtered));
    return true;
  },

  // 4. RESET / CLEAR DATA
  resetDemoData() {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ENTRIES, JSON.stringify(INITIAL_DEMO_ENTRIES));
    localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    localStorage.setItem(LOCAL_STORAGE_KEYS.GOALS, JSON.stringify(DEFAULT_GOALS));
    return true;
  },

  clearAllData() {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ENTRIES, JSON.stringify([]));
    return true;
  }
};
