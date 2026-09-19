# Sitewide Storefront Audit

Audit date: September 19, 2026  
Branch: `codex/sitewide-storefront-polish`

## Executive status

The storefront already has a strong shared foundation: one application shell, durable product states, compatibility redirects, responsive catalog filters, account-scoped trade-ins, and structured SEO controls. This phase should refine those systems instead of replacing them.

The highest-priority gaps are a model-level watchlist for sold products, a documented used-printer testing standard, a few accessibility and copy inconsistencies, and owner-supplied operating details for policy pages. No public Admin navigation was found, and no duplicate storefront shell needs to be consolidated.

A promotional image introduced before this audit contained unverified claims about discounts, shipping, and business history. It is removed from this branch. It must not return until every claim has evidence and matches current policy.

## Audit findings

### Shared storefront shell

- `src/app/layout.tsx` provides the shared header, footer, cart provider, and main content landmark.
- The desktop header, mobile header, navigation menu, and bag panel use the same public information architecture.
- Public compatibility routes preserve old URLs: `/cart` redirects to `/bag`, singular brand and product routes redirect to their canonical equivalents, and older trade-in routes redirect to `/sell-your-camera`.
- No public Admin link was found outside authenticated admin code.
- Several pages emitted their own `main` element inside the root layout's `main`. This branch removes the nested landmarks and adds a keyboard-visible skip link.

### Bag and account access

- Customer-facing language consistently uses **Bag**, with `/cart` retained only as a compatibility redirect.
- The bag badge is computed from cart state rather than embedded in artwork.
- Login and sign-up access appears in the desktop header, mobile menu, and bag experience.
- The default account image is used consistently when a customer has not uploaded a profile photo.

### Product lifecycle and sold inventory

- The data model already supports `DRAFT`, `ACTIVE`, `SOLD_OUT`, and `ARCHIVED` product states.
- Public catalog queries expose active and sold-out products while excluding drafts and archived products.
- Sold product detail pages retain photography and descriptive content.
- Related-product queries return active, in-stock inventory.
- Sitemap and metadata logic index sold pages only when they retain real photos and useful original content.
- Product availability in structured data follows inventory state.
- The remaining customer-experience gap is a durable, account-scoped model watchlist and a clearer sold-product path to similar available items.

### Catalog, search, filters, and empty states

- Primary filters include category, brand, price, condition, and availability.
- Advanced filters are grouped under **More filters**, with a mobile drawer and selected-filter chips.
- Search suggestions and field copy should explicitly cover cameras, printers, brands, and models. This branch standardizes that language.
- Empty states should explain why no results appear, preserve the customer's query where useful, and provide direct actions to clear filters or browse related inventory.
- No fake inventory should be created to make a category look populated.

### Printers

- Printers already exist as a first-class catalog category, and printer brands have SEO content.
- Printer pages need a clear, reusable explanation of how used printers are evaluated.
- A testing guide should distinguish universal checks from tests performed only when the required consumables, media, cables, or accessories are available.
- Product and category pages should link to that guide without implying that every possible test was completed on every unit.

### Trade-ins

- The public trade-in landing page routes customers into an account-required submission flow.
- Customers can create and review their submissions; administrators have separate management routes and auditable history.
- Ownership and origin checks are covered by automated tests.
- The temporary seasonal sale banner is removed because its embedded claims are not supported by current operating policy.

### Policies and trust claims

Current shipping and returns copy avoids invented service levels. The following details require owner decisions before more specific promises can be published:

- order handling time and cutoff rules
- supported carriers
- signature and insurance thresholds
- oversized-printer shipping rules
- international destinations and exclusions
- return window and condition requirements
- refund processing timing
- responsibility for return shipping
- warranty duration and scope
- parts, repair, and as-is exceptions
- damaged-in-transit reporting process

The privacy policy should be reconciled with the actual production use of Stripe, Cloudinary, the application database, transactional email, analytics, and cookies.

### SEO, accessibility, and performance

- Canonical compatibility redirects reduce duplicate routes.
- Product metadata, sitemap inclusion, and structured availability already use shared lifecycle rules.
- The root shell now provides one main landmark and a skip-to-content link.
- Menu and dialog components already include Escape-key and focus behavior.
- Image sizes and runtime behavior should be checked again after lifecycle and printer-guide changes; optimization should be evidence-led rather than cosmetic.

## Implementation phases

1. **Audit and shell consistency**: record findings, remove unverified campaign claims, fix the main landmark, add skip navigation, and standardize global search language.
2. **Sold-product lifecycle**: add the model watchlist, improve sold calls to action, and verify related inventory never includes unavailable products.
3. **Printer experience**: publish the testing guide and connect it to printer category and product paths.
4. **Flow refinement**: review empty states, account navigation, trade-in clarity, and admin workflow consistency.
5. **Verification**: run unit tests, lint, production build, route checks, and focused responsive/accessibility review.

## Verification baseline

The initial automated run passed 30 of 32 tests. Both failures were stale expectations after previously approved interface changes: one still prohibited the newly requested login/sign-up links, and one still expected the retired summer campaign slide. The tests are updated in this branch to match the approved experience and to guard against unsupported promotional claims.

## Release boundaries

- Work remains on `codex/sitewide-storefront-polish` until review.
- Do not push this branch directly to `main`.
- Do not publish discount, shipping, warranty, longevity, or service-level claims without current evidence.
- Do not expose Admin navigation in the public storefront.
- Do not delete useful sold-product pages solely because inventory reaches zero.
- Do not create placeholder inventory.
