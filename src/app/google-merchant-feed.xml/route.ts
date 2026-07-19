import { categories, getCategory } from '@/lib/categories';
import { getCatalogProducts, type Product } from '@/lib/products';
import {
  absoluteUrl,
  googleProductCategory,
  imageUrl,
  merchantAvailability,
  merchantCondition,
  productTypePath
} from '@/lib/seo-utils';
import { site } from '@/lib/seo';

export const dynamic = 'force-dynamic';

function escapeXml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function hasMerchantReadyImage(product: Product) {
  return Boolean(product.heroImage && !product.heroImage.includes('placeholder-camera.svg'));
}

function productDescription(product: Product) {
  return [
    product.seoDescription,
    product.conditionSummary,
    product.included.length ? `Includes: ${product.included.join(', ')}` : '',
    product.flaws.length ? `Disclosed flaws: ${product.flaws.join(', ')}` : ''
  ]
    .filter(Boolean)
    .join(' ');
}

function productItemXml(product: Product) {
  const category = getCategory(product.categorySlug);
  const price = (product.priceCents ? product.priceCents / 100 : product.price).toFixed(2);

  return `
    <item>
      <g:id>${escapeXml(product.sku || product.id)}</g:id>
      <title>${escapeXml(product.title)}</title>
      <description>${escapeXml(productDescription(product))}</description>
      <link>${escapeXml(absoluteUrl(`/shop/${product.slug}`))}</link>
      <g:image_link>${escapeXml(imageUrl(product.heroImage))}</g:image_link>
      <g:availability>${escapeXml(merchantAvailability(product))}</g:availability>
      <g:price>${escapeXml(`${price} USD`)}</g:price>
      <g:condition>${escapeXml(merchantCondition(product))}</g:condition>
      <g:brand>${escapeXml(product.brand)}</g:brand>
      <g:mpn>${escapeXml(product.model || product.sku)}</g:mpn>
      <g:product_type>${escapeXml(productTypePath(product, category))}</g:product_type>
      <g:google_product_category>${escapeXml(googleProductCategory(product))}</g:google_product_category>
      <g:shipping>
        <g:country>US</g:country>
        <g:service>Standard</g:service>
      </g:shipping>
      <g:return_policy_label>standard</g:return_policy_label>
    </item>`;
}

export async function GET() {
  const products = await getCatalogProducts();
  const feedProducts = products.filter((product) => product.status !== 'coming-soon' && hasMerchantReadyImage(product));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${escapeXml(site.domain)}</link>
    <description>${escapeXml(site.description)}</description>
    ${feedProducts.map(productItemXml).join('')}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'X-Shutterbug-Feed-Items': String(feedProducts.length),
      'X-Shutterbug-Categories': String(categories.length)
    }
  });
}
