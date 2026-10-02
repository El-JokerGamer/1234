-- ============================================
-- Eclesiar Economic Dashboard - Database Schema
-- ============================================
-- انسخ هذا الكود وشغله في Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- جدول الدول
CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  flag TEXT NOT NULL,
  treasury BIGINT DEFAULT 0,
  population INTEGER DEFAULT 0,
  gdp BIGINT DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  currency TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول المستخدمين
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  game_id TEXT NOT NULL UNIQUE,
  username TEXT,
  country_id INTEGER REFERENCES countries(id) ON DELETE SET NULL,
  serial TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'banned')),
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  device_fingerprint TEXT,
  last_login TIMESTAMPTZ,
  last_ip TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول الموارد
CREATE TABLE IF NOT EXISTS resources (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  change_24h DECIMAL(5,2) DEFAULT 0,
  supply INTEGER DEFAULT 0,
  demand INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول عروض السوق
CREATE TABLE IF NOT EXISTS market_offers (
  id SERIAL PRIMARY KEY,
  type TEXT CHECK (type IN ('buy', 'sell')),
  resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 0,
  price DECIMAL(10,2) DEFAULT 0,
  country_id INTEGER REFERENCES countries(id) ON DELETE SET NULL,
  seller TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول الوظائف
CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT,
  country_id INTEGER REFERENCES countries(id) ON DELETE SET NULL,
  salary INTEGER DEFAULT 0,
  slots INTEGER DEFAULT 0,
  filled INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول تاريخ الخزينة
CREATE TABLE IF NOT EXISTS treasury_history (
  id SERIAL PRIMARY KEY,
  country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE,
  amount BIGINT DEFAULT 0,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول الإيرادات والمصروفات
CREATE TABLE IF NOT EXISTS revenue_data (
  id SERIAL PRIMARY KEY,
  country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  income BIGINT DEFAULT 0,
  expenses BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول توزيع الضرائب
CREATE TABLE IF NOT EXISTS tax_breakdown (
  id SERIAL PRIMARY KEY,
  country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount BIGINT DEFAULT 0,
  percentage DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول أكواد التفعيل
CREATE TABLE IF NOT EXISTS activation_codes (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  duration_hours INTEGER,
  is_unlimited BOOLEAN DEFAULT FALSE,
  is_used BOOLEAN DEFAULT FALSE,
  used_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- جدول سجل الأمان
CREATE TABLE IF NOT EXISTS security_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  ip_address TEXT,
  device_fingerprint TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول تاريخ أسعار الموارد
CREATE TABLE IF NOT EXISTS resource_price_history (
  id SERIAL PRIMARY KEY,
  resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
  price DECIMAL(10,2) DEFAULT 0,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. INSERT SEED DATA
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
ON CONFLICT (name) DO NOTHING;

-- إدخال عروض السوق
INSERT INTO market_offers (type, resource_id, quantity, price, country_id, seller)
SELECT 'sell', r.id, 500, 44.8, c.id, 'IronKing99'
FROM resources r, countries c WHERE r.name = 'Iron Ore' AND c.name = 'Nordia';

INSERT INTO market_offers (type, resource_id, quantity, price, country_id, seller)
SELECT 'buy', r.id, 50, 895.0, c.id, 'GoldRush'
FROM resources r, countries c WHERE r.name = 'Gold' AND c.name = 'Solaria';

INSERT INTO market_offers (type, resource_id, quantity, price, country_id, seller)
SELECT 'sell', r.id, 200, 155.2, c.id, 'OilBaron'
FROM resources r, countries c WHERE r.name = 'Oil' AND c.name = 'Ignara';

INSERT INTO market_offers (type, resource_id, quantity, price, country_id, seller)
SELECT 'buy', r.id, 1000, 12.5, c.id, 'TimberWolf'
FROM resources r, countries c WHERE r.name = 'Wood' AND c.name = 'Verdania';

INSERT INTO market_offers (type, resource_id, quantity, price, country_id, seller)
SELECT 'sell', r.id, 2000, 8.2, c.id, 'FarmLord'
FROM resources r, countries c WHERE r.name = 'Food' AND c.name = 'Aqualis';

-- إدخال الوظائف
INSERT INTO jobs (title, company, country_id, salary, slots, filled)
SELECT 'Iron Miner', 'Nordia Mining Co.', c.id, 120, 50, 38
FROM countries c WHERE c.name = 'Nordia';

INSERT INTO jobs (title, company, country_id, salary, slots, filled)
SELECT 'Gold Refiner', 'Solaria Gold Works', c.id, 280, 20, 15
FROM countries c WHERE c.name = 'Solaria';

INSERT INTO jobs (title, company, country_id, salary, slots, filled)
SELECT 'Lumberjack', 'Verdania Forest Inc.', c.id, 85, 100, 72
FROM countries c WHERE c.name = 'Verdania';

INSERT INTO jobs (title, company, country_id, salary, slots, filled)
SELECT 'Oil Engineer', 'Ignara Petroleum', c.id, 350, 30, 28
FROM countries c WHERE c.name = 'Ignara';

INSERT INTO jobs (title, company, country_id, salary, slots, filled)
SELECT 'Farmer', 'Aqualis Agriculture', c.id, 65, 200, 145
FROM countries c WHERE c.name = 'Aqualis';

INSERT INTO jobs (title, company, country_id, salary, slots, filled)
SELECT 'Diamond Cutter', 'Terranova Gems', c.id, 420, 10, 8
FROM countries c WHERE c.name = 'Terranova';

-- إدخال تاريخ الخزينة (Nordia)
INSERT INTO treasury_history (country_id, amount, recorded_at)
SELECT c.id, 2100000, NOW() - INTERVAL '14 days'
FROM countries c WHERE c.name = 'Nordia';

INSERT INTO treasury_history (country_id, amount, recorded_at)
SELECT c.id, 2150000, NOW() - INTERVAL '12 days'
FROM countries c WHERE c.name = 'Nordia';

INSERT INTO treasury_history (country_id, amount, recorded_at)
SELECT c.id, 2200000, NOW() - INTERVAL '10 days'
FROM countries c WHERE c.name = 'Nordia';

INSERT INTO treasury_history (country_id, amount, recorded_at)
SELECT c.id, 2180000, NOW() - INTERVAL '8 days'
FROM countries c WHERE c.name = 'Nordia';

INSERT INTO treasury_history (country_id, amount, recorded_at)
SELECT c.id, 2250000, NOW() - INTERVAL '6 days'
FROM countries c WHERE c.name = 'Nordia';

INSERT INTO treasury_history (country_id, amount, recorded_at)
SELECT c.id, 2300000, NOW() - INTERVAL '4 days'
FROM countries c WHERE c.name = 'Nordia';

INSERT INTO treasury_history (country_id, amount, recorded_at)
SELECT c.id, 2380000, NOW() - INTERVAL '2 days'
FROM countries c WHERE c.name = 'Nordia';

INSERT INTO treasury_history (country_id, amount, recorded_at)
SELECT c.id, 2450000, NOW()
FROM countries c WHERE c.name = 'Nordia';

-- إدخال الإيرادات والمصروفات (Nordia)
INSERT INTO revenue_data (country_id, month, income, expenses)
SELECT c.id, 'Aug', 450000, 320000 FROM countries c WHERE c.name = 'Nordia';

INSERT INTO revenue_data (country_id, month, income, expenses)
SELECT c.id, 'Sep', 520000, 380000 FROM countries c WHERE c.name = 'Nordia';

INSERT INTO revenue_data (country_id, month, income, expenses)
SELECT c.id, 'Oct', 480000, 350000 FROM countries c WHERE c.name = 'Nordia';

INSERT INTO revenue_data (country_id, month, income, expenses)
SELECT c.id, 'Nov', 610000, 420000 FROM countries c WHERE c.name = 'Nordia';

INSERT INTO revenue_data (country_id, month, income, expenses)
SELECT c.id, 'Dec', 580000, 400000 FROM countries c WHERE c.name = 'Nordia';

INSERT INTO revenue_data (country_id, month, income, expenses)
SELECT c.id, 'Jan', 690000, 450000 FROM countries c WHERE c.name = 'Nordia';

-- إدخال توزيع الضرائب (Nordia)
INSERT INTO tax_breakdown (country_id, category, amount, percentage)
SELECT c.id, 'Trade Tax', 285000, 35 FROM countries c WHERE c.name = 'Nordia';

INSERT INTO tax_breakdown (country_id, category, amount, percentage)
SELECT c.id, 'Income Tax', 195000, 24 FROM countries c WHERE c.name = 'Nordia';

INSERT INTO tax_breakdown (country_id, category, amount, percentage)
SELECT c.id, 'Property Tax', 142000, 17 FROM countries c WHERE c.name = 'Nordia';

INSERT INTO tax_breakdown (country_id, category, amount, percentage)
SELECT c.id, 'Import Tax', 98000, 12 FROM countries c WHERE c.name = 'Nordia';

INSERT INTO tax_breakdown (country_id, category, amount, percentage)
SELECT c.id, 'Luxury Tax', 65000, 8 FROM countries c WHERE c.name = 'Nordia';

INSERT INTO tax_breakdown (country_id, category, amount, percentage)
SELECT c.id, 'Other', 33000, 4 FROM countries c WHERE c.name = 'Nordia';

-- إدخال تاريخ أسعار الموارد (Iron Ore)
INSERT INTO resource_price_history (resource_id, price, recorded_at)
SELECT r.id, 42.0, NOW() - INTERVAL '14 days' FROM resources r WHERE r.name = 'Iron Ore';

INSERT INTO resource_price_history (resource_id, price, recorded_at)
SELECT r.id, 43.5, NOW() - INTERVAL '12 days' FROM resources r WHERE r.name = 'Iron Ore';

INSERT INTO resource_price_history (resource_id, price, recorded_at)
SELECT r.id, 44.0, NOW() - INTERVAL '10 days' FROM resources r WHERE r.name = 'Iron Ore';

INSERT INTO resource_price_history (resource_id, price, recorded_at)
SELECT r.id, 43.2, NOW() - INTERVAL '8 days' FROM resources r WHERE r.name = 'Iron Ore';

INSERT INTO resource_price_history (resource_id, price, recorded_at)
SELECT r.id, 44.8, NOW() - INTERVAL '6 days' FROM resources r WHERE r.name = 'Iron Ore';

INSERT INTO resource_price_history (resource_id, price, recorded_at)
SELECT r.id, 45.0, NOW() - INTERVAL '4 days' FROM resources r WHERE r.name = 'Iron Ore';

INSERT INTO resource_price_history (resource_id, price, recorded_at)
SELECT r.id, 44.5, NOW() - INTERVAL '2 days' FROM resources r WHERE r.name = 'Iron Ore';

INSERT INTO resource_price_history (resource_id, price, recorded_at)
SELECT r.id, 45.2, NOW() FROM resources r WHERE r.name = 'Iron Ore';

-- إدخال تاريخ أسعار الموارد (Gold)
INSERT INTO resource_price_history (resource_id, price, recorded_at)
SELECT r.id, 910.0, NOW() - INTERVAL '14 days' FROM resources r WHERE r.name = 'Gold';

INSERT INTO resource_price_history (resource_id, price, recorded_at)
SELECT r.id, 905.0, NOW() - INTERVAL '12 days' FROM resources r WHERE r.name = 'Gold';

INSERT INTO resource_price_history (resource_id, price, recorded_at)
SELECT r.id, 898.0, NOW() - INTERVAL '10 days' FROM resources r WHERE r.name = 'Gold';

INSERT INTO resource_price_history (resource_id, price, recorded_at)
SELECT r.id, 900.0, NOW() - INTERVAL '8 days' FROM resources r WHERE r.name = 'Gold';

INSERT INTO resource_price_history (resource_id, price, recorded_at)
SELECT r.id, 895.0, NOW() - INTERVAL '6 days' FROM resources r WHERE r.name = 'Gold';

INSERT INTO resource_price_history (resource_id, price, recorded_at)
SELECT r.id, 890.0, NOW() - INTERVAL '4 days' FROM resources r WHERE r.name = 'Gold';

INSERT INTO resource_price_history (resource_id, price, recorded_at)
SELECT r.id, 894.0, NOW() - INTERVAL '2 days' FROM resources r WHERE r.name = 'Gold';

INSERT INTO resource_price_history (resource_id, price, recorded_at)
SELECT r.id, 892.5, NOW() FROM resources r WHERE r.name = 'Gold';

-- إدخال تاريخ أسعار الموارد (Oil)
INSERT INTO resource_price_history (resource_id, price, recorded_at)
SELECT r.id, 140.0, NOW() - INTERVAL '14 days' FROM resources r WHERE r.name = 'Oil';

INSERT INTO resource_price_history (resource_id, price, recorded_at)
SELECT r.id, 142.0, NOW() - INTERVAL '12 days' FROM resources r WHERE r.name = 'Oil';

INSERT INTO resource_price_history (resource_id, price, recorded_at)
SELECT r.id, 148.0, NOW() - INTERVAL '10 days' FROM resources r WHERE r.name = 'Oil';

INSERT INTO resource_price_history (resource_id, price, recorded_at)
SELECT r.id, 150.0, NOW() - INTERVAL '8 days' FROM resources r WHERE r.name = 'Oil';

INSERT INTO resource_price_history (resource_id, price, recorded_at)
SELECT r.id, 152.0, NOW() - INTERVAL '6 days' FROM resources r WHERE r.name = 'Oil';

INSERT INTO resource_price_history (resource_id, price, recorded_at)
SELECT r.id, 155.0, NOW() - INTERVAL '4 days' FROM resources r WHERE r.name = 'Oil';

INSERT INTO resource_price_history (resource_id, price, recorded_at)
SELECT r.id, 154.0, NOW() - INTERVAL '2 days' FROM resources r WHERE r.name = 'Oil';

INSERT INTO resource_price_history (resource_id, price, recorded_at)
SELECT r.id, 156.7, NOW() FROM resources r WHERE r.name = 'Oil';

-- إدخال الأدمن (Owner)
INSERT INTO users (game_id, username, country_id, serial, status, role, device_fingerprint)
SELECT '10001', 'DragonSlayer', c.id, 'A3F8-B2C1-D4E5-F6A7', 'active', 'owner', 'fp_admin'
FROM countries c WHERE c.name = 'Nordia'
ON CONFLICT (game_id) DO NOTHING;

-- ============================================
-- 3. CREATE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_game_id ON users(game_id);
CREATE INDEX IF NOT EXISTS idx_users_serial ON users(serial);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_market_offers_created_at ON market_offers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON security_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_treasury_history_recorded_at ON treasury_history(recorded_at);
CREATE INDEX IF NOT EXISTS idx_resource_price_history_recorded_at ON resource_price_history(recorded_at);

-- ============================================
-- 4. ENABLE ROW LEVEL SECURITY
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

-- ============================================
-- 5. CREATE POLICIES
-- ============================================

-- السماح بالقراءة للجميع للبيانات العامة
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

-- السماح بإدراج سجلات الأمان
CREATE POLICY "Allow insert security logs" ON security_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read security logs" ON security_logs FOR SELECT USING (true);

-- أكواد التفعيل
CREATE POLICY "Allow read activation codes" ON activation_codes FOR SELECT USING (true);
CREATE POLICY "Allow insert activation codes" ON activation_codes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update activation codes" ON activation_codes FOR UPDATE USING (true);

-- ============================================
-- 6. CREATE FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_countries_updated_at BEFORE UPDATE ON countries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. VERIFICATION QUERIES
-- ============================================

-- تحقق من عدد الصفوف في كل جدول
SELECT 'countries' as table_name, COUNT(*) as row_count FROM countries
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'resources', COUNT(*) FROM resources
UNION ALL
SELECT 'market_offers', COUNT(*) FROM market_offers
UNION ALL
SELECT 'jobs', COUNT(*) FROM jobs
UNION ALL
SELECT 'treasury_history', COUNT(*) FROM treasury_history
UNION ALL
SELECT 'revenue_data', COUNT(*) FROM revenue_data
UNION ALL
SELECT 'tax_breakdown', COUNT(*) FROM tax_breakdown
UNION ALL
SELECT 'resource_price_history', COUNT(*) FROM resource_price_history;

-- ============================================
-- DONE! ✅
-- ============================================
