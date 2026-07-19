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

export const products: Product[] = [
  {
    id: 'canon-sd1000-silver-001',
    slug: 'canon-powershot-sd1000-silver-tested',
    sku: 'SB-CANON-SD1000-001',
    title: 'Canon PowerShot SD1000 Silver - Tested Vintage Digital Camera',
    brand: 'Canon',
    model: 'PowerShot SD1000',
    categorySlug: 'vintage-digital-cameras',
    categorySlugs: ['vintage-digital-cameras', 'canon-powershot-cameras'],
    cameraType: 'Vintage Digital',
    format: 'Digital',
    condition: 'Used - Excellent',
    conditionSummary: 'Clean body, bright screen, light normal wear.',
    price: 344.99,
    status: 'active',
    heroImage: '/placeholder-camera.svg',
    gallery: ['/placeholder-camera.svg'],
    shortDescription:
      'A clean Canon PowerShot SD1000 with the classic compact digital camera look. Tested, photographed, and ready to shoot.',
    seoDescription:
      'Tested Canon PowerShot SD1000 vintage digital camera with battery, charger, clear condition notes, and ready-to-shoot compact digital character.',
    badges: ['Tested', 'Actual photos', 'Ready to shoot'],
    includesBattery: true,
    includesCharger: true,
    actualPhotos: true,
    goodFor: ['Y2K-style photos', 'Travel snapshots', 'Collectors', 'Everyday compact carry'],
    included: ['Canon PowerShot SD1000 camera body', 'Battery', 'Charger', 'Wrist strap'],
    tested: ['Powers on', 'Zoom works', 'Flash fires', 'Screen works', 'Buttons respond', 'Photos save to SD card'],
    cosmeticNotes: ['Light marks from normal use', 'Lens ring and buttons present well', 'Screen has minor surface wear'],
    functionalNotes: ['Starts quickly', 'Zoom and shutter respond normally', 'Sample photos save to SD card'],
    flaws: ['Minor cosmetic wear from normal use'],
    notes: ['Actual sample images should be added before final publishing'],
    shippingNote: 'Ships from Shutterbug Camera Shop with protective packing.',
    returnsNote: 'Return eligible if the item arrives not as described.',
    checkoutUrl: '#'
  },
  {
    id: 'olympus-fe340-001',
    slug: 'olympus-fe-340-tested-vintage-digital-camera',
    sku: 'SB-OLY-FE340-001',
    title: 'Olympus FE-340 - Tested Vintage Digital Camera',
    brand: 'Olympus',
    model: 'FE-340',
    categorySlug: 'vintage-digital-cameras',
    categorySlugs: ['vintage-digital-cameras', 'olympus-digital-cameras'],
    cameraType: 'Vintage Digital',
    format: 'Digital',
    condition: 'Used - Good',
    conditionSummary: 'Fully tested with light body wear.',
    price: 179.99,
    status: 'active',
    heroImage: '/placeholder-camera.svg',
    gallery: ['/placeholder-camera.svg'],
    shortDescription:
      'A compact Olympus digital camera with a simple point-and-shoot feel and nostalgic photo character.',
    seoDescription:
      'Tested Olympus FE-340 vintage digital camera with battery, clear function checks, and honest cosmetic condition notes.',
    badges: ['Tested', 'Compact', 'Nostalgic look'],
    includesBattery: true,
    includesCharger: false,
    actualPhotos: true,
    goodFor: ['Casual photos', 'Nostalgic digital look', 'Beginner point-and-shoot use'],
    included: ['Olympus FE-340 camera body', 'Battery', 'USB cable'],
    tested: ['Powers on', 'Lens extends', 'Screen works', 'Menu responds', 'Photos save to memory card'],
    cosmeticNotes: ['Light body wear', 'Clean lens glass at inspection', 'Normal handling marks'],
    functionalNotes: ['Power and lens extension tested', 'Menu and buttons respond', 'Photo capture checked'],
    flaws: ['Charger details should be confirmed before final publishing'],
    notes: ['Great starter compact for vintage digital photos'],
    shippingNote: 'Ships from Shutterbug Camera Shop with battery protected in transit.',
    returnsNote: 'Return eligible if testing notes do not match the camera received.',
    checkoutUrl: '#'
  },
  {
    id: 'nikon-coolpix-s220-001',
    slug: 'nikon-coolpix-s220-tested-digital-camera',
    sku: 'SB-NIKON-S220-001',
    title: 'Nikon Coolpix S220 - Tested Compact Digital Camera',
    brand: 'Nikon',
    model: 'Coolpix S220',
    categorySlug: 'vintage-digital-cameras',
    categorySlugs: ['vintage-digital-cameras', 'nikon-coolpix-cameras'],
    cameraType: 'Vintage Digital',
    format: 'Digital',
    condition: 'Used - Good',
    conditionSummary: 'Slim pocket camera, final testing pending before sale.',
    price: 149.99,
    status: 'archived',
    heroImage: '/placeholder-camera.svg',
    gallery: ['/placeholder-camera.svg'],
    shortDescription:
      'Slim Nikon Coolpix compact camera. Final photos, testing details, and checkout will be added before sale.',
    seoDescription:
      'Nikon Coolpix S220 compact digital camera listing for vintage digital camera buyers looking for a pocket-friendly point-and-shoot.',
    badges: ['Coming soon', 'Pocket compact'],
    includesBattery: false,
    includesCharger: false,
    actualPhotos: false,
    goodFor: ['Pocket carry', 'Vintage digital photos', 'Affordable starter camera'],
    included: ['Nikon Coolpix S220 camera body'],
    tested: ['Testing pending'],
    cosmeticNotes: ['Coming soon listing with final photos and grading pending'],
    functionalNotes: ['Full Shutterbug testing checklist will be completed before sale'],
    flaws: ['Final battery and charger status pending'],
    notes: ['Coming soon listing with final photos and testing details pending'],
    shippingNote: 'Shipping details will be confirmed once the listing is finalized.',
    returnsNote: 'Final return eligibility will be shown once the item is available.',
    checkoutUrl: '#'
  },
  {
    id: 'sony-dsc-w120-001',
    slug: 'sony-cyber-shot-dsc-w120-tested-camera',
    sku: 'SB-SONY-W120-001',
    title: 'Sony Cyber-shot DSC-W120 - Tested Digital Camera',
    brand: 'Sony',
    model: 'Cyber-shot DSC-W120',
    categorySlug: 'vintage-digital-cameras',
    categorySlugs: ['vintage-digital-cameras', 'sony-cyber-shot-cameras'],
    cameraType: 'Vintage Digital',
    format: 'Digital',
    condition: 'Used - Excellent',
    conditionSummary: 'Sold example page for a high-demand compact model.',
    price: 199.99,
    status: 'sold_out',
    heroImage: '/placeholder-camera.svg',
    gallery: ['/placeholder-camera.svg'],
    shortDescription:
      'Sold-out Sony Cyber-shot model page example. Keep these pages indexed and collect restock interest for high-demand cameras.',
    seoDescription:
      'Sony Cyber-shot DSC-W120 compact digital camera sold listing with testing language, condition notes, and restock interest path.',
    badges: ['Sold out', 'Restock interest'],
    includesBattery: true,
    includesCharger: true,
    actualPhotos: true,
    goodFor: ['Restock alerts', 'SEO model pages', 'Collector demand capture'],
    included: ['Sold-out example listing'],
    tested: ['Previously tested unit sold'],
    cosmeticNotes: ['Sold-out listing retained for model demand'],
    functionalNotes: ['Previously tested unit sold'],
    flaws: ['No active unit available right now'],
    notes: ['Use sold-out model pages to rank and capture emails'],
    shippingNote: 'Sold-out item. Similar cameras ship from Shutterbug Camera Shop when available.',
    returnsNote: 'Returns apply to active inventory only.',
    checkoutUrl: '#'
  }
];

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
  const hero = product.mainImageUrl || relationHero;
  const gallery = Array.from(new Set([hero, ...product.imageUrls, ...sortedImages.map((image) => image.url)].filter(Boolean)));
  const publicStatus = product.quantity <= 0 && product.status === DbProductStatus.ACTIVE ? 'sold_out' : statusFromDb[product.status];

  return {
    id: product.id,
    slug: product.slug,
    sku: product.sku ?? product.id,
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
    functionalStatus: product.testedStatus || product.functionalStatus || 'Tested',
    testedStatus: product.testedStatus || product.functionalStatus || 'Tested',
    conditionSummary: product.conditionNotes || product.conditionSummary,
    conditionNotes: product.conditionNotes || product.conditionSummary,
    price: product.priceCents / 100,
    priceCents: product.priceCents,
    quantity: product.quantity,
    status: publicStatus,
    heroImage: hero ?? '/placeholder-camera.svg',
    gallery: gallery.length ? gallery : ['/placeholder-camera.svg'],
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
    return dbProducts.map(dbProductToProduct);
  } catch (error) {
    console.warn('Falling back to static products because the product database could not be read.', error);
    return null;
  }
}

export async function getCatalogProducts() {
  const dbProducts = await readDbProducts();
  return dbProducts && dbProducts.length ? dbProducts : publicProducts;
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
        return dbProductToProduct(dbProduct);
      }
    } catch (error) {
      console.warn(`Falling back to static product lookup for ${slug}.`, error);
    }
  }

  return getProduct(slug);
}

export async function getProductsByCategoryAsync(categorySlug: string) {
  const catalog = await getCatalogProducts();
  return catalog.filter(
    (product) => product.categorySlug === categorySlug || product.categorySlugs.includes(categorySlug)
  );
}

export async function getSimilarProductsAsync(product: Product, limit = 3) {
  const catalog = await getCatalogProducts();
  return catalog
    .filter(
      (candidate) =>
        candidate.id !== product.id &&
        (candidate.brand === product.brand ||
          candidate.categorySlugs.some((slug) => product.categorySlugs.includes(slug)))
    )
    .slice(0, limit);
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
  return publicProducts.filter(
    (product) => product.categorySlug === categorySlug || product.categorySlugs.includes(categorySlug)
  );
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
