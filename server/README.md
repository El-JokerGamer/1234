# 🖥️ Eclesiar Economic Dashboard - Server

سيرفر Node.js كامل مع Express + Supabase لإدارة البيانات والمصادقة.

---

## 📁 هيكل الملفات

```
server/
├── index.js                  # الملف الرئيسي للسيرفر
├── package.json              # تبعيات المشروع
├── .env.example              # مثال لملف البيئة
├── supabase-schema.sql       # كود قاعدة البيانات
└── README.md                 # هذا الملف
```

---

## 🚀 التشغيل

### 1️⃣ تثبيت التبعيات

```bash
cd server
npm install
```

### 2️⃣ إعداد ملف البيئة

```bash
cp .env.example .env
```

عدّل ملف `.env` بالقيم الصحيحة (القيم الافتراضية جاهزة للاستخدام).

### 3️⃣ إعداد قاعدة البيانات

1. افتح Supabase SQL Editor
2. انسخ محتوى `supabase-schema.sql`
3. الصق الكود واضغط Run
4. تأكد من ظهور رسالة "DONE! ✅"

### 4️⃣ تشغيل السيرفر

```bash
# وضع التطوير (مع إعادة تشغيل تلقائية)
npm run dev

# وضع الإنتاج
npm start
```

السيرفر سيعمل على: `http://localhost:3001`

---

## 📡 API Endpoints

### 🔐 المصادقة

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | تسجيل حساب جديد |
| POST | `/api/auth/login` | تسجيل دخول |

### 📊 البيانات العامة

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/countries` | جلب جميع الدول |
| GET | `/api/resources` | جلب جميع الموارد |
| GET | `/api/market-offers` | جلب عروض السوق |
| GET | `/api/jobs` | جلب الوظائف |
| GET | `/api/treasury-history/:countryId?` | تاريخ الخزينة |
| GET | `/api/revenue/:countryId?` | الإيرادات والمصروفات |
| GET | `/api/tax-breakdown/:countryId?` | توزيع الضرائب |
| GET | `/api/price-history/:resourceName` | تاريخ أسعار مورد |

### 👑 لوحة التحكم (Admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | جلب جميع المستخدمين |
| PUT | `/api/admin/users/:id/status` | تحديث حالة مستخدم |
| DELETE | `/api/admin/users/:id` | حذف مستخدم |
| POST | `/api/admin/users/:id/regenerate-serial` | إعادة توليد السيريال |
| POST | `/api/admin/activation-codes` | توليد كود تفعيل |
| GET | `/api/admin/activation-codes` | جلب أكواد التفعيل |
| GET | `/api/admin/security-logs` | سجل الأمان |

### 🏥 Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | فحص حالة السيرفر |

---

## 🔐 الأمان

### Rate Limiting
- 100 طلب كل 15 دقيقة لكل IP
- يمكن تعديله في `.env`

### CORS
- مسموح فقط من `FRONTEND_URL` المحدد
- يمكن إضافة origins إضافية

### Helmet
- حماية من الهجمات الشائعة
- XSS, CSRF, Clickjacking protection

### Device Fingerprint
- التحقق من بصمة الجهاز عند تسجيل الدخول
- منع الدخول من أجهزة غير مصرح بها

---

## 📝 أمثلة على الاستخدام

### تسجيل حساب جديد

```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "game_id": "10002",
    "device_fingerprint": "fp_abc123"
  }'
```

**Response:**
```json
{
  "success": true,
  "serial": "A3F8-B2C1-D4E5-F6A7",
  "message": "Account created successfully. Waiting for admin activation."
}
```

### تسجيل دخول

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "game_id": "10001",
    "serial": "A3F8-B2C1-D4E5-F6A7",
    "device_fingerprint": "fp_admin"
  }'
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "game_id": "10001",
    "username": "DragonSlayer",
    "country": {
      "name": "Nordia",
      "flag": "🏔️"
    },
    "role": "owner",
    "status": "active"
  }
}
```

### جلب الدول

```bash
curl http://localhost:3001/api/countries
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Nordia",
    "flag": "🏔️",
    "treasury": 2450000,
    "population": 12400,
    "gdp": 8900000,
    "tax_rate": 12,
    "currency": "NORD"
  },
  ...
]
```

---

## 🗄️ قاعدة البيانات

### الجداول

1. **countries** - الدول
2. **users** - المستخدمين
3. **resources** - الموارد
4. **market_offers** - عروض السوق
5. **jobs** - الوظائف
6. **treasury_history** - تاريخ الخزينة
7. **revenue_data** - الإيرادات
8. **tax_breakdown** - توزيع الضرائب
9. **activation_codes** - أكواد التفعيل
10. **security_logs** - سجل الأمان
11. **resource_price_history** - تاريخ أسعار الموارد

### البيانات الأولية

- ✅ 6 دول
- ✅ 8 موارد
- ✅ 5 عروض سوق
- ✅ 6 وظائف
- ✅ 8 سجلات تاريخ خزينة
- ✅ 6 سجلات إيرادات
- ✅ 6 سجلات ضرائب
- ✅ 24 سجل تاريخ أسعار (8 نقاط لكل مورد × 3 موارد)
- ✅ 1 حساب أدمن

---

## 🔧 التطوير

### إضافة Endpoint جديد

```javascript
app.get('/api/new-endpoint', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('table_name')
      .select('*');

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});
```

### استخدام Service Role Key

للعمليات الحساسة (تجاوز RLS):

```javascript
const { data, error } = await supabaseAdmin
  .from('users')
  .select('*');
```

---

## 📦 النشر

### Railway

```bash
# تثبيت Railway CLI
npm i -g @railway/cli

# تسجيل الدخول
railway login

# إنشاء مشروع جديد
railway init

# إضافة متغيرات البيئة
railway variables set SUPABASE_URL=...
railway variables set SUPABASE_ANON_KEY=...
railway variables set SUPABASE_SERVICE_KEY=...

# النشر
railway up
```

### Render

1. ارفع الكود على GitHub
2. اربط المستودع بـ Render
3. أضف متغيرات البيئة
4. Deploy

### Vercel

```bash
# تثبيت Vercel CLI
npm i -g vercel

# النشر
vercel
```

---

## 🐛 حل المشاكل

### المشكلة: "Cannot connect to Supabase"
**الحل:** تأكد من صحة `SUPABASE_URL` و `SUPABASE_ANON_KEY` في `.env`

### المشكلة: "Table does not exist"
**الحل:** شغّل `supabase-schema.sql` في Supabase SQL Editor

### المشكلة: "CORS error"
**الحل:** أضف `FRONTEND_URL` الصحيح في `.env`

---

## 📞 الدعم

إذا واجهت أي مشكلة:
1. راجع Console في السيرفر
2. تحقق من سجلات Supabase
3. تأكد من تشغيل SQL Schema
4. راجع ملف `.env`

---

**تم التطوير بواسطة Eclesiar Team** 🎮
