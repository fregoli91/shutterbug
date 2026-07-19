import type { MetadataRoute } from 'next';
import { site } from '@/lib/seo';
import { categories } from '@/lib/categories';
import { getBrandPages } from '@/lib/brands';
import { getActiveCatalogProducts } from '@/lib/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [catalog, brands] = await Promise.all([getActiveCatalogProducts(), getBrandPages()]);
  const staticRoutes = [
    '',
    '/shop',
    '/brands',
    '/sell-your-camera',
    '/about',
    '/buyer-guarantee',
    '/used-cameras-michigan',
    '/testing-process',
    '/returns',
    '/shipping',
    '/contact',
    '/privacy',
    '/terms'
  ].map((path) => ({
    url: `${site.domain}${path}`,
    lastModified: now
  }));

  const categoryRoutes = categories.map((category) => ({
    url: `${site.domain}/categories/${category.slug}`,
    lastModified: now
  }));

  const brandRoutes = brands.map((brand) => ({
    url: `${site.domain}/brands/${brand.slug}`,
    lastModified: now
  }));

  const productRoutes = catalog.map((product) => ({
    url: `${site.domain}/shop/${product.slug}`,
    lastModified: now
  }));

  return [...staticRoutes, ...categoryRoutes, ...brandRoutes, ...productRoutes];
}
