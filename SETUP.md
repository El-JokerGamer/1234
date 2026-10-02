# 🚀 دليل الإعداد السريع - Eclesiar Economic Dashboard

## ✅ الخطوات المطلوبة

### 1️⃣ إعداد قاعدة البيانات (Supabase)

1. افتح: https://supabase.com/dashboard/
2. اختر مشروعك: `asvhpyfzdtzuygoivcmd`
3. اذهب إلى **SQL Editor**
4. انسخ محتوى ملف: `server/supabase-schema.sql`
5. الصق الكود واضغط **Run**
6. تأكد من ظهور رسالة "DONE! ✅"

### 2️⃣ إعداد Frontend

```bash
# من جذر المشروع
npm install
npm run dev
```

الموقع سيعمل على: `http://localhost:5173`

### 3️⃣ إعداد Backend (اختياري)

```bash
# من مجلد server
cd server
npm install
cp .env.example .env
npm run dev
```

السيرفر سيعمل على: `http://localhost:3001`

---

## 🔐 حسابات الاختبار

### الأدمن (Owner)
```
Game ID: 10001
Serial: A3F8-B2C1-D4E5-F6A7
Role: Owner
```

### عضو عادي (Member)
```
Game ID: 10002
Serial: (أنشئ حساب جديد)
Role: Member
```

---

## 📊 التحقق من قاعدة البيانات

بعد تشغيل SQL Schema، تحقق من وجود البيانات:

```sql
-- عدد الدول
SELECT COUNT(*) FROM countries;  -- يجب أن يكون 6

-- عدد الموارد
SELECT COUNT(*) FROM resources;  -- يجب أن يكون 8

-- عدد المستخدمين
SELECT COUNT(*) FROM users;      -- يجب أن يكون 1 (الأدمن)

-- عدد الوظائف
SELECT COUNT(*) FROM jobs;       -- يجب أن يكون 6
```

---

## 🎯 المميزات المتاحة

### بدون سيرفر (Frontend Only)
- ✅ عرض البيانات من Supabase مباشرة
- ✅ تسجيل الدخول والتسجيل
- ✅ لوحة التحكم الاقتصادية
- ✅ الاقتصاد العالمي
- ✅ التحليلات
- ✅ لوحة الأدمن

### مع سيرفر (Full Stack)
- ✅ كل مميزات Frontend
- ✅ Rate limiting
- ✅ حماية إضافية
- ✅ CORS محكم
- ✅ Logging متقدم
- ✅ جاهز للنشر

---

## 🐛 حل المشاكل الشائعة

### المشكلة: "لا توجد بيانات"
**الحل:** تأكد من تشغيل `supabase-schema.sql` في Supabase

### المشكلة: "خطأ في تسجيل الدخول"
**الحل:** تأكد من:
1. تشغيل SQL Schema
2. صحة Game ID و Serial
3. تفعيل الحساب من لوحة الأدمن

### المشكلة: "السيرفر لا يعمل"
**الحل:**
1. تأكد من تثبيت التبعيات: `npm install`
2. تحقق من ملف `.env`
3. راجع Console للأخطاء

---

## 📝 ملاحظات مهمة

1. **السيرفر اختياري**: الموقع يعمل بدون سيرفر (يتصل بـ Supabase مباشرة)
2. **Fallback System**: إذا فشل الاتصال بـ Supabase، يستخدم بيانات محلية
3. **الأمان**: استخدم `service_role key` فقط في السيرفر (ليس في Frontend)
4. **النشر**: يمكن نشر Frontend على Vercel و Backend على Railway/Render

---

## 🎮 الاستمتاع!

المشروع جاهز للاستخدام. استمتع بمتابعة اقتصاد Eclesiar! 🚀

---

**تم التطوير بواسطة Eclesiar Team** 💎
