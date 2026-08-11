import type { MetadataRoute } from 'next';
import { site } from '@/lib/seo';
import { categories } from '@/lib/categories';
import { getBrandPages } from '@/lib/brands';
import { getCatalogProducts } from '@/lib/products';
import { guides } from '@/lib/guides';
import { blogPosts } from '@/lib/blog';
import { isPriorityBrand, isPriorityCategory } from '@/lib/seo-content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
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
    lastModified: now
  }));

  const categoryRoutes = categories
    .filter(
      (category) =>
        isPriorityCategory(category.slug) || catalog.some((product) => product.categorySlug === category.slug)
    )
    .map((category) => ({
      url: `${site.domain}/categories/${category.slug}`,
      lastModified: now
    }));

  const brandRoutes = brands
    .filter((brand) => isPriorityBrand(brand.slug) || brand.products.length > 0)
    .map((brand) => ({
      url: `${site.domain}/brands/${brand.slug}`,
      lastModified: now
    }));

  const productRoutes = catalog
    .filter(
      (product) =>
        product.status === 'active' ||
        (product.status === 'sold_out' &&
          product.actualPhotos &&
          Boolean(product.seoDescription || product.shortDescription))
    )
    .map((product) => ({
      url: `${site.domain}/shop/${product.slug}`,
      lastModified: now
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