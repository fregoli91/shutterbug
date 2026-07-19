import { POPULAR_CAMERA_BRANDS } from '@/lib/catalog';
import { getCatalogProducts, products, type Product } from '@/lib/products';
import { brandSlug, titleFromSlug } from '@/lib/seo-utils';

export type BrandPage = {
  name: string;
  slug: string;
  products: Product[];
  description: string;
};

const priorityBrands = [
  'Canon',
  'Nikon',
  'Olympus',
  'Sony',
  'Kodak',
  'Fujifilm',
  'Panasonic',
  'Pentax',
  'Minolta',
  'Leica',
  'Polaroid',
  'HP'
];

export function getBrandSlug(name: string) {
  return brandSlug(name);
}

export function brandNameFromSlug(slug: string) {
  const known = [...priorityBrands, ...POPULAR_CAMERA_BRANDS].find((brand) => brandSlug(brand) === slug);
  return known ?? titleFromSlug(slug);
}

function brandDescription(name: string, count: number) {
  const base =
    count > 0
      ? `Shop ${name} cameras and gear from Shutterbug Camera Shop with clear condition notes, testing details, real photos, and honest availability.`
      : `Browse Shutterbug's ${name} camera page for future inventory, restock interest, and used-camera buying help.`;

  if (name === 'Canon') {
    return `${base} Canon PowerShot and Canon film/digital models are common high-intent searches for used-camera buyers.`;
  }

  if (name === 'Olympus') {
    return `${base} Olympus compact digital and film cameras are popular for easy point-and-shoot shooting.`;
  }

  if (name === 'Nikon') {
    return `${base} Nikon Coolpix, DSLR, lens, and compact-camera listings should include clear testing and accessory notes.`;
  }

  if (name === 'Sony') {
    return `${base} Sony Cyber-shot and Handycam listings should make storage, batteries, and functional testing easy to understand.`;
  }

  return base;
}

export function buildBrandPages(catalog: Product[]): BrandPage[] {
  const names = Array.from(new Set([...priorityBrands, ...catalog.map((product) => product.brand).filter(Boolean)]));

  return names
    .map((name) => {
      const slug = brandSlug(name);
      const brandProducts = catalog.filter((product) => brandSlug(product.brand) === slug);

      return {
        name,
        slug,
        products: brandProducts,
        description: brandDescription(name, brandProducts.length)
      };
    })
    .sort((a, b) => {
      if (a.products.length !== b.products.length) return b.products.length - a.products.length;
      return a.name.localeCompare(b.name);
    });
}

export async function getBrandPages() {
  const catalog = await getCatalogProducts();
  return buildBrandPages(catalog);
}

export async function getBrandPageBySlug(slug: string) {
  const pages = await getBrandPages();
  return pages.find((page) => page.slug === slug) ?? null;
}

export function getStaticBrandParams() {
  return buildBrandPages(products).map((brand) => ({ slug: brand.slug }));
}
