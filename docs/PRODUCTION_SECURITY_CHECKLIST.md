# Production Security Checklist

## Before deployment

- [ ] Rotate every secret ever shared outside the production secret manager.
- [ ] Set unique `ADMIN_SESSION_SECRET` and `CUSTOMER_SESSION_SECRET` values (at least 32 random bytes).
- [ ] Confirm `ADMIN_EMAIL`, `ADMIN_USERNAME`, and a strong `ADMIN_PASSWORD` are set only where required.
- [ ] Confirm `DATABASE_URL` is the intended production Neon database with TLS required.
- [ ] Configure Stripe keys for the intended mode and verify that secret/publishable modes match.
- [ ] Register `/api/webhooks/stripe` and set its exact `STRIPE_WEBHOOK_SECRET`.
- [ ] Configure verified Resend sender/domain, `RESEND_API_KEY`, `EMAIL_FROM`, and `ADMIN_ORDER_EMAIL`.
- [ ] Configure Cloudinary credentials and a dedicated upload folder.
- [ ] Set `NEXT_PUBLIC_SITE_URL=https://www.shutterbugcamerashop.com`.
- [ ] Apply pending migrations with `npx prisma migrate deploy` against the explicitly confirmed production database.
- [ ] Run `npm run prisma:generate`, `npm test`, `npm run lint`, `npm run build`, and `npm audit`.
- [ ] Confirm no secret values are present in Git history or build output.

## Deployment validation

- [ ] Admin login rejects incorrect credentials and protects every admin route/action.
- [ ] Customer signup sends one verification email; verification tokens are one-use and expire.
- [ ] Upload rejects unauthenticated, cross-origin, oversized, SVG, and MIME-spoofed files.
- [ ] Draft/archived/sold-out products cannot enter checkout.
- [ ] Two simultaneous quantity-one checkout attempts cannot reserve the same item.
- [ ] Checkout cancel/expiration releases inventory.
- [ ] Stripe webhook rejects bad signatures, wrong amount/currency/mode, and duplicate events.
- [ ] Inventory changes only after a valid paid webhook.
- [ ] Customer/admin paid emails send once.
- [ ] Shipping email sends once and uses a safe tracking URL.
- [ ] Customer order pages do not reveal admin notes or another customer's order.
- [ ] Refund control reports unavailable until the approved provider-backed flow exists.

## Monitoring and operations

- [ ] Alert on repeated webhook failures, checkout reservation failures, and email delivery failures.
- [ ] Review Stripe webhook delivery history after every release touching checkout.
- [ ] Review Neon connection/slow-query metrics and reservation expiration behavior.
- [ ] Review Cloudinary usage and unexpected upload spikes.
- [ ] Replace in-memory throttles with shared Redis/KV before material traffic.
- [ ] Maintain database backups and test restore procedures.
- [ ] Re-run dependency and secret scans on every release.

## Incident response

- [ ] Disable checkout if payment or inventory invariants fail.
- [ ] Rotate affected provider/session secrets immediately.
- [ ] Preserve Stripe event IDs and order history for reconciliation.
- [ ] Do not manually mark orders paid or refunded without provider evidence.