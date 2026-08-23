import { safeJsonLd } from '@/lib/security';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProductCard } from '@/components/ProductCard';
import { getBrandPageBySlug, getStaticBrandParams } from '@/lib/brands';
import { getCustomerSession } from '@/lib/customer-auth';
import { getLikedProductIds } from '@/lib/customer-likes';
import { site } from '@/lib/seo';
import { getBrandSeoProfile, isPriorityBrand } from '@/lib/seo-content';
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd, jsonLdGraph } from '@/lib/seo-utils';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getStaticBrandParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandPageBySlug(slug);
  if (!brand) return {};

  const profile = getBrandSeoProfile(slug);
  const title = profile?.title ?? `${brand.name} Cameras and Gear`;
  const description = profile?.description ?? brand.description;
  const hero = profile?.heroImage;

  return {
    title,
    description,
    alternates: { canonical: `/brands/${brand.slug}` },
    robots: isPriorityBrand(slug) || brand.products.length > 0 ? undefined : { index: false, follow: true },
    openGraph: {
      title: `${title} | Shutterbug Camera Shop`,
      description,
      url: `${site.domain}/brands/${brand.slug}`,
      type: 'website',
      images: hero ? [{ url: hero.src, width: hero.width, height: hero.height, alt: hero.alt }] : undefined
    }
  };
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = await getBrandPageBySlug(slug);
  if (!brand) notFound();

  const profile = getBrandSeoProfile(slug);
  const brandHeroImage = profile?.heroImage;
  const title = profile?.title ?? `${brand.name} Cameras and Gear`;
  const heading = profile?.heading ?? `${brand.name} cameras and gear.`;
  const description = profile?.description ?? brand.description;
  const intro = profile?.intro ?? brand.description;
  const customer = await getCustomerSession();
  const likedProductIds = await getLikedProductIds(
    customer?.id,
    brand.products.map((product) => product.id)
  );
  const structuredData = jsonLdGraph([
    buildCollectionPageJsonLd({
      name: title,
      description,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(structuredData) }} />
      <div className="mx-auto max-w-7xl">
        <header className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-moss">Used camera brand guide</p>
          <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-ink sm:text-6xl">{heading}</h1>
          <p className="mt-5 text-lg leading-8 text-ink/70">{intro}</p>
        </header>

        {brandHeroImage ? (
          <div className="relative mt-7 aspect-[4/3] max-h-[30rem] overflow-hidden rounded-lg border border-ink/10 bg-sand shadow-sm sm:aspect-[16/7]">
            <Image
              src={brandHeroImage.src}
              alt={brandHeroImage.alt}
              fill
              sizes="(min-width: 1280px) 80rem, (min-width: 768px) calc(100vw - 3rem), calc(100vw - 2rem)"
              className="object-contain object-center sm:object-cover"
            />
          </div>
        ) : null}

        {profile ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-ink">What {brand.name} is known for</h2>
              <ul className="mt-4 grid list-disc gap-3 pl-5 text-sm leading-6 text-ink/70">
                {profile.knownFor.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>
            <section className="rounded-lg border border-ink/10 bg-mint p-6">
              <h2 className="font-serif text-2xl font-bold text-ink">Used {brand.name} buying notes</h2>
              <ul className="mt-4 grid list-disc gap-3 pl-5 text-sm leading-6 text-ink/70">
                {profile.buyingAdvice.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>
          </div>
        ) : null}

        {profile ? (
          <nav className="mt-6 flex flex-wrap gap-2" aria-label={`Explore ${brand.name}`}>
            {profile.links.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink/70 shadow-sm transition hover:border-moss/40 hover:text-moss">
                {link.label}
              </Link>
            ))}
          </nav>
        ) : null}

        <div className="mt-8 flex flex-col gap-5 rounded-lg border border-ink/10 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl">
            <p className="font-serif text-2xl font-bold text-ink">
              {brand.products.length ? 'Current Shutterbug listings' : 'Looking for this brand?'}
            </p>
            <p className="mt-3 text-sm leading-6 text-ink/68">
              {brand.products.length
                ? 'Open a listing to see testing notes, included accessories, disclosed flaws, exact photos, and current availability.'
                : 'Used inventory changes as individual cameras arrive. Send us the model name and we can help with a restock question or a camera you want to sell.'}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:min-w-48">
            {brand.products.length ? (
              <a href="#current-listings" className="inline-flex min-h-11 items-center justify-center rounded-full bg-forest px-5 text-sm font-semibold text-white transition hover:bg-moss">
                Browse current listings
              </a>
            ) : (
              <Link href="/contact" className="inline-flex min-h-11 items-center justify-center rounded-full bg-forest px-5 text-sm font-semibold text-white transition hover:bg-moss">
                Ask about {brand.name}
              </Link>
            )}
            <Link href="/sell-your-camera" className="inline-flex min-h-11 items-center justify-center rounded-full border border-ink/15 bg-cream px-5 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss">
              Sell us this brand
            </Link>
          </div>
        </div>

        {brand.products.length ? (
          <div id="current-listings" className="mt-10 grid scroll-mt-32 grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {brand.products.map((product) => (
              <ProductCard key={product.id} product={product} liked={likedProductIds.has(product.id)} signedIn={Boolean(customer)} />
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-lg border border-ink/10 bg-white p-8 shadow-sm">
            <p className="font-serif text-2xl font-bold text-ink">No active {brand.name} listings yet</p>
            <p className="mt-3 max-w-3xl leading-7 text-ink/68">
              This guide remains useful while one-off inventory changes. Browse the related camera types above or contact Shutterbug about a specific {brand.name} model.
            </p>
            <Link href="/shop" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-ink/15 bg-cream px-5 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss">
              Browse all cameras
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}