import { safeJsonLd } from '@/lib/security';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProductCard } from '@/components/ProductCard';
import { categories, getCategory, getRelatedCategories } from '@/lib/categories';
import { getLikedProductIds } from '@/lib/customer-likes';
import { getCustomerSession } from '@/lib/customer-auth';
import { getProductsByCategoryAsync } from '@/lib/products';
import { site } from '@/lib/seo';
import { getCategorySeoProfile, isPriorityCategory } from '@/lib/seo-content';
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd, jsonLdGraph } from '@/lib/seo-utils';

type Props = { params: Promise<{ slug: string }> };

const categoryHeroImages: Record<string, { src: string; alt: string; width: number; height: number }> = {
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
  'canon-powershot-cameras': {
    src: '/shutterbug-canon-powershot-page.png',
    alt: 'Canon cameras, lenses, printer, camera bag, and photo prints displayed at Shutterbug Camera Shop',
    width: 1672,
    height: 941
  },
  'nikon-coolpix-cameras': {
    src: '/shutterbug-nikon-coolpix-page.png',
    alt: 'Nikon Coolpix compact cameras, DSLR cameras, and rugged camera displayed at Shutterbug Camera Shop',
    width: 1448,
    height: 1086
  },
  'polaroid-cameras': {
    src: '/shutterbug-polaroid-cameras-page.png',
    alt: 'Polaroid instant cameras and instant photo prints displayed at Shutterbug Camera Shop',
    width: 1448,
    height: 1086
  },
  'olympus-digital-cameras': {
    src: '/shutterbug-olympus-digital-cameras-page.png',
    alt: 'Olympus compact digital and film cameras displayed at Shutterbug Camera Shop',
    width: 1448,
    height: 1086
  },
  'sony-cyber-shot-cameras': {
    src: '/shutterbug-sony-cyber-shot-page.png',
    alt: 'Sony Cyber-shot compact and mirrorless cameras displayed at Shutterbug Camera Shop',
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};

  const profile = getCategorySeoProfile(slug);
  const products = await getProductsByCategoryAsync(slug);
  const title = profile?.title ?? category.seoTitle;
  const description = profile?.description ?? category.description;
  const hero = categoryHeroImages[slug];
  const indexable = isPriorityCategory(slug) || products.length > 0;

  return {
    title: category.slug === 'printers' ? { absolute: title } : title,
    description,
    alternates: { canonical: `/categories/${category.slug}` },
    robots: indexable ? undefined : { index: false, follow: true },
    openGraph: {
      title: `${title} | Shutterbug Camera Shop`,
      description,
      url: `${site.domain}/categories/${category.slug}`,
      type: 'website',
      images: hero ? [{ url: hero.src, width: hero.width, height: hero.height, alt: hero.alt }] : undefined
    }
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const profile = getCategorySeoProfile(slug);
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
  const pageTitle = profile?.title ?? category.seoTitle;
  const pageHeading = profile?.heading ?? (isPrinterCategory ? category.name : category.seoTitle);
  const pageDescription = profile?.description ?? category.description;
  const pageIntro = profile?.intro ?? category.intro;
  const discoveryLinks = profile?.links ?? relatedCategories.map((related) => ({
    label: related.name,
    href: `/categories/${related.slug}`
  }));
  const structuredData = jsonLdGraph([
    buildCollectionPageJsonLd({
      name: pageTitle,
      description: pageDescription,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(structuredData) }} />
      <div className="mx-auto max-w-7xl">
        <header className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-moss">
            {isPrinterCategory ? 'Printer category' : 'Used camera category'}
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-ink sm:text-5xl">{pageHeading}</h1>
          <p className="mt-4 text-base leading-7 text-ink/70 sm:text-lg sm:leading-8">{pageIntro}</p>
        </header>

        {categoryHeroImage ? (
          <div className="relative mt-7 aspect-[4/3] max-h-[30rem] overflow-hidden rounded-lg border border-ink/10 bg-sand shadow-sm sm:aspect-[16/7]">
            <Image
              src={categoryHeroImage.src}
              alt={categoryHeroImage.alt}
              fill
              sizes="(min-width: 1280px) 80rem, 100vw"
              className="object-contain object-center sm:object-cover"
            />
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2" aria-label="Shutterbug listing standards">
          {trustItems.map((item) => (
            <span key={item} className="rounded-full border border-moss/15 bg-white px-4 py-2 text-sm font-semibold text-ink/70 shadow-sm">
              {item}
            </span>
          ))}
        </div>

        <nav className="mt-8 flex flex-wrap gap-2" aria-label={`Explore ${category.name}`}>
          {discoveryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink/70 shadow-sm transition hover:border-moss/40 hover:text-moss"
            >
              {link.label}
            </Link>
          ))}
        </nav>

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
                Shutterbug inventory changes as individual used items arrive. Browse the related resources above or
                contact us about a specific {isPrinterCategory ? 'printer model' : 'camera model'}.
              </p>
            </div>
          )}
        </div>

        {profile ? (
          <section className="mt-14 grid gap-6 border-t border-ink/10 pt-10 lg:grid-cols-[1.2fr_0.8fr]" aria-labelledby="category-buying-heading">
            <div>
              <h2 id="category-buying-heading" className="font-serif text-3xl font-bold text-ink sm:text-4xl">
                {profile.supportingHeading}
              </h2>
              <div className="mt-5 grid gap-4 text-base leading-7 text-ink/70">
                {profile.supportingCopy.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </div>
            <div className="rounded-lg border border-ink/10 bg-mint p-6">
              <h2 className="font-serif text-2xl font-bold text-ink">Before you buy</h2>
              <ul className="mt-4 grid list-disc gap-3 pl-5 text-sm leading-6 text-ink/72">
                {profile.buyerTips.map((tip) => <li key={tip}>{tip}</li>)}
              </ul>
              <Link href="/testing-process" className="mt-5 inline-flex min-h-11 items-center font-semibold text-moss hover:text-ink">
                See how Shutterbug tests used cameras
              </Link>
            </div>
          </section>
        ) : null}

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