import type { MetadataRoute } from 'next';
import { site } from '@/lib/seo';
import { categories } from '@/lib/categories';
import { products } from '@/lib/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ['', '/shop', '/sell-your-camera', '/about', '/testing-process', '/returns', '/contact'].map((path) => ({
    url: `${site.domain}${path}`,
    lastModified: now
  }));

  const categoryRoutes = categories.map((category) => ({
    url: `${site.domain}/categories/${category.slug}`,
    lastModified: now
  }));

  const productRoutes = products.map((product) => ({
    url: `${site.domain}/shop/${product.slug}`,
    lastModified: now
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
