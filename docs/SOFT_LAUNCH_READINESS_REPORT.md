# Soft Launch Readiness Report

Date: 2026-10-15  
Branch: `codex/soft-launch-inventory-strategy`  
Audited implementation commit: `cb66f4c` (`Harden soft launch publishing readiness`)  
Initial preview commit: `35ea133` (`Refine soft launch inventory experience`)  
Remote branch: `origin/codex/soft-launch-inventory-strategy`
Final deployment-gate HEAD: `25d78e957f403e74970e80b977ba82689e7f898f`

## Preview deployment

GitHub reported successful Vercel deployments for the initial preview and subsequent readiness commits. The latest successful deployment dashboard associated with final gate HEAD `25d78e9` is:

`https://vercel.com/zachery-dante-fregolis-projects/shutterbug/DSsRq7BbmbtyAg9QEHkspuuysgR7`

The public preview hostname could not be retrieved without an authenticated Vercel session, so the successful deployment could not be used for public deployed-preview QA. Production was not deployed and `main` was not changed.

## Soft-launch UX

**Local status: pass. Deployed status: pending.**

- One compact, dismissible global announcement explains that the independent store is live while photographed and tested inventory is added.
- Dismissal is stored and remained dismissed after reload in local browser testing. The control has an accessible label and visible focus styling and does not autofocus.
- Homepage supporting copy appears only where it provides context. It does not describe the business as closed, under construction, beta software, or an empty template.
- The sale and carousel remain in their existing positions.
- Fresh Finds shows an intentional shelf-preparation state with Browse categories, Explore guides, Model watchlist, and Sell Your Camera actions.
- No fabricated product cards appear.

## Empty states

**Status: pass locally.**

`/shop`, priority camera categories, Canon, printers, Pentax Optio, other priority model families, and empty brand/category views provide contextual next actions. They use category or brand links where useful and avoid dead-end screens. The actions vary by page rather than repeating one identical panel everywhere.

## Inventory readiness rules

An item is publicly purchasable only when all of the following are true:

1. Lifecycle state is `active`.
2. Quantity is greater than zero.
3. Price is greater than zero.
4. `actualPhotos` is explicitly confirmed.
5. The hero image is an HTTPS Cloudinary image-upload URL.
6. Condition summary is present.
7. Short description is present.
8. At least one testing note is present.
9. At least one included-item note is present.

These are universal exact-item disclosure rules for cameras, lenses, accessories, and printers. They do not require camera-specific facts from unrelated categories. When a test could not be performed or an accessory is not included, the editor instructs the administrator to state that limitation or “none included” rather than leave the disclosure blank.

The admin product editor now displays a saved-state Publishing readiness checklist showing Active status, price, quantity, real photos, condition, description, testing notes, and included-item details. It states that incomplete items remain off the storefront and Merchant feed.

## Real-image rule

An image counts as a confirmed item photograph only when:

- the product has `actualPhotos` enabled;
- the URL uses HTTPS;
- the host is exactly `res.cloudinary.com`;
- the path contains `/image/upload/`; and
- the path is not an SVG or named as a placeholder.

Local clay/category artwork, generic local assets, arbitrary third-party URLs, and placeholder files do not qualify. Merchant additional images now use the same Cloudinary upload rule, so category artwork cannot enter the feed through the gallery.

## Merchant eligibility

**Current local feed: valid XML, 0 items.**

The RSS/channel envelope parses and remains structurally valid with no item elements. No sample, demo, sold, placeholder, or incomplete products appeared. A future feed item must satisfy every storefront-readiness rule above; feed code also rechecks active/in-stock state and confirmed item photography.

## Sold products and watchlist

**Code/test status: pass. Live inventory review: pending a genuine sold record.**

- Sold listings do not render Add to Bag or quantity controls.
- Cards and product pages label the amount as `Last listed price`.
- Structured data returns `OutOfStock`.
- Useful sold pages require an actual Cloudinary item photo, exact model, description, condition, and at least one test/functional/flaw note before they remain indexable.
- Thin sold records remain unavailable to public catalog lookup.
- Exact-model watch actions preserve the requested return path for signed-out users and are customer-scoped and duplicate-safe.
- Similar results include only available inventory and preserve camera-versus-printer relevance.
- Brand/category links remain available.

The connected local data contained no genuine sold product, so no record was invented for visual QA.

## Model library

Canon PowerShot/Digital ELPH, Olympus digital/Stylus, Sony Cyber-shot, Nikon Coolpix, Fujifilm FinePix, Kodak EasyShare, Pentax Optio, Casio Exilim, and Panasonic Lumix routes have distinct titles, descriptions, headings, guidance, and internal links. They do not publish product counts or availability claims when inventory is empty. No additional model-family pages were added in this phase.

## Account

The dashboard organizes Orders, Saved finds, Model watchlist, Trade-ins, and Profile. Existing account utilities remain reachable through the account menu. Signed-out access redirects to login with a return path. A new account layout gives every private account page an explicit `noindex, nofollow` policy in addition to the robots.txt crawl block.

## SEO and indexability

Local rendered-HTML checks passed for:

- `/`
- `/shop`
- `/categories/digital-cameras`
- `/categories/vintage-digital-cameras`
- `/categories/canon-powershot-cameras`
- `/brands/canon`
- `/categories/printers`
- `/categories/pentax-optio-cameras`

Each sampled public page had a unique title, meta description, canonical, one H1, and appropriate Organization/WebSite plus CollectionPage/BreadcrumbList structured data. Category and brand breadcrumbs rendered. Priority empty evergreen pages remain indexable. Filtered search URLs are noindex. Private account, Bag, checkout, login, signup, admin, and API paths are excluded by robots controls; account pages also inherit meta noindex.

## Sitemap

**Status: pass locally.**

The sitemap includes Used Digital Cameras, Vintage Digital Cameras, Canon PowerShot, Olympus digital, Sony Cyber-shot, Nikon Coolpix, Fujifilm FinePix, Kodak EasyShare, Pentax Optio, Casio Exilim, Panasonic Lumix, printers, and guides. It excludes account, Bag, checkout, admin, and query/filter URLs.

## Sample-data audit

- The legacy in-code sample catalog is empty.
- `inventory-template.csv` is header-only.
- No customer-facing demo, example, or test products remain.
- Remaining `sample` uses describe real sample-photo fields or editorial guidance.
- Remaining `placeholder` uses are form input hints, transient Bag/order fallbacks, admin fallbacks, docs, tests, or the defensive product-image fallback. The public catalog readiness gate prevents that fallback from qualifying as inventory or Merchant photography.
- Automated test fixtures remain test-only.

## Mobile and desktop QA

Local production UI was checked at widths 320, 360, 375, 390, 414, 430, 768, 1024, 1440, and 1920 pixels.

- No width produced document-level horizontal overflow.
- Carousel remained contained at every width.
- Mobile hero copy, actions, header, search, Bag, and navigation remained readable and available.
- Fresh Finds remained intentional and action-oriented.
- No fake `/shop/[slug]` cards appeared.
- Desktop heading widths and layout remained centered and contained.

This must be repeated against the public Vercel preview after its hostname is available.

## Accessibility

**Status: pass for reviewed controls and automated regressions.**

- Announcement dismiss control has an accessible name, native button keyboard behavior, and focus-visible styling.
- No announcement autofocus is used.
- Empty-state links use descriptive labels.
- Sold state and historical-price wording are visible text.
- Header, Bag, mobile menu, skip navigation, main landmark, signed-in/out account access, and watchlist return paths are covered by tests and local inspection.

No full third-party automated accessibility scan was available for the protected preview.

## Performance

Lighthouse scores and deployed-preview LCP, CLS, INP, Accessibility, Best Practices, and SEO metrics were not measured. The public preview URL was unavailable without Vercel authentication, and Lighthouse is not installed in this workspace. No metrics are inferred or invented. Local responsive inspection found no visible announcement-driven reflow after dismissal, but deployed Lighthouse remains required.

## Validation

Validation of the audited implementation:

- `npm test`: 57 tests passed, 0 failed.
- `npm run lint`: passed with no ESLint errors.
- `npm run build`: passed on Next.js 16.4.0; TypeScript passed; 127 static pages generated.
- `git diff --check`: passed.

These commands were rerun after committing the implementation and report. The subsequent report-only status update does not change runtime source.

## Migrations and environment

No Prisma schema or migration differs from `origin/main` on this branch. No database migration is required specifically for this merge.

Before production, verify the presence and correct environment scope of site URL, database runtime/direct URLs, admin and customer session secrets, email sender/API, Stripe publishable/secret/webhook values, and Cloudinary credentials/folders. Do not expose secret values in review output and do not use `.env.example` placeholders.

## Remaining blockers

1. Push the final audit/report commits and wait for a successful Vercel preview build.
2. Obtain the public Vercel preview hostname through an authenticated Vercel session.
3. Repeat visual/functional QA on that deployed preview at every required width.
4. Run Lighthouse on `/`, `/shop`, `/categories/digital-cameras`, and `/categories/printers` and record real metrics.
5. Visually verify sold-product behavior when a genuine sold record exists; do not fabricate inventory for QA.
6. Verify required production environment variables by key and deployment scope before merging.

## Recommended production sequence

1. Push `codex/soft-launch-inventory-strategy` only.
2. Wait for the final Vercel preview build and record its public URL.
3. Complete deployed visual, functional, accessibility, and Lighthouse QA.
4. Confirm production environment keys and scopes without changing values during review.
5. Confirm no branch-specific Prisma migration is required (currently none).
6. Review and approve the branch diff.
7. Merge the branch to `main` only after the blockers above are cleared.
8. Allow the normal Vercel production deployment from `main`.
9. Smoke-test homepage, shop, priority categories/brands, account redirects, Bag, checkout start, sold behavior when available, and admin publishing guidance.
10. Validate the live Merchant feed, sitemap, and robots.txt.
11. Request Search Console reindexing for the homepage and priority category/model-family pages.
12. Begin loading genuine inventory through the readiness checklist.

## Final production deployment gate

### Preview access status

**Blocked on authenticated Vercel project access.** The verified deployment dashboard URL for commit `25d78e9` redirects this audit browser to Vercel login. A dashboard login redirect does not establish whether the generated deployment hostname itself is protected; the public deployment hostname and the project's Deployment Protection configuration are not visible in the unauthenticated session.

Vercel supports two scoped ways to test a protected preview without disabling protection globally: a deployment-specific shareable link for a human reviewer, or Protection Bypass for Automation for browser automation. Both must be created by an authenticated project member and must be treated as access credentials. No public preview, bypass secret, protection exception, production deployment, or global security change was created during this audit.

To finish safely, the owner should log into Vercel, open the successful deployment for `25d78e9`, and use **Share > Anyone with the link** for a temporary review link, or create a dedicated, revocable automation bypass under **Project Settings > Deployment Protection**. The link or bypass should be revoked after QA. Anonymous public-user behavior must remain unverified until the generated URL is tested without an existing Vercel session.

### Deployed breakpoint QA

**Not run; blocking.** The public or scoped preview URL was unavailable. The successful local results at 320, 360, 375, 390, 414, 430, 768, 1024, 1440, and 1920 pixels were not substituted for deployed testing. The required deployed pass still covers 320, 360, 375, 390, 414, 430, 768, 1024, 1280, 1440, and 1920 pixels across the homepage, shop, priority categories, Canon brand, printers, Sell Your Camera, login, account redirects, watchlist redirects, and Bag, plus real empty/sold states where data exists.

### Lighthouse

**Not run; blocking.** No deployed-preview URL could be accessed. Performance, Accessibility, Best Practices, SEO, LCP, CLS, and INP are unreported rather than inferred from localhost.

### Production environment checklist

Only `.env.example` is present locally. Production values and scopes require authenticated Vercel access, so no production key is marked present on inference alone.

| VARIABLE NAME | REQUIRED? | PRODUCTION PRESENT? | USED BY | BLOCKING? |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes for explicit production configuration | Unknown — Vercel auth required | Email links and Stripe success/cancel URLs | Yes |
| `DATABASE_URL` | Yes | Unknown — Vercel auth required | Prisma runtime, accounts, admin, inventory, checkout, orders, trade-ins | Yes |
| `DIRECT_URL` | Conditional; needed when the runtime pooler cannot safely run migrations | Unknown — Vercel auth required | Prisma CLI migration connection | Yes until migration path is confirmed |
| `ADMIN_EMAIL` | One of `ADMIN_EMAIL` or `ADMIN_USERNAME` is required | Unknown — Vercel auth required | Admin login identifier and email fallbacks | Yes as a pair with `ADMIN_USERNAME` |
| `ADMIN_USERNAME` | One of `ADMIN_EMAIL` or `ADMIN_USERNAME` is required | Unknown — Vercel auth required | Admin login identifier fallback | Yes as a pair with `ADMIN_EMAIL` |
| `ADMIN_PASSWORD` | Yes | Unknown — Vercel auth required | Admin authentication | Yes |
| `ADMIN_SESSION_SECRET` | Yes; at least 32 bytes in production | Unknown — Vercel auth required | Signed admin session cookies | Yes |
| `CUSTOMER_SESSION_SECRET` | Yes; at least 32 bytes in production | Unknown — Vercel auth required | Signed customer session cookies | Yes |
| `EMAIL_FROM` | Yes for reliable production delivery | Unknown — Vercel auth required | Transactional sender address | Yes |
| `ADMIN_ORDER_EMAIL` | Yes for order operations | Unknown — Vercel auth required | New-order notifications | Yes |
| `ADMIN_TRADE_IN_EMAIL` | Optional when the documented fallback is intentionally accepted | Unknown — Vercel auth required | Trade-in notifications | No if the fallback recipient is verified |
| `RESEND_API_KEY` | Yes | Unknown — Vercel auth required | Transactional email delivery | Yes |
| `STRIPE_SECRET_KEY` | Yes for checkout | Unknown — Vercel auth required | Checkout session creation and webhook validation | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No; not referenced by current runtime code | Unknown — Vercel auth required | Documented legacy/client configuration only | No |
| `STRIPE_WEBHOOK_SECRET` | Yes for checkout finalization | Unknown — Vercel auth required | `/api/webhooks/stripe` signature verification | Yes |
| `CLOUDINARY_CLOUD_NAME` | Yes for production uploads | Unknown — Vercel auth required | Product and trade-in uploads | Yes |
| `CLOUDINARY_API_KEY` | Yes for production uploads | Unknown — Vercel auth required | Product and trade-in uploads | Yes |
| `CLOUDINARY_API_SECRET` | Yes for production uploads | Unknown — Vercel auth required | Product and trade-in uploads | Yes |
| `CLOUDINARY_UPLOAD_FOLDER` | No; defaults to `shutterbug-products` | Unknown — Vercel auth required | Product upload organization | No |
| `CLOUDINARY_TRADE_IN_FOLDER` | No; defaults to `shutterbug-trade-ins` | Unknown — Vercel auth required | Trade-in upload organization | No |
| `NEXT_PUBLIC_AMAZON_STORE_URL` | No; a production fallback is coded | Unknown — Vercel auth required | Amazon storefront links | No |
| `TRADE_IN_PROMOTION_ENABLED` | Conditional business setting | Unknown — Vercel auth required | Trade-in offer display and valuation | Yes until the current promotion is confirmed; omission enables the default offer |
| `TRADE_IN_PROMOTION_STARTS_AT` | No | Unknown — Vercel auth required | Optional promotion start boundary | No |
| `TRADE_IN_PROMOTION_ENDS_AT` | No | Unknown — Vercel auth required | Optional promotion end boundary | No |
| `TRADE_IN_PROMOTION_ID` | No; default exists | Unknown — Vercel auth required | Promotion identity stored with trade-ins | No |
| `TRADE_IN_PROMOTION_LABEL` | No; default exists | Unknown — Vercel auth required | Customer-facing promotion label | No after business review |
| `TRADE_IN_PROMOTION_DESCRIPTION` | No; default exists | Unknown — Vercel auth required | Customer-facing promotion explanation | No after business review |

### Canonical production URL

**Static code audit: pass. Production environment verification: pending.** The application expects `https://www.shutterbugcamerashop.com`. The central SEO configuration fixes that hostname for canonical URLs, WebSite and Organization schema, sitemap URLs, robots sitemap reference, and Merchant feed links. Email links and Stripe return URLs use `NEXT_PUBLIC_SITE_URL` with the same domain as their code fallback and require HTTPS in production. `NEXT_PUBLIC_SITE_URL` still must be confirmed in Vercel Production scope before merge. The canonical domain was not changed.

### Database migration status

**Branch status: pass. Production status: unknown and blocking.** A fresh `origin/main...HEAD` comparison contains no Prisma schema or migration changes. `npx prisma migrate status` was not run because this checkout has no authenticated, confirmed production database configuration. Pointing Prisma at an unverified or previously shared connection string would not be a safe production read. No schema operation was attempted.

### Stripe configuration status

**Unknown and blocking.** Static code requires `STRIPE_SECRET_KEY` for checkout and both `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` at `/api/webhooks/stripe`. Webhook handling verifies the signature, amount, currency, payment state, and live/test alignment. The current code does not use `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`. Production key presence, live-versus-test mode, webhook secret, and the configured webhook destination cannot be verified without authenticated Vercel and Stripe project access. No charge or Stripe mutation was attempted.

### Resend configuration status

**Unknown and blocking.** Production email requires `RESEND_API_KEY`; `EMAIL_FROM` must be a verified production sender, and `ADMIN_ORDER_EMAIL` must reach the intended operator. Their presence and sender-domain verification could not be inspected. No email was sent.

### Cloudinary configuration status

**Unknown and blocking.** Production uploads require the Cloudinary cloud name, API key, and API secret. The optional product and trade-in folder names have safe code defaults. The storefront readiness rule accepts a product as photographed only when `actualPhotos` is confirmed and its HTTPS hero URL is a Cloudinary image-upload URL, matching the admin upload path. Credential presence and an actual production upload still require authenticated environment and operational testing. No upload was attempted.

### Secret rotation items

Documentation and conversation history still require owner review and rotation before a real launch for these categories only:

- database password/connection credentials;
- admin password;
- admin and customer session-signing secrets;
- Stripe secret and webhook secrets if they were ever shared outside the production secret manager;
- Resend API key if it was ever shared outside the production secret manager; and
- Cloudinary API secret if it was ever shared outside the production secret manager.

No secret was printed, retrieved, changed, or rotated during this audit.

### Pre-merge deployed smoke test

**Not run; blocking.** Without an accessible deployed-preview hostname, the required Home, Shop, Category, Brand, Printers, Login, Account redirect, Watchlist redirect, and Bag checks could not be performed against the deployed build. No deployed result, anonymous behavior, or absence of HTTP 500 responses is claimed.

### Remaining blockers

1. Authenticate to the Vercel project and obtain a scoped shareable preview URL or revocable automation bypass without weakening production protection globally.
2. Run the complete deployed breakpoint, redirect, empty-state, sample-inventory, unsupported-claim, and no-500 smoke suite.
3. Run deployed Lighthouse on the five required routes and record real scores and web-vital observations.
4. Verify every blocking production environment key and its Production scope without exposing values.
5. Confirm the intended production database and run read-only `npx prisma migrate status` against it.
6. Confirm Stripe mode alignment and webhook destination, Resend sender/domain configuration, and Cloudinary upload configuration in their provider dashboards.
7. Rotate all credential categories known or suspected to have been shared outside the production secret manager.

## Decision

**NOT READY**

The code and local validation remain ready for the final gate, but merge to `main` is blocked until deployed-preview QA, deployed Lighthouse, production environment verification, production migration status, provider configuration, and required secret rotation are completed. Production was not deployed and `main` was not changed.
