# Shutterbug Security Audit

Date: 2026-08-23
Branch: `codex/security-hardening`

## Scope

Reviewed customer/admin authentication, product administration, cart validation, checkout and inventory reservations, Stripe webhook processing, order email delivery, uploads, output encoding, security headers, dependencies, and production configuration assumptions.

## Architecture

- Next.js App Router serves storefront, customer account, admin, and route handlers.
- Prisma connects to PostgreSQL/Neon for products, customers, orders, inventory reservations, and webhook event records.
- Stripe Checkout is the payment processor. The signed webhook is the only paid-order authority.
- Cloudinary stores product images. Uploads are authenticated and validated server-side.
- Resend sends verification, paid-order, admin-order, and shipping emails.
- Vercel is the expected runtime. Security-sensitive secrets are runtime environment variables.

## Findings and remediation

### Critical

1. **Database-only refund status could claim money was returned when it was not.**
   - Remediation: disabled the admin refund mutation. A refund workflow must be separately approved and must call Stripe before changing local payment state.

### High

1. **Checkout had no inventory reservation, permitting simultaneous payment attempts for one-off products.**
   - Remediation: added atomic reservations, expiration/release, and payment-time consumption in serializable transactions.
2. **Webhook processing needed durable idempotency and amount/currency/mode validation.**
   - Remediation: added a unique webhook-event ledger and strict Stripe snapshot validation before any paid transition.
3. **Upload validation trusted browser MIME metadata.**
   - Remediation: allowlisted JPEG/PNG/WebP, checks magic bytes and size, enforces same origin, throttles requests, and limits Cloudinary formats.
4. **Admin cancellation did not release reserved inventory.**
   - Remediation: cancellation and reservation release now execute together in a transaction.
5. **Production auth could accept weak fallback configuration.**
   - Remediation: dedicated production session secrets are mandatory; admin identity has no production default; cookie clearing and rotation semantics were tightened.

### Medium

1. Open redirects in login/signup return paths were normalized to internal paths.
2. Stored tracking/image URLs are allowlisted before rendering or email embedding.
3. JSON-LD output now escapes `<` to prevent script-tag breakout.
4. Public cart validation, login, signup, resend, and upload surfaces are rate-limited.
5. Product deletion now archives records to preserve order history.
6. Production no longer silently displays demo inventory when database access fails.
7. Transactional emails now use provider idempotency keys in addition to database send claims.
8. Direct production dependencies were patched to Next.js 16.3.2, Prisma runtime 7.9.1, and PostCSS 8.5.26. The production-only dependency audit reports zero vulnerabilities.

## Intentional constraints / blockers

- Refunds are intentionally disabled until a Stripe-backed, audited refund flow is explicitly approved.
- In-memory rate limiting is best-effort on serverless instances. Add a shared Redis/KV limiter before high-volume or hostile traffic.
- Inventory reservations require the included migration to be deployed before the hardened checkout is enabled in production.
- Security headers should be checked against all production third-party scripts before deployment.
- No production migrations, payments, refunds, emails, or database mutations were run by this audit.
- The Prisma CLI remains build-only in devDependencies and currently carries three high-severity advisories through @prisma/config/deepmerge-ts; upstream offers no non-breaking Prisma 7 fix. It is excluded from the deployed runtime and must be upgraded when a compatible patch is released.
