# Storefront UX Review

Branch: `codex/storefront-ux-polish`. Reviewed locally; user approved publishing this pass.
Preview: http://127.0.0.1:3000/

## Changes

| Area | Result |
| --- | --- |
| Desktop navigation | Seven concise destinations; Cameras, Brands, and Lenses & Accessories use compact keyboard-accessible dropdowns. Existing green treatment retained. |
| Mobile header | Compact controls retained; concise Cameras / Vintage Digital / Film / Brands / Sell strip with native horizontal scrolling. Expanded search dismisses outside and on Escape. |
| Mobile drawer | Organized Shop, Brands, Discover, Sell, Account, and support links. Existing focus trap preserved. |
| Shop filters | Category, brand, price, condition, and availability first; advanced controls under More Filters. Removable chips preserve other selections. |
| Mobile filters | Native modal dialog, contained keyboard focus, Escape dismissal, scrolling content, persistent Show Results and Clear All actions. |
| Sorting | Default Newest uses database creation timestamps; automatic sort submission preserves filters. Existing alternatives retained. |
| Empty shelves | Intentional home, shop, brand, category, and no-results states with browse, clear, or sell paths. Public development sample fallback removed. No fabricated stock added. |
| Product cards | Real photo first, exact model, recorded condition/functionality, price and availability. Heart below image; removed Compare and excessive badges. |
| Trade-in | Replaced inert form with an honest prefilled email quote path, photo instructions and phone alternative. No false upload or submission success. |
| Bag and checkout | Customer-facing Bag terminology and availability/payment copy; payment, reservation, webhook and checkout logic unchanged. |
| Trust | Consolidated homepage standard; removed redundant footer pills and public Admin link. |
| Account | Large homepage signup promotion reduced to a compact strip. Authentication internals unchanged. |
| Printers | Kept lower on homepage, after camera/brand/trust content. |
| Campaigns | Carousel and Summer Sale placement/order unchanged. Swipe, dots, pause/play, reduced-motion handling and desktop Lucide arrows. |
| Images | First carousel slide eager/high priority; subsequent slides lazy. Removed below-fold Summer Sale preload and oversized account artwork. Existing responsive image optimization retained. |
| Accessibility | Named icon controls, expanded states, keyboard dropdown handling, modal focus containment, 44px heart target, reduced-motion support. |
| Public copy | Removed developer checkout language, inert-form disclaimer, SEO jargon, public Admin link and verification-console instructions. |

## Verification

- Automated browser checks: home, shop, film/vintage-digital categories, Canon/Olympus/Sony/Nikon/Fujifilm/Pentax brands, sell-your-camera, bag and signed-out account flow at 390px and 1440px.
- Home widths: 320, 360, 375, 390, 393, 414 and 430px; additional 1024/1280 desktop checks. No horizontal page overflow detected.
- No broken loaded images or page errors in the route checks.
- Real empty catalog, empty brand/category and no-search-result states exercised.
- Touch input: green strip scroll position changed; carousel advanced without unintended navigation. Last trade-in slide links to sell-your-camera.
- Filter apply/clear, preserved query chips, dialog focus containment across 60 Tab presses, Escape, menu open/close, dropdown dismissal and outside-search dismissal checked.
- Product cards separately rendered at 320/390/1440px using private layout fixtures, never inserted into public inventory. Heart stays below photograph.
- Test suite: 17 tests, including five focused storefront regressions.
- Application ESLint passed without warnings; production build passed with all 122 pages generated. Plain npm lint also scans untracked local QA CommonJS scripts; application lint explicitly excludes .codex-recovery/**.
- git diff --check passed (only Windows line-ending notices).

## Remaining Issues / Boundaries

- Supplied carousel artwork includes embedded text that remains small on phones. No dedicated mobile artwork was available; no destructive crop or invented replacement was introduced.
- Inventory is intentionally empty. No genuine in-stock purchase or authenticated account end-to-end test was possible; no fake products or customers were created. Empty inventory is not a launch blocker.
- Trade-in uses email/phone, not an upload backend. Actual email delivery and response operations are not verified by a browser click test.
- Production dependency audit reports four high-severity findings in the Prisma tooling dependency chain. Its suggested breaking downgrade was not applied in this UX branch; address in the separate hardening workstream.
- Existing indexing rules, schema, payment, webhook, authentication and reservation internals remain outside this pass.

## Visual Review

Screenshots and JSON results are local-only under `.codex-recovery/ux-qa/screenshots/`.

- [Mobile home](../.codex-recovery/ux-qa/screenshots/390-home.png)
- [Desktop home](../.codex-recovery/ux-qa/screenshots/1440-home.png)
- [Desktop navigation](../.codex-recovery/ux-qa/screenshots/desktop-nav-crop.png)
- [Mobile menu](../.codex-recovery/ux-qa/screenshots/mobile-menu.png)
- [Mobile filters](../.codex-recovery/ux-qa/screenshots/mobile-filter.png)
- [Mobile shop](../.codex-recovery/ux-qa/screenshots/390-shop.png)
- [Empty search](../.codex-recovery/ux-qa/screenshots/390-empty-filter.png)
- [Trade-in](../.codex-recovery/ux-qa/screenshots/390-sell-your-camera.png)

## Files

New: src/components/DesktopNavigation.tsx, EmptyShelf.tsx, ShopFilterDrawer.tsx, ShopSort.tsx; src/lib/shop-query.ts, storefront-sort.ts; tests/storefront-ux.test.mjs; this report.

Modified: package.json, package-lock.json; src/app/page.tsx, shop/page.tsx, brands/[slug]/page.tsx, categories/[slug]/page.tsx, sell-your-camera/page.tsx, cart/page.tsx, checkout/page.tsx, signup/check-email/page.tsx; src/components/Header.tsx, MobileHeader.tsx, MobileMenu.tsx, HomePromotionalCarousel.tsx, ProductCard.tsx, Footer.tsx, cart/CartLink.tsx, cart/CartPageClient.tsx, checkout/CheckoutFormClient.tsx; src/lib/brands.ts, products.ts.

Pre-existing header/bag/menu edits were preserved. Local recovery files, generated TypeScript artifacts, AGENTS.md and CLAUDE.md were not staged or committed.