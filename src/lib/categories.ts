export type Category = {
  slug: string;
  name: string;
  description: string;
};

export const categories: Category[] = [
  {
    slug: 'vintage-digital-cameras',
    name: 'Vintage Digital Cameras',
    description: 'Tested compact digital cameras from Canon, Olympus, Nikon, Sony, Kodak, Fujifilm, and more.'
  },
  {
    slug: 'film-cameras',
    name: 'Film Cameras',
    description: 'Classic 35mm and point-and-shoot film cameras with clear condition notes.'
  },
  {
    slug: 'camera-accessories',
    name: 'Camera Accessories',
    description: 'Chargers, batteries, memory cards, camera bags, straps, cables, and useful add-ons.'
  },
  {
    slug: 'parts-repair',
    name: 'Parts & Repair',
    description: 'As-is cameras, lenses, and electronics for repair, parts harvesting, and collectors.'
  }
];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}
