# Soft Launch Readiness Report

Date: 2026-10-16
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

Lighthouse scores and deployed-preview LCP, CLS, INP, Accessibility, Best Practices, and SEO metrics were not measured. The preview is protected by Vercel Authentication and Lighthouse is not installed in this workspace. No metrics are inferred or invented. Authenticated responsive inspection found no visible announcement-driven reflow after dismissal, but deployed Lighthouse remains required.

## Validation

Validation of the audited implementation:

- `npm test`: 57 tests passed, 0 failed.
- `npm run lint`: passed with no ESLint errors.
- `npm run build`: passed on Next.js 16.4.0; TypeScript passed; 127 static pages generated.
- `git diff --check`: passed.

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
Audited and deployed branch HEAD: `4aed5fc89930385a649c1c5c67f8e7ac7e980de5` (`Contain nested shop media grid`)
Preview deployment dashboard: `https://vercel.com/zachery-dante-fregolis-projects/shutterbug/45YYDTPv316A5ajXmwhTegUgjdBq`
Preview hostname: `https://shutterbug-git-codex-sof-b1cb02-zachery-dante-fregolis-projects.vercel.app`

Production was not deployed and `main` was not changed.

### Preview access status

**Authenticated access confirmed; anonymous access remains protected.** The Vercel project uses **Vercel Authentication**, **Require Log In**, with **Standard Protection**. The deployment Share dialog is currently limited to **Only people with access**. No Protection Bypass secret or Deployment Protection Exception is configured.

Vercel offers a deployment share link and a branch-domain protection exception without disabling protection globally. Creating either changes who can access the deployment, so no access permission was changed without the owner's action-time approval. Authenticated deployed QA was completed through the current project session. Anonymous public-user behavior and command-line Lighthouse remain unverified.

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

**Not run; blocking.** Lighthouse is not installed in this workspace, and the preview requires an authenticated Vercel browser session. No performance, Accessibility, Best Practices, SEO, LCP, CLS, or INP result is inferred. A scoped public branch exception or compatible automation bypass is needed before command-line Lighthouse can audit the deployed preview.

### Validation

- `npm test`: 57 tests passed, 0 failed.
- `npm run lint`: passed with no ESLint errors.
- `npm run build`: passed on Next.js 16.4.0; TypeScript passed and 127 static pages were generated.
- Final deployed `/shop` responsive matrix: 11/11 widths passed without document overflow.
- Branch and remote HEAD match at `4aed5fc89930385a649c1c5c67f8e7ac7e980de5` before this report update.

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

**Branch status: pass. Production status: unknown and blocking.** `origin/main...HEAD` contains no Prisma schema or migration change, so this branch introduces no migration. `npx prisma migrate status` was not run because no production database connection was safely supplied to this checkout. A previously shared database credential must be treated as exposed and rotated rather than reused. No schema operation was attempted.

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
7. Run Lighthouse on `/`, `/shop`, `/categories/digital-cameras`, `/categories/printers`, and one priority brand/model route through a scoped, revocable preview-access method.
8. Confirm `NEXT_PUBLIC_SITE_URL` resolves exactly to `https://www.shutterbugcamerashop.com` without exposing its value in review output.
9. Visually verify the sold-product state when a genuine sold record exists.

## Decision

**NOT READY**

The deployed branch passed the responsive and route smoke matrix after the narrow `/shop` containment fix, and the application code, tests, lint, and production build pass. Merge to `main` remains blocked by missing Stripe and Cloudinary production credentials, incomplete Resend sender/recipient configuration, unverified production migration status, unresolved trade-in promotion configuration, credential-rotation review, and deployed Lighthouse. Production was not deployed and `main` was not changed.
