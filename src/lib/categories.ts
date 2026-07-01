export type Category = {
  slug: string;
  name: string;
  navLabel: string;
  description: string;
  seoTitle: string;
  intro: string;
  keywords: string[];
};

export const categories: Category[] = [
  {
    slug: 'vintage-digital-cameras',
    name: 'Vintage Digital Cameras',
    navLabel: 'Vintage Digital',
    description: 'Tested compact digital cameras from Canon, Olympus, Nikon, Sony, Kodak, Fujifilm, and more.',
    seoTitle: 'Tested Vintage Digital Cameras',
    intro:
      'Shop tested vintage digital cameras with real condition notes, clear included accessories, and the nostalgic CCD-style look buyers love.',
    keywords: ['vintage digital cameras', 'used digital cameras', 'CCD digital camera']
  },
  {
    slug: 'canon-powershot-cameras',
    name: 'Canon PowerShot Cameras',
    navLabel: 'Canon PowerShot',
    description: 'Curated Canon PowerShot compact cameras with tested functions and exact-item notes.',
    seoTitle: 'Canon PowerShot Cameras',
    intro:
      'Canon PowerShot cameras are some of the most requested vintage digital models. Listings call out battery, charger, testing, and cosmetic notes.',
    keywords: ['Canon PowerShot camera', 'used Canon PowerShot', 'Canon digital camera']
  },
  {
    slug: 'olympus-digital-cameras',
    name: 'Olympus Digital Cameras',
    navLabel: 'Olympus',
    description: 'Olympus compact digital cameras selected for easy point-and-shoot use and nostalgic color.',
    seoTitle: 'Olympus Digital Cameras',
    intro:
      'Browse Olympus digital cameras with transparent testing notes, included accessory details, and honest condition grading.',
    keywords: ['Olympus digital camera', 'Olympus compact camera']
  },
  {
    slug: 'nikon-coolpix-cameras',
    name: 'Nikon Coolpix Cameras',
    navLabel: 'Nikon Coolpix',
    description: 'Slim Nikon Coolpix compact cameras for pocket carry, travel, and vintage digital photos.',
    seoTitle: 'Nikon Coolpix Cameras',
    intro:
      'Nikon Coolpix cameras are compact, approachable, and easy to carry. Shutterbug listings separate tested units from coming-soon or parts cameras.',
    keywords: ['Nikon Coolpix camera', 'used Nikon Coolpix']
  },
  {
    slug: 'sony-cyber-shot-cameras',
    name: 'Sony Cyber-shot Cameras',
    navLabel: 'Sony Cyber-shot',
    description: 'Sony Cyber-shot compact digital cameras with restock demand and clear condition details.',
    seoTitle: 'Sony Cyber-shot Cameras',
    intro:
      'Sony Cyber-shot cameras are popular for vintage digital photography, pocket carry, and model-specific collector demand.',
    keywords: ['Sony Cyber-shot camera', 'used Sony digital camera']
  },
  {
    slug: 'kodak-easyshare-cameras',
    name: 'Kodak EasyShare Cameras',
    navLabel: 'Kodak EasyShare',
    description: 'Kodak EasyShare cameras for warm nostalgic digital photos and casual point-and-shoot use.',
    seoTitle: 'Kodak EasyShare Cameras',
    intro:
      'Kodak EasyShare cameras bring a familiar compact-camera feel. Inventory is sorted by tested status, included accessories, and condition.',
    keywords: ['Kodak EasyShare camera', 'used Kodak digital camera']
  },
  {
    slug: 'fujifilm-finepix-cameras',
    name: 'Fujifilm FinePix Cameras',
    navLabel: 'Fujifilm FinePix',
    description: 'Fujifilm FinePix digital cameras with clear grading, testing, and included accessory notes.',
    seoTitle: 'Fujifilm FinePix Cameras',
    intro:
      'Fujifilm FinePix cameras are a natural fit for buyers looking for a compact used digital camera with vintage character.',
    keywords: ['Fujifilm FinePix camera', 'used Fujifilm digital camera']
  },
  {
    slug: 'film-cameras',
    name: 'Film Cameras',
    navLabel: 'Film Cameras',
    description: 'Classic 35mm and point-and-shoot film cameras with clear condition notes.',
    seoTitle: 'Film Cameras',
    intro:
      'Film camera listings focus on honest cosmetic notes, function checks where possible, and clear disclosure of limitations.',
    keywords: ['film camera shop', 'used film camera']
  },
  {
    slug: 'camera-accessories',
    name: 'Camera Accessories',
    navLabel: 'Accessories',
    description: 'Chargers, batteries, memory cards, camera bags, straps, cables, and useful add-ons.',
    seoTitle: 'Camera Accessories',
    intro:
      'Find batteries, chargers, cards, cases, straps, and practical add-ons that help vintage cameras stay ready to shoot.',
    keywords: ['camera accessories', 'camera batteries', 'camera chargers']
  },
  {
    slug: 'parts-repair',
    name: 'Parts & Repair Cameras',
    navLabel: 'Parts & Repair',
    description: 'As-is cameras, lenses, and electronics for repair, parts harvesting, and collectors.',
    seoTitle: 'Parts and Repair Cameras',
    intro:
      'Parts and repair cameras are clearly marked as as-is. These listings are for repair projects, parts harvesting, or display use.',
    keywords: ['parts repair cameras', 'as-is camera', 'camera repair parts']
  }
];

export const featuredCategorySlugs = [
  'canon-powershot-cameras',
  'olympus-digital-cameras',
  'nikon-coolpix-cameras',
  'sony-cyber-shot-cameras',
  'film-cameras',
  'parts-repair'
];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getRelatedCategories(slug: string, limit = 4) {
  return categories.filter((category) => category.slug !== slug).slice(0, limit);
}
