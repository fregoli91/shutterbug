# Storefront Final Readiness Review

Date: September 20, 2026  
Branch: `codex/sitewide-storefront-polish`  
Release state: review-ready branch; not merged, deployed, or migrated in production

## Outcome

The remaining code and UX work identified in the sitewide audit is complete for review. Automated tests, lint, the production build, production-mode route checks, the full responsive matrix, representative visual inspection, keyboard interaction checks, and local browser performance sampling pass.

Production release remains gated by the additive watchlist migration, owner policy decisions, a review deployment smoke test, and post-deployment production monitoring. No production database or live site was changed during this review.

## Unresolved-item inventory

### Code and UX completed in this review

- Replaced promotional artwork that embedded unsupported authenticity, warranty, discount, shipping, or business-history claims while preserving the homepage placements and links.
- Added truthful HTML copy over reusable product imagery so claims remain reviewable and accessible.
- Corrected the empty-watchlist availability link to use `sold_out`.
- Made the watchlist toggle derive its revalidation slug from the database product record.
- Made concurrent duplicate watch saves idempotent around Prisma `P2002` while retaining the database unique constraint.
- Removed the redundant client-supplied product slug from the sold-product watch form.
- Added regression coverage for customer ownership, duplicate prevention, guest return paths, active/sold eligibility, sold calls to action, unavailable-state copy, archived/deleted visibility, structured availability, related links, and promotional claims.

### Visual QA completed in this review

The browser matrix covered these 11 routes:

- `/`
- `/shop`
- `/sell-your-camera`
- `/brands`
- `/brands/canon`
- `/brands/hp`
- `/categories/printers`
- `/guides/how-we-test-used-printers`
- `/account`
- `/account/watchlist`
- `/bag`

Every route was rendered at 320, 360, 375, 390, 393, 414, 430, 768, 1024, 1280, 1440, 1600, and 1920 pixels: 143 page-width cases in total.

Results:

- No document-level horizontal overflow.
- Exactly one `main` landmark and one visible H1 in every case.
- Mobile menu, mobile Bag, shop filter dialog, and desktop dropdown opened, closed with Escape, and restored focus to their trigger.
- Representative mobile and desktop screenshots were visually inspected for Home, Shop, Sell Your Camera, Canon, Printers, the printer-testing guide, Bag, and login redirects. No clipping, overlapping content, or unreadable controls were found.
- The scan's “unnamed” link reports were checked and were false positives from image-only links whose accessible names come from non-empty image alt text. Reported “failed images” were below-fold lazy images that had not loaded in the fixed 900-pixel viewport, not broken image responses.
- The local database contains no sold products, so the sold-filter empty state was used rather than creating placeholder inventory.

### Watchlist validation

- Signed-out browser behavior: `/account/watchlist` returns a 307 redirect to `/login?returnTo=%2Faccount%2Fwatchlist`.
- Signed-in behavior: the account page lists watches by authenticated `customerId`; mutation code and regression tests verify customer-scoped reads and deletes.
- Product ownership: removal uses `id + customerId`; a customer cannot delete another customer's watch by guessing an ID.
- Duplicate handling: the migration uniquely indexes `customerId + key`, normalized keys collapse equivalent brand/model input, and the action treats a concurrent `P2002` duplicate as an already-saved watch.
- Sold CTA: public active and sold products may create a watch; draft and archived products cannot.
- Empty/unavailable state: the account page explains how to add a watch, links to `availability=sold_out`, and states that automatic email/text alerts are not active.

No authenticated browser fixture was available, so the signed-in branch was validated through implementation and regression tests rather than an account session recorded in Edge.

### Product lifecycle validation

- `ACTIVE` with positive quantity is purchasable and maps to Schema.org `InStock`.
- `SOLD_OUT` remains publicly resolvable, is not purchasable, maps to `OutOfStock`, retains exact-item history, links to similar active inventory, offers an availability contact path, and exposes the model-watch control.
- `ARCHIVED` and `DRAFT` are excluded from public catalog reads and product detail resolution.
- A deleted record cannot resolve because product detail begins with a database lookup and returns unavailable when no public record exists.
- Related products are restricted to active, positive-quantity inventory.
- The production database currently has zero sold products; no inventory was fabricated for visual testing.

### Accessibility validation

- Shared skip navigation reaches the single page `main`.
- Each tested page has one visible H1.
- Menus and dialogs support keyboard opening, Escape dismissal, and trigger-focus restoration.
- Native labels or image alt text provide names for the controls flagged by the simple DOM scanner.
- Carousel controls have accessible names, and motion transitions respect reduced-motion preferences.
- Mobile controls retain at least 44-pixel target heights where applicable.

A full screen-reader session and production contrast scan remain advisable on the review deployment because no dedicated accessibility scanner or assistive-technology fixture was available locally.

## Production-mode route checks

| Route | Result |
| --- | --- |
| `/`, `/shop`, `/sell-your-camera`, `/brands`, `/brands/canon`, `/brands/hp` | 200 |
| `/categories/printers`, `/guides/how-we-test-used-printers`, `/bag` | 200 |
| `/account` | 307 to `/login?returnTo=%2Faccount` |
| `/account/watchlist` | 307 to `/login?returnTo=%2Faccount%2Fwatchlist` |
| `/cart` | 308 to `/bag` |

## Local browser performance sample

Method: production `next start`, headless Microsoft Edge, 1440×900 viewport, cache disabled, local network, no CPU or network throttling, one navigation per route. These values show local regressions and resource weight; they are not production field data.

| Requested route | Final route | TTFB | FCP | LCP | CLS | Transfer |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| `/` | `/` | 32 ms | 176 ms | 440 ms | 0 | 737 KiB |
| `/shop` | `/shop` | 49 ms | 120 ms | 120 ms | 0 | 276 KiB |
| `/sell-your-camera` | same | 16 ms | 76 ms | 168 ms | 0 | 258 KiB |
| `/brands/canon` | same | 17 ms | 68 ms | 104 ms | 0 | 299 KiB |
| `/categories/printers` | same | 13 ms | 64 ms | 64 ms | 0 | 296 KiB |
| `/guides/how-we-test-used-printers` | same | 19 ms | 92 ms | 92 ms | 0 | 263 KiB |
| `/bag` | same | 14 ms | 68 ms | 184 ms | 0.065 | 237 KiB |
| `/account/watchlist` | login redirect | 34 ms | 88 ms | 208 ms | 0.020 | 298 KiB |

Lighthouse performance, accessibility, best-practices, and SEO scores are not reported because Lighthouse is not installed in this workspace. INP is not reported because a local single-navigation harness cannot provide meaningful field interaction latency. Production Core Web Vitals require a deployed URL and real-user or representative throttled lab collection.

## Migration review

Migration: `prisma/migrations/20260919120000_customer_model_watchlist/migration.sql`

Created:

- Table `CustomerModelWatch`.
- Columns `id`, `customerId`, `key`, `brand`, `model`, `categorySlug`, `createdAt`, and `updatedAt`.
- Primary key on `id`.
- Unique index on `(customerId, key)`.
- Index on `(customerId, createdAt)`.
- Index on `key`.
- Foreign key from `customerId` to `Customer(id)` with cascade on delete and update.

Modified: no existing table, column, index, or constraint.  
Removed: nothing.  
Unaffected: orders, order items, payments, Stripe webhook records, inventory reservations, product stock, customer sessions, and trade-in records.

The migration is additive but required before the new watchlist code receives production traffic.

## Owner decisions

All policy questions are isolated in [OWNER_POLICY_DECISIONS.md](./OWNER_POLICY_DECISIONS.md). The document covers returns, warranty, shipping, trade-ins, privacy vendors/tracking, and model-watch notifications without selecting terms on the owner's behalf.

## Deliberate wait items

These items should remain deferred until their prerequisites exist:

- Automatic watchlist email/text alerts until channel, consent, timing, and unsubscribe policy are approved.
- Specific returns, warranty, shipping, trade-in, and local-handoff promises until owner decisions are supplied.
- Promotional discount, free-shipping, warranty, longevity, or authenticity claims until current evidence and terms are available.
- Privacy/vendor copy until production processors and tracking choices are final.
- Printer-family and brand editorial expansion until inventory and Search Console data support it.
- Operational About-page photography until real approved images are available.

## Validation gate

- `npm test`: 45 passed, 0 failed.
- `npm run lint`: passed.
- `npm run build`: passed; 128 pages generated.
- `git diff --check`: required again immediately before commit.

## Deployment order

1. Review this branch and approve owner-controlled policy language separately.
2. Confirm a recent production database backup and validate the target database/environment variables.
3. Apply `prisma migrate deploy` to production before routing traffic to watchlist code; verify the table, indexes, and foreign key.
4. Deploy the reviewed application artifact.
5. Smoke-test home, shop, sold product, login, watchlist, bag, checkout entry, printer category/guide, and trade-in routes.
6. Verify signed-in watch add/remove ownership with a controlled customer account.
7. Run Lighthouse or an equivalent throttled lab suite on the deployed URL, then monitor real-user LCP, CLS, and INP.
8. Monitor application, database, Stripe, and email logs; roll back the application artifact if needed. The additive table may remain because the prior application does not depend on it.
