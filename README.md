# 📊 Eclesiar Economic Dashboard

منصة ويب متكاملة لمتابعة وتحليل الاقتصاد داخل لعبة **Eclesiar** — لعبة MMO استراتيجية اجتماعية تقوم على السياسة والاقتصاد والحرب.

---

## 🏗️ هيكل المشروع

```
eclesiar-economic-dashboard/
├── src/                          # Frontend (React + Vite)
│   ├── components/               # المكونات المشتركة
│   ├── pages/                    # الصفحات
│   ├── lib/                      # مكتبات الاتصال
│   │   ├── supabase.ts          # إعداد Supabase
│   │   └── database.ts          # دوال قاعدة البيانات
│   ├── data/                     # بيانات احتياطية
│   └── App.tsx                   # المكون الرئيسي
├── server/                       # Backend (Node.js + Express)
│   ├── index.js                 # الملف الرئيسي للسيرفر
│   ├── package.json             # تبعيات السيرفر
│   ├── .env.example             # مثال ملف البيئة
│   ├── supabase-schema.sql      # كود قاعدة البيانات
│   └── README.md                # دليل السيرفر
├── package.json                  # تبعيات المشروع
└── README.md                     # هذا الملف
```

---

## 🚀 التشغيل السريع

### Frontend

```bash
# تثبيت التبعيات
npm install

# تشغيل المشروع
npm run dev

# بناء المشروع
npm run build
```

### Backend

```bash
cd server

# تثبيت التبعيات
npm install

# نسخ ملف البيئة
cp .env.example .env

# تشغيل السيرفر
npm run dev
```

---

## 🔗 ربط المشروع بـ Supabase

تم ربط المشروع بقاعدة بيانات Supabase بنجاح! المشروع الآن يستخدم Supabase كقاعدة بيانات رئيسية مع fallback تلقائي للبيانات المحلية في حال عدم الاتصال.

---

## 📋 خطوات الإعداد

### 1️⃣ تشغيل SQL Schema في Supabase

1. افتح لوحة تحكم Supabase: https://supabase.com/dashboard/
2. اختر مشروعك: `asvhpyfzdtzuygoivcmd`
3. اذهب إلى **SQL Editor** من القائمة الجانبية
4. انسخ محتوى ملف `supabase-schema.sql` من هذا المشروع
5. الصق الكود في SQL Editor
6. اضغط **Run** لتشغيل الكود

### 2️⃣ التحقق من الجداول

بعد تشغيل الكود، تأكد من وجود الجداول التالية:
- ✅ `countries` - الدول
- ✅ `users` - المستخدمين
- ✅ `resources` - الموارد
- ✅ `market_offers` - عروض السوق
- ✅ `jobs` - الوظائف
- ✅ `treasury_history` - تاريخ الخزينة
- ✅ `revenue_data` - الإيرادات
- ✅ `tax_breakdown` - توزيع الضرائب
- ✅ `activation_codes` - أكواد التفعيل
- ✅ `security_logs` - سجل الأمان
- ✅ `resource_price_history` - تاريخ أسعار الموارد

### 3️⃣ التحقق من البيانات الأولية

الكود يقوم بإدخال البيانات التالية تلقائيًا:
- 6 دول (Nordia, Solaria, Verdania, Aqualis, Ignara, Terranova)
- 8 موارد (Iron Ore, Gold, Wood, Food, Oil, Diamond, Coal, Silver)
- حساب أدمن واحد (ID: 10001, Serial: A3F8-B2C1-D4E5-F6A7)

---

## 🔐 معلومات الاتصال

### Supabase Configuration
```
URL: https://asvhpyfzdtzuygoivcmd.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### حساب الأدمن للتجربة
```
Game ID: 10001
Serial: A3F8-B2C1-D4E5-F6A7
Role: Owner
```

---

## 🛡️ نظام الأمان

المشروع يستخدم نظام أمان متعدد الطبقات:

1. **Game ID** - معرف الحساب في اللعبة
2. **Serial** - سيريال فريد من 16 خانة
3. **Device Fingerprint** - بصمة الجهاز

### التحقق من بصمة الجهاز
- يتم توليد بصمة فريدة لكل جهاز عند التسجيل
- عند تسجيل الدخول، يتم التحقق من تطابق البصمة
- إذا لم تتطابق، يتم رفض الدخول

---

## 📊 هيكل قاعدة البيانات

### جدول المستخدمين (users)
```sql
- id: SERIAL PRIMARY KEY
- game_id: TEXT UNIQUE (معرف اللعبة)
- username: TEXT
- country_id: INTEGER (FK -> countries)
- serial: TEXT UNIQUE (السيريال)
- status: TEXT (active/pending/banned)
- role: TEXT (owner/member)
- device_fingerprint: TEXT
- last_login: TIMESTAMPTZ
- last_ip: TEXT
```

### جدول الدول (countries)
```sql
- id: SERIAL PRIMARY KEY
- name: TEXT UNIQUE
- flag: TEXT
- treasury: BIGINT
- population: INTEGER
- gdp: BIGINT
- tax_rate: DECIMAL
- currency: TEXT
```

---

## 🔄 Fallback System

المشروع مصمم ليعمل حتى لو لم تكن قاعدة البيانات جاهزة:

1. **عند التشغيل**: يتحقق من اتصال Supabase
2. **إذا نجح الاتصال**: يستخدم البيانات من Supabase
3. **إذا فشل الاتصال**: يستخدم البيانات المحلية (mock data)

هذا يضمن أن الموقع يعمل دائمًا، حتى أثناء التطوير أو في حال انقطاع الاتصال.

---

## 🎯 الميزات الرئيسية

### للمستخدم العادي (Member)
- ✅ عرض اقتصاد بلده فقط
- ✅ متابعة أسعار الموارد
- ✅ عرض عروض السوق
- ✅ سوق العمل
- ✅ التحليلات والتنبؤات
- ✅ مقارنة الاقتصاد العالمي

### للأدمن (Owner)
- ✅ كل ميزات المستخدم العادي
- ✅ إدارة المستخدمين (تفعيل/حظر/حذف)
- ✅ توليد أكواد التفعيل
- ✅ إعادة توليد السيريال
- ✅ عرض سجل الأمان
- ✅ مراقبة محاولات الدخول

---

## 🚀 التشغيل

```bash
# تثبيت المكتبات
npm install

# تشغيل المشروع
npm run dev

# بناء المشروع
npm run build
```

---

## 📝 ملاحظات مهمة

### Row Level Security (RLS)
- تم تفعيل RLS على جميع الجداول
- البيانات العامة (countries, resources, etc.) قابلة للقراءة من الجميع
- بيانات المستخدمين محمية ولا يمكن قراءتها إلا من قبل الأدمن (عبر service_role)

### الأمان
- ❌ **لا تشارك الـ service_role key** مع أي شخص
- ✅ الـ anon key آمن للاستخدام في الـ frontend
- ✅ جميع العمليات الحساسة تتم عبر service_role من الـ backend

### الأداء
- يتم تحميل البيانات عند الطلب
- يمكن إضافة caching لتحسين الأداء
- يُنصح بتحديث البيانات الاقتصادية كل 5-10 دقائق

---

## 🔧 التطوير المستقبلي

### إضافات مقترحة
- [ ] Discord Bot للإشعارات
- [ ] Edge Functions لمعالجة البيانات
- [ ] Realtime subscriptions للتحديثات اللحظية
- [ ] نظام تنبيهات متقدم
- [ ] تقارير دورية تلقائية
- [ ] API عام للمطورين

---

## 📞 الدعم

إذا واجهت أي مشكلة:
1. تأكد من تشغيل SQL Schema في Supabase
2. تحقق من صحة الـ API keys
3. راجع Console في المتصفح للأخطاء
4. تأكد من تفعيل RLS policies

---

## 📄 الملفات المهمة

- `src/lib/supabase.ts` - إعداد اتصال Supabase
- `src/lib/database.ts` - جميع دوال التعامل مع قاعدة البيانات
- `supabase-schema.sql` - كود إنشاء الجداول والبيانات الأولية
- `src/pages/` - جميع صفحات الموقع
- `src/data/mockData.ts` - البيانات المحلية (fallback)

---

**تم التطوير بواسطة Eclesiar Team** 🎮
