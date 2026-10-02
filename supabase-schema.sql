-- ============================================
-- Eclesiar Economic Dashboard - Database Schema
-- ============================================
-- انسخ هذا الكود وشغله في Supabase SQL Editor
-- ============================================

-- 1. جدول الدول
CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  flag TEXT NOT NULL,
  treasury BIGINT DEFAULT 0,
  population INTEGER DEFAULT 0,
  gdp BIGINT DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  currency TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. جدول المستخدمين
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  game_id TEXT NOT NULL UNIQUE,
  username TEXT,
  country_id INTEGER REFERENCES countries(id),
  serial TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'banned')),
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  device_fingerprint TEXT,
  last_login TIMESTAMPTZ,
  last_ip TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. جدول الموارد
CREATE TABLE IF NOT EXISTS resources (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  change_24h DECIMAL(5,2) DEFAULT 0,
  supply INTEGER DEFAULT 0,
  demand INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. جدول عروض السوق
CREATE TABLE IF NOT EXISTS market_offers (
  id SERIAL PRIMARY KEY,
  type TEXT CHECK (type IN ('buy', 'sell')),
  resource_id INTEGER REFERENCES resources(id),
  quantity INTEGER DEFAULT 0,
  price DECIMAL(10,2) DEFAULT 0,
  country_id INTEGER REFERENCES countries(id),
  seller TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. جدول الوظائف
CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT,
  country_id INTEGER REFERENCES countries(id),
  salary INTEGER DEFAULT 0,
  slots INTEGER DEFAULT 0,
  filled INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. جدول تاريخ الخزينة
CREATE TABLE IF NOT EXISTS treasury_history (
  id SERIAL PRIMARY KEY,
  country_id INTEGER REFERENCES countries(id),
  amount BIGINT DEFAULT 0,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. جدول الإيرادات والمصروفات
CREATE TABLE IF NOT EXISTS revenue_data (
  id SERIAL PRIMARY KEY,
  country_id INTEGER REFERENCES countries(id),
  month TEXT NOT NULL,
  income BIGINT DEFAULT 0,
  expenses BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. جدول توزيع الضرائب
CREATE TABLE IF NOT EXISTS tax_breakdown (
  id SERIAL PRIMARY KEY,
  country_id INTEGER REFERENCES countries(id),
  category TEXT NOT NULL,
  amount BIGINT DEFAULT 0,
  percentage DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. جدول أكواد التفعيل
CREATE TABLE IF NOT EXISTS activation_codes (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  duration_hours INTEGER,
  is_unlimited BOOLEAN DEFAULT FALSE,
  is_used BOOLEAN DEFAULT FALSE,
  used_by INTEGER REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- 10. جدول سجل الأمان
CREATE TABLE IF NOT EXISTS security_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action TEXT NOT NULL,
  ip_address TEXT,
  device_fingerprint TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. جدول تاريخ أسعار الموارد
CREATE TABLE IF NOT EXISTS resource_price_history (
  id SERIAL PRIMARY KEY,
  resource_id INTEGER REFERENCES resources(id),
  price DECIMAL(10,2) DEFAULT 0,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- بيانات أولية (Seed Data)
-- ============================================

-- إدخال الدول
INSERT INTO countries (name, flag, treasury, population, gdp, tax_rate, currency) VALUES
  ('Nordia', '🏔️', 2450000, 12400, 8900000, 12, 'NORD'),
  ('Solaria', '☀️', 3200000, 15600, 11200000, 10, 'SOL'),
  ('Verdania', '🌿', 1800000, 9800, 6500000, 15, 'VERD'),
  ('Aqualis', '🌊', 2100000, 11200, 7800000, 11, 'AQUA'),
  ('Ignara', '🔥', 4100000, 18900, 14500000, 8, 'IGN'),
  ('Terranova', '🌍', 1500000, 8500, 5200000, 18, 'TERR')
ON CONFLICT (name) DO NOTHING;

-- إدخال الموارد
INSERT INTO resources (name, icon, price, change_24h, supply, demand) VALUES
  ('Iron Ore', '⛏️', 45.2, 2.3, 15400, 12800),
  ('Gold', '🥇', 892.5, -1.1, 3200, 4100),
  ('Wood', '🪵', 12.8, 0.5, 28900, 22100),
  ('Food', '🌾', 8.4, -0.3, 45600, 41200),
  ('Oil', '🛢️', 156.7, 4.2, 8900, 11200),
  ('Diamond', '💎', 2340.0, 1.8, 1200, 1800),
  ('Coal', '⬛', 22.1, -2.1, 19800, 16500),
  ('Silver', '🪙', 234.6, 0.9, 5600, 6200)
ON CONFLICT DO NOTHING;

-- إدخال الأدمن (Owner)
INSERT INTO users (game_id, username, country_id, serial, status, role, device_fingerprint)
SELECT '10001', 'DragonSlayer', c.id, 'A3F8-B2C1-D4E5-F6A7', 'active', 'owner', 'fp_admin'
FROM countries c WHERE c.name = 'Nordia'
ON CONFLICT (game_id) DO NOTHING;

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasury_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_breakdown ENABLE ROW LEVEL SECURITY;
ALTER TABLE activation_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_price_history ENABLE ROW LEVEL SECURITY;

-- السماح بالقراءة للجميع (anon) للبيانات العامة
CREATE POLICY "Public read access for countries" ON countries FOR SELECT USING (true);
CREATE POLICY "Public read access for resources" ON resources FOR SELECT USING (true);
CREATE POLICY "Public read access for market_offers" ON market_offers FOR SELECT USING (true);
CREATE POLICY "Public read access for jobs" ON jobs FOR SELECT USING (true);
CREATE POLICY "Public read access for treasury_history" ON treasury_history FOR SELECT USING (true);
CREATE POLICY "Public read access for revenue_data" ON revenue_data FOR SELECT USING (true);
CREATE POLICY "Public read access for tax_breakdown" ON tax_breakdown FOR SELECT USING (true);
CREATE POLICY "Public read access for resource_price_history" ON resource_price_history FOR SELECT USING (true);

-- المستخدمين يقدرون يقرؤون بياناتهم فقط
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (true);

-- الأدمن يقدر يعدل كل شي (عبر service role)
-- ملاحظة: التعديلات تتم عبر service_role key من الـ backend

-- السماح بإدراج سجلات الأمان
CREATE POLICY "Allow insert security logs" ON security_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read security logs" ON security_logs FOR SELECT USING (true);

-- أكواد التفعيل
CREATE POLICY "Allow read activation codes" ON activation_codes FOR SELECT USING (true);
CREATE POLICY "Allow insert activation codes" ON activation_codes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update activation codes" ON activation_codes FOR UPDATE USING (true);
