# Pre-Merge Preview Checklist

Use this checklist on the preview deployment for `codex/sitewide-storefront-polish`. Test at desktop and mobile widths, use a non-production database with `20260919120000_customer_model_watchlist` applied, and use test-mode payment/email/media credentials. Never connect a preview to production write credentials.

Record the preview URL, tested commit SHA, browser/device, tester, date, and any failure before approving merge.

## Home

- [ ] Sale placement is unchanged.
- [ ] Carousel placement is unchanged.
- [ ] Canon, Olympus, Nikon, and trade-in replacement artwork displays with correct crops.
- [ ] Promotional copy contains no unsupported discount, free-shipping, warranty, authenticity, or business-history claims.
- [ ] Carousel previous/next, indicators, pause, keyboard controls, and reduced motion work.
- [ ] Desktop navigation, search, account access, camera shortcut, and Bag open the correct destinations.
- [ ] Mobile logo, search, Bag, menu drawer, login/sign-up, and close/Escape behavior work without clipping.

## Shop

- [ ] Search returns expected camera, printer, brand, and model results.
- [ ] Category, brand, condition, price, availability, and advanced filters can be applied and removed.
- [ ] Sorting works for featured, newest, price low-to-high, and price high-to-low.
- [ ] Empty results explain the state and provide useful clear/browse actions.
- [ ] Mobile filter drawer opens, scrolls, applies, cancels, closes with Escape, and restores focus.
- [ ] Product cards, prices, stock labels, images, likes, and Add to Bag controls match product state.

## Watchlist

### Signed out

- [ ] A sold product's Watch this model action sends the customer to login.
- [ ] Successful login returns to the originating product or requested watchlist route.
- [ ] `/account/watchlist` redirects to `/login?returnTo=%2Faccount%2Fwatchlist`.

### Signed in

- [ ] Watch this model adds the normalized model once.
- [ ] Repeating the action does not create duplicate rows.
- [ ] Watching this model reflects the saved state.
- [ ] Remove deletes only the current customer's record.
- [ ] A second controlled customer cannot view or remove the first customer's watches.
- [ ] Empty watchlist presentation is intentional and Browse sold finds uses `availability=sold_out`.
- [ ] Account watchlist layout remains usable at 320, 390, 768, 1024, and 1440 pixels.
- [ ] The page states that automatic email/text alerts are not active.

## Sold products

- [ ] Sold page remains available when it has useful original photos and content.
- [ ] The product is clearly marked sold/out of stock.
- [ ] Add to Bag is absent and Ask about availability is present.
- [ ] Model watchlist CTA is available and follows the authentication behavior above.
- [ ] Related alternatives are active, in stock, relevant, and have working links.
- [ ] Brand, category, guide, breadcrumb, and canonical links resolve.
- [ ] Product JSON-LD reports `https://schema.org/OutOfStock`.
- [ ] An active positive-quantity control product still shows Add to Bag and `InStock`.
- [ ] Archived/deleted products follow the deliberate unavailable/404 behavior.

If preview inventory contains no sold product, record that limitation and repeat these checks with the first real sold listing before production approval. Do not create fake public inventory.

## Printers

- [ ] `/categories/printers` loads with truthful testing and condition language.
- [ ] HP, Lexmark, Brother, and Canon brand/category relationships lead to the intended pages or filtered inventory.
- [ ] `/guides/how-we-test-used-printers` loads and distinguishes universal checks from supply-dependent checks.
- [ ] Printer category and printer product pages link to the testing guide.
- [ ] Printer related-product links exclude cameras, sold units, archived units, and zero-quantity stock.
- [ ] Empty printer inventory remains intentional; no placeholder products appear.

## Sell Your Camera

- [ ] Hero layout is centered, responsive, and uses the current trade-in image.
- [ ] Primary trade-in CTA and See how it works anchor work.
- [ ] Public explanation remains readable without signing in.
- [ ] Starting a submission requests authentication and preserves the intended return path.
- [ ] Existing draft, photo upload, offer review, accept/decline, and history flows still work with a controlled preview account.
- [ ] No unapproved seasonal bonus or payout/shipping promise appears.

## Bag

- [ ] Header Bag opens and closes on desktop and mobile.
- [ ] Escape closes the Bag panel and restores focus.
- [ ] Empty Bag state has working shop, saved-item, camera, printer, and sign-in links.
- [ ] A real active item can be added, quantity can be changed, and it can be removed.
- [ ] Server cart validation rejects sold, archived, missing, or insufficient-quantity items.
- [ ] `/cart` redirects permanently to `/bag`.
- [ ] Checkout entry uses preview/test configuration and does not create live charges.

## Account

- [ ] Sign-up, verification, login, logout, and session persistence use preview data and email configuration.
- [ ] Account navigation reaches profile/settings, addresses, likes, watchlist, orders, tracking, and trade-ins.
- [ ] Watchlist passes the ownership checks above.
- [ ] Orders show only the authenticated customer's eligible purchase history.
- [ ] Direct access to another customer's order, trade-in, or watch record is denied server-side.
- [ ] Account pages remain `noindex`.

## Responsive and accessibility

- [ ] Check 320, 360, 375, 390, 393, 414, 430, 768, 1024, 1280, 1440, 1600, and 1920 pixels on representative routes.
- [ ] No document overflow, clipped copy, overlapping controls, bad image crops, or hidden actions.
- [ ] Skip link, single main landmark, one visible H1, labels, alt text, focus indicators, and target sizes remain correct.
- [ ] Complete keyboard-only navigation for header, menus, search, Bag, filters, carousel, forms, watchlist, and sold CTAs.
- [ ] Menus/dialogs close with Escape and restore focus; modal focus does not escape.
- [ ] Verify reduced-motion mode and a production contrast scan.

## Lighthouse procedure

Use Chrome/Edge DevTools Lighthouse in an Incognito/InPrivate window with extensions disabled. Test the exact preview commit over HTTPS while signed out, using Mobile mode, simulated throttling, and a fresh navigation. Run at least three times per route and record the median Performance score plus Accessibility, Best Practices, SEO, LCP, CLS, and any lab interaction diagnostic. INP requires field/RUM data and must not be inferred from a navigation-only Lighthouse run.

Test:

- `/`
- `/shop`
- `/categories/printers`
- `/brands/canon` or another representative populated brand
- a real retained sold-product URL if preview data contains one
- `/sell-your-camera`

Review image request dimensions/bytes, preload requests, carousel requests before interaction, client JavaScript, duplicate responsive DOM, font requests, and layout-shift attribution. Keep the existing local measurements labeled as local unthrottled lab data.

## Zach's owner decisions

These decisions are documented in [OWNER_POLICY_DECISIONS.md](./OWNER_POLICY_DECISIONS.md) and are not selected by this branch:

- Returns: window, item-condition requirements, return-shipping responsibility, restocking treatment, refund timing, and parts/repair exceptions.
- Warranty: whether coverage exists, duration, covered failures, exclusions, and parts/repair treatment.
- Shipping: handling time, carriers/service, oversized printers, transit damage, international service, insurance, and signatures.
- Trade-ins: revised/rejected-offer return shipping, offer-expiry and payout timing, local handoff, store credit, and abandoned/prohibited gear.
- Privacy: production processors, analytics/advertising choices, cookies, retention, and privacy-request handling.
- Model watches: whether and how email/text/in-account alerts should be sent, including consent and unsubscribe rules.

Policy decisions that do not change copy or configuration in this branch do not block technical review. Any decision that changes live claims must be approved and implemented before those claims are published.

## Approval record

- Preview URL:
- Commit SHA:
- Preview database/migration confirmed:
- Test-mode integrations confirmed:
- Manual QA owner/date:
- Lighthouse results location:
- Open defects:
- Merge decision:
