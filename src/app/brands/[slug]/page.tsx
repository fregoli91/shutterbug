import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProductCard } from '@/components/ProductCard';
import { getBrandPageBySlug, getStaticBrandParams } from '@/lib/brands';
import { getCustomerSession } from '@/lib/customer-auth';
import { getLikedProductIds } from '@/lib/customer-likes';
import { site } from '@/lib/seo';
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd, jsonLdGraph } from '@/lib/seo-utils';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getStaticBrandParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandPageBySlug(slug);
  if (!brand) return {};

  return {
    title: `${brand.name} Cameras and Gear`,
    description: brand.description,
    alternates: { canonical: `/brands/${brand.slug}` },
    openGraph: {
      title: `${brand.name} Cameras and Gear | Shutterbug Camera Shop`,
      description: brand.description,
      url: `${site.domain}/brands/${brand.slug}`,
      type: 'website'
    }
  };
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = await getBrandPageBySlug(slug);
  if (!brand) notFound();

  const customer = await getCustomerSession();
  const likedProductIds = await getLikedProductIds(
    customer?.id,
    brand.products.map((product) => product.id)
  );
  const structuredData = jsonLdGraph([
    buildCollectionPageJsonLd({
      name: `${brand.name} Cameras and Gear`,
      description: brand.description,
      url: `/brands/${brand.slug}`,
      products: brand.products
    }),
    buildBreadcrumbJsonLd([
      { name: 'Home', url: '/' },
      { name: 'Brands', url: '/brands' },
      { name: brand.name, url: `/brands/${brand.slug}` }
    ])
  ]);

  return (
    <section className="bg-cream px-4 py-14 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-moss">Brand guide</p>
            <h1 className="mt-3 font-serif text-5xl font-bold tracking-tight text-ink sm:text-6xl">
              {brand.name} cameras and gear.
            </h1>
            <p className="mt-5 text-lg leading-8 text-ink/70">{brand.description}</p>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <p className="font-serif text-2xl font-bold text-ink">
              {brand.products.length ? 'Current Shutterbug listings' : 'Looking for this brand?'}
            </p>
            <p className="mt-3 text-sm leading-6 text-ink/68">
              {brand.products.length
                ? 'Open a listing to see testing notes, included accessories, disclosed flaws, and stock status.'
                : 'This page is ready for future inventory. Send us a note and we can help source or review a camera.'}
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <Link
                href={`/shop?brand=${encodeURIComponent(brand.name)}`}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-forest px-5 text-sm font-semibold text-white transition hover:bg-moss"
              >
                Search {brand.name}
              </Link>
              <Link
                href="/sell-your-camera"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-ink/15 bg-cream px-5 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss"
              >
                Sell us this brand
              </Link>
            </div>
          </div>
        </div>

        {brand.products.length ? (
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {brand.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                liked={likedProductIds.has(product.id)}
                signedIn={Boolean(customer)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-lg border border-ink/10 bg-white p-8 shadow-sm">
            <p className="font-serif text-2xl font-bold text-ink">No active {brand.name} listings yet</p>
            <p className="mt-3 max-w-3xl leading-7 text-ink/68">
              Shutterbug inventory changes as one-off used cameras come in. If you want a specific {brand.name} model,
              contact us with the model name or send photos if you have one to sell.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-forest px-5 text-sm font-semibold text-white transition hover:bg-moss"
              >
                Ask Shutterbug
              </Link>
              <Link
                href="/shop"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-ink/15 bg-cream px-5 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss"
              >
                Browse all cameras
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
