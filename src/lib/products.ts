export type Product = {
  id: string;
  slug: string;
  sku: string;
  title: string;
  brand: string;
  model: string;
  categorySlug: string;
  condition: 'Mint' | 'Excellent' | 'Good' | 'Fair' | 'For Parts';
  price: number;
  status: 'in-stock' | 'sold-out' | 'coming-soon';
  heroImage: string;
  gallery: string[];
  shortDescription: string;
  goodFor: string[];
  included: string[];
  tested: string[];
  notes: string[];
  checkoutUrl?: string;
};

export const products: Product[] = [
  {
    id: 'canon-sd1000-silver-001',
    slug: 'canon-powershot-sd1000-silver-tested',
    sku: 'SB-CANON-SD1000-001',
    title: 'Canon PowerShot SD1000 Silver — Tested Vintage Digital Camera',
    brand: 'Canon',
    model: 'PowerShot SD1000',
    categorySlug: 'vintage-digital-cameras',
    condition: 'Excellent',
    price: 344.99,
    status: 'in-stock',
    heroImage: '/placeholder-camera.svg',
    gallery: ['/placeholder-camera.svg'],
    shortDescription:
      'A clean Canon PowerShot SD1000 with the classic compact digital camera look. Tested, photographed, and ready to shoot.',
    goodFor: ['Y2K-style photos', 'Travel snapshots', 'Collectors', 'Everyday compact carry'],
    included: ['Canon PowerShot SD1000 camera body', 'Battery', 'Charger', 'Wrist strap'],
    tested: ['Powers on', 'Zoom works', 'Flash fires', 'Screen works', 'Buttons respond', 'Photos save to SD card'],
    notes: ['Minor cosmetic wear from normal use', 'Sample images should be added before publishing'],
    checkoutUrl: '#'
  },
  {
    id: 'olympus-fe340-001',
    slug: 'olympus-fe-340-tested-vintage-digital-camera',
    sku: 'SB-OLY-FE340-001',
    title: 'Olympus FE-340 — Tested Vintage Digital Camera',
    brand: 'Olympus',
    model: 'FE-340',
    categorySlug: 'vintage-digital-cameras',
    condition: 'Good',
    price: 179.99,
    status: 'in-stock',
    heroImage: '/placeholder-camera.svg',
    gallery: ['/placeholder-camera.svg'],
    shortDescription:
      'A compact Olympus digital camera with a simple point-and-shoot feel and nostalgic photo character.',
    goodFor: ['Casual photos', 'Nostalgic digital look', 'Beginner point-and-shoot use'],
    included: ['Olympus FE-340 camera body', 'Battery', 'USB cable'],
    tested: ['Powers on', 'Lens extends', 'Screen works', 'Menu responds', 'Photos save to memory card'],
    notes: ['Light body wear', 'Charger details should be confirmed before publishing'],
    checkoutUrl: '#'
  },
  {
    id: 'nikon-coolpix-s220-001',
    slug: 'nikon-coolpix-s220-tested-digital-camera',
    sku: 'SB-NIKON-S220-001',
    title: 'Nikon Coolpix S220 — Tested Compact Digital Camera',
    brand: 'Nikon',
    model: 'Coolpix S220',
    categorySlug: 'vintage-digital-cameras',
    condition: 'Good',
    price: 149.99,
    status: 'coming-soon',
    heroImage: '/placeholder-camera.svg',
    gallery: ['/placeholder-camera.svg'],
    shortDescription:
      'Slim Nikon Coolpix compact camera. Add real photos, testing details, and final price before launch.',
    goodFor: ['Pocket carry', 'Vintage digital photos', 'Affordable starter camera'],
    included: ['Nikon Coolpix S220 camera body'],
    tested: ['Testing pending'],
    notes: ['Coming soon placeholder listing'],
    checkoutUrl: '#'
  },
  {
    id: 'sony-dsc-w120-001',
    slug: 'sony-cyber-shot-dsc-w120-tested-camera',
    sku: 'SB-SONY-W120-001',
    title: 'Sony Cyber-shot DSC-W120 — Tested Digital Camera',
    brand: 'Sony',
    model: 'Cyber-shot DSC-W120',
    categorySlug: 'vintage-digital-cameras',
    condition: 'Excellent',
    price: 199.99,
    status: 'sold-out',
    heroImage: '/placeholder-camera.svg',
    gallery: ['/placeholder-camera.svg'],
    shortDescription:
      'Sold-out model page example. Keep these pages indexed and collect restock interest for high-demand cameras.',
    goodFor: ['Restock alerts', 'SEO model pages', 'Collector demand capture'],
    included: ['Sold-out example listing'],
    tested: ['Previously tested unit sold'],
    notes: ['Use sold-out model pages to rank and capture emails'],
    checkoutUrl: '#'
  }
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(categorySlug: string) {
  return products.filter((product) => product.categorySlug === categorySlug);
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
}
