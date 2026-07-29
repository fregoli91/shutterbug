import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { categories, getCategory, getRelatedCategories } from '@/lib/categories';
import { getLikedProductIds } from '@/lib/customer-likes';
import { getCustomerSession } from '@/lib/customer-auth';
import { getProductsByCategoryAsync } from '@/lib/products';
import { site } from '@/lib/seo';
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd, jsonLdGraph } from '@/lib/seo-utils';

type Props = { params: Promise<{ slug: string }> };

const categoryHeroImages: Record<
  string,
  { src: string; alt: string; width: number; height: number }
> = {
  'parts-repair': {
    src: '/shutterbug-parts-repair.png',
    alt: 'Shutterbug mascot repairing a vintage camera',
    width: 640,
    height: 640
  },
  'camera-accessories': {
    src: '/shutterbug-accessories-page.png',
    alt: 'Camera straps, flash, chargers, batteries, cases, filters, remote, and cables at Shutterbug Camera Shop',
    width: 1448,
    height: 1086
  },
  lenses: {
    src: '/shutterbug-lenses-page.png',
    alt: 'Used camera lenses displayed with condition tags and inspection details at Shutterbug Camera Shop',
    width: 1672,
    height: 941
  },
  'film-cameras': {
    src: '/shutterbug-film-cameras-page.png',
    alt: 'Used film cameras, film rolls, lenses, and accessories displayed at Shutterbug Camera Shop',
    width: 1448,
    height: 1086
  },
  'vintage-digital-cameras': {
    src: '/shutterbug-vintage-digital-cameras-page.png',
    alt: 'Tested vintage compact digital cameras with memory cards, wrist strap, and camera case at Shutterbug Camera Shop',
    width: 1448,
    height: 1086
  },
  printers: {
    src: '/shutterbug-printers-page.png',
    alt: 'Used photo, inkjet, and laser printers displayed with ink cartridges and paper at Shutterbug Camera Shop',
    width: 1448,
    height: 1086
  }
};

export async function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title:
      category.slug === 'printers'
        ? { absolute: category.seoTitle }
        : category.seoTitle,
    description: category.description,
    alternates: { canonical: `/categories/${category.slug}` },
    openGraph: {
      title: `${category.seoTitle} | Shutterbug Camera Shop`,
      description: category.description,
      url: `${site.domain}/categories/${category.slug}`,
      type: 'website'
    }
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const categoryProducts = await getProductsByCategoryAsync(category.slug);
  const customer = await getCustomerSession();
  const likedProductIds = await getLikedProductIds(
    customer?.id,
    categoryProducts.map((product) => product.id)
  );
  const relatedCategories = getRelatedCategories(category.slug);
  const categoryHeroImage = categoryHeroImages[category.slug];
  const isPrinterCategory = category.slug === 'printers';
  const trustItems = isPrinterCategory
    ? ['Tested when possible', 'Clear condition notes', 'Includes / does-not-include details', 'Packed securely for shipment']
    : ['Tested gear is clearly marked.', 'Parts/repair items stay separate and honest.', 'Included accessories and flaws are disclosed.'];
  const structuredData = jsonLdGraph([
    buildCollectionPageJsonLd({
      name: category.seoTitle,
      description: category.description,
      url: `/categories/${category.slug}`,
      products: categoryProducts
    }),
    buildBreadcrumbJsonLd([
      { name: 'Home', url: '/' },
      { name: 'Shop', url: '/shop' },
      { name: category.name, url: `/categories/${category.slug}` }
    ])
  ]);

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-moss">
              {isPrinterCategory ? 'Printer category' : 'Camera category'}
            </p>
            <h1 className="mt-3 font-serif text-5xl font-bold text-ink">
              {isPrinterCategory ? category.name : category.seoTitle}
            </h1>
            <p className="mt-5 text-lg leading-8 text-ink/70">{category.intro}</p>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            {categoryHeroImage ? (
              <Image
                src={categoryHeroImage.src}
                alt={categoryHeroImage.alt}
                width={categoryHeroImage.width}
                height={categoryHeroImage.height}
                sizes="(min-width: 1024px) 22rem, 100vw"
                className="mb-5 h-auto w-full rounded-lg bg-sand object-contain object-center"
              />
            ) : null}
            <p className="font-serif text-2xl font-bold text-ink">Shutterbug standard</p>
            <ul className="mt-4 grid list-disc gap-2 pl-5 text-sm leading-6 text-ink/70">
              {trustItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {category.keywords.map((keyword) => (
            <Link
              key={keyword}
              href={`/shop?q=${encodeURIComponent(keyword)}`}
              className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink/70 shadow-sm transition hover:border-moss/40 hover:text-moss"
            >
              {keyword}
            </Link>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {categoryProducts.length > 0 ? (
            categoryProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                liked={likedProductIds.has(product.id)}
                signedIn={Boolean(customer)}
              />
            ))
          ) : (
            <div className="col-span-2 rounded-lg border border-ink/10 bg-white p-8 text-ink/70 lg:col-span-3">
              <p className="font-serif text-2xl font-bold text-ink">No active inventory in this category yet</p>
              <p className="mt-3 leading-7">
                This category is ready for future listings. Contact Shutterbug if you are looking for a specific
                {isPrinterCategory ? ' printer model' : ' camera model'} or want to sell gear in this category.
              </p>
            </div>
          )}
        </div>

        <div className="mt-14 rounded-lg border border-ink/10 bg-mint p-6">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-moss">Related categories</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {relatedCategories.map((related) => (
              <Link
                key={related.slug}
                href={`/categories/${related.slug}`}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink/70 shadow-sm transition hover:text-moss"
              >
                {related.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
