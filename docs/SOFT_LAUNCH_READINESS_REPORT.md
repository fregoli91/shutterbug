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
- the production migration remains mandatory. The reduced selection is resilience, not a substitute for applying the missing migration.

Regression coverage in `tests/order-confirmation-lookup.test.mjs` verifies malformed input does not query storage, nonexistent and unauthorized results are indistinguishable, owner and guest-token access work, thrown database errors collapse to a detail-free unavailable result, and the public confirmation selection excludes `stripeRefundId`. On 2026-10-20 the complete suite passed with 62 tests and 0 failures, and ESLint completed with no errors.

The post-fix anonymous probe ran locally because the user required the immutable `69ff56d` deployment to remain unchanged and prohibited a deployment:

| Route | Result | Expected control |
| --- | --- | --- |
| `/` | 200 | Public storefront |
| `/shop` | 200 | Public storefront |
| `/admin` | 307 to `/admin/login` | Admin protected |
| `/account` | 307 to `/login?returnTo=%2Faccount` | Account protected |
| `/api/orders/confirmation` | 404 | Missing session fails without storage access |
| `/api/orders/confirmation?session_id=nonexistent-security-check` | 503 JSON, no 500 | Local database is intentionally unconfigured; operational failure is controlled and detail-free |
| `/checkout/success` | 200 | Safe customer-facing pending/not-found state |
| `/checkout/success?session_id=nonexistent-security-check` | 200 | Safe customer-facing pending state when lookup is unavailable |
| `/api/trade-ins/images/synthetic-nonexistent-image` | 401 | Private asset protected |

Because no fixed deployment was authorized, the immutable preview still contains the original 500 behavior. A new deployed regression probe must be performed after the migration and code fix are deployed to a separately approved preview.

### Validation

- `npm test`: passed, 62 tests passed, 0 failed, exit code 0.
- `npm run lint`: passed with no ESLint errors, exit code 0.
- `npm run build`: passed on 2026-10-20, exit code 0, after selecting Next.js 16.4.0's documented `experimental.turbopackPluginRuntimeStrategy: 'workerThreads'`. The earlier error was isolated to Turbopack's child-process PostCSS/plugin runtime on this Windows worker. The first restricted run with worker threads progressed past that failure and then correctly exposed a sandbox-only inability to create Turbopack's workspace-local Prisma junction. The same standard command outside the restricted filesystem sandbox compiled with Turbopack in 2.5 seconds, passed TypeScript, and generated all 127 static pages. No webpack fallback was used for this successful result.
- Supplementary `next build --webpack`: passed, exit code 0. It compiled successfully, TypeScript passed, and 127 static pages were generated. This earlier fallback result independently corroborates the code and type checks; the required Turbopack command now passes as recorded above.
- `git diff --check`: passed, exit code 0. Git emitted only the existing Windows LF-to-CRLF working-copy warning for this Markdown file.
- Final deployed `/shop` responsive matrix: 11/11 widths passed without document overflow.
- Anonymous smoke test: all ten public routes returned 200; `/account` and `/account/watchlist` returned 307 redirects to their login return paths.
- Anonymous guard test: `/admin` redirected to `/admin/login`; a private trade-in image request returned 401.
- The immutable-preview order-confirmation probe returned an empty 500; Vercel logs established the missing `Order.stripeRefundId` migration as the root cause. Local regression behavior is controlled as documented above, but it has not been deployed.
- Lighthouse 13.5.0 completed without runtime errors on all five required routes.
- Branch and remote HEAD matched at report commit `69ff56d9a106dfa719953983df117998b53c7133` before this Lighthouse/report update; the audited runtime source remained `4aed5fc89930385a649c1c5c67f8e7ac7e980de5`.

### Production environment checklist

Authenticated Vercel inspection recorded names and scopes only. No value was displayed or copied. Variables marked present are scoped to **Production and Preview**.

| VARIABLE NAME | PRODUCTION STATUS | BLOCKING? | NOTES |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Present | No after value/domain owner verification | Used by email and Stripe return URLs; static fallback is the intended production domain. |
| `DATABASE_URL` | Present | No for runtime; migration audit still blocked | Used by Prisma runtime. |
| `DIRECT_URL` | Absent | Yes until the production migration connection is confirmed | Prisma CLI falls back to `DATABASE_URL`; the provider exposes separate integration variables, but current code does not consume their names. |
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
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Absent | No | Not referenced by the current runtime. |
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

**Static code audit: pass. Production value review: pending.** The canonical production hostname is consistently `https://www.shutterbugcamerashop.com` in the central SEO configuration, canonical tags, WebSite and Organization schema, sitemap, robots sitemap reference, and Merchant feed links. Email and Stripe return URLs use `NEXT_PUBLIC_SITE_URL`, which is present in Production and Preview scope, with the same production-domain fallback. Its value was not exposed during this audit, so the owner must confirm it equals the intended HTTPS domain.

### Database migration status

**Branch status: pass. Production status: unknown and blocking.** `origin/main...HEAD` contains no Prisma schema or migration change, so this branch introduces no migration. On 2026-10-20 Neon opened to an unauthenticated login screen, so the production project, branch, database, and `_prisma_migrations` ledger could not be verified. `npx prisma migrate status` was not run because no production database connection was safely supplied to this checkout. A previously shared database credential remains treated as exposed and was not reused. No schema operation was attempted. The migration will not be applied until the intended production target and complete ledger state can be read first.

### Stripe configuration status

**Not ready.** `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` are absent from Vercel Production and Preview scope. The current webhook code verifies signatures, amount, currency, payment state, and live/test alignment, but production mode and the webhook destination cannot be confirmed until the provider configuration exists. No charge or Stripe mutation was attempted.

### Resend configuration status

**Not ready.** `RESEND_API_KEY` is present, while `EMAIL_FROM` and `ADMIN_ORDER_EMAIL` are absent. The verified sender/domain and intended operations recipient therefore remain unconfirmed. No email was sent.

### Cloudinary configuration status

**Not ready.** `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are absent. Product and trade-in uploads cannot be considered production-ready. No upload was attempted.

### Secret rotation items

Rotate or verify rotation of these categories before launch when they have been shared outside the production secret manager:

- database password and connection credentials;
- admin password;
- admin and customer session-signing secrets;
- Stripe secret and webhook secrets;
- Resend API key; and
- Cloudinary API secret.

No secret value was printed, copied, changed, or rotated during this audit.

### Remaining blockers

1. Configure `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`, confirm live/test alignment, and verify the production webhook destination.
2. Configure a verified `EMAIL_FROM` and the intended `ADMIN_ORDER_EMAIL`; verify the Resend sender domain.
3. Configure the three required Cloudinary credentials and verify product and trade-in upload behavior without using customer data.
4. Confirm the intended production database connection and run read-only `npx prisma migrate status`; configure `DIRECT_URL` when required by the provider migration path.
5. Explicitly approve or disable the default trade-in promotion through production configuration.
6. Complete the required credential rotation review, including the database credential previously shared outside the secret manager.
7. Apply and verify migration `20260814183000_security_inventory_reservations` in the intended production database, deploy the local confirmation fix to a separately approved preview, and rerun the anonymous confirmation probe. The root cause and local fix are complete; the immutable `69ff56d` preview remains intentionally unchanged and still returns 500.
8. Raise the identified muted text and breadcrumb contrast from 4.11:1 to at least 4.5:1 and rerun Accessibility.
9. Improve or explicitly accept the homepage's 3.7-second lab LCP before changing the gate to **GO FOR MERGE**.
10. Confirm `NEXT_PUBLIC_SITE_URL` resolves exactly to `https://www.shutterbugcamerashop.com` without exposing its value in review output.
11. Visually verify the sold-product state when a genuine sold record exists.

## Decision

**NOT READY**

Deployed QA and all five Lighthouse runs are complete for immutable preview commit `69ff56d`, and their weak results are recorded above. The responsive/public-route checks passed, but QA also found the order-confirmation 500 and Lighthouse found a homepage LCP concern plus repeated text-contrast failure. The order-confirmation root cause is proven and a regression-tested local fix exists, but a fixed preview has not yet been verified and the required production database migration is unapplied. Tests and lint pass. The exact required `npm run build` command now also passes with Turbopack and generates all 127 static pages after moving the documented plugin runtime from child processes to worker threads; the build blocker is resolved. Merge to `main` remains blocked by the unverified production migration and deployed confirmation behavior, missing Stripe and Cloudinary production credentials, incomplete Resend sender/recipient configuration, unresolved trade-in promotion configuration, Lighthouse contrast and LCP findings, and credential-rotation review. Production was not deployed, `main` was not changed, and the temporary protection exception remains removed.
