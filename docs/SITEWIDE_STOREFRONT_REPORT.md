# Sitewide Storefront Polish — Phase Report

> Final readiness verification was completed on September 20, 2026. See [STOREFRONT_FINAL_READINESS.md](./STOREFRONT_FINAL_READINESS.md) for the current responsive, lifecycle, accessibility, migration, and performance results.

Date: September 19, 2026
Branch: `codex/sitewide-storefront-polish`

## Audit findings

The repository already uses a single shared App Router layout, header, navigation system, mobile menu, bag provider, and footer. Durable product states, indexability rules, related-product filtering, compatibility redirects, catalog filtering, and the account-required trade-in system were already present and working. The detailed audit is in [SITEWIDE_STOREFRONT_AUDIT.md](./SITEWIDE_STOREFRONT_AUDIT.md).

The principal foundation gaps were nested main landmarks, camera-only global search language, unsupported claims embedded in a seasonal banner, no model-level watchlist, and no dedicated used-printer testing resource.

## Legacy components found

No duplicate public header/footer system or public Admin navigation was found. Compatibility routes remain intentionally available for old URLs, including `/cart`, singular brand/product routes, and previous trade-in routes.

## Global UI changes

- Added one keyboard-visible skip link and one canonical `main` landmark in the root layout.
- Removed nested `main` elements from public pages.
- Preserved the existing homepage and carousel structure.
- Kept the established visual language and shared components.

## Product lifecycle changes

The existing `DRAFT`, `ACTIVE`, `SOLD_OUT`, and `ARCHIVED` lifecycle remains the source of truth. Existing catalog, sitemap, structured-data, and related-product rules were verified rather than replaced.

A new customer model-watch record stores normalized brand, model, and category identity independently of a single product listing.

## Sold-product behavior

Sold pages continue to preserve exact-item photos and history, mark the unit sold, disable purchasing, and show available related inventory. They now also let customers save the model to an account watchlist. The UI explicitly states that automatic email or text alerts are not active yet.

## Shop/filter changes

The existing primary filters, advanced “More filters” controls, mobile filter drawer, selected chips, and availability handling were audited and retained. No taxonomy was removed. Shop headings and descriptions now explicitly include printers and gear.

## Search changes

Desktop, mobile, and shop search language now says “Search cameras, printers, brands & models.” Search suggestions already include printers.

## Trade-in changes

The existing public landing, authenticated drafts, photo uploads, offer acceptance/decline, ownership enforcement, customer history, admin review, revision history, and revised-offer flow were verified. No security-sensitive trade-in code was rewritten.

The seasonal trade-in banner was removed because the artwork contained unverified discount, shipping, and business-history claims.

## Account changes

- Added `/account/watchlist`.
- Added watched-model count and navigation to the account hub.
- Kept individual liked products separate from model watches.
- Enforced customer ownership on watchlist deletion.
- Redirected guests back through login with an internal return path.

## Printer changes

- Added `/guides/how-we-test-used-printers`.
- Documented power, controls, connectivity, paper handling, print, scan, consumable, accessory, defect, and packing checks with conditional language.
- Linked printer category and printer product pages to the guide.
- Expanded the guides landing page to include cameras and printers.
- Kept printer claims tied to listing-level evidence and available supplies.

A future editorial roadmap should prioritize “How to Buy a Used Printer,” laser versus inkjet buying guidance, consumables/maintenance explanations, and model-family guides only when real inventory and search demand justify them.

## Policy issues found

Owner decisions are still required for handling time, carriers, signature/insurance thresholds, oversized printers, international service, return window, refund timing, return-shipping responsibility, warranty scope, parts/repair exceptions, and damaged-in-transit handling.

Privacy copy still needs final reconciliation with the production choices for Stripe, Cloudinary, database hosting, transactional email, analytics, advertising pixels, cookies, support communications, and account/privacy requests.

## SEO changes

- Updated shop metadata to include used cameras, printers, and gear.
- Added the printer guide to the existing guide data source, which automatically includes it in static generation and the sitemap.
- Preserved sold-page indexability rules that require real photos and useful original content.
- Preserved accurate availability mapping in product structured data.

## Internal-link changes

Printer category and product pages now link to the printer testing guide. Sold product pages already link to brand, category, and available related products; the watchlist adds a durable account path for exact models.

## Image/performance changes

The unsupported 2.4 MB seasonal banner was removed. No other image formats or loading behavior changed in this phase.

Lighthouse and production Core Web Vitals were **not measured**. The branch has not been deployed, so a valid production before/after comparison is not yet possible.

## Accessibility changes

- Added skip navigation.
- Removed nested main landmarks.
- Preserved existing focus trapping and Escape behavior in mobile menu and bag panels.
- Added regression coverage for the shared landmark.

Automated contrast scanning and full assistive-technology testing remain outstanding.

## Mobile changes

Global mobile search now includes printers in its language. The existing mobile drawer, bag, account, and filter patterns were retained.

A full visual pass at 320, 360, 375, 390, 393, 414, and 430 pixels was not completed in this branch. Browser UI automation was unavailable because the local Windows browser-control helper failed to start.

## Security considerations

Authentication, Stripe, webhooks, inventory reservation, payment confirmation, upload validation, and trade-in authorization were left intact. Watchlist mutations derive model data from an existing public product record and scope reads/deletes to the authenticated customer.

## Database/migrations

Added migration `20260919120000_customer_model_watchlist` and Prisma model `CustomerModelWatch` with:

- customer foreign key and cascade deletion
- unique customer/model key
- customer/date and model-key indexes
- normalized brand, model, and category data

The migration is committed but has not been applied to production.

## Files changed

Changes are grouped across:

- shared layout and search components
- sold product and account pages
- printer category, product, and guide pages
- Prisma schema and migration
- audit/report documentation
- storefront, watchlist, and printer regression tests

Use `git show --stat d60a6f4` and `git show --stat 1408153` for the exact phase inventories.

## Tests added

- shared single-main and skip-navigation behavior
- printer-inclusive global search language
- unsupported campaign-claim prevention
- normalized model-watch keys
- customer-scoped watchlist mutation checks
- honest sold-page alert status
- conditional printer testing language
- printer category/product guide links

## Lint result

`npm run lint`: passed.

## Build result

`npm run build`: passed. Next.js generated all 128 pages and included `/account/watchlist` and `/guides/how-we-test-used-printers`.

## Test result

`npm test`: 38 passed, 0 failed.

## Runtime route checks

The local runtime returned 200 for:

- `/`
- `/shop`
- `/categories/printers`
- `/guides`
- `/guides/how-we-test-used-printers`
- `/sell-your-camera`

Guest access to `/account/watchlist` returned a 307 redirect to login with the correct internal return path. The printer guide appeared in the sitemap and linked from the printer category. Unsupported campaign claims were absent from home and trade-in HTML.

## Performance results

No Lighthouse score, LCP, CLS, or INP result is reported. Measuring the current production site would provide only a baseline; measuring this branch requires a review deployment or release candidate URL.

## Remaining owner decisions

- shipping and handling rules
- returns, refunds, warranty, and exceptions
- oversized printer fulfillment
- international availability
- exact privacy vendors and tracking choices
- whether automatic model-watch email/text alerts should be built
- verified promotional offer terms before campaign artwork returns
- legitimate Michigan local-handoff details
- real operational photos for About content

## Remaining launch risks

- Production must run the new database migration before enabling the watchlist UI.
- Watchlist alerts are intentionally not sent yet.
- Policy pages cannot become more specific until owner decisions are supplied.
- Responsive visual QA and production performance measurements remain required before release.
- Printer family and brand-specific editorial expansion should follow real inventory and Search Console evidence.
- Older Journal launch-language and testing-content cannibalization remain P2 editorial work.

## Commits created

- `d60a6f4` — Audit and unify storefront shell
- `1408153` — Add sold-model watchlist and printer guidance
- `cb084b3` — Record Next.js workspace agent rules

No commit was pushed to `main`.
## PRE-MERGE STATUS

- **Branch:** `codex/sitewide-storefront-polish`
- **Validated storefront code HEAD:** `37d667b` before this documentation-only preparation commit. The exact final pushed HEAD is recorded in the release handoff because a commit cannot embed its own final SHA.
- **Push status:** Successful. `codex/sitewide-storefront-polish` was pushed to `origin/codex/sitewide-storefront-polish`; local and remote were verified at `4bb9d7fc51cfe82eaf6de1adbb40caf7ca75fcb5` before this documentation-only status update. The exact final pushed HEAD is recorded in the release handoff.
- **Migration required:** Yes, before watchlist code receives production traffic.
- **Migration filename:** `prisma/migrations/20260919120000_customer_model_watchlist/migration.sql`.
- **Tests:** 45 passed, 0 failed in the final-readiness gate; repeat from the final committed state before push.
- **Lint:** Passed with 0 errors in the final-readiness gate; repeat before push.
- **Build:** Passed; Next.js generated 128 pages in the final-readiness gate; repeat before push.
- **Responsive QA:** 143 route-width cases across 11 routes and 13 widths; 0 document-overflow failures, 0 main-landmark failures, and 0 visible-H1 failures.
- **Accessibility QA:** Skip navigation, landmarks, headings, labels/alt text, reduced motion, keyboard opening, Escape dismissal, and focus restoration passed focused local checks. Preview contrast and screen-reader checks remain manual.
- **Watchlist QA:** Signed-out redirect/return path, customer-scoped reads/deletes, duplicate prevention, database-derived slug, sold CTA, and empty state passed automated/source and local route checks. Signed-in browser E2E remains a preview checklist item.
- **Sold-product QA:** Purchase gating, OutOfStock structured data, retained-content rules, watch CTA, and active-only related inventory passed regression checks. The current local database has no sold product for full visual E2E.
- **Known limitations:** Lighthouse is unavailable locally; recorded metrics are unthrottled local lab measurements rather than production Core Web Vitals. INP requires field data. No repository Vercel project configuration is committed, and preview availability must be confirmed after push. Automatic watch alerts are intentionally inactive.
- **Owner decisions:** Returns, warranty, shipping, trade-ins, privacy vendors/tracking, and watch-notification policy remain with Zach; see [OWNER_POLICY_DECISIONS.md](./OWNER_POLICY_DECISIONS.md).
- **Preview URL:** Vercel reported the preview deployment completed successfully. GitHub exposed the deployment dashboard at `https://vercel.com/zachery-dante-fregolis-projects/shutterbug/hagwQPXD6co6HNznNxUUUo47BMRd`, but did not expose the public `vercel.app` alias. Copy the public alias from that deployment page, then follow [PREMERGE_PREVIEW_CHECKLIST.md](./PREMERGE_PREVIEW_CHECKLIST.md) using non-production database and test-mode integrations.
- **Production blockers:** Apply and verify the additive watchlist migration; complete preview visual/authenticated QA; verify preview/production secrets; resolve only owner decisions that change live claims; run preview Lighthouse and production smoke checks. Do not merge or deploy until these gates are accepted.

### Recommended deployment order

1. Push `codex/sitewide-storefront-polish` to `origin` and record the exact SHA.
2. Confirm or create an HTTPS Vercel preview for that SHA with a separate preview database, test Stripe keys/webhook, preview email configuration, and non-production media settings.
3. Apply `20260919120000_customer_model_watchlist` to the preview database only and verify its table, indexes, unique constraint, and foreign key.
4. Complete [PREMERGE_PREVIEW_CHECKLIST.md](./PREMERGE_PREVIEW_CHECKLIST.md), including authenticated watchlist ownership and a real sold product if preview data provides one.
5. Run three mobile Lighthouse passes per required public route and record median scores/metrics; fix only release-blocking regressions.
6. Confirm Zach's decisions only where they affect copy or configuration intended for this release.
7. Verify production secrets and endpoint configuration without displaying values; ensure Stripe remains live-only in production and test-only in preview.
8. Take or confirm a recent production database backup and a tested rollback path.
9. Run `prisma migrate deploy` against production using the direct/session migration URL before new watchlist application traffic; verify migration status and the new objects.
10. Merge the reviewed feature branch to `main` through the normal protected workflow.
11. Deploy the exact merged production artifact.
12. Run live smoke tests for Home, Shop, sold lifecycle, watchlist, Bag, account, printers/guide, Sell Your Camera, sitemap, canonical links, and product structured data.
13. Run production Lighthouse and begin real-user LCP, CLS, and INP monitoring.
14. Monitor application, database, Stripe, checkout, webhook, email, and upload logs. If the application must roll back, the additive watchlist table can remain for the prior version.
