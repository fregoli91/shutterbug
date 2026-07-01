import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { SectionHeading } from '@/components/SectionHeading';
import { categories, featuredCategorySlugs } from '@/lib/categories';
import { formatPrice, getAvailabilityLabel, getCatalogProducts } from '@/lib/products';
import { site } from '@/lib/seo';

const brandLinks = [
  ['Canon PowerShot', '/categories/canon-powershot-cameras'],
  ['Olympus Digital', '/categories/olympus-digital-cameras'],
  ['Nikon Coolpix', '/categories/nikon-coolpix-cameras'],
  ['Sony Cyber-shot', '/categories/sony-cyber-shot-cameras'],
  ['Kodak EasyShare', '/categories/kodak-easyshare-cameras'],
  ['Fujifilm FinePix', '/categories/fujifilm-finepix-cameras'],
  ['Film Cameras', '/categories/film-cameras'],
  ['Parts / Repair', '/categories/parts-repair']
];

const trustCards = [
  {
    title: 'Tested cameras',
    copy: 'Power, lens, screen, flash, buttons, and card checks are listed before sale.',
    image: '/shutterbug-tested-cameras.png'
  },
  {
    title: 'Photos and condition',
    copy: 'Real photos, included accessories, cosmetic notes, and flaws are easy to scan.',
    image: '/shutterbug-storefront.png'
  },
  {
    title: 'Friendly support',
    copy: 'Ask about a model, an order, or a trade-in before you buy.',
    image: '/shutterbug-customer-service.png'
  }
];

const trustBadges = ['Tested gear', 'Actual photos', 'Condition notes', 'Ships from Shutterbug'];

export default async function Home() {
  const catalog = await getCatalogProducts();
  const featuredProducts = catalog.filter((product) => product.featured).slice(0, 3);
  const featured = featuredProducts.length ? featuredProducts : catalog.slice(0, 3);
  const shelfProducts = featured.slice(0, 3);
  const featuredCategories = featuredCategorySlugs
    .map((slug) => categories.find((category) => category.slug === slug))
    .filter(Boolean);

  return (
    <>
      <section className="relative overflow-hidden bg-cream">
        <div className="relative mx-auto grid max-w-7xl items-start gap-10 px-4 pb-12 pt-8 sm:px-6 sm:pb-14 sm:pt-10 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:pb-16 lg:pt-12">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-moss">Vintage digital &amp; film cameras</p>
            <h1 className="mt-5 max-w-4xl font-serif text-5xl font-bold tracking-tight text-ink sm:text-7xl">
              Tested cameras, ready for their next story.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/72">
              Shop carefully inspected Canon PowerShot, Olympus, Nikon, Sony, Kodak, film cameras, and camera gear with
              real photos, clear condition notes, and honest testing details.
            </p>

            <form action="/shop" className="mt-8 max-w-2xl rounded-lg border border-ink/10 bg-white p-3 shadow-sm">
              <label htmlFor="home-search" className="sr-only">
                Search vintage cameras
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="home-search"
                  name="q"
                  type="search"
                  placeholder="Search Canon PowerShot, Olympus, Nikon Coolpix..."
                  className="min-h-12 min-w-0 flex-1 rounded-lg border border-ink/10 bg-cream px-4 text-sm text-ink outline-none focus:border-moss"
                />
                <button className="rounded-full bg-forest px-7 py-3 text-sm font-semibold text-white transition hover:bg-moss">
                  Search cameras
                </button>
              </div>
            </form>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="rounded-full bg-forest px-7 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-moss"
              >
                Shop tested cameras
              </Link>
              <Link
                href="/sell-your-camera"
                className="rounded-full border border-ink/20 bg-white px-7 py-3 text-center font-semibold text-ink transition hover:border-moss hover:text-moss"
              >
                Sell us your camera
              </Link>
            </div>

            <div className="mt-8 grid gap-2 text-sm text-ink/70 sm:grid-cols-2">
              {trustBadges.map((badge) => (
                <div key={badge} className="rounded-full border border-ink/10 bg-white px-4 py-2 shadow-sm">
                  <span className="font-semibold text-moss">Checked:</span> {badge}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft sm:p-5">
            <img
              src="/shutterbug-storefront.png"
              alt="Shutterbug ladybug character helping a customer choose a camera"
              className="aspect-[4/3] w-full rounded-lg bg-sand object-cover object-center"
            />
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-moss">Camera shelf</p>
                <h2 className="mt-2 font-serif text-3xl font-bold text-ink">Fresh finds, ready to browse.</h2>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {shelfProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  className="grid grid-cols-[5.25rem_1fr] gap-3 rounded-lg border border-ink/10 bg-cream p-3 transition hover:border-moss/35 hover:bg-white"
                >
                  <img
                    src={product.heroImage}
                    alt={product.title}
                    className="aspect-square w-full rounded-md bg-white object-cover object-center"
                  />
                  <div className="min-w-0 py-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-moss">{product.brand}</p>
                      <span className="rounded-full bg-sage px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-forest">
                        {getAvailabilityLabel(product.status)}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-ink">{product.title}</p>
                    <p className="mt-2 text-sm font-bold text-forest">{formatPrice(product.price)}</p>
                  </div>
                </Link>
              ))}
            </div>

            <Link
              href="/shop"
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-forest px-5 text-sm font-semibold text-white transition hover:bg-moss"
            >
              Browse all cameras
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-cream px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 rounded-lg border border-ink/10 bg-white p-5 shadow-sm sm:grid-cols-[5rem_1fr] sm:items-center lg:grid-cols-[6rem_1fr_auto] lg:p-6">
          <img
            src="/shutterbug-basic-character.png"
            alt=""
            className="h-20 w-20 rounded-full bg-sand object-cover object-center lg:h-24 lg:w-24"
          />
          <div>
            <p className="font-serif text-2xl font-bold text-ink">Shop Shutterbug direct or at Amazon.com</p>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/68">
              Buy direct from Shutterbug Camera Shop here, with select camera listings also available through our
              Amazon.com store for shoppers who prefer that checkout experience.
            </p>
          </div>
          {site.amazonStoreUrl ? (
            <a
              href={site.amazonStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-forest px-5 text-sm font-semibold text-white transition hover:bg-moss sm:col-start-2 lg:col-start-auto"
            >
              Shop now at Amazon.com
            </a>
          ) : (
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-ink/15 bg-cream px-5 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss sm:col-start-2 lg:col-start-auto"
            >
              Ask what is available
            </Link>
          )}
        </div>
      </section>

      <section className="bg-cream px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-moss">Popular searches</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {brandLinks.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink/75 shadow-sm transition hover:border-moss/40 hover:text-moss"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Start here" title="Shop by category">
            Find compact digitals, film cameras, accessories, and clearly marked parts/repair gear.
          </SectionHeading>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredCategories.map((category) => (
              <Link
                key={category!.slug}
                href={`/categories/${category!.slug}`}
                className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-moss/30 hover:shadow-soft"
              >
                <p className="font-serif text-2xl font-bold text-ink">{category!.name}</p>
                <p className="mt-3 text-sm leading-6 text-ink/65">{category!.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-moss">Featured inventory</p>
              <h2 className="mt-3 font-serif text-4xl font-bold text-ink">Fresh camera finds</h2>
            </div>
            <Link href="/shop" className="font-semibold text-moss hover:text-ink">
              View all products &rarr;
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">
          {trustCards.map(({ title, copy, image }) => (
            <div key={title} className="rounded-lg border border-ink/10 bg-white p-8 shadow-sm">
              <img
                src={image}
                alt=""
                className="mb-6 aspect-[4/3] w-full rounded-lg bg-sand object-cover object-center"
              />
              <p className="font-serif text-2xl font-bold text-ink">{title}</p>
              <p className="mt-4 text-sm leading-7 text-ink/68">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-mint px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-lg border border-ink/10 bg-white p-8 shadow-sm lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-moss">Testing process preview</p>
            <h2 className="mt-3 font-serif text-4xl font-bold text-ink">Know what works before it arrives.</h2>
            <p className="mt-4 max-w-3xl leading-7 text-ink/70">
              See how each camera is checked before it is listed.
            </p>
          </div>
          <Link
            href="/testing-process"
            className="rounded-full bg-forest px-7 py-3 text-center font-semibold text-white transition hover:bg-moss"
          >
            See how we test
          </Link>
        </div>
      </section>
    </>
  );
}
