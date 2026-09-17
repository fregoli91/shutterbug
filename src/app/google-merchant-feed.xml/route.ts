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
import { hasRealProductImage } from '@/lib/catalog-seo';

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
  return hasRealProductImage(product);
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

function additionalImageLinks(product: Product) {
  return Array.from(new Set(product.gallery))
    .filter((image) => image && image !== product.heroImage && !image.includes('shutterbug-product-placeholder.png'))
    .slice(0, 10)
    .map((image) => `      <g:additional_image_link>${escapeXml(imageUrl(image))}</g:additional_image_link>`)
    .join('\n');
}
function productItemXml(product: Product) {
  const category = getCategory(product.categorySlug);
  const price = (product.priceCents ? product.priceCents / 100 : product.price).toFixed(2);
  const additionalImages = additionalImageLinks(product);
  const identifiers = [
    product.gtin ? `      <g:gtin>${escapeXml(product.gtin)}</g:gtin>` : '',
    product.mpn ? `      <g:mpn>${escapeXml(product.mpn)}</g:mpn>` : ''
  ]
    .filter(Boolean)
    .join('\n');

  return `
    <item>
      <g:id>${escapeXml(product.sku || product.id)}</g:id>
      <title>${escapeXml(product.title)}</title>
      <description>${escapeXml(productDescription(product))}</description>
      <link>${escapeXml(absoluteUrl(`/shop/${product.slug}`))}</link>
      <g:image_link>${escapeXml(imageUrl(product.heroImage))}</g:image_link>
${additionalImages}
      <g:availability>${escapeXml(merchantAvailability(product))}</g:availability>
      <g:price>${escapeXml(`${price} USD`)}</g:price>
      <g:condition>${escapeXml(merchantCondition(product))}</g:condition>
      <g:brand>${escapeXml(product.brand)}</g:brand>
${identifiers}
${product.gtin || product.mpn ? '      <g:identifier_exists>yes</g:identifier_exists>' : ''}
      <g:product_type>${escapeXml(productTypePath(product, category))}</g:product_type>
${googleProductCategory(product) ? `      <g:google_product_category>${escapeXml(googleProductCategory(product))}</g:google_product_category>` : ''}

    </item>`;
}

export async function GET() {
  const products = await getCatalogProducts();
  const feedProducts = products.filter(hasMerchantReadyImage);
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
      'Cache-Control': 'no-store',
      'X-Shutterbug-Feed-Items': String(feedProducts.length),
      'X-Shutterbug-Categories': String(categories.length)
    }
  });
}
