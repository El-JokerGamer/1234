import { supabase, getDeviceFingerprint } from './supabase';
import { countries as mockCountries, resources as mockResources, marketOffers as mockOffers, jobs as mockJobs, treasuryHistory as mockTreasury, revenueData as mockRevenue, taxBreakdown as mockTax, users as mockUsers, resourcePriceHistory as mockPriceHistory } from '../data/mockData';

// ============================================
// Types
// ============================================

export interface DBUser {
  id: number;
  game_id: string;
  username: string | null;
  country_id: number | null;
  serial: string;
  status: 'active' | 'pending' | 'banned';
  role: 'owner' | 'member';
  device_fingerprint: string | null;
  last_login: string | null;
  last_ip: string | null;
  created_at: string;
  country?: { name: string; flag: string };
}

export interface DBCountry {
  id: number;
  name: string;
  flag: string;
  treasury: number;
  population: number;
  gdp: number;
  tax_rate: number;
  currency: string;
}

export interface DBResource {
  id: number;
  name: string;
  icon: string | null;
  price: number;
  change_24h: number;
  supply: number;
  demand: number;
}

export interface DBMarketOffer {
  id: number;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  seller: string | null;
  created_at: string;
  resources?: { name: string };
  countries?: { name: string };
}

export interface DBJob {
  id: number;
  title: string;
  company: string | null;
  salary: number;
  slots: number;
  filled: number;
  countries?: { name: string };
}

export interface DBTreasuryHistory {
  id: number;
  amount: number;
  recorded_at: string;
}

export interface DBRevenueData {
  id: number;
  month: string;
  income: number;
  expenses: number;
}

export interface DBTaxBreakdown {
  id: number;
  category: string;
  amount: number;
  percentage: number;
}

export interface DBActivationCode {
  id: number;
  code: string;
  duration_hours: number | null;
  is_unlimited: boolean;
  is_used: boolean;
  used_by: number | null;
  created_at: string;
  expires_at: string | null;
}

export interface DBSecurityLog {
  id: number;
  user_id: number | null;
  action: string;
  ip_address: string | null;
  device_fingerprint: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

// ============================================
// Helper: check if Supabase is reachable
// ============================================

let supabaseAvailable: boolean | null = null;

async function checkSupabase(): Promise<boolean> {
  if (supabaseAvailable !== null) return supabaseAvailable;
  
  try {
    const { error } = await supabase.from('countries').select('id').limit(1);
    supabaseAvailable = !error;
    return supabaseAvailable;
  } catch {
    supabaseAvailable = false;
    return false;
  }
}

// ============================================
// Auth Functions
// ============================================

export async function signup(gameId: string): Promise<{ success: boolean; serial?: string; error?: string }> {
  const isAvailable = await checkSupabase();
  
  if (!isAvailable) {
    // Fallback: generate serial locally
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const segments = [];
    for (let i = 0; i < 4; i++) {
      let segment = '';
      for (let j = 0; j < 4; j++) {
        segment += chars[Math.floor(Math.random() * chars.length)];
      }
      segments.push(segment);
    }
    return { success: true, serial: segments.join('-') };
  }

  try {
    const fingerprint = getDeviceFingerprint();
    
    // Check if user already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('game_id', gameId)
      .single();
    
    if (existing) {
      return { success: false, error: 'هذا الحساب مسجل بالفعل' };
    }

    // Generate serial
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const segments = [];
    for (let i = 0; i < 4; i++) {
      let segment = '';
      for (let j = 0; j < 4; j++) {
        segment += chars[Math.floor(Math.random() * chars.length)];
      }
      segments.push(segment);
    }
    const serial = segments.join('-');

    // Insert user
    const { error } = await supabase
      .from('users')
      .insert({
        game_id: gameId,
        serial,
        device_fingerprint: fingerprint,
        status: 'pending',
        role: 'member',
      });

    if (error) {
      return { success: false, error: error.message };
    }

    // Log security event
    await supabase.from('security_logs').insert({
      action: 'signup',
      device_fingerprint: fingerprint,
      details: { game_id: gameId },
    });

    return { success: true, serial };
  } catch (err) {
    return { success: false, error: 'حدث خطأ أثناء التسجيل' };
  }
}

export async function login(gameId: string, serial: string): Promise<{ success: boolean; user?: DBUser; error?: string }> {
  const isAvailable = await checkSupabase();
  
  if (!isAvailable) {
    // Fallback: use mock data
    if (gameId === '10001' && serial === 'A3F8-B2C1-D4E5-F6A7') {
      return { success: true, user: mockUsers[0] as unknown as DBUser };
    }
    const mockUser = mockUsers.find(u => u.gameId === gameId);
    if (mockUser) {
      return { success: true, user: mockUser as unknown as DBUser };
    }
    return { success: false, error: 'بيانات الدخول غير صحيحة' };
  }

  try {
    const fingerprint = getDeviceFingerprint();

    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('*, country:countries(name, flag)')
      .eq('game_id', gameId)
      .eq('serial', serial)
      .single();

    if (error || !user) {
      await supabase.from('security_logs').insert({
        action: 'login_failed',
        device_fingerprint: fingerprint,
        details: { game_id: gameId, reason: 'invalid_credentials' },
      });
      return { success: false, error: 'بيانات الدخول غير صحيحة' };
    }

    // Check device fingerprint
    if (user.device_fingerprint && user.device_fingerprint !== fingerprint) {
      await supabase.from('security_logs').insert({
        action: 'login_failed',
        device_fingerprint: fingerprint,
        details: { game_id: gameId, reason: 'device_mismatch' },
      });
      return { success: false, error: 'جهاز غير مصرح به. يرجى التواصل مع الأدمن.' };
    }

    // Check status
    if (user.status === 'banned') {
      return { success: false, error: 'هذا الحساب محظور' };
    }
    if (user.status === 'pending') {
      return { success: false, error: 'الحساب في انتظار التفعيل من الأدمن' };
    }

    // Update last login
    await supabase
      .from('users')
      .update({
        last_login: new Date().toISOString(),
        last_ip: 'client_ip', // In production, get from edge function
      })
      .eq('id', user.id);

    // Log security event
    await supabase.from('security_logs').insert({
      user_id: user.id,
      action: 'login_success',
      device_fingerprint: fingerprint,
    });

    return { success: true, user };
  } catch (err) {
    return { success: false, error: 'حدث خطأ أثناء تسجيل الدخول' };
  }
}

// ============================================
// Data Fetching Functions
// ============================================

export async function fetchCountries(): Promise<DBCountry[]> {
  const isAvailable = await checkSupabase();
  
  if (!isAvailable) {
    return mockCountries as unknown as DBCountry[];
  }

  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .order('name');

  if (error || !data || data.length === 0) {
    return mockCountries as unknown as DBCountry[];
  }

  return data;
}

export async function fetchResources(): Promise<DBResource[]> {
  const isAvailable = await checkSupabase();
  
  if (!isAvailable) {
    return mockResources as unknown as DBResource[];
  }

  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .order('name');

  if (error || !data || data.length === 0) {
    return mockResources as unknown as DBResource[];
  }

  return data;
}

export async function fetchMarketOffers(): Promise<DBMarketOffer[]> {
  const isAvailable = await checkSupabase();
  
  if (!isAvailable) {
    return mockOffers as unknown as DBMarketOffer[];
  }

  const { data, error } = await supabase
    .from('market_offers')
    .select('*, resources(name), countries(name)')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error || !data || data.length === 0) {
    return mockOffers as unknown as DBMarketOffer[];
  }

  return data;
}

export async function fetchJobs(): Promise<DBJob[]> {
  const isAvailable = await checkSupabase();
  
  if (!isAvailable) {
    return mockJobs as unknown as DBJob[];
  }

  const { data, error } = await supabase
    .from('jobs')
    .select('*, countries(name)')
    .order('salary', { ascending: false });

  if (error || !data || data.length === 0) {
    return mockJobs as unknown as DBJob[];
  }

  return data;
}

export async function fetchTreasuryHistory(countryId?: number): Promise<DBTreasuryHistory[]> {
  const isAvailable = await checkSupabase();
  
  if (!isAvailable) {
    return mockTreasury.map(t => ({
      id: Math.random(),
      amount: t.price,
      recorded_at: t.date,
    })) as DBTreasuryHistory[];
  }

  let query = supabase
    .from('treasury_history')
    .select('*')
    .order('recorded_at', { ascending: true });

  if (countryId) {
    query = query.eq('country_id', countryId);
  }

  const { data, error } = await query.limit(30);

  if (error || !data || data.length === 0) {
    return mockTreasury.map(t => ({
      id: Math.random(),
      amount: t.price,
      recorded_at: t.date,
    })) as DBTreasuryHistory[];
  }

  return data;
}

export async function fetchRevenueData(countryId?: number): Promise<DBRevenueData[]> {
  const isAvailable = await checkSupabase();
  
  if (!isAvailable) {
    return mockRevenue as unknown as DBRevenueData[];
  }

  let query = supabase
    .from('revenue_data')
    .select('*')
    .order('month');

  if (countryId) {
    query = query.eq('country_id', countryId);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    return mockRevenue as unknown as DBRevenueData[];
  }

  return data;
}

export async function fetchTaxBreakdown(countryId?: number): Promise<DBTaxBreakdown[]> {
  const isAvailable = await checkSupabase();
  
  if (!isAvailable) {
    return mockTax as unknown as DBTaxBreakdown[];
  }

  let query = supabase
    .from('tax_breakdown')
    .select('*')
    .order('percentage', { ascending: false });

  if (countryId) {
    query = query.eq('country_id', countryId);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    return mockTax as unknown as DBTaxBreakdown[];
  }

  return data;
}

export async function fetchResourcePriceHistory(resourceName: string): Promise<{ date: string; price: number }[]> {
  const isAvailable = await checkSupabase();
  
  if (!isAvailable) {
    return mockPriceHistory[resourceName] || [];
  }

  // First get resource ID
  const { data: resource } = await supabase
    .from('resources')
    .select('id')
    .eq('name', resourceName)
    .single();

  if (!resource) {
    return mockPriceHistory[resourceName] || [];
  }

  const { data, error } = await supabase
    .from('resource_price_history')
    .select('price, recorded_at')
    .eq('resource_id', resource.id)
    .order('recorded_at', { ascending: true });

  if (error || !data || data.length === 0) {
    return mockPriceHistory[resourceName] || [];
  }

  return data.map(d => ({
    date: new Date(d.recorded_at).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    price: d.price,
  }));
}

// ============================================
// Admin Functions
// ============================================

export async function fetchAllUsers(): Promise<DBUser[]> {
  const isAvailable = await checkSupabase();
  
  if (!isAvailable) {
    return mockUsers as unknown as DBUser[];
  }

  const { data, error } = await supabase
    .from('users')
    .select('*, country:countries(name, flag)')
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    return mockUsers as unknown as DBUser[];
  }

  return data;
}

export async function updateUserStatus(userId: number, status: 'active' | 'pending' | 'banned'): Promise<boolean> {
  const isAvailable = await checkSupabase();
  
  if (!isAvailable) return true;

  const { error } = await supabase
    .from('users')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', userId);

  return !error;
}

export async function deleteUser(userId: number): Promise<boolean> {
  const isAvailable = await checkSupabase();
  
  if (!isAvailable) return true;

  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

  return !error;
}

export async function regenerateSerial(userId: number): Promise<string | null> {
  const isAvailable = await checkSupabase();
  
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segments = [];
  for (let i = 0; i < 4; i++) {
    let segment = '';
    for (let j = 0; j < 4; j++) {
      segment += chars[Math.floor(Math.random() * chars.length)];
    }
    segments.push(segment);
  }
  const newSerial = segments.join('-');

  if (!isAvailable) return newSerial;

  const { error } = await supabase
    .from('users')
    .update({ serial: newSerial, updated_at: new Date().toISOString() })
    .eq('id', userId);

  return error ? null : newSerial;
}

export async function createActivationCode(durationHours: number | null): Promise<string | null> {
  const isAvailable = await checkSupabase();
  
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) code += '-';
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  if (!isAvailable) return code;

  const expiresAt = durationHours
    ? new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString()
    : null;

  const { error } = await supabase
    .from('activation_codes')
    .insert({
      code,
      duration_hours: durationHours,
      is_unlimited: !durationHours,
      expires_at: expiresAt,
    });

  return error ? null : code;
}

export async function fetchActivationCodes(): Promise<DBActivationCode[]> {
  const isAvailable = await checkSupabase();
  
  if (!isAvailable) {
    return [];
  }

  const { data, error } = await supabase
    .from('activation_codes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error || !data) return [];
  return data;
}

export async function fetchSecurityLogs(): Promise<DBSecurityLog[]> {
  const isAvailable = await checkSupabase();
  
  if (!isAvailable) {
    return [];
  }

  const { data, error } = await supabase
    .from('security_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error || !data) return [];
  return data;
}
