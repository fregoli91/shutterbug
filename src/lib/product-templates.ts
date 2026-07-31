import { CameraFormat, CameraType } from '@/generated/prisma/client';

export type CameraProductTemplate = {
  key: string;
  brand: string;
  model: string;
  title: string;
  categorySlug: string;
  categorySlugs: string[];
  subcategorySlug: string;
  productType: string;
  cameraType: CameraType;
  format: CameraFormat;
  shortDescription: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  goodFor: string[];
  filmFormat?: string;
};

type DigitalTemplateInput = {
  key: string;
  brand: string;
  model: string;
  subcategorySlug: string;
  productType: string;
  categorySlug?: string;
  goodFor?: string[];
};

function digitalTemplate({
  key,
  brand,
  model,
  subcategorySlug,
  productType,
  categorySlug = 'vintage-digital-cameras',
  goodFor = ['Everyday snapshots', 'Compact camera collectors', 'Nostalgic digital photos']
}: DigitalTemplateInput): CameraProductTemplate {
  const title = `${brand} ${model}`;
  return {
    key,
    brand,
    model,
    title,
    categorySlug,
    categorySlugs: Array.from(
      new Set(['digital-cameras', categorySlug, 'compact-digital-cameras', 'point-and-shoot-cameras', subcategorySlug])
    ),
    subcategorySlug,
    productType,
    cameraType: CameraType.VINTAGE_DIGITAL,
    format: CameraFormat.DIGITAL,
    shortDescription: `A used ${title} with exact-item photos, clear condition notes, and honest testing details.`,
    description: `This listing is for the exact ${title} shown in the photos. Shutterbug documents cosmetic wear, tested functions, included accessories, and known issues for each used camera before checkout. Review the condition, testing, and included-items sections for this specific unit.`,
    seoTitle: `Used ${title} Camera | Shutterbug`,
    seoDescription: `Shop a used ${title} with actual photos, clear condition notes, included accessories, and honest testing details from Shutterbug Camera Shop.`,
    tags: [brand, model, productType, 'used camera', 'compact digital camera'],
    goodFor
  };
}

function polaroidTemplate(key: string, model: string, goodFor: string[]): CameraProductTemplate {
  const brand = 'Polaroid';
  const title = `${brand} ${model}`;
  return {
    key,
    brand,
    model,
    title,
    categorySlug: 'instant-cameras',
    categorySlugs: ['film-cameras', 'instant-cameras', 'polaroid-cameras'],
    subcategorySlug: 'polaroid-cameras',
    productType: 'Instant Film Cameras',
    cameraType: CameraType.FILM_CAMERA,
    format: CameraFormat.FILM,
    filmFormat: 'Instant',
    shortDescription: `A used ${title} instant camera with exact-item photos and clear condition notes.`,
    description: `This listing is for the exact ${title} shown in the photos. Shutterbug records visible wear, tested functions, film compatibility, included accessories, and known issues before checkout. Review the condition and testing sections for this specific camera.`,
    seoTitle: `Used ${title} Instant Camera | Shutterbug`,
    seoDescription: `Shop a used ${title} instant camera with actual photos, clear condition notes, included accessories, and honest testing details.`,
    tags: ['Polaroid', model, 'instant camera', 'instant film camera', 'used camera'],
    goodFor
  };
}

export const CAMERA_PRODUCT_TEMPLATES: CameraProductTemplate[] = [
  digitalTemplate({
    key: 'canon-powershot-sd1000',
    brand: 'Canon',
    model: 'PowerShot SD1000',
    subcategorySlug: 'canon-powershot-cameras',
    productType: 'Canon PowerShot'
  }),
  digitalTemplate({
    key: 'canon-powershot-elph-100-hs',
    brand: 'Canon',
    model: 'PowerShot ELPH 100 HS',
    subcategorySlug: 'canon-powershot-cameras',
    productType: 'Canon PowerShot'
  }),
  digitalTemplate({
    key: 'canon-powershot-g7-x-mark-ii',
    brand: 'Canon',
    model: 'PowerShot G7 X Mark II',
    subcategorySlug: 'canon-powershot-cameras',
    productType: 'Canon PowerShot',
    categorySlug: 'digital-cameras',
    goodFor: ['Everyday photography', 'Travel', 'Content creation']
  }),
  digitalTemplate({
    key: 'nikon-coolpix-s220',
    brand: 'Nikon',
    model: 'COOLPIX S220',
    subcategorySlug: 'nikon-coolpix-cameras',
    productType: 'Nikon Coolpix'
  }),
  digitalTemplate({
    key: 'nikon-coolpix-s3300',
    brand: 'Nikon',
    model: 'COOLPIX S3300',
    subcategorySlug: 'nikon-coolpix-cameras',
    productType: 'Nikon Coolpix'
  }),
  digitalTemplate({
    key: 'nikon-coolpix-s6900',
    brand: 'Nikon',
    model: 'COOLPIX S6900',
    subcategorySlug: 'nikon-coolpix-cameras',
    productType: 'Nikon Coolpix',
    categorySlug: 'digital-cameras',
    goodFor: ['Travel', 'Everyday snapshots', 'Self portraits']
  }),
  digitalTemplate({
    key: 'sony-cyber-shot-dsc-w120',
    brand: 'Sony',
    model: 'Cyber-shot DSC-W120',
    subcategorySlug: 'sony-cyber-shot-cameras',
    productType: 'Sony Cyber-shot'
  }),
  digitalTemplate({
    key: 'sony-cyber-shot-dsc-t90',
    brand: 'Sony',
    model: 'Cyber-shot DSC-T90',
    subcategorySlug: 'sony-cyber-shot-cameras',
    productType: 'Sony Cyber-shot'
  }),
  digitalTemplate({
    key: 'sony-cyber-shot-dsc-w830',
    brand: 'Sony',
    model: 'Cyber-shot DSC-W830',
    subcategorySlug: 'sony-cyber-shot-cameras',
    productType: 'Sony Cyber-shot',
    categorySlug: 'digital-cameras'
  }),
  digitalTemplate({
    key: 'olympus-fe-340',
    brand: 'Olympus',
    model: 'FE-340',
    subcategorySlug: 'olympus-digital-cameras',
    productType: 'Olympus Digital Cameras'
  }),
  digitalTemplate({
    key: 'olympus-stylus-1000',
    brand: 'Olympus',
    model: 'Stylus 1000',
    subcategorySlug: 'olympus-digital-cameras',
    productType: 'Olympus Digital Cameras'
  }),
  digitalTemplate({
    key: 'olympus-stylus-tough-6020',
    brand: 'Olympus',
    model: 'Stylus Tough 6020',
    subcategorySlug: 'olympus-digital-cameras',
    productType: 'Waterproof / Tough Cameras',
    goodFor: ['Travel', 'Outdoor snapshots', 'Compact camera collectors']
  }),
  digitalTemplate({
    key: 'fujifilm-finepix-a340',
    brand: 'Fujifilm',
    model: 'FinePix A340',
    subcategorySlug: 'fujifilm-finepix-cameras',
    productType: 'Fujifilm FinePix'
  }),
  digitalTemplate({
    key: 'fujifilm-finepix-f30',
    brand: 'Fujifilm',
    model: 'FinePix F30',
    subcategorySlug: 'fujifilm-finepix-cameras',
    productType: 'Fujifilm FinePix'
  }),
  digitalTemplate({
    key: 'fujifilm-finepix-z30',
    brand: 'Fujifilm',
    model: 'FinePix Z30',
    subcategorySlug: 'fujifilm-finepix-cameras',
    productType: 'Fujifilm FinePix'
  }),
  digitalTemplate({
    key: 'kodak-easyshare-dx4530',
    brand: 'Kodak',
    model: 'EasyShare DX4530',
    subcategorySlug: 'kodak-easyshare-cameras',
    productType: 'Kodak EasyShare'
  }),
  digitalTemplate({
    key: 'kodak-easyshare-c743',
    brand: 'Kodak',
    model: 'EasyShare C743',
    subcategorySlug: 'kodak-easyshare-cameras',
    productType: 'Kodak EasyShare'
  }),
  digitalTemplate({
    key: 'kodak-easyshare-m340',
    brand: 'Kodak',
    model: 'EasyShare M340',
    subcategorySlug: 'kodak-easyshare-cameras',
    productType: 'Kodak EasyShare'
  }),
  polaroidTemplate('polaroid-onestep-closeup-600', 'OneStep CloseUp 600', [
    'Instant snapshots',
    'Parties and events',
    'Polaroid collectors'
  ]),
  polaroidTemplate('polaroid-sun-600-lms', 'Sun 600 LMS', [
    'Classic instant photos',
    'Casual snapshots',
    'Polaroid collectors'
  ]),
  polaroidTemplate('polaroid-sx-70-sonar-onestep', 'SX-70 Sonar OneStep', [
    'Instant photography',
    'Polaroid collectors',
    'Creative projects'
  ])
];

export function getCameraProductTemplate(key: string) {
  return CAMERA_PRODUCT_TEMPLATES.find((template) => template.key === key);
}

export function cameraProductTemplatesByBrand() {
  return CAMERA_PRODUCT_TEMPLATES.reduce<Record<string, CameraProductTemplate[]>>((groups, template) => {
    (groups[template.brand] ??= []).push(template);
    return groups;
  }, {});
}
