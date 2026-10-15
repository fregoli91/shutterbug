# Soft Launch Readiness Report

Date: 2026-10-15  
Branch: `codex/soft-launch-inventory-strategy`  
Audited implementation commit: `cb66f4c` (`Harden soft launch publishing readiness`)  
Initial preview commit: `35ea133` (`Refine soft launch inventory experience`)  
Remote branch: `origin/codex/soft-launch-inventory-strategy`

## Preview deployment

GitHub reported successful Vercel deployments for the initial preview and for branch commit `a188110` (the audited `cb66f4c` implementation plus this readiness report). The latest authenticated deployment dashboard checked during the audit is:

`https://vercel.com/zachery-dante-fregolis-projects/shutterbug/9MBk7X89LBW9mJyARjujEtZeDopZ`

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

## Decision

**NOT YET READY**

The local implementation and safeguards are ready for a final deployed-preview review. Merge to `main` remains blocked until the new public preview is identified, deployed responsive QA and Lighthouse are completed, and production environment keys are verified.
