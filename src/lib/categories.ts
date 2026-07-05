export type Category = {
  slug: string;
  name: string;
  navLabel: string;
  description: string;
  seoTitle: string;
  intro: string;
  keywords: string[];
};

function category({
  slug,
  name,
  navLabel,
  description,
  seoTitle,
  intro,
  keywords
}: {
  slug: string;
  name: string;
  navLabel?: string;
  description: string;
  seoTitle?: string;
  intro?: string;
  keywords?: string[];
}): Category {
  return {
    slug,
    name,
    navLabel: navLabel ?? name,
    description,
    seoTitle: seoTitle ?? name,
    intro:
      intro ??
      `${name} from Shutterbug Camera Shop are organized with clear condition notes, availability, and product details.`,
    keywords: keywords ?? [name.toLowerCase()]
  };
}

export const categories: Category[] = [
  category({
    slug: 'vintage-digital-cameras',
    name: 'Vintage Digital Cameras',
    navLabel: 'Vintage Digital',
    description: 'Tested compact digital cameras from Canon, Olympus, Nikon, Sony, Kodak, Fujifilm, and more.',
    seoTitle: 'Tested Vintage Digital Cameras',
    intro:
      'Shop tested vintage digital cameras with real condition notes, clear included accessories, and the nostalgic compact-camera look buyers love.',
    keywords: ['vintage digital cameras', 'used digital cameras', 'CCD digital camera']
  }),
  category({
    slug: 'digital-cameras',
    name: 'Digital Cameras',
    description: 'Used digital cameras across compact, DSLR, mirrorless, bridge, and collectible models.',
    seoTitle: 'Used Digital Cameras',
    keywords: ['used digital cameras', 'digital camera shop']
  }),
  category({
    slug: 'compact-digital-cameras',
    name: 'Compact Digital Cameras',
    navLabel: 'Compact Digital',
    description: 'Pocketable compact digital cameras with simple controls and vintage photo character.',
    keywords: ['compact digital camera', 'used point and shoot digital camera']
  }),
  category({
    slug: 'point-and-shoot-cameras',
    name: 'Point & Shoot Cameras',
    navLabel: 'Point & Shoot',
    description: 'Easy point-and-shoot cameras across digital, film, compact, and travel-friendly formats.',
    keywords: ['point and shoot camera', 'used point and shoot']
  }),
  category({
    slug: 'ccd-digital-cameras',
    name: 'CCD Digital Cameras',
    navLabel: 'CCD Digital',
    description: 'Older digital cameras known for the nostalgic CCD-style look.',
    seoTitle: 'CCD Digital Cameras',
    keywords: ['CCD digital camera', 'vintage CCD camera']
  }),
  category({
    slug: 'canon-powershot-cameras',
    name: 'Canon PowerShot Cameras',
    navLabel: 'Canon PowerShot',
    description: 'Curated Canon PowerShot compact cameras with tested functions and exact-item notes.',
    seoTitle: 'Canon PowerShot Cameras',
    intro:
      'Canon PowerShot cameras are some of the most requested vintage digital models. Listings call out battery, charger, testing, and cosmetic notes.',
    keywords: ['Canon PowerShot camera', 'used Canon PowerShot', 'Canon digital camera']
  }),
  category({
    slug: 'nikon-coolpix-cameras',
    name: 'Nikon Coolpix Cameras',
    navLabel: 'Nikon Coolpix',
    description: 'Slim Nikon Coolpix compact cameras for pocket carry, travel, and vintage digital photos.',
    seoTitle: 'Nikon Coolpix Cameras',
    keywords: ['Nikon Coolpix camera', 'used Nikon Coolpix']
  }),
  category({
    slug: 'sony-cyber-shot-cameras',
    name: 'Sony Cyber-shot Cameras',
    navLabel: 'Sony Cyber-shot',
    description: 'Sony Cyber-shot compact digital cameras with restock demand and clear condition details.',
    seoTitle: 'Sony Cyber-shot Cameras',
    keywords: ['Sony Cyber-shot camera', 'used Sony digital camera']
  }),
  category({
    slug: 'olympus-digital-cameras',
    name: 'Olympus Digital Cameras',
    navLabel: 'Olympus',
    description: 'Olympus compact digital cameras selected for easy point-and-shoot use and nostalgic color.',
    seoTitle: 'Olympus Digital Cameras',
    keywords: ['Olympus digital camera', 'Olympus compact camera']
  }),
  category({
    slug: 'kodak-easyshare-cameras',
    name: 'Kodak EasyShare Cameras',
    navLabel: 'Kodak EasyShare',
    description: 'Kodak EasyShare cameras for warm nostalgic digital photos and casual point-and-shoot use.',
    seoTitle: 'Kodak EasyShare Cameras',
    keywords: ['Kodak EasyShare camera', 'used Kodak digital camera']
  }),
  category({
    slug: 'fujifilm-finepix-cameras',
    name: 'Fujifilm FinePix Cameras',
    navLabel: 'Fujifilm FinePix',
    description: 'Fujifilm FinePix digital cameras with clear grading, testing, and included accessory notes.',
    seoTitle: 'Fujifilm FinePix Cameras',
    keywords: ['Fujifilm FinePix camera', 'used Fujifilm digital camera']
  }),
  category({
    slug: 'panasonic-lumix-cameras',
    name: 'Panasonic Lumix Cameras',
    navLabel: 'Panasonic Lumix',
    description: 'Panasonic Lumix compact, bridge, mirrorless, and travel cameras.',
    seoTitle: 'Panasonic Lumix Cameras',
    keywords: ['Panasonic Lumix camera', 'used Lumix camera']
  }),
  category({
    slug: 'casio-exilim-cameras',
    name: 'Casio Exilim Cameras',
    navLabel: 'Casio Exilim',
    description: 'Casio Exilim compact digital cameras and pocket-friendly models.',
    seoTitle: 'Casio Exilim Cameras',
    keywords: ['Casio Exilim camera', 'used Casio digital camera']
  }),
  category({
    slug: 'film-cameras',
    name: 'Film Cameras',
    navLabel: 'Film Cameras',
    description: 'Classic 35mm, instant, medium format, and point-and-shoot film cameras with clear condition notes.',
    seoTitle: 'Used Film Cameras',
    keywords: ['film camera shop', 'used film camera']
  }),
  category({
    slug: '35mm-film-cameras',
    name: '35mm Film Cameras',
    description: 'Used 35mm film cameras including point-and-shoot, SLR, and rangefinder models.',
    keywords: ['35mm film camera', 'used 35mm camera']
  }),
  category({
    slug: 'medium-format-cameras',
    name: 'Medium Format Cameras',
    navLabel: 'Medium Format',
    description: '120 and medium format film cameras for collectors and working photographers.',
    keywords: ['medium format camera', '120 film camera']
  }),
  category({
    slug: 'rangefinder-cameras',
    name: 'Rangefinder Cameras',
    navLabel: 'Rangefinders',
    description: 'Rangefinder cameras across vintage film and collectible systems.',
    keywords: ['rangefinder camera', 'used rangefinder camera']
  }),
  category({
    slug: 'instant-cameras',
    name: 'Instant Cameras',
    description: 'Instant cameras from Polaroid, Fujifilm, Kodak, and other brands.',
    keywords: ['instant camera', 'used Polaroid camera']
  }),
  category({
    slug: 'dslr-cameras',
    name: 'DSLR Cameras',
    description: 'Used DSLR camera bodies and kits with clear shutter, cosmetic, and function notes.',
    keywords: ['used DSLR camera', 'DSLR camera body']
  }),
  category({
    slug: 'mirrorless-cameras',
    name: 'Mirrorless Cameras',
    description: 'Used mirrorless cameras and kits from Sony, Canon, Nikon, Fujifilm, Panasonic, and more.',
    keywords: ['used mirrorless camera', 'mirrorless camera body']
  }),
  category({
    slug: 'bridge-cameras',
    name: 'Bridge Cameras',
    description: 'Superzoom and bridge cameras for travel, wildlife, and all-in-one shooting.',
    keywords: ['bridge camera', 'superzoom camera']
  }),
  category({
    slug: 'camcorders',
    name: 'Camcorders',
    description: 'Used camcorders, MiniDV, Hi8, Digital8, and video gear with media notes.',
    keywords: ['used camcorder', 'MiniDV camcorder']
  }),
  category({
    slug: 'action-cameras',
    name: 'Action Cameras',
    description: 'Action cameras from GoPro, DJI, Insta360, and related accessory kits.',
    keywords: ['used action camera', 'GoPro camera']
  }),
  category({
    slug: 'lenses',
    name: 'Lenses',
    description: 'Used camera lenses, vintage manual focus lenses, autofocus lenses, and lens adapters.',
    seoTitle: 'Used Camera Lenses',
    keywords: ['used camera lenses', 'vintage camera lens']
  }),
  category({
    slug: 'camera-accessories',
    name: 'Camera Accessories',
    navLabel: 'Accessories',
    description: 'Chargers, batteries, memory cards, camera bags, straps, cables, and useful add-ons.',
    seoTitle: 'Used Camera Accessories',
    keywords: ['camera accessories', 'camera batteries', 'camera chargers']
  }),
  category({
    slug: 'batteries-chargers',
    name: 'Batteries & Chargers',
    navLabel: 'Batteries',
    description: 'Camera batteries, battery chargers, charging docks, and power accessories.',
    keywords: ['camera battery charger', 'camera batteries']
  }),
  category({
    slug: 'memory-cards-storage',
    name: 'Memory Cards & Storage',
    navLabel: 'Memory Cards',
    description: 'SD cards, CompactFlash, xD Picture Card, Memory Stick, and older storage formats.',
    keywords: ['camera memory card', 'xD Picture Card', 'CompactFlash card']
  }),
  category({
    slug: 'flashes-lighting',
    name: 'Flashes & Lighting',
    navLabel: 'Flashes',
    description: 'Camera flashes, speedlights, lighting accessories, and sync gear.',
    keywords: ['camera flash', 'used speedlight']
  }),
  category({
    slug: 'tripods-supports',
    name: 'Tripods & Supports',
    navLabel: 'Tripods',
    description: 'Tripods, monopods, heads, plates, and camera support accessories.',
    keywords: ['camera tripod', 'monopod']
  }),
  category({
    slug: 'camera-bags-cases',
    name: 'Camera Bags & Cases',
    navLabel: 'Bags & Cases',
    description: 'Camera bags, cases, pouches, and protective carry options.',
    keywords: ['camera bag', 'camera case']
  }),
  category({
    slug: 'straps-grips',
    name: 'Straps & Grips',
    navLabel: 'Straps',
    description: 'Neck straps, wrist straps, grips, and handling accessories.',
    keywords: ['camera strap', 'camera grip']
  }),
  category({
    slug: 'filters',
    name: 'Filters',
    description: 'Lens filters including UV, protective, color, and specialty filters.',
    keywords: ['lens filter', 'camera filter']
  }),
  category({
    slug: 'lens-caps-hoods',
    name: 'Lens Caps & Hoods',
    navLabel: 'Caps & Hoods',
    description: 'Lens caps, body caps, rear caps, and lens hoods.',
    keywords: ['lens cap', 'lens hood']
  }),
  category({
    slug: 'adapters-mounts',
    name: 'Adapters & Mounts',
    navLabel: 'Adapters',
    description: 'Lens adapters, mount adapters, step rings, and conversion accessories.',
    keywords: ['lens adapter', 'camera mount adapter']
  }),
  category({
    slug: 'film-darkroom',
    name: 'Film & Darkroom',
    navLabel: 'Film',
    description: 'Film, darkroom accessories, developing gear, and analog workflow tools.',
    keywords: ['camera film', 'darkroom gear']
  }),
  category({
    slug: 'scanners-printers',
    name: 'Scanners & Printers',
    navLabel: 'Scanners',
    description: 'Film scanners, photo printers, printer accessories, and imaging devices.',
    keywords: ['film scanner', 'photo printer']
  }),
  category({
    slug: 'manuals-paperwork',
    name: 'Manuals & Paperwork',
    navLabel: 'Manuals',
    description: 'Camera manuals, original boxes, paperwork, brochures, and collector materials.',
    keywords: ['camera manual', 'original camera box']
  }),
  category({
    slug: 'parts-repair',
    name: 'Parts & Repair Cameras',
    navLabel: 'Parts & Repair',
    description: 'As-is cameras, lenses, electronics, and components for repair, parts harvesting, and collectors.',
    seoTitle: 'Parts & Repair Cameras',
    intro:
      'Parts and repair cameras are clearly marked as as-is. These listings are for repair projects, parts harvesting, display, or collectors who understand the condition notes.',
    keywords: ['parts repair cameras', 'as-is camera', 'camera repair parts']
  }),
  category({
    slug: 'collectible-cameras',
    name: 'Collectible Cameras',
    navLabel: 'Collectible',
    description: 'Collectible, obscure, display-worthy, and historically interesting cameras.',
    keywords: ['collectible camera', 'vintage collectible camera']
  }),
  category({
    slug: 'bundles-kits',
    name: 'Bundles & Kits',
    navLabel: 'Kits',
    description: 'Camera bundles, lens kits, accessory kits, and ready-to-shoot packages.',
    keywords: ['camera kit', 'camera bundle']
  })
];

export const featuredCategorySlugs = [
  'vintage-digital-cameras',
  'canon-powershot-cameras',
  'nikon-coolpix-cameras',
  'sony-cyber-shot-cameras',
  'film-cameras',
  'lenses',
  'camera-accessories',
  'parts-repair'
];

export function getCategory(slug: string) {
  return categories.find((item) => item.slug === slug);
}

export function getRelatedCategories(slug: string, limit = 4) {
  const category = getCategory(slug);
  const keyword = category?.keywords[0]?.split(' ')[0];
  const related = categories.filter(
    (item) => item.slug !== slug && (keyword ? item.keywords.some((value) => value.includes(keyword)) : false)
  );
  return [...related, ...categories.filter((item) => item.slug !== slug && !related.includes(item))].slice(0, limit);
}
