# بوابة الدفع الإلكتروني (Tap) — شرح معمّق للتوثيق المستقبلي

> هذا الملف يشرح **كل ما تم بناؤه** في مشروع هبة بطّيّة (HEBA BAATTIYA) لاستقبال
> الدفع بالبطاقات عبر شركة **Tap Payments**. احتفظي به للمرجعية.

---

## 1) نظرة عامة على التدفق (من لحظة الضغط على "إتمام الطلب")

```
الزبون يختار الدفع بالبطاقة
        │
        ▼
POST /api/checkout
        │  1) يتأكد من بيانات الطلب والسلة والكوبون
        │  2) يحسب: المجموع - الخصم + الضريبة (15%) + الشحن
        │  3) ينشئ الطلب في جدول Order + الأصناف في OrderItem
        │  4) ينشئ سجل دفع في جدول Payment (الحالة PENDING)
        │  5) يتصل بـ Tap API → ينشئ "شحنة دفع" (Charge) ويأخذ رابط صفحة الدفع
        │  6) يخزّن مرجع الشحنة (tapChargeId) ورابطها في جدول Payment
        ▼
الزبون يُحوَّل إلى صفحة دفع تاب (https://...checkout.payments.tap.company)
        │  يدفع ببطاقته (مدى/فيزا/ماستركارد/Apple Pay/STC Pay)
        ▼
تاب ترسل Webhook للموقع (POST /api/payments/webhook)
        │  1) التحقق من التوقيع (HMAC-SHA256) — أمني
        │  2) إعادة جلب حالة الشحنة من تاب نفسها (لا نثق بالرسالة وحدها)
        │  3) إذا الحالة = CAPTURED → نُحدّث: Payment=PAID، Order=PAID+CONFIRMED
        │  4) خصم المخزون (مرة واحدة فقط)
        ▼
تاب تُعيد الزبون إلى صفحة التأكيد
        │  /order-confirmation/{orderNumber}
        ▼
الصفحة تفحص تلقائياً كل 3 ثوانٍ (GET /api/orders/{orderNumber}/payment-status)
        وتظهر: "Payment received" / "Processing…" / "Payment failed"
```

---

## 2) جداول قاعدة البيانات (PostgreSQL على Neon)

أضفنا **جدولاً جديداً** اسمه `payments`، وأضفنا علاقة `payments` في جدول `orders`.

### جدول `orders` (كان موجوداً)
| الحقل | الوصف |
|---|---|
| `id` | معرّف الطلب |
| `orderNumber` | رقم الطلب الظاهر للعميل (فريد) |
| `userId` | معرّف المستخدم |
| `status` | حالة الطلب: PENDING / CONFIRMED / PROCESSING / SHIPPED / DELIVERED / CANCELLED ... |
| `paymentStatus` | حالة الدفع: PENDING / PAID / FAILED / REFUNDED |
| `paymentMethod` | الطريقة: MADA / VISA / MASTERCARD / APPLE_PAY / STC_PAY / CASH_ON_DELIVERY |
| `subtotal` `shippingCost` `taxAmount` `discountAmount` `total` `currency` | التكلفة |
| `couponId` | الكوبون المستخدم |
| `shipFullName` `shipPhone` `shipEmail` `shipCountry` `shipCity` `shipLine1` `shipLine2` `shipPostal` | نسخة ثابتة من عنوان الشحن |
| `trackingNumber` `trackingCarrier` `notes` | التتبع والملاحظات |
| `payments` | علاقة → كل طلب له سجل/سجلات دفع |

### جدول `payments` (الجديد) — قلب بوابة الدفع
| الحقل | الوصف |
|---|---|
| `id` | معرّف سجل الدفع |
| `orderId` | الطلب المرتبط به (علاقة مع orders) |
| `tapChargeId` | **مرجع الشحنة عند تاب** (فريد) — مهم للربط مع تاب |
| `tapPaymentId` | مرجع العملية عند تاب (بعد الدفع) |
| `amount` `currency` | المبلغ والعملة (SAR) |
| `method` | طريقة الدفع |
| `description` | وصف العملية (مثلاً "Order HB-1234") |
| `status` | PENDING / PAID / FAILED / CANCELLED / REFUNDED |
| `url` | رابط صفحة الدفع المؤقتة التي وُجّه إليها الزبون |
| `paidAt` | وقت إتمام الدفع |
| `raw` | **JSON خام** لأحدث استجابة من تاب (للمراجعة والتسوية) — لا يُرسل للمتصفح أبداً |
| `createdAt` `updatedAt` | الأوقات |

### جدول `order_items` (كان موجوداً)
يحفظ نسخة من الأصناف: `productName`, `productImage`, `colorName`, `sizeLabel`, `unitPrice`, `quantity`, `lineTotal` — بحيث يبقى التاريخ محفوظاً حتى لو تغيّر المنتج لاحقاً.

---

## 3) روابط الـ API (كيف نصل للبيانات)

| الرابط | الطريقة | الوصف | الحماية |
|---|---|---|---|
| `/api/checkout` | POST | إنشاء الطلب وتوجيه الزبون لصفحة تاب | يتطلب تسجيل دخول |
| `/api/payments/webhook` | POST | استقبال إشعارات تاب وتحديث الحالة | توقيع HMAC + إعادة جلب من تاب |
| `/api/orders/[orderNumber]/payment-status` | GET | حالة الدفع لصفحة التأكيد (للعميل) | عام لكن يعرض بيانات محدودة فقط |
| `/api/admin/orders` | GET | قائمة الطلبات (تشمل سجلات الدفع) | أدمن فقط |
| `/api/admin/orders` | PATCH | تغيير حالة الطلب/الدفع/التتبع يدوياً | أدمن فقط |

**أين ترى البيانات عملياً؟**
- لوحة الأدمن → `/admin/orders` → عمود Payment يعرض: طريقة الدفع + شارة الحالة (PAID/PENDING/FAILED) + مرجع تاب (`tapChargeId`).
- قاعدة البيانات مباشرة: `npm run db:studio` (Prisma Studio) أو من **لوحة Neon** → SQL Editor → جربي: `SELECT * FROM payments;`
- علاقة الاستعلام: كل `payment` مرتبط بـ `orderId`، وكل `order` مرتبط بمستخدم.

---

## 4) الملفات التي أُنشئت أو عُدّلت

### ملفات جديدة
| الملف | الوظيفة |
|---|---|
| `src/lib/tap.ts` | عميل Tap الآمن (إنشاء شحنة، جلب حالة، التحقق من التوقيع) |
| `src/lib/stock.ts` | مساعد خصم المخزون (يُستدعى من checkout للدفع عند الاستلام، ومن webhook عند تأكيد الدفع) |
| `src/app/api/payments/webhook/route.ts` | استقبال إشعارات تاب وتحديث الحالة |
| `src/app/api/orders/[orderNumber]/payment-status/route.ts` | قراءة حالة الدفع لصفحة التأكيد |
| `TAP-PAYMENTS-SETUP.md` | دليل التشغيل خطوة بخطوة |

### ملفات معدّلة
| الملف | ما تغيّر |
|---|---|
| `prisma/schema.prisma` | نموذج `Payment` + علاقة `payments` في Order |
| `src/app/api/checkout/route.ts` | إنشاء سجل الدفع، إنشاء شحنة تاب، توجيه الزبون |
| `src/app/api/admin/orders/route.ts` | تضمين سجلات الدفع في قائمة الطلبات |
| `src/components/checkout/checkout-form.tsx` | إعادة توجيه الزبون لصفحة تاب عند الدفع الإلكتروني |
| `src/components/checkout/order-confirmation-client.tsx` | فحص حالة الدفع وعرضها تلقائياً |
| `src/app/admin/orders/page.tsx` | عرض حالة الدفع ومرجع تاب |
| `src/types/index.ts` | نوع `Payment` الجديد |
| `.env` / `.env.example` | متغيرات تاب `TAP_SECRET_KEY` و `TAP_WEBHOOK_SECRET` و `TAP_BASE_URL` |

---

## 5) الأمان (لماذا لا يمكن تسريب أي شيء)

1. **المفاتيح لا تُرفع على GitHub** — ملف `.env` مستثنى عبر `.gitignore`. المفاتيح تعيش فقط في:
   - جهازك: ملف `.env`
   - الإنتاج: لوحة Vercel → Settings → Environment Variables
2. **لا تُرسل أي مفتاح للمتصفح** — `src/lib/tap.ts` يُستورد حصراً من الخادم (routes)، ولا يظهر في أي استجابة API.
3. **الـ Webhook محمي بطبقتين:**
   - التحقق من التوقيع `hashstring` (HMAC-SHA256) حسب صيغة تاب الرسمية.
   - ثم **إعادة جلب حالة الشحنة من تاب نفسها** — فلا يمكن تزوير "تم الدفع" حتى لو عُرفت الواجهة، لأن التزوير يحتاج شحنة حقيقية لا يعرفها إلا تاب.
4. **المخزون لا يُخصم إلا بعد تأكيد الدفع** — طلبات البطاقة غير المدفوعة لا تحجز مخزوناً.
5. **التحديث يتم مرة واحدة فقط (idempotent)** — حتى لو وصل الـ webhook مرتين، لا يُخصم المخزون ولا يُتأكد الطلب مرتين.
6. **تأكيد المبلغ والعملة** — قبل تأكيد الدفع نتأكد أن مبلغ الشحنة في تاب يساوي مبلغ الطلب في قاعدة البيانات.

---

## 6) قواعد سلوكية مهمة (سلوك النظام)

- **الدفع عند الاستلام (COD):** يتأكد الطلب فوراً → `status=CONFIRMED`، `paymentStatus=PENDING`، ويُخصم المخزون في نفس اللحظة.
- **الدفع بالبطاقة:** الطلب يبقى `PENDING` حتى يصلك الـ webhook ويؤكد تاب الدفع → عندها يصبح `CONFIRMED` و`PAID` ويُخصم المخزون.
- **فشل الدفع:** يبقى الطلب موجوداً بحالة دفع `FAILED`، والعميل يعيد التجربة بعملية جديدة.
- **الاسترداد (Refund):** حالياً يُدار يدوياً من لوحة الأدمن بتغيير `paymentStatus` إلى `REFUNDED` (تعديل يدوي من `/admin/orders`). توسيع استرداد تلقائي ممكن لاحقاً.

---

## 7) ملخص متغيرات البيئة المطلوبة

| المتغير | الحالة | مثال |
|---|---|---|
| `TAP_SECRET_KEY` | **مطلوب** لتشغيل الدفع الإلكتروني | `sk_test_xxxxxxxx` / `sk_live_xxxxxxxx` |
| `TAP_WEBHOOK_SECRET` | موصى به (أمان إضافي) | نص من لوحة تاب |
| `TAP_BASE_URL` | اختياري (له افتراضي) | `https://api.tap.company/v2` |
| `NEXT_PUBLIC_SITE_URL` | مطلوب لرابط العودة بعد الدفع | `https://hebabaattiya.com` |

> بدون `TAP_SECRET_KEY`، يظهر للمستخدم عند اختيار الدفع بالبطاقة: "Online payments are not available yet" (ويعمل الدفع عند الاستلام بشكل طبيعي).
