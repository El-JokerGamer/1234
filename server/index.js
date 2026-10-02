import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// Supabase Clients
// ============================================

const supabaseUrl = process.env.SUPABASE_URL || 'https://asvhpyfzdtzuygoivcmd.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Public client (for read operations)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client (for write operations - bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// ============================================
// Middleware
// ============================================

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// ============================================
// Helper Functions
// ============================================

function generateSerial() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segments = [];
  for (let i = 0; i < 4; i++) {
    let segment = '';
    for (let j = 0; j < 4; j++) {
      segment += chars[Math.floor(Math.random() * chars.length)];
    }
    segments.push(segment);
  }
  return segments.join('-');
}

function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         'unknown';
}

// ============================================
// Auth Routes
// ============================================

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { game_id, device_fingerprint } = req.body;

    if (!game_id) {
      return res.status(400).json({ error: 'Game ID is required' });
    }

    // Check if user already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('game_id', game_id)
      .single();

    if (existing) {
      return res.status(409).json({ error: 'هذا الحساب مسجل بالفعل' });
    }

    // Generate serial
    const serial = generateSerial();

    // Insert user
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        game_id,
        serial,
        device_fingerprint: device_fingerprint || 'unknown',
        status: 'pending',
        role: 'member',
      })
      .select()
      .single();

    if (error) {
      console.error('Signup error:', error);
      return res.status(500).json({ error: 'Failed to create account' });
    }

    // Log security event
    await supabaseAdmin.from('security_logs').insert({
      user_id: user.id,
      action: 'signup',
      ip_address: getClientIP(req),
      device_fingerprint: device_fingerprint || 'unknown',
      details: { game_id },
    });

    res.json({
      success: true,
      serial,
      message: 'Account created successfully. Waiting for admin activation.',
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { game_id, serial, device_fingerprint } = req.body;

    if (!game_id || !serial) {
      return res.status(400).json({ error: 'Game ID and serial are required' });
    }

    // Find user
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*, country:countries(name, flag)')
      .eq('game_id', game_id)
      .eq('serial', serial)
      .single();

    if (error || !user) {
      // Log failed attempt
      await supabaseAdmin.from('security_logs').insert({
        action: 'login_failed',
        ip_address: getClientIP(req),
        device_fingerprint: device_fingerprint || 'unknown',
        details: { game_id, reason: 'invalid_credentials' },
      });

      return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
    }

    // Check device fingerprint
    if (user.device_fingerprint && user.device_fingerprint !== 'unknown' && 
        device_fingerprint && user.device_fingerprint !== device_fingerprint) {
      await supabaseAdmin.from('security_logs').insert({
        user_id: user.id,
        action: 'login_failed',
        ip_address: getClientIP(req),
        device_fingerprint: device_fingerprint || 'unknown',
        details: { game_id, reason: 'device_mismatch' },
      });

      return res.status(403).json({ error: 'جهاز غير مصرح به. يرجى التواصل مع الأدمن.' });
    }

    // Check status
    if (user.status === 'banned') {
      return res.status(403).json({ error: 'هذا الحساب محظور' });
    }
    if (user.status === 'pending') {
      return res.status(403).json({ error: 'الحساب في انتظار التفعيل من الأدمن' });
    }

    // Update last login
    await supabaseAdmin
      .from('users')
      .update({
        last_login: new Date().toISOString(),
        last_ip: getClientIP(req),
      })
      .eq('id', user.id);

    // Log success
    await supabaseAdmin.from('security_logs').insert({
      user_id: user.id,
      action: 'login_success',
      ip_address: getClientIP(req),
      device_fingerprint: device_fingerprint || 'unknown',
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        game_id: user.game_id,
        username: user.username,
        country: user.country,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// Public Data Routes
// ============================================

// Get all countries
app.get('/api/countries', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .order('name');

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Error fetching countries:', err);
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
});

// Get all resources
app.get('/api/resources', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('name');

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Error fetching resources:', err);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// Get market offers
app.get('/api/market-offers', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('market_offers')
      .select('*, resources(name), countries(name)')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Error fetching market offers:', err);
    res.status(500).json({ error: 'Failed to fetch market offers' });
  }
});

// Get jobs
app.get('/api/jobs', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*, countries(name)')
      .order('salary', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Get treasury history
app.get('/api/treasury-history/:countryId?', async (req, res) => {
  try {
    const { countryId } = req.params;
    
    let query = supabase
      .from('treasury_history')
      .select('*')
      .order('recorded_at', { ascending: true })
      .limit(30);

    if (countryId) {
      query = query.eq('country_id', countryId);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Error fetching treasury history:', err);
    res.status(500).json({ error: 'Failed to fetch treasury history' });
  }
});

// Get revenue data
app.get('/api/revenue/:countryId?', async (req, res) => {
  try {
    const { countryId } = req.params;
    
    let query = supabase
      .from('revenue_data')
      .select('*')
      .order('month');

    if (countryId) {
      query = query.eq('country_id', countryId);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Error fetching revenue data:', err);
    res.status(500).json({ error: 'Failed to fetch revenue data' });
  }
});

// Get tax breakdown
app.get('/api/tax-breakdown/:countryId?', async (req, res) => {
  try {
    const { countryId } = req.params;
    
    let query = supabase
      .from('tax_breakdown')
      .select('*')
      .order('percentage', { ascending: false });

    if (countryId) {
      query = query.eq('country_id', countryId);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Error fetching tax breakdown:', err);
    res.status(500).json({ error: 'Failed to fetch tax breakdown' });
  }
});

// Get resource price history
app.get('/api/price-history/:resourceName', async (req, res) => {
  try {
    const { resourceName } = req.params;

    // Get resource ID
    const { data: resource } = await supabase
      .from('resources')
      .select('id')
      .eq('name', resourceName)
      .single();

    if (!resource) {
      return res.json([]);
    }

    const { data, error } = await supabase
      .from('resource_price_history')
      .select('price, recorded_at')
      .eq('resource_id', resource.id)
      .order('recorded_at', { ascending: true });

    if (error) throw error;
    
    const formatted = (data || []).map(d => ({
      date: new Date(d.recorded_at).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      price: d.price,
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching price history:', err);
    res.status(500).json({ error: 'Failed to fetch price history' });
  }
});

// ============================================
// Admin Routes
// ============================================

// Get all users (admin only)
app.get('/api/admin/users', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*, country:countries(name, flag)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user status
app.put('/api/admin/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'pending', 'banned'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { error } = await supabaseAdmin
      .from('users')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating user status:', err);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// Delete user
app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Regenerate serial
app.post('/api/admin/users/:id/regenerate-serial', async (req, res) => {
  try {
    const { id } = req.params;
    const newSerial = generateSerial();

    const { error } = await supabaseAdmin
      .from('users')
      .update({ serial: newSerial, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true, serial: newSerial });
  } catch (err) {
    console.error('Error regenerating serial:', err);
    res.status(500).json({ error: 'Failed to regenerate serial' });
  }
});

// Create activation code
app.post('/api/admin/activation-codes', async (req, res) => {
  try {
    const { duration_hours } = req.body;
    
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 12; i++) {
      if (i > 0 && i % 4 === 0) code += '-';
      code += chars[Math.floor(Math.random() * chars.length)];
    }

    const expiresAt = duration_hours
      ? new Date(Date.now() + duration_hours * 60 * 60 * 1000).toISOString()
      : null;

    const { error } = await supabaseAdmin
      .from('activation_codes')
      .insert({
        code,
        duration_hours: duration_hours || null,
        is_unlimited: !duration_hours,
        expires_at: expiresAt,
      });

    if (error) throw error;
    res.json({ success: true, code });
  } catch (err) {
    console.error('Error creating activation code:', err);
    res.status(500).json({ error: 'Failed to create activation code' });
  }
});

// Get activation codes
app.get('/api/admin/activation-codes', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('activation_codes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Error fetching activation codes:', err);
    res.status(500).json({ error: 'Failed to fetch activation codes' });
  }
});

// Get security logs
app.get('/api/admin/security-logs', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('security_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Error fetching security logs:', err);
    res.status(500).json({ error: 'Failed to fetch security logs' });
  }
});

// ============================================
// Health Check
// ============================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    supabase: supabaseUrl,
  });
});

// ============================================
// Start Server
// ============================================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎮 Eclesiar Economic Dashboard Server                   ║
║                                                           ║
║   🚀 Server running on port ${PORT}                        ║
║   📊 Environment: ${process.env.NODE_ENV || 'development'}                    ║
║   🔗 Supabase: ${supabaseUrl.substring(0, 30)}...         ║
║                                                           ║
║   📡 API Endpoints:                                       ║
║   • POST   /api/auth/signup                               ║
║   • POST   /api/auth/login                                ║
║   • GET    /api/countries                                 ║
║   • GET    /api/resources                                 ║
║   • GET    /api/market-offers                             ║
║   • GET    /api/jobs                                      ║
║   • GET    /api/treasury-history/:countryId               ║
║   • GET    /api/revenue/:countryId                        ║
║   • GET    /api/tax-breakdown/:countryId                  ║
║   • GET    /api/price-history/:resourceName               ║
║   • GET    /api/admin/users                               ║
║   • PUT    /api/admin/users/:id/status                    ║
║   • DELETE /api/admin/users/:id                           ║
║   • POST   /api/admin/users/:id/regenerate-serial         ║
║   • POST   /api/admin/activation-codes                    ║
║   • GET    /api/admin/activation-codes                    ║
║   • GET    /api/admin/security-logs                       ║
║   • GET    /api/health                                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
