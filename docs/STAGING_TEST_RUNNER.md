# Shutterbug Staging Test Runner

Use this checklist after the staging deployment has the real staging environment variables configured. It is meant to prove one complete store flow before production launch.

Do not run production migrations or live-payment tests from this checklist unless you have intentionally pointed the app at the matching staging or production services.

## 1. Required Staging Environment Variables

Set these in the staging host before testing:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_AMAZON_STORE_URL`
- `DATABASE_URL`
- `ADMIN_EMAIL` or `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `CUSTOMER_SESSION_SECRET`
- `EMAIL_FROM`
- `ADMIN_ORDER_EMAIL`
- `RESEND_API_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_UPLOAD_FOLDER`

Pass condition:

- Every value is configured in the staging host.
- `NEXT_PUBLIC_SITE_URL` points to the staging URL while testing staging.
- Stripe keys are test-mode keys for staging.
- Resend sender matches a verified staging-safe sender or verified domain.
- Cloudinary folder is distinct enough to identify staging uploads, such as `shutterbug-products-staging`.

Fail condition:

- Any required secret is missing, blank, or still using placeholder text.

## 2. Database Migration

Run only with the staging `DATABASE_URL` configured:

```bash
npx prisma migrate deploy
```

Then generate the Prisma client if needed:

```bash
npm run prisma:generate
```

Pass condition:

- Migrations apply without errors.
- The app boots against the staging database.

Fail condition:

- Migration command points at a placeholder, local scratch database, or production by accident.

## 3. Stripe Webhook Setup

In Stripe test mode, create a webhook endpoint for:

```txt
https://YOUR-STAGING-DOMAIN/api/webhooks/stripe
```

Enable this event:

```txt
checkout.session.completed
```

Copy the endpoint signing secret into:

```txt
STRIPE_WEBHOOK_SECRET
```

Pass condition:

- Stripe test webhook endpoint is active.
- The staging app has the matching `STRIPE_WEBHOOK_SECRET`.

Fail condition:

- Webhook secret belongs to another endpoint, environment, or live-mode account.

## 4. Resend Sender And Domain Setup

In Resend:

1. Verify the sender/domain used by `EMAIL_FROM`.
2. Set `ADMIN_ORDER_EMAIL` to the inbox that should receive paid order notifications.
3. Confirm `RESEND_API_KEY` belongs to the intended staging or production Resend account.

Pass condition:

- Resend accepts the sender.
- Paid order emails can be delivered to both customer and admin addresses.

Fail condition:

- Emails fall back to console output in staging because `RESEND_API_KEY` is missing.

## 5. Cloudinary Setup

Configure:

```txt
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
CLOUDINARY_UPLOAD_FOLDER
```

Pass condition:

- Uploads go to Cloudinary.
- Product records save hosted Cloudinary URLs.
- The app does not depend on local filesystem uploads.

Fail condition:

- Admin uploads return a configuration error.
- Product image URLs point to local server paths such as `/uploads/...`.

## 6. Admin Login Test

Go to:

```txt
/admin/login
```

Log in with `ADMIN_EMAIL` or `ADMIN_USERNAME` and `ADMIN_PASSWORD`.

Pass condition:

- Login redirects to `/admin`.
- Admin dashboard links are visible.
- Opening `/admin/products` works.

Fail condition:

- Login reloads without an error.
- Admin routes are public while logged out.

## 7. Product Creation Test

Go to:

```txt
/admin/products/new
```

Create a staging product with:

- title
- slug
- SKU
- brand
- model
- category
- price
- quantity greater than 0
- condition
- tested status
- included items
- status `active`

Pass condition:

- Product saves successfully.
- Product appears in `/admin/products`.
- Product has a public detail page at `/shop/[slug]` or `/product/[slug]`.

Fail condition:

- Product cannot be saved.
- Active product does not appear publicly.

## 8. Cloudinary Image Upload Test

From the product add/edit form:

1. Upload one main image.
2. Upload at least one additional image.
3. Save the product.
4. Open the public product page.

Pass condition:

- Images preview in admin.
- Saved URLs are Cloudinary-hosted URLs.
- Public product cards and product detail gallery show the uploaded images.

Fail condition:

- Upload fails.
- Saved image URLs are blank.
- Public product pages show broken images.

## 9. Stripe Test Checkout

With the active staging product:

1. Open the product page.
2. Add the product to cart.
3. Go to `/cart`.
4. Continue to `/checkout`.
5. Enter contact and shipping details.
6. Submit checkout.
7. Pay with Stripe test card:

```txt
4242 4242 4242 4242
Any future expiration date
Any CVC
Any ZIP
```

Pass condition:

- Checkout starts from `/checkout`.
- Stripe-hosted Checkout opens.
- Browser returns to the configured success page after payment.

Fail condition:

- Checkout uses client-submitted prices.
- Checkout bypasses the `/checkout` form.
- Stripe returns a configuration error.

## 10. Webhook Paid-Order Verification

After the Stripe test payment:

1. Check Stripe webhook delivery logs.
2. Open `/admin/orders`.
3. Open the new order detail page.

Pass condition:

- Stripe webhook delivery returns a success response.
- Order status is marked paid only after webhook delivery.
- Stripe session or payment intent references are visible to admin.

Fail condition:

- Success page marks an unpaid order as paid.
- Webhook fails signature verification.
- Order remains `pending_payment` after successful webhook delivery.

## 11. Inventory Deduction Verification

Return to the product in admin and public product page.

Pass condition:

- Purchased quantity is deducted only after webhook-confirmed payment.
- If quantity reaches 0, the item becomes sold out or unavailable for purchase.
- Sold-out products cannot be checked out again.

Fail condition:

- Inventory decreases before payment is confirmed.
- Inventory does not decrease after paid webhook processing.
- Sold-out products can still be purchased.

## 12. Paid Email Verification

Check the customer inbox and the admin order inbox.

Pass condition:

- Customer receives paid order confirmation.
- Admin receives new paid order notification.
- Emails include order number, product snapshots, totals, status, and customer/shipping details where appropriate.
- Duplicate webhook delivery does not send duplicate paid emails.

Fail condition:

- Emails send before webhook-confirmed payment.
- Admin or customer emails are missing.
- Duplicate webhook events produce duplicate customer/admin paid emails.

## 13. Fulfillment And Tracking Email Verification

In `/admin/orders/[id]`:

1. Mark the order processing.
2. Add carrier.
3. Add tracking number.
4. Add tracking URL.
5. Mark the order shipped.

Pass condition:

- Customer shipping email sends once.
- `/orders/[id]` shows customer-safe tracking information.
- Admin order detail shows shipping email sent status.

Fail condition:

- Shipping email sends more than once for the same shipped order.
- Public order page exposes admin notes.
- Pending-payment orders can be marked shipped.

## 14. SEO Endpoint Checks

Open these staging URLs:

```txt
/sitemap.xml
/robots.txt
/google-merchant-feed.xml
```

Pass condition:

- `/sitemap.xml` loads and includes active public product URLs.
- `/robots.txt` loads and blocks private/admin/account/cart/checkout areas.
- `/google-merchant-feed.xml` loads and includes active products with real image URLs.

Fail condition:

- Any endpoint returns a 500.
- Merchant feed includes draft, archived, or placeholder-only products.
- Private routes are indexable.

## 15. Final Pass/Fail Checklist

Record results before launch:

```txt
Staging URL:
Tester:
Date:

[ ] Required env vars configured
[ ] Database migrations applied to staging
[ ] Stripe webhook configured and verified
[ ] Resend sender/domain verified
[ ] Cloudinary upload configured
[ ] Admin login works
[ ] Product creation works
[ ] Product image upload works
[ ] Stripe test checkout works
[ ] Webhook marks order paid
[ ] Inventory deducts after payment
[ ] Customer paid email sends once
[ ] Admin paid email sends once
[ ] Fulfillment/tracking email sends once
[ ] Customer order page shows tracking
[ ] Customer order page does not expose admin notes
[ ] Sitemap loads
[ ] Robots loads
[ ] Google Merchant feed loads

Final result: PASS / FAIL
Blockers:
Owner:
Retest date:
```

Launch is blocked until every required item is checked or intentionally deferred with a written reason.
