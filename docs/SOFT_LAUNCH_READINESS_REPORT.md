# Soft Launch Readiness Report

Date: 2026-10-16
Latest evidence update: 2026-10-20
Branch: `codex/soft-launch-inventory-strategy`  
Audited implementation commit: `cb66f4c` (`Harden soft launch publishing readiness`)  
Initial preview commit: `35ea133` (`Refine soft launch inventory experience`)  
Remote branch: `origin/codex/soft-launch-inventory-strategy`
Final deployment-gate HEAD: `4aed5fc89930385a649c1c5c67f8e7ac7e980de5`

## Preview deployment

GitHub reported successful Vercel deployments for the initial preview and subsequent readiness commits. The latest successful deployment dashboard associated with final gate HEAD `25d78e9` is:

`https://vercel.com/zachery-dante-fregolis-projects/shutterbug/DSsRq7BbmbtyAg9QEHkspuuysgR7`

Authenticated Vercel access was later established. The final audited preview is documented in the production-gate section below. Production was not deployed and `main` was not changed.

## Soft-launch UX

**Local and authenticated deployed status: pass.**

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

Local production UI was checked at widths 320, 360, 375, 390, 414, 430, 768, 1024, 1440, and 1920 pixels. The deployed preview was subsequently checked at those widths plus 1280 pixels across the 12 production-gate routes.

- No width produced document-level horizontal overflow.
- Carousel remained contained at every width.
- Mobile hero copy, actions, header, search, Bag, and navigation remained readable and available.
- Fresh Finds remained intentional and action-oriented.
- No fake `/shop/[slug]` cards appeared.
- Desktop heading widths and layout remained centered and contained.

The deployed matrix found one narrow `/shop` overflow, which was fixed and retested successfully at every required width.

## Accessibility

**Status: pass for reviewed controls and automated regressions.**

- Announcement dismiss control has an accessible name, native button keyboard behavior, and focus-visible styling.
- No announcement autofocus is used.
- Empty-state links use descriptive labels.
- Sold state and historical-price wording are visible text.
- Header, Bag, mobile menu, skip navigation, main landmark, signed-in/out account access, and watchlist return paths are covered by tests and local inspection.

No full third-party automated accessibility scan was available for the protected preview.

## Performance

The five required Lighthouse runs were completed anonymously against the single temporarily exempt immutable preview. Full scores and route-level findings are recorded in the final production gate below. The homepage's 3.7-second lab LCP and the repeated 4.11:1 muted-text contrast failure remain open. INP was not available from these Lighthouse lab runs; TBT is reported instead.

## Validation

Validation of the original audited implementation passed with 57 tests, lint, and a Next.js production build. The final-gate validation after the order-confirmation remediation is recorded below and supersedes those counts.

These commands were rerun after the implementation changes. The two subsequent `/shop` containment commits were also verified in the deployed preview at every required width.

## Migrations and environment

No Prisma schema or migration differs from `origin/main` on this branch. No database migration is required specifically for this merge.

Authenticated Vercel inspection of key names and scopes is recorded below. No value was exposed. Several required provider variables are absent and block merge.

## Remaining blockers

The authoritative remaining-blocker list is in the final production deployment gate below.

## Recommended production sequence

1. Clear every blocker in the final production deployment gate.
2. Run and record the protected-preview Lighthouse audits through a scoped access method.
3. Review and approve the branch diff.
4. Merge the branch to `main` only after the gate changes to **GO FOR MERGE**.
5. Allow the normal Vercel production deployment from `main`.
6. Smoke-test homepage, shop, priority categories/brands, account redirects, Bag, checkout start, sold behavior when available, and admin publishing guidance.
7. Validate the live Merchant feed, sitemap, and robots.txt.
8. Request Search Console reindexing for the homepage and priority category/model-family pages.
9. Begin loading genuine inventory through the readiness checklist.

## Final production deployment gate

Gate date: 2026-10-16
Audited runtime source HEAD: `4aed5fc89930385a649c1c5c67f8e7ac7e980de5` (`Contain nested shop media grid`)
Report-only deployment commit: `69ff56d9a106dfa719953983df117998b53c7133` (`Update authenticated production gate audit`)
Preview deployment dashboard: `https://vercel.com/zachery-dante-fregolis-projects/shutterbug/CHKEdhdWLvZtfj8gmE7b8UVizWJd`
QA preview hostname (exception removed 2026-10-17): `https://shutterbug-nyfwwq4kn-zachery-dante-fregolis-projects.vercel.app`

Production was not deployed and `main` was not changed.

### Preview access status

**Temporary single-deployment exception removed after owner approval.** The Vercel project still uses **Vercel Authentication**, **Require Log In**, with **Standard Protection**. The QA exception had applied only to `shutterbug-nyfwwq4kn-zachery-dante-fregolis-projects.vercel.app`, the immutable deployment for report commit `69ff56d`; it was removed on 2026-10-17 after anonymous QA and Lighthouse completed. The Unprotected Domains list is empty. No automation bypass secret was created, global protection was not disabled, and no production protection setting was changed. Anonymous requests to both the unique deployment hostname and `shutterbug-git-codex-sof-b1cb02-zachery-dante-fregolis-projects.vercel.app` now return HTTP 302 redirects to Vercel authentication, confirming that the immutable deployment and branch/future preview policy are protected again.

Preflight confirmed that application-level access controls remain in place: `/admin` redirects to `/admin/login`; all admin pages and mutations require the signed admin session; account pages redirect signed-out users to login; order confirmation requires customer ownership or a guest access token; trade-in data and images require customer ownership or admin authorization; protected source maps remain enabled; and the built client assets contain none of the audited server-secret variable names. Deployment protection has now also been restored.

### Deployed breakpoint and smoke QA

**Authenticated deployed status: pass.** The preview was checked across 132 route/width combinations: 12 routes at 320, 360, 375, 390, 414, 430, 768, 1024, 1280, 1440, and 1920 pixels.

Routes checked:

- `/`
- `/shop`
- `/categories/digital-cameras`
- `/categories/vintage-digital-cameras`
- `/categories/canon-powershot-cameras`
- `/brands/canon`
- `/categories/printers`
- `/sell-your-camera`
- `/login`
- `/account`
- `/account/watchlist`
- `/bag`

Results:

- Main content, site search, and Bag access were present.
- No route rendered an HTTP 500 page, framework error, debug panel, stale `Cart` label, or stale `Admin` header control.
- `/account` and `/account/watchlist` redirected signed-out users to `/login` at every width.
- The announcement dismissal remained dismissed after client hydration and reload.
- Empty inventory rendered the intentional stocking state and no fabricated product cards.
- No genuine sold product existed in the connected data, so sold-state visual QA was not fabricated.
- The first deployed matrix found an 8-pixel horizontal overflow on `/shop` at 320 pixels. Commits `6a47e45` and `4aed5fc` constrained the hero and nested media grid. The final deployment was retested on `/shop` at all 11 required widths; `scrollWidth` equaled `clientWidth` at every width, including 305/305 CSS pixels in the 320-pixel viewport.

### Lighthouse

**Complete. Run anonymously with Lighthouse 13.5.0 against the temporary deployment exception on the immutable `69ff56d` preview.** Mobile-mode lab results:

| Route | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT | INP |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `/` | 89 | 96 | 100 | 69 | 3.7 s | 0 | 50 ms | Not measured in this lab run |
| `/shop` | 98 | 96 | 100 | 69 | 2.4 s | 0 | 30 ms | Not measured in this lab run |
| `/categories/digital-cameras` | 98 | 96 | 100 | 69 | 2.2 s | 0 | 30 ms | Not measured in this lab run |
| `/categories/printers` | 99 | 96 | 100 | 69 | 2.2 s | 0 | 30 ms | Not measured in this lab run |
| `/brands/canon` | 99 | 96 | 100 | 69 | 2.2 s | 0 | 40 ms | Not measured in this lab run |

INP was not measured by these Lighthouse lab runs, so TBT is the available responsiveness proxy. All five TBT values are low (30-50 ms) and all CLS values are 0.

Route-level opportunities and warnings:

- `/`: the 3.7-second LCP is the only material performance weakness in the five-run set and is above the 2.5-second good threshold. Accessibility lost four points because muted soft-launch/support text measured 4.11:1 against cream where 4.5:1 is required. The preview-only `X-Robots-Tag: noindex` caps SEO at 69. Best Practices is 100; CLS is 0 and TBT is 50 ms.
- `/shop`: LCP is 2.4 seconds, close to the 2.5-second good threshold but still within it. Muted explanatory copy has the same 4.11:1 contrast failure. The preview `noindex` caps SEO at 69. No additional major Best Practices or performance warning was present in the retained run evidence; CLS is 0 and TBT is 30 ms.
- `/categories/digital-cameras`: LCP is 2.2 seconds, CLS is 0, and TBT is 30 ms. Breadcrumb/muted text has the same contrast failure, and preview `noindex` caps SEO. The first capture reported a missing meta description and scored SEO 58; server HTML contained the description and a clean rerun passed that audit and scored 69. The table reports the clean rerun and does not hide the initial warning.
- `/categories/printers`: LCP is 2.2 seconds, CLS is 0, and TBT is 30 ms. Breadcrumb/muted text contrast and preview `noindex` are the material warnings. No additional major opportunity was present in the retained run evidence; Best Practices is 100.
- `/brands/canon`: LCP is 2.2 seconds, CLS is 0, and TBT is 40 ms. Breadcrumb/muted text contrast and preview `noindex` are the material warnings. No additional major opportunity was present in the retained run evidence; Best Practices is 100.

The SEO score is therefore not a production SEO measurement: Vercel deliberately marks preview deployments `noindex`. Production headers still require a post-launch verification. The contrast and homepage LCP findings are real and remain blockers unless explicitly accepted.

### Anonymous access and order-confirmation investigation

**Immutable-preview probe completed; result contained one controlled-safety defect.** On the exempt `69ff56d` hostname, `/` and `/shop` returned 200, `/admin` redirected to `/admin/login`, `/account` redirected to `/login?returnTo=%2Faccount`, and `/api/trade-ins/images/synthetic-nonexistent-image` returned 401. No real customer identifier, order, payment, or private image was used.

The failing request was:

`GET /api/orders/confirmation?session_id=nonexistent-security-check`

The `session_id` was an intentionally synthetic non-customer value. The request intentionally omitted the `access` guest token, had no path token, carried no authenticated customer cookie, and created no payment. It returned HTTP 500 with an empty body, so no customer details, order facts, secrets, or database diagnostic were returned to the caller.

Vercel runtime logs identified the exact root cause as Prisma `P2022` in `prisma.order.findFirst()`: the connected preview database does not contain `Order.stripeRefundId`. That column is created by `prisma/migrations/20260814183000_security_inventory_reservations/migration.sql`. Prisma's implicit full `Order` selection requested the missing, confirmation-unrelated column before the route could decide that the synthetic order did not exist. The same exception can affect a legitimate signed-in customer or guest confirmation because every lookup used that full selection. The runtime log contained the Prisma code, missing schema column, generated chunk stack, and client version, but no session value, access token, customer identifier, or order data. The HTTP response contained none of the log details.

The local remediation is deliberately limited to this failure path:

- confirmation queries select only the fields needed for access control and the customer response, excluding `stripeRefundId`;
- empty or overlong session values stop before database access;
- nonexistent orders and existing-but-unauthorized orders return the same generic 404 body, so the endpoint does not reveal whether another customer's order exists;
- database, session, or schema lookup exceptions become a generic 503 with `private, no-store` caching and the constant server log `Order confirmation lookup unavailable.`; no identifier, token, exception, SQL, or schema detail is logged by the route;
- the customer-facing `/checkout/success` loader uses the same guarded lookup and renders its existing safe confirmation-pending state instead of a framework 500; and
- the production migration was mandatory and has now been applied. The reduced selection remains defense in depth rather than a substitute for schema consistency.

Regression coverage in `tests/order-confirmation-lookup.test.mjs` verifies malformed input does not query storage, nonexistent and unauthorized results are indistinguishable, owner and guest-token access work, thrown database errors collapse to a detail-free unavailable result, and the public confirmation selection excludes `stripeRefundId`. On 2026-10-20 the complete suite passed with 62 tests and 0 failures, and ESLint completed with no errors.

The post-fix route probe first ran locally without a database and was then repeated against a local application connected to the migrated rehearsal clone. The pushed fix also produced protected Vercel Preview deployment `CZDKtscdAWDp6hmXwab8TgjFQBJV` (`shutterbug-apm7a5zot-zachery-dante-fregolis-projects.vercel.app`) from commit `976fe03`; it is a Preview deployment, not Production. Anonymous access remains blocked by Vercel SSO. An authenticated inspection of that fixed preview returned the same generic 404 for both missing and synthetic nonexistent confirmation sessions, and Vercel request logs recorded 404 rather than 500.

| Route | Result | Expected control |
| --- | --- | --- |
| `/` | 200 | Public storefront |
| `/shop` | 200 | Public storefront |
| `/admin` | 307 to `/admin/login` | Admin protected |
| `/account` | 307 to `/login?returnTo=%2Faccount` | Account protected |
| `/api/orders/confirmation` | 404 | Missing session fails without storage access |
| `/api/orders/confirmation?session_id=nonexistent-security-check` | 503 JSON, no 500 | Local database intentionally unconfigured; operational failure is controlled and detail-free |
| `/checkout/success` | 200 | Safe customer-facing pending/not-found state |
| `/checkout/success?session_id=nonexistent-security-check` | 200 | Safe customer-facing pending state when lookup is unavailable |
| `/api/trade-ins/images/synthetic-nonexistent-image` | 401 | Private asset protected |

The migrated rehearsal application produced the stronger database-connected result: `/` and `/shop` returned 200; `/account`, `/account/watchlist`, and `/admin` redirected to their login routes; `/google-merchant-feed.xml` returned 200; missing and synthetic nonexistent confirmation requests both returned `404 {"error":"Order not found."}`; an unauthenticated trade-in collection GET returned 405 because the route intentionally exposes POST only; and a synthetic private trade-in image returned 401. No real customer identifier, order, image, or payment was used, and no write endpoint was called. The original immutable `69ff56d` preview still contains the historical 500 and remains useful only as retained evidence; the fixed `976fe03` preview is the current regression evidence.

### Validation

- `npm test`: passed, 62 tests passed, 0 failed, exit code 0.
- `npm run lint`: passed with no ESLint errors, exit code 0.
- `npm run build`: passed again on 2026-10-20, exit code 0, after selecting Next.js 16.4.0's documented `experimental.turbopackPluginRuntimeStrategy: 'workerThreads'`. The earlier error was isolated to Turbopack's child-process PostCSS/plugin runtime on this Windows worker. After the temporary rehearsal dev server was stopped to release its `.next` log handle, the exact command compiled with Turbopack in 2.9 seconds, passed TypeScript in 4.2 seconds, and generated all 127 static pages. No Windows-only path or configuration was added and no webpack fallback was used for this successful result.
- Vercel's Preview build for commit `976fe03` is Ready, completed in 40 seconds, and its build log reports `Build Completed in /vercel/output [19s]` followed by `Deployment completed`. This verifies the same checked-in worker-thread configuration in Vercel's build environment. The deployment summary reports Next.js 16.4.0, 127 static assets, and 76 functions.
- `next-env.d.ts` is generated by Next.js. `next dev` points its route imports at `.next/dev/types`, while `next build` rewrites them to `.next/types`; the Next.js 16.4 documentation says the file is managed by Next.js and should not be edited manually. The build-only rewrite was restored and is not part of this report change.
- Supplementary `next build --webpack`: passed, exit code 0. It compiled successfully, TypeScript passed, and 127 static pages were generated. This earlier fallback result independently corroborates the code and type checks; the required Turbopack command now passes as recorded above.
- `git diff --check`: passed, exit code 0. Git emitted only the existing Windows LF-to-CRLF working-copy warning for this Markdown file.
- Final deployed `/shop` responsive matrix: 11/11 widths passed without document overflow.
- Anonymous smoke test: all ten public routes returned 200; `/account` and `/account/watchlist` returned 307 redirects to their login return paths.
- Anonymous guard test: `/admin` redirected to `/admin/login`; a private trade-in image request returned 401.
- The immutable-preview order-confirmation probe returned an empty 500; Vercel logs established the missing `Order.stripeRefundId` migration as the root cause. The fixed Preview from `976fe03` is Ready and returns controlled 404s for missing/nonexistent confirmation access when inspected through the authenticated Vercel session; anonymous access is blocked by Deployment Protection.
- Lighthouse 13.5.0 completed without runtime errors on all five required routes.
- Branch and remote HEAD matched at report commit `69ff56d9a106dfa719953983df117998b53c7133` before this Lighthouse/report update; the audited runtime source remained `4aed5fc89930385a649c1c5c67f8e7ac7e980de5`.

### Production environment checklist

Authenticated Vercel inspection recorded names and scopes only. Existing secret values are write-only in the Vercel editor and were not revealed. Variables marked present are scoped to **Production and Preview**.

| VARIABLE NAME | PRODUCTION STATUS | BLOCKING? | NOTES |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Present | Yes until exact write-only value is owner-confirmed | Used by email and Stripe return URLs. Vercel and live-output checks prove the intended domain is active, but the saved secret value cannot be revealed for comparison. |
| `DATABASE_URL` | Present | No for runtime | Used by Prisma runtime. The production target was migrated through a credential that was transferred without exposing its value. |
| `DIRECT_URL` | Absent | No for runtime | Prisma CLI used the validated production connection supplied only through an ignored local file for the approved migration run. |
| `ADMIN_EMAIL` | Present | No | Admin identifier and notification fallback. |
| `ADMIN_USERNAME` | Present | No | Admin identifier fallback. |
| `ADMIN_PASSWORD` | Present | No after rotation review | Required for admin authentication. |
| `ADMIN_SESSION_SECRET` | Present | No after rotation/length review | Must be at least 32 bytes in production. |
| `CUSTOMER_SESSION_SECRET` | Present | No after rotation/length review | Must be at least 32 bytes in production. |
| `EMAIL_FROM` | Absent | Yes | A verified production sender is required. |
| `ADMIN_ORDER_EMAIL` | Absent | Yes | Required for reliable order operations rather than relying on fallback behavior. |
| `ADMIN_TRADE_IN_EMAIL` | Absent | No if the documented `ADMIN_EMAIL` fallback is intentionally accepted | Trade-in notification recipient. |
| `RESEND_API_KEY` | Present | Yes until sender and recipient configuration is complete | No email was sent. |
| `STRIPE_SECRET_KEY` | Absent | Yes | Required for checkout session creation. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Absent | No for the current implementation | The current checkout creates hosted Checkout sessions server-side and never references this variable. Add a mode-matched publishable key before introducing Stripe.js client code. |
| `STRIPE_WEBHOOK_SECRET` | Absent | Yes | Required for verified checkout finalization. |
| `CLOUDINARY_CLOUD_NAME` | Absent | Yes | Required for production product and trade-in uploads. |
| `CLOUDINARY_API_KEY` | Absent | Yes | Required for production uploads. |
| `CLOUDINARY_API_SECRET` | Absent | Yes | Required for production uploads. |
| `CLOUDINARY_UPLOAD_FOLDER` | Absent | No | Defaults to `shutterbug-products`. |
| `CLOUDINARY_TRADE_IN_FOLDER` | Absent | No | Defaults to `shutterbug-trade-ins`. |
| `NEXT_PUBLIC_AMAZON_STORE_URL` | Absent | No | A production storefront fallback is coded. |
| `TRADE_IN_PROMOTION_ENABLED` | Absent | Yes until business approval | Omission enables the default store-credit offer. |
| `TRADE_IN_PROMOTION_STARTS_AT` | Absent | No | Optional schedule boundary. |
| `TRADE_IN_PROMOTION_ENDS_AT` | Absent | No | Optional schedule boundary. |
| `TRADE_IN_PROMOTION_ID` | Absent | No | Code default exists. |
| `TRADE_IN_PROMOTION_LABEL` | Absent | No after business review | Code default exists. |
| `TRADE_IN_PROMOTION_DESCRIPTION` | Absent | No after business review | Code default exists. |

### Canonical production URL

**Live/static host audit: pass; write-only environment value confirmation remains pending.** Vercel lists `www.shutterbugcamerashop.com` as the valid Production domain and redirects the apex domain to it with HTTP 308. Live GETs returned 200 for the homepage, robots, sitemap, and Merchant feed. The homepage canonical, Organization JSON-LD, WebSite JSON-LD and search target use `https://www.shutterbugcamerashop.com`; robots points to that sitemap; sitemap and Merchant feed URLs stay on that hostname. Source uses the same central hostname for canonical metadata and uses `NEXT_PUBLIC_SITE_URL` for Stripe success/cancel URLs and order/email links, with the central hostname as fallback. `NEXT_PUBLIC_SITE_URL` exists in Vercel Production and Preview as a write-only secret, so its exact saved value could not be compared. The owner must confirm or re-enter the expected HTTPS value before the provider gate closes.

### Database migration status

**Production migration complete; schema-drift blocker closed.** Authenticated inspection confirmed the target as Neon project `shuttbug` (`flat-base-16798381`), branch `main` (`br-steep-dew-au9p5zh5`), database `neondb`, schema `public`, PostgreSQL 17. Before the approved run, the production ledger contained 12 finished, non-rolled-back migrations and omitted exactly these three checked-in directories:

1. `20260814183000_security_inventory_reservations`
2. `20260825120000_google_merchant_identifiers`
3. `20260918090000_trade_in_experience`

The later `20260919120000_customer_model_watchlist` migration was already recorded as applied. Before rehearsal, metadata confirmed the missing columns and tables were also absent, so this was ledger and schema drift rather than an already-applied schema change with only a missing ledger record. No customer, order, or product row contents were queried.

#### SQL impact and safety audit

- `20260814183000_security_inventory_reservations` adds `Product.reservedQuantity INTEGER NOT NULL DEFAULT 0`; adds nullable `Order.reservationExpiresAt`, `Order.inventoryReleasedAt`, and `Order.stripeRefundId`; creates the nullable-column unique index `Order_stripeRefundId_key`; creates `StripeWebhookEvent` with its primary key, `orderId` index, and nullable `Order` foreign key using `ON DELETE SET NULL`; and adds nonnegative, stock-bound, component-total, quantity, and line-total check constraints to existing `Product`, `Order`, and `OrderItem` rows. It has no data backfill and no destructive statement. The new `NOT NULL` product field has a safe default. The important risk is validation of the new checks against existing rows; the new refund unique index cannot conflict at creation because the new column starts null for all existing rows.
- `20260825120000_google_merchant_identifiers` adds nullable `Product.gtin` and `Product.mpn`. It creates no table, index, unique constraint, foreign key, default, `NOT NULL` change, or backfill. It is fully additive and depends only on the existing `Product` table.
- `20260918090000_trade_in_experience` creates six trade-in enum types and four new tables: `TradeInSubmission`, `TradeInImage`, `TradeInOffer`, and `TradeInStatusEvent`. It creates the unique `TradeInSubmission.reference` index plus customer/status/image/offer/history lookup indexes. Its foreign keys reference existing `Customer` and the new submission table with `ON DELETE CASCADE`. Defaults cover draft status, text fields, quantity, arrays, offer kind/status, actor, sort order, and creation timestamps. `updatedAt` and several identity/storage fields are required without database defaults, but only on new empty tables and are supplied by the application. It performs no backfill and changes no existing column.

None of the three migrations contains `DROP TABLE`, `DROP COLUMN`, `ALTER TYPE`, a required existing-table column without a default, or a data migration. The first depends on `Product`, `Order`, and `OrderItem`; the second depends on `Product`; the third depends on `Customer`. The later watchlist migration is independent. The rehearsal proves the existing production snapshot satisfies every newly validated check and foreign-key prerequisite as of clone creation.

#### Migration-history gap evidence

Git history shows the security migration was introduced in commit `8007f2d` on 2026-08-23, merchant identifiers in `513027d` on 2026-08-25, trade-ins in `77f625c` on 2026-09-18, and the later applied watchlist migration in `1408153` on 2026-09-19. The repository has no checked-in GitHub Actions workflow or deployment script that selectively applies migrations; its only migration command is `prisma migrate deploy`. A normal deploy from a checkout containing all 15 migrations would have applied the three gaps before the watchlist migration. A Prisma `migrate resolve --applied` for these exact migrations would also have left ledger records, which are absent. The catalogs show their schema objects were absent as well, so manual application of these migrations is not supported by the evidence. The available repository and ledger evidence therefore proves that the later migration reached production without a normal complete deploy over the current migration directory, but it does not identify whether an older deployment artifact, selective procedure, branch divergence, or another historical workflow caused it. No unsupported cause is asserted.

#### Neon rehearsal

A temporary Neon branch named `migration-rehearsal-20261020` (`br-calm-sea-auxtv7r5`) was created from the current production `main` branch with data and schema at the current parent LSN. It expires automatically on 2026-10-21. Its credential was held only in an ignored local env file, was not printed, and was removed after verification.

Initial command and result:

```text
npx prisma migrate status
15 migrations found; exactly the three migrations above were pending.
```

Rehearsal command and execution order:

```text
npx prisma migrate deploy
20260814183000_security_inventory_reservations
20260825120000_google_merchant_identifiers
20260918090000_trade_in_experience
All migrations have been successfully applied.
```

The post-rehearsal `npx prisma migrate status` returned `Database schema is up to date!` with exit code 0. The three ledger rows are finished, not rolled back, and each records one applied step. Metadata confirmed `Order.stripeRefundId`, reservation timestamps, `Product.reservedQuantity`, `Product.gtin`, `Product.mpn`, `StripeWebhookEvent`, all four trade-in tables, their intended indexes, foreign keys, enum-backed columns, defaults, and checks. Existing critical tables remained present: customer/auth records, verification tokens, likes, watchlist, products and images, orders and items, order events, payment identifiers, reservation fields, and webhook events. Customer sessions and admin authentication are cookie/environment based in this application rather than separate database tables; inventory reservations are represented by the new product/order fields rather than a standalone reservation table.

The application was then run locally against the migrated clone. Public catalog and Merchant feed reads succeeded; account, watchlist, admin, and trade-in-image access controls behaved correctly; the confirmation route returned controlled generic 404s; and the 62-test suite covered inventory/payment lifecycle, confirmation, Merchant feed, trade-in, auth, and watchlist behavior with 62 passes and 0 failures. No real payment, write endpoint, customer identifier, order identifier, or private row content was used.

#### Production migration execution and recovery

On 2026-10-21, the explicitly approved procedure was applied exactly as rehearsed. Before production was modified, a fresh Neon recovery branch named `production-recovery-pre-migration-20261020` (`br-aged-morning-auqicpal`) was created from production `main`. Its automatic deletion is set to **Never**. Keep it until the subsequent production application deployment has been verified.

The metadata-only production preflight reported database `neondb`, schema `public`, 15 checked-in migrations, and exactly the following pending set in this order:

```text
20260814183000_security_inventory_reservations
20260825120000_google_merchant_identifiers
20260918090000_trade_in_experience
```

`npx prisma migrate deploy` then applied those three migrations in that order and returned `All migrations have been successfully applied.` with exit code 0. No manual SQL was executed and `_prisma_migrations` was not edited. The immediate follow-up `npx prisma migrate status` returned `Database schema is up to date!` with exit code 0.

Metadata-only verification passed with no missing expected objects. It confirmed the reservation/refund fields, Merchant `gtin` and `mpn`, `StripeWebhookEvent`, all seven trade-in enum types, all four trade-in tables, their indexes and foreign keys, the new financial/inventory checks, and finished ledger records for all three migrations. Existing critical customer/auth, verification-token, likes, watchlist, product/image, order/item, order-status, and migration-ledger tables remained present. No customer, order, product, or trade-in row data was queried.

The application was run locally against the migrated production schema for GET-only synthetic smoke tests. Results were:

| Probe | Result |
|---|---|
| `/` | 200 |
| `/shop` | 200 |
| `/google-merchant-feed.xml` | 200 XML |
| `/account` | 307 to `/login?returnTo=%2Faccount` |
| `/account/watchlist` | 307 to `/login?returnTo=%2Faccount%2Fwatchlist` |
| `/admin` | 307 to `/admin/login` |
| missing order confirmation | 404 `Order not found.` |
| synthetic nonexistent order confirmation | 404 `Order not found.` |
| synthetic private trade-in image | 401 `Sign in required.` |

No payment was created, no write endpoint was called, no customer/order identifier was used, and no inventory or trade-in record was modified. The production database credential was transferred through a loopback-only handoff into an ignored local file without being printed. The recovery branch remains intact. There are no down migrations; if a later production application deployment reveals a material schema-related regression, use the retained recovery branch or point-in-time restore under a separately approved incident procedure.

### Stripe configuration status

**BLOCKING — not configured.** Authenticated Vercel inspection found `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, and `STRIPE_WEBHOOK_SECRET` absent from Production and Preview. With no secret or publishable key, live/test mode cannot be classified and same-mode consistency cannot be verified. The absent publishable key does not break the current server-created hosted Checkout flow because the runtime does not reference it; the absent secret key does block Checkout-session creation.

The application webhook route is `POST /api/webhooks/stripe`. A GET-only probe of `https://www.shutterbugcamerashop.com/api/webhooks/stripe` returned 405, confirming the route exists on the intended production hostname without sending an event. The route requires a Stripe signature and `STRIPE_WEBHOOK_SECRET`, rejects invalid signatures, validates payment amount/currency/status and event live mode, and de-duplicates recorded Stripe event IDs. Relevant handled events are:

- `checkout.session.completed`;
- `checkout.session.async_payment_succeeded`;
- `checkout.session.expired`; and
- `checkout.session.async_payment_failed`.

The Stripe Dashboard was not authenticated in the audit browser, so provider-side endpoint registration, selected event subscriptions, and the destination URL could not be verified. The missing signing secret independently proves that the production webhook integration is not ready. No charge, Checkout session, webhook event, or Stripe mutation was created.

### Resend configuration status

**BLOCKING — partially configured.** `RESEND_API_KEY` exists in Vercel Production and Preview. `EMAIL_FROM` and `ADMIN_ORDER_EMAIL` are absent. The required sender is `Shutterbug Camera Shop <support@shutterbugcamerashop.com>`; without `EMAIL_FROM`, runtime code falls back to the general support address rather than that required identity. Without `ADMIN_ORDER_EMAIL`, paid-order notifications fall back to `ADMIN_EMAIL` or the general support address instead of an explicitly approved operations inbox.

Public DNS has the common Resend DKIM, sending-subdomain MX/TXT, root TXT, and DMARC records, which is consistent with domain setup. The Resend Dashboard was not authenticated in the audit browser, so its authoritative **Verified** state, API-key account ownership, and sender authorization could not be confirmed. No email was sent. A controlled owner-only test remains prohibited until separately approved.

### Cloudinary configuration status

**BLOCKING — not configured.** `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are absent from Vercel Production and Preview, so server product uploads and authenticated trade-in-image delivery cannot authenticate. Product upload code returns 503 before accepting a file when these variables are absent. The Cloudinary Dashboard was not authenticated in the audit browser, and no upload or deletion was attempted.

The readiness rules remain compatible with Cloudinary-only inventory photography. A real product image must be HTTPS, hosted exactly on `res.cloudinary.com`, contain `/image/upload/`, avoid SVG/placeholder naming, and have `actualPhotos` confirmed. Local category/clay artwork, generic local images, placeholders, and arbitrary third-party URLs do not qualify. The Merchant feed applies the same rule to the hero image and additional gallery images, so decorative category artwork cannot make a product storefront- or feed-ready.

The focused catalog/security regression run passed 13 of 13 tests, including placeholder rejection, Cloudinary-only real-photo qualification, safe image URL handling, and Stripe live/test mismatch rejection.

### Secret rotation items

Repository history contains only `.env.example` and placeholder/example Stripe, webhook, and Resend forms; no real-looking tracked provider secret was found. The known production database connection string was previously shared outside the secret manager, so its credential requires rotation. Existing Vercel values were not revealed during this audit.

| SECRET CATEGORY | ROTATION REQUIRED? | WHY | WHERE IT MUST BE UPDATED | VERIFICATION STEP |
|---|---|---|---|---|
| Neon/database credentials | **Yes** | The production connection credential was previously exposed outside the secret manager. | Rotate the Neon role/password, then update `DATABASE_URL` and affected Neon integration connection variables in Vercel Production/Preview and any approved local secret store. | `prisma migrate status` metadata check plus GET-only storefront/account/order-confirmation smoke checks; keep the recovery branch until application production is verified. |
| Stripe secret key | No current key; provision a fresh live key | Vercel has no `STRIPE_SECRET_KEY`; there is nothing active in this project to rotate. | Stripe live-mode restricted/secret key and Vercel Production. | Confirm `sk_live_` classification without displaying it, then compare mode with the publishable key and perform a separately approved non-charge configuration test. |
| Stripe webhook signing secret | No current secret; create/configure after endpoint registration | Vercel has no `STRIPE_WEBHOOK_SECRET`, and provider-side endpoint registration is unverified. | Stripe live webhook endpoint and Vercel Production. | Confirm the destination is the intended HTTPS route and verify one separately approved signed test event without exposing the secret. |
| Resend API key | Conditional | A production key exists and no exposure was found in repository history or this audit; account ownership/age and prior sharing remain unverified. | Resend API Keys and Vercel `RESEND_API_KEY` if provenance is uncertain or it was shared. | Confirm the replacement is active through an owner-approved inbox-only test, then revoke the prior key. |
| `ADMIN_PASSWORD` | Conditional | Present as a write-only Vercel secret; no known exposure was found, but reuse, age, and provenance were not verifiable. | Vercel Production/Preview and the owner's password manager. | Confirm old credentials fail and approved admin login succeeds; do not expose the password. |
| `ADMIN_SESSION_SECRET` | Conditional | Present with no known exposure; exact length and generation provenance are write-only. Rotation invalidates admin sessions. | Vercel Production/Preview. | Confirm at least 32 random bytes, redeploy only when approved, and verify existing sessions are invalidated and fresh login succeeds. |
| `CUSTOMER_SESSION_SECRET` | Conditional | Present with no known exposure; exact length and generation provenance are write-only. Rotation invalidates customer sessions. | Vercel Production/Preview. | Confirm at least 32 random bytes, redeploy only when approved, and verify existing sessions are invalidated and fresh customer login succeeds. |
| Cloudinary API secret | No current secret; provision fresh credentials | Vercel has no Cloudinary credentials, and no Cloudinary secret exposure was found. | Cloudinary API Keys and Vercel Production/Preview. | Use a separately approved synthetic owner-controlled upload, verify the returned HTTPS Cloudinary URL and authenticated trade-in delivery, then delete the synthetic asset only with approval. |

No secret was printed, changed, or rotated. Temporary migration credentials were deleted after their respective verification runs.

### Local commit audit

The branch was exactly two commits ahead of `origin/codex/soft-launch-inventory-strategy` before this report update:

- `b640153 Document production migration rehearsal` — changes only `docs/SOFT_LAUNCH_READINESS_REPORT.md` with the production-clone rehearsal, metadata verification, safe smoke results, and migration procedure.
- `b58117d Document production migration completion` — changes only the same report with the approved production migration, retained recovery branch, final Prisma status, metadata evidence, and read-only smoke results.

The order-confirmation hardening, five regression tests, and Turbopack worker-thread configuration are in `976fe03`, which is already the remote branch HEAD and therefore is not one of the two local-only commits. No generated `next-env.d.ts` change is present.

### Remaining blockers

1. Provision live-mode `STRIPE_SECRET_KEY`, register the production webhook at `https://www.shutterbugcamerashop.com/api/webhooks/stripe`, add its signing secret, and verify key/webhook live-mode alignment. Add a mode-matched publishable key if Stripe.js client code is introduced.
2. Configure all three Cloudinary credentials and verify owner-controlled product and private trade-in-image flows through a separately approved synthetic test.
3. Set `EMAIL_FROM` to `Shutterbug Camera Shop <support@shutterbugcamerashop.com>`, configure the approved `ADMIN_ORDER_EMAIL`, confirm the Resend domain is Verified, and request approval before an owner-only test email.
4. Rotate the known-exposed Neon/database credential and update every dependent Vercel/Neon integration variable; review conditional rotations in the table above.
5. Owner-confirm or re-enter the write-only `NEXT_PUBLIC_SITE_URL` as exactly `https://www.shutterbugcamerashop.com`.
6. Explicitly approve or disable the default trade-in promotion through production configuration.
7. Raise the identified muted text and breadcrumb contrast from 4.11:1 to at least 4.5:1 and rerun Accessibility.
8. Improve or explicitly accept the homepage's 3.7-second lab LCP before changing the gate to **GO FOR MERGE**.
9. Visually verify the sold-product state when a genuine sold record exists.

## Decision

**NOT READY**

Deployed QA and all five Lighthouse runs are complete for immutable preview commit `69ff56d`, and their weak results are recorded above. The order-confirmation root cause is proven; the defensive fix has five regression tests, behaves correctly against the migrated rehearsal clone, and is present in Ready protected Preview deployment `CZDKtscdAWDp6hmXwab8TgjFQBJV` from commit `976fe03`. The exact Turbopack build passes locally and in Vercel, and the production database/schema-drift blocker is closed. The provider gate is **BLOCKED**: Stripe secret/webhook configuration is absent and the provider endpoint registration cannot be verified; all required Cloudinary credentials are absent; Resend lacks the required sender and admin destination and its dashboard verification state is unconfirmed; the exposed database credential requires rotation; and the write-only `NEXT_PUBLIC_SITE_URL` still needs owner confirmation. Trade-in promotion configuration, Lighthouse contrast/LCP findings, and sold-state verification also remain. Application production was not deployed, Git `main` was not changed, and Deployment Protection remains enabled.
