# MOERIS — إعداد Firebase

هذه الملفات تربط لوحة MOERIS STUDIO بخدمات Firebase. لا تفعّلي المتجر على بيانات حقيقية قبل إكمال جميع الخطوات واختبار قواعد الأمان.

## 1) إنشاء المشروع
1. افتحي https://console.firebase.google.com/ من المتصفح.
2. أنشئي مشروعًا باسم MOERIS (أو أي اسم تختارينه).
3. من Project settings أضيفي Web App.
4. انسخي إعدادات تطبيق الويب إلى `js/firebase-config.js`. استبدلي القيم التجريبية بالقيم التي يعطيها Firebase.

## 2) تفعيل تسجيل الدخول
1. Authentication → Get started → Sign-in method.
2. فعّلي Email/Password.
3. من Users أنشئي حساب المالكة بالبريد الإلكتروني وكلمة مرور قوية.
4. افتحي الحساب وانسخي User UID.
5. ضعي UID في `window.MOERIS_OWNER_UID` داخل `js/firebase-config.js`.

## 3) قاعدة البيانات والتخزين
1. Firestore Database → Create database.
2. Storage → Get started.
3. افتحي Rules في Firestore وانسخي محتوى `firestore.rules`.
4. استبدلي `PASTE_OWNER_AUTH_UID` بنفس UID الخاص بالمالكة ثم انشري القواعد.
5. افتحي Storage → Rules وانسخي `storage.rules`، واستبدلي UID نفسه ثم Publish.

## 4) مهم جدًا
- يجب أن يكون UID في ملف الإعداد وفي القاعدتين متطابقًا حرفيًا.
- لا تضعي Service Account JSON أو أي مفتاح خاص في ملفات الموقع.
- إعدادات Web API الظاهرة في الواجهة ليست كلمة مرور؛ الحماية الفعلية في Firebase Rules.
- لا تشاركي كلمة مرور حساب المالكة.
- لوحة الإدارة على `/admin.html`، ولا تظهر في قائمة المتجر. القواعد تمنع أي حساب آخر من تعديل المنتجات حتى لو عرف رابط اللوحة.

## 5) بنية المنتجات
تُحفظ المنتجات في مجموعة Firestore باسم `products`، والصور في Storage تحت `products/{productId}/`.
حقول المنتج: `name`, `category`, `price`, `stock`, `tag`, `description`, `case`, `movement`, `water`, `images`, `available`, `createdAt`, `updatedAt`.

## تنبيه عن المتجر الحالي
هذه الخطوة تنشئ لوحة الإدارة وتخزين المنتجات بأمان. عرض المنتجات المضافة من اللوحة في واجهة المتجر العامة وربط الطلبات يحتاج خطوة دمج واختبار منفصلة بعد إدخال إعدادات مشروع Firebase الفعلية. لا تعتبري الطلبات مستلمة فعليًا قبل إعداد قناة استقبال الطلبات واختبارها.
