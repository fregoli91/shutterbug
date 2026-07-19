import type { Category } from '@/lib/categories';
import type { Product } from '@/lib/products';
import { site } from '@/lib/seo';

export type JsonLdNode = Record<string, unknown>;

const DEFAULT_IMAGE = '/shutterbug-icon-512.png';

export function absoluteUrl(value = '') {
  if (/^https?:\/\//i.test(value)) return value;
  const path = value.startsWith('/') ? value : `/${value}`;
  return `${site.domain}${path}`;
}

export function imageUrl(value?: string) {
  return absoluteUrl(value || DEFAULT_IMAGE);
}

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function titleFromSlug(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function brandSlug(brand: string) {
  return slugify(brand);
}

export function productConditionUrl(product: Product) {
  if (product.condition === 'New') return 'https://schema.org/NewCondition';
  if (product.condition === 'Refurbished') return 'https://schema.org/RefurbishedCondition';
  if (product.condition === 'For Parts' || product.partsRepair) return 'https://schema.org/DamagedCondition';
  return 'https://schema.org/UsedCondition';
}

export function productAvailabilityUrl(product: Product) {
  if (product.status === 'in-stock' && (product.quantity ?? 1) > 0) return 'https://schema.org/InStock';
  if (product.status === 'coming-soon') return 'https://schema.org/PreOrder';
  return 'https://schema.org/OutOfStock';
}

export function merchantAvailability(product: Product) {
  if (product.status === 'in-stock' && (product.quantity ?? 1) > 0) return 'in_stock';
  if (product.status === 'coming-soon') return 'preorder';
  return 'out_of_stock';
}

export function merchantCondition(product: Product) {
  if (product.condition === 'New') return 'new';
  if (product.condition === 'Refurbished') return 'refurbished';
  return 'used';
}

export function googleProductCategory(product: Product) {
  if (product.categorySlug === 'camera-accessories' || product.cameraType === 'Accessory') {
    return 'Cameras & Optics > Camera & Optic Accessories';
  }

  if (product.categorySlug === 'scanners-printers' || product.productType?.toLowerCase().includes('printer')) {
    return 'Electronics > Print, Copy, Scan & Fax';
  }

  return 'Cameras & Optics > Cameras';
}

export function productTypePath(product: Product, category?: Category) {
  return [category?.name, product.productType, product.brand, product.model].filter(Boolean).join(' > ');
}

export function jsonLdGraph(nodes: JsonLdNode[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes
  };
}

export function buildOrganizationJsonLd(): JsonLdNode {
  return {
    '@type': 'Store',
    '@id': `${site.domain}/#organization`,
    name: site.name,
    url: site.domain,
    logo: imageUrl('/shutterbug-icon-512.png'),
    image: imageUrl('/shutterbug-trust-banner.png'),
    description: site.description,
    telephone: site.supportPhone,
    email: site.supportEmail,
    sameAs: site.amazonStoreUrl ? [site.amazonStoreUrl] : [],
    areaServed: {
      '@type': 'Country',
      name: 'United States'
    }
  };
}

export function buildWebSiteJsonLd(): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': `${site.domain}/#website`,
    name: site.name,
    url: site.domain,
    publisher: { '@id': `${site.domain}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${site.domain}/shop?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; url: string }>): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url)
    }))
  };
}

export function buildCollectionPageJsonLd({
  name,
  description,
  url,
  products = []
}: {
  name: string;
  description: string;
  url: string;
  products?: Product[];
}): JsonLdNode {
  return {
    '@type': 'CollectionPage',
    name,
    description,
    url: absoluteUrl(url),
    isPartOf: { '@id': `${site.domain}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: products.slice(0, 24).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: absoluteUrl(`/shop/${product.slug}`),
        name: product.title
      }))
    }
  };
}

export function buildProductJsonLd(product: Product, category?: Category): JsonLdNode {
  const gallery = Array.from(new Set([product.heroImage, ...product.gallery])).map((image) => imageUrl(image));
  const additionalProperty = [
    product.tested.length
      ? { '@type': 'PropertyValue', name: 'Testing checklist', value: product.tested.join('; ') }
      : null,
    product.included.length
      ? { '@type': 'PropertyValue', name: 'Included accessories', value: product.included.join('; ') }
      : null,
    product.flaws.length ? { '@type': 'PropertyValue', name: 'Disclosed flaws', value: product.flaws.join('; ') } : null,
    product.storageType ? { '@type': 'PropertyValue', name: 'Storage type', value: product.storageType } : null,
    product.filmFormat ? { '@type': 'PropertyValue', name: 'Film format', value: product.filmFormat } : null,
    product.lensMount ? { '@type': 'PropertyValue', name: 'Lens mount', value: product.lensMount } : null
  ].filter(Boolean);

  return {
    '@type': 'Product',
    '@id': `${site.domain}/shop/${product.slug}#product`,
    name: product.title,
    brand: { '@type': 'Brand', name: product.brand },
    manufacturer: product.manufacturer || product.brand,
    model: product.model,
    sku: product.sku,
    mpn: product.model,
    description: product.seoDescription || product.shortDescription,
    image: gallery,
    category: category?.name ?? product.categorySlug,
    itemCondition: productConditionUrl(product),
    additionalProperty,
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(`/shop/${product.slug}`),
      price: product.price.toFixed(2),
      priceCurrency: 'USD',
      availability: productAvailabilityUrl(product),
      itemCondition: productConditionUrl(product),
      seller: { '@id': `${site.domain}/#organization` },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'US'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 2,
            maxValue: 7,
            unitCode: 'DAY'
          }
        },
        shippingSettingsLink: absoluteUrl('/shipping')
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'US',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/ReturnShippingFees',
        merchantReturnLink: absoluteUrl('/returns')
      }
    }
  };
}
