# Shutterbug Production Launch Checklist

This checklist captures the production readiness audit for the current store foundation.

## Current Status

- Product inventory, cart, checkout, Stripe payment, paid emails, admin fulfillment, shipping emails, and Cloudinary image uploads are implemented.
- Uploads are production-safe when Cloudinary env vars are configured. The app does not store product uploads in the repo or local filesystem.
- Database migrations are present, but production migrations must be applied only where the real `DATABASE_URL` is configured.

## Required Environment Variables

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

## Production Migration

Run only in the environment that has the real production database URL:

```bash
npx prisma migrate deploy
```

Do not run production migrations with the placeholder `.env.example` value or a local scratch database.

## Storage

Product image uploads use Cloudinary through `/api/admin/upload`.

- The route requires an admin session.
- Files must be images.
- Files larger than 8 MB are rejected.
- Cloudinary stores the image and returns a hosted URL.
- Product records store the final hosted URLs.

Blocker if missing: Cloudinary env vars must be configured before relying on admin uploads.

## Security Checks

- Admin routes call `requireAdmin()` or `getAdminSession()`.
- Admin image uploads are protected by session auth.
- Admin session cookies require `ADMIN_SESSION_SECRET` or `NEXTAUTH_SECRET` in production.
- Customer session cookies require `CUSTOMER_SESSION_SECRET`, `ADMIN_SESSION_SECRET`, or `NEXTAUTH_SECRET` in production.
- Stripe webhook uses `stripe.webhooks.constructEvent()` with `STRIPE_WEBHOOK_SECRET`.
- Public order pages do not render `adminNotes`.

## Order Safety Checks

- Checkout revalidates cart items from the database before creating the Stripe Checkout Session.
- Draft, archived, sold-out, inactive, missing, and over-quantity products block checkout.
- Stripe line item prices are built from server-validated product data.
- Orders are marked paid only from the verified Stripe webhook.
- Inventory is deducted only after webhook-confirmed payment.
- Paid order emails and shipping emails track sent/sending timestamps for idempotency.

## SEO And Feed Checks

- `/sitemap.xml` uses active catalog products.
- `/robots.txt` blocks admin, API, account, cart, checkout, login, and signup paths.
- `/google-merchant-feed.xml` uses active products with real product images.
- Product detail pages build product structured data from saved product images and product fields.

## Launch QA

Before launch, run through this with Stripe test mode and real test products:

1. Create a product in `/admin/products/new`.
2. Upload a main image and additional images.
3. Publish the product as active with quantity greater than 0.
4. Confirm the product appears on `/shop`, category pages, brand pages, sitemap, and Merchant feed.
5. Add the product to cart.
6. Go through checkout with Stripe test card.
7. Confirm the webhook marks the order paid.
8. Confirm inventory decreases.
9. Confirm customer paid email sends.
10. Confirm admin paid email sends.
11. Mark the order processing.
12. Add carrier, tracking number, and tracking URL.
13. Mark shipped.
14. Confirm shipping email sends once.
15. Confirm customer order page shows tracking.
16. Confirm sold-out items cannot be purchased again.

## Remaining Blockers Before Real Orders

- Production `DATABASE_URL` must be configured.
- Production migrations must be deployed.
- Stripe webhook endpoint must be registered and tested.
- Resend email sending must be configured with a verified sender/domain.
- Cloudinary credentials must be configured and tested from the admin product form.
- At least 10-25 real products should be entered before Search Console and Merchant Center submission.
