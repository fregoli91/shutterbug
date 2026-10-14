# Digital camera Search Console plan

Use this plan after the SEO expansion is deployed. It is a measurement and indexing workflow, not a ranking guarantee.

## Deployment day

1. Confirm the production sitemap loads at `/sitemap.xml` and submit that URL in Google Search Console.
2. Inspect these URLs and request indexing when Google has not discovered the updated version:
   - `/categories/digital-cameras`
   - `/categories/vintage-digital-cameras`
   - `/brands/canon`
   - `/categories/canon-powershot-cameras`
   - `/guides/y2k-digital-cameras`
3. Use URL Inspection to confirm the declared canonical matches the inspected URL and the page is allowed to index.
4. Test live HTML for a successful response, one H1, title, meta description, canonical, crawlable internal links, and JSON-LD.

## Weekly for the first eight weeks

- Review indexing for the five primary URLs and investigate crawled-not-indexed, duplicate-canonical, soft-404, or server-error states.
- Compare clicks, impressions, average position, and click-through rate by page and query. Do not interpret a few days of movement as a durable trend.
- Group queries by intent: broad used digital, vintage digicam, Canon, PowerShot, and Y2K/2000s informational.
- Confirm that the intended URL receives impressions for each group. If two pages compete for the same query set, improve the intent distinction and internal-link wording before creating any new URL.
- Check mobile usability and Core Web Vitals trends, especially image-heavy category and guide pages.

## Monthly review

- Export page and query data for the five targets with a 28-day and three-month comparison.
- Identify high-impression, low-click queries where the page already matches intent; test clearer titles or descriptions one page at a time.
- Identify meaningful query gaps that deserve additions to the existing guide or category copy.
- Review product availability. Keep evergreen category copy accurate even when a shelf is empty.
- Inspect inbound internal links and ensure new relevant blog posts and products link to their intended hub.
- Check rich-results reports for product and breadcrumb issues. Validate sample product pages when schema errors appear.

## Decision rules

- Preserve a URL when its intent is correct; improve content rather than replacing the slug.
- Do not create spelling, year, sensor, or trend variants solely to target small keyword differences.
- Consolidate pages only when Search Console and content review show the same intent with no useful distinction.
- Record the date and exact title/content change so later performance comparisons are meaningful.
- Treat seasonal demand, inventory changes, and sitewide promotions as possible causes when interpreting traffic.

## Reporting template

For each primary URL record: index status, last crawl, canonical selected by Google, top queries, clicks, impressions, CTR, average position, rich-result errors, mobile/Core Web Vitals notes, inventory state, content change, and next action.
