# Security Invariants

These rules are production contracts. Future changes must preserve them and add tests when they touch the relevant flow.

## Authentication and authorization

- Admin routes and mutations require a valid signed admin session.
- Customer account data and likes require a valid signed customer session.
- Production must not use fallback session secrets or a default admin identity.
- Redirect parameters may resolve only to internal application paths.
- Sensitive cookies are HTTP-only, secure in production, same-site, bounded, and explicitly cleared on logout.

## Products and cart

- Public catalog data includes only public statuses.
- Product price, status, quantity, and availability always come from the database, never the browser.
- Cart payloads are bounded, normalized, deduplicated, and integer-only.
- Product quantity and reserved quantity can never be negative.
- Archived, draft, unavailable, or over-quantity products cannot proceed to payment.

## Checkout and payment

- Checkout reserves inventory atomically before creating a Stripe session.
- Abandoned/failed/expired checkout releases its reservation exactly once.
- A paid order can be created only by a verified Stripe webhook.
- The webhook must validate order/session linkage, payment state, amount, currency, and live/test mode.
- Every Stripe event is processed at most once through a unique durable event ledger.
- Inventory is deducted only while consuming a valid reservation after confirmed payment.
- A success URL is display-only and never authoritative for payment.
- A refund status must never be written unless the payment provider has accepted the refund.

## Uploads and output

- Admin uploads require authentication, same-origin requests, rate limits, bounded size, allowlisted MIME types, and matching magic bytes.
- Public image URLs are local assets or HTTPS Cloudinary URLs.
- Tracking links are HTTPS URLs.
- User-controlled text is escaped in email HTML.
- JSON-LD serialization escapes `<` before entering a script element.
- Admin notes are never displayed on customer order pages.

## Email and privacy

- Paid-order emails send only after webhook-confirmed payment.
- Shipping email sends only for paid shipped/delivered orders.
- Email delivery uses durable database claims and provider idempotency keys.
- Logs must not include passwords, tokens, full database URLs, Stripe keys, Resend keys, or session secrets.