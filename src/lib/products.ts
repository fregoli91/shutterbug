import {
  CameraFormat as DbCameraFormat,
  CameraType as DbCameraType,
  ProductCondition as DbProductCondition,
  ProductImageRole,
  ProductStatus as DbProductStatus,
  type Prisma
} from '@/generated/prisma/client';
import {
  CAMERA_BRANDS,
  FILM_FORMATS,
  FUNCTIONAL_STATUSES,
  LENS_MOUNTS,
  PRODUCT_TYPES,
  STORAGE_TYPES,
  TOP_LEVEL_CATEGORIES
} from '@/lib/catalog';
import { getPrisma } from '@/lib/prisma';
import { safeProductImageUrl } from '@/lib/security';
import { availableRelatedProducts, isIndexableProduct, isPrinter, isStorefrontReadyProduct } from '@/lib/catalog-seo';

export type ProductStatus = 'draft' | 'active' | 'sold_out' | 'archived';
export type ProductCondition =
  | 'New'
  | 'Open Box'
  | 'Used - Excellent'
  | 'Used - Good'
  | 'Used - Fair'
  | 'For Parts';
export type CameraType = 'Vintage Digital' | 'Film Camera' | 'Accessory' | 'Parts & Repair';
export type CameraFormat = 'Digital' | 'Film' | 'Accessory';

export type Product = {
  id: string;
  slug: string;
  sku: string;
  gtin?: string;
  mpn?: string;
  title: string;
  brand: string;
  manufacturer?: string;
  model: string;
  categorySlug: string;
  categorySlugs: string[];
  subcategorySlug?: string;
  productType?: string;
  cameraType: CameraType;
  format: CameraFormat;
  condition: ProductCondition;
  functionalStatus?: string;
  testedStatus?: string;
  conditionSummary: string;
  conditionNotes?: string;
  price: number;
  priceCents?: number;
  quantity?: number;
  status: ProductStatus;
  heroImage: string;
  gallery: string[];
  imageAlts?: Record<string, string>;
  updatedAt?: string;
  shortDescription: string;
  seoTitle?: string;
  seoDescription: string;
  tags?: string[];
  lensMount?: string;
  filmFormat?: string;
  storageType?: string;
  badges: string[];
  includesBattery: boolean;
  includesCharger: boolean;
  includesMemoryCard?: boolean;
  includesCase?: boolean;
  includesStrap?: boolean;
  includesManual?: boolean;
  includesOriginalBox?: boolean;
  actualPhotos: boolean;
  samplePhotos?: boolean;
  partsRepair?: boolean;
  featured?: boolean;
  newArrival?: boolean;
  createdAt?: string;
  tested: string[];
  included: string[];
  doesNotInclude?: string[];
  goodFor: string[];
  cosmeticNotes: string[];
  functionalNotes: string[];
  flaws: string[];
  notes: string[];
  shippingNote: string;
  returnsNote: string;
  checkoutUrl?: string;
  mainImageUrl?: string;
  imageUrls?: string[];
};

type ProductWithImages = Prisma.ProductGetPayload<{ include: { images: true } }>;

export const products: Product[] = [];

export const brands = Array.from(new Set(products.map((product) => product.brand))).sort();
export const cameraTypes = Array.from(new Set(products.map((product) => product.cameraType)));
export const conditions: ProductCondition[] = [
  'New',
  'Open Box',
  'Used - Excellent',
  'Used - Good',
  'Used - Fair',
  'For Parts'
];

const statusFromDb: Record<DbProductStatus, ProductStatus> = {
  [DbProductStatus.DRAFT]: 'draft',
  [DbProductStatus.ACTIVE]: 'active',
  [DbProductStatus.SOLD_OUT]: 'sold_out',
  [DbProductStatus.ARCHIVED]: 'archived'
};

const conditionFromDb: Record<DbProductCondition, ProductCondition> = {
  [DbProductCondition.NEW]: 'New',
  [DbProductCondition.OPEN_BOX]: 'Open Box',
  [DbProductCondition.USED_EXCELLENT]: 'Used - Excellent',
  [DbProductCondition.USED_GOOD]: 'Used - Good',
  [DbProductCondition.USED_FAIR]: 'Used - Fair',
  [DbProductCondition.FOR_PARTS]: 'For Parts'
};

const cameraTypeFromDb: Record<DbCameraType, CameraType> = {
  [DbCameraType.VINTAGE_DIGITAL]: 'Vintage Digital',
  [DbCameraType.FILM_CAMERA]: 'Film Camera',
  [DbCameraType.ACCESSORY]: 'Accessory',
  [DbCameraType.PARTS_REPAIR]: 'Parts & Repair'
};

const formatFromDb: Record<DbCameraFormat, CameraFormat> = {
  [DbCameraFormat.DIGITAL]: 'Digital',
  [DbCameraFormat.FILM]: 'Film',
  [DbCameraFormat.ACCESSORY]: 'Accessory'
};

export const statusToDb: Record<ProductStatus, DbProductStatus> = {
  draft: DbProductStatus.DRAFT,
  active: DbProductStatus.ACTIVE,
  sold_out: DbProductStatus.SOLD_OUT,
  archived: DbProductStatus.ARCHIVED
};

export const conditionToDb: Record<ProductCondition, DbProductCondition> = {
  New: DbProductCondition.NEW,
  'Open Box': DbProductCondition.OPEN_BOX,
  'Used - Excellent': DbProductCondition.USED_EXCELLENT,
  'Used - Good': DbProductCondition.USED_GOOD,
  'Used - Fair': DbProductCondition.USED_FAIR,
  'For Parts': DbProductCondition.FOR_PARTS
};

export const cameraTypeToDb: Record<CameraType, DbCameraType> = {
  'Vintage Digital': DbCameraType.VINTAGE_DIGITAL,
  'Film Camera': DbCameraType.FILM_CAMERA,
  Accessory: DbCameraType.ACCESSORY,
  'Parts & Repair': DbCameraType.PARTS_REPAIR
};

export const formatToDb: Record<CameraFormat, DbCameraFormat> = {
  Digital: DbCameraFormat.DIGITAL,
  Film: DbCameraFormat.FILM,
  Accessory: DbCameraFormat.ACCESSORY
};

function dbProductToProduct(product: ProductWithImages): Product {
  const sortedImages = [...product.images].sort((a, b) => a.sortOrder - b.sortOrder);
  const relationHero = sortedImages.find((image) => image.role === ProductImageRole.HERO)?.url ?? sortedImages[0]?.url;
  const hero = safeProductImageUrl(product.mainImageUrl || relationHero) || '/shutterbug-product-placeholder.png';
  const gallery = Array.from(
    new Set(
      [hero, ...product.imageUrls, ...sortedImages.map((image) => image.url)]
        .map((image) => safeProductImageUrl(image))
        .filter((image): image is string => Boolean(image))
    )
  );
  const publicStatus = product.quantity <= 0 && product.status === DbProductStatus.ACTIVE ? 'sold_out' : statusFromDb[product.status];

  return {
    id: product.id,
    slug: product.slug,
    sku: product.sku ?? product.id,
    gtin: product.gtin || undefined,
    mpn: product.mpn || undefined,
    title: product.title,
    brand: product.brand,
    manufacturer: product.manufacturer || product.brand,
    model: product.model,
    categorySlug: product.categorySlug,
    categorySlugs: product.categorySlugs,
    subcategorySlug: product.subcategorySlug || undefined,
    productType: product.productType || undefined,
    cameraType: cameraTypeFromDb[product.cameraType],
    format: formatFromDb[product.format],
    condition: conditionFromDb[product.condition],
    functionalStatus: product.testedStatus || product.functionalStatus || undefined,
    testedStatus: product.testedStatus || product.functionalStatus || undefined,
    conditionSummary: product.conditionNotes || product.conditionSummary,
    conditionNotes: product.conditionNotes || product.conditionSummary,
    price: product.priceCents / 100,
    priceCents: product.priceCents,
    quantity: product.quantity,
    status: publicStatus,
    heroImage: hero ?? '/shutterbug-product-placeholder.png',
    gallery: gallery.length ? gallery : ['/shutterbug-product-placeholder.png'],
    imageAlts: Object.fromEntries(sortedImages.filter((image) => image.alt.trim()).map((image) => [image.url, image.alt.trim()])),
    updatedAt: product.updatedAt.toISOString(),
    shortDescription: product.shortDescription || product.description,
    seoTitle: product.seoTitle ?? undefined,
    seoDescription: product.seoDescription || product.shortDescription || product.description,
    tags: product.tags,
    lensMount: product.lensMount || undefined,
    filmFormat: product.filmFormat || undefined,
    storageType: product.storageType || undefined,
    badges: product.badges,
    includesBattery: product.includesBattery,
    includesCharger: product.includesCharger,
    includesMemoryCard: product.includesMemoryCard,
    includesCase: product.includesCase,
    includesStrap: product.includesStrap,
    includesManual: product.includesManual,
    includesOriginalBox: product.includesOriginalBox,
    actualPhotos: product.actualPhotos,
    samplePhotos: product.samplePhotos,
    partsRepair: product.forPartsOrRepair || product.partsRepair,
    featured: product.featured,
    newArrival: product.newArrival,
    createdAt: product.createdAt.toISOString(),
    tested: product.tested,
    included: product.included,
    doesNotInclude: product.doesNotInclude,
    goodFor: product.goodFor,
    cosmeticNotes: product.cosmeticNotes,
    functionalNotes: product.functionalNotes,
    flaws: product.flaws,
    notes: product.notes,
    shippingNote: product.shippingNote,
    returnsNote: product.returnsNote,
    checkoutUrl: product.checkoutUrl ?? undefined,
    mainImageUrl: product.mainImageUrl || undefined,
    imageUrls: product.imageUrls
  };
}

export function isPublicCatalogStatus(status: ProductStatus) {
  return status === 'active' || status === 'sold_out';
}

export function isActiveProduct(product: Product) {
  return product.status === 'active' && (product.quantity ?? 1) > 0;
}

export const publicProducts = products.filter((product) => isPublicCatalogStatus(product.status));

async function readDbProducts() {
  const prisma = getPrisma();
  if (!prisma) return null;

  try {
    const dbProducts = await prisma.product.findMany({
      where: { status: { in: [DbProductStatus.ACTIVE, DbProductStatus.SOLD_OUT] } },
      include: { images: true },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }]
    });
    return dbProducts
      .map(dbProductToProduct)
      .filter((product) => product.status === 'active' ? isStorefrontReadyProduct(product) : isIndexableProduct(product));
  } catch {
    console.error('Product database read failed.');
    return null;
  }
}

export async function getCatalogProducts() {
  const dbProducts = await readDbProducts();
  if (dbProducts) return dbProducts;
  return [];
}

export async function getActiveCatalogProducts() {
  const catalog = await getCatalogProducts();
  return catalog.filter(isActiveProduct);
}

export async function getProductBySlug(slug: string) {
  const prisma = getPrisma();
  if (prisma) {
    try {
      const dbProduct = await prisma.product.findUnique({
        where: { slug },
        include: { images: true }
      });
      if (
        dbProduct &&
        (dbProduct.status === DbProductStatus.ACTIVE || dbProduct.status === DbProductStatus.SOLD_OUT)
      ) {
        const product = dbProductToProduct(dbProduct);
        if (product.status === 'active' && !isStorefrontReadyProduct(product)) return undefined;
        if (product.status === 'sold_out' && !isIndexableProduct(product)) return undefined;
        return product;
      }
    } catch {
      console.error('Product database lookup failed.');
      if (process.env.NODE_ENV === 'production') return undefined;
    }
  }

  return undefined;
}

export function productMatchesCategory(product: Product, categorySlug: string) {
  if (categorySlug === 'vintage-cameras') {
    if (isPrinter(product)) return false;
    return (
      product.cameraType === 'Vintage Digital' ||
      product.cameraType === 'Film Camera' ||
      product.categorySlugs.includes('vintage-digital-cameras') ||
      product.categorySlugs.includes('film-cameras')
    );
  }

  return product.categorySlug === categorySlug || product.categorySlugs.includes(categorySlug);
}

export async function getProductsByCategoryAsync(categorySlug: string) {
  const catalog = await getCatalogProducts();
  return catalog.filter((product) => productMatchesCategory(product, categorySlug));
}

export async function getSimilarProductsAsync(product: Product, limit = 3) {
  const catalog = await getCatalogProducts();
  return availableRelatedProducts(product, catalog, limit);
}

export function getFilterOptions(catalog: Product[]) {
  const catalogBrands = catalog.map((product) => product.brand).filter(Boolean);
  const catalogCategories = catalog.flatMap((product) => [product.categorySlug, ...product.categorySlugs]).filter(Boolean);

  const unique = (values: string[]) => Array.from(new Set(values.filter(Boolean)));

  return {
    brands: unique([...CAMERA_BRANDS, ...catalogBrands]),
    categories: unique([...TOP_LEVEL_CATEGORIES.map((category) => category.slug), ...catalogCategories]),
    cameraTypes: Array.from(new Set(catalog.map((product) => product.cameraType))),
    productTypes: unique([...PRODUCT_TYPES, ...catalog.map((product) => product.productType ?? '')]),
    functionalStatuses: unique([...FUNCTIONAL_STATUSES, ...catalog.map((product) => product.functionalStatus ?? '')]),
    lensMounts: unique([...LENS_MOUNTS, ...catalog.map((product) => product.lensMount ?? '')]),
    filmFormats: unique([...FILM_FORMATS, ...catalog.map((product) => product.filmFormat ?? '')]),
    storageTypes: unique([...STORAGE_TYPES, ...catalog.map((product) => product.storageType ?? '')]),
    conditions
  };
}

export function isPurchasable(product: Product) {
  return isActiveProduct(product);
}

export function getProduct(slug: string) {
  return publicProducts.find((product) => product.slug === slug);
}

export function getProductsByCategory(categorySlug: string) {
  return publicProducts.filter((product) => productMatchesCategory(product, categorySlug));
}

export function getSimilarProducts(product: Product, limit = 3) {
  return publicProducts
    .filter(
      (candidate) =>
        candidate.id !== product.id &&
        (candidate.brand === product.brand ||
          candidate.categorySlugs.some((slug) => product.categorySlugs.includes(slug)))
    )
    .slice(0, limit);
}

export function getAvailabilityLabel(status: ProductStatus) {
  if (status === 'active') return 'Active';
  if (status === 'sold_out') return 'Sold out';
  if (status === 'archived') return 'Archived';
  return 'Draft';
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
}
