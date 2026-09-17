import type { MetadataRoute } from 'next';
import { site } from '@/lib/seo';
import { categories } from '@/lib/categories';
import { getBrandPages } from '@/lib/brands';
import { getCatalogProducts, productMatchesCategory } from '@/lib/products';
import { isIndexableProduct } from '@/lib/catalog-seo';
import { guides } from '@/lib/guides';
import { blogPosts } from '@/lib/blog';
import { isPriorityBrand, isPriorityCategory } from '@/lib/seo-content';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [catalog, brands] = await Promise.all([getCatalogProducts(), getBrandPages()]);
  const staticRoutes = [
    '',
    '/shop',
    '/brands',
    '/guides',
    '/blog',
    '/amazon',
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
    lastModified: undefined
  }));

  const categoryRoutes = categories
    .filter(
      (category) =>
        isPriorityCategory(category.slug) || catalog.some((product) => productMatchesCategory(product, category.slug))
    )
    .map((category) => ({
      url: `${site.domain}/categories/${category.slug}`,
      lastModified: undefined
    }));

  const brandRoutes = brands
    .filter((brand) => isPriorityBrand(brand.slug) || brand.products.length > 0)
    .map((brand) => ({
      url: `${site.domain}/brands/${brand.slug}`,
      lastModified: undefined
    }));

  const productRoutes = catalog
    .filter(isIndexableProduct)
    .map((product) => ({
      url: `${site.domain}/shop/${product.slug}`,
      ...(product.updatedAt ? { lastModified: new Date(product.updatedAt) } : {})
    }));

  const guideRoutes = guides.map((guide) => ({
    url: `${site.domain}/guides/${guide.slug}`,
    lastModified: new Date(guide.updatedAt)
  }));

  const blogRoutes = blogPosts.map((post) => ({
    url: `${site.domain}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt)
  }));

  return [...staticRoutes, ...categoryRoutes, ...brandRoutes, ...productRoutes, ...guideRoutes, ...blogRoutes];
}