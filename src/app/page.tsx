import Link from 'next/link';
import Image from 'next/image';
import { ProductCard } from '@/components/ProductCard';
import { SectionHeading } from '@/components/SectionHeading';
import { categories, featuredCategorySlugs, type Category } from '@/lib/categories';
import { getLikedProductIds } from '@/lib/customer-likes';
import { getCustomerSession } from '@/lib/customer-auth';
import { formatPrice, getCatalogProducts, type Product } from '@/lib/products';
import { site } from '@/lib/seo';

type CustomerSession = NonNullable<Awaited<ReturnType<typeof getCustomerSession>>>;

const brandLinks = [
  ['Canon', '/brands/canon'],
  ['Olympus', '/brands/olympus'],
  ['Nikon', '/brands/nikon'],
  ['Sony', '/brands/sony'],
  ['Kodak', '/brands/kodak'],
  ['Fujifilm', '/brands/fujifilm'],
  ['Panasonic', '/brands/panasonic'],
  ['All brands', '/brands']
];

const trustBadges = ['Tested gear', 'Actual photos', 'Condition notes', 'Secure checkout'];

const offerCards = [
  {
    title: 'Vintage digital cameras',
    copy: 'Pocketable digital finds from Canon, Olympus, Nikon, Sony, Kodak, and more.',
    href: '/categories/vintage-digital-cameras',
    image: '/shutterbug-category-digital.png'
  },
  {
    title: 'Film cameras',
    copy: 'Classic 35mm cameras and film gear with clear condition notes.',
    href: '/categories/film-cameras',
    image: '/shutterbug-category-film.png'
  },
  {
    title: 'Accessories',
    copy: 'Chargers, batteries, cards, straps, bags, filters, and useful add-ons.',
    href: '/categories/camera-accessories',
    image: '/shutterbug-category-accessories-hero.png'
  },
  {
    title: 'Parts and repair',
    copy: 'As-is repair projects kept clearly separate from ready-to-shoot cameras.',
    href: '/categories/parts-repair',
    image: '/shutterbug-category-parts-repair.png'
  },
  {
    title: 'Sell or trade in',
    copy: 'Send your camera details for a buyout or trade-in review.',
    href: '/sell-your-camera',
    image: '/shutterbug-category-trade-in.png'
  }
];

const accountBenefits = [
  'Track your camera orders',
  'View your purchase history',
  'Save time at checkout',
  'Get easier support for past purchases'
];

const quickLinks = [
  ['Shop all cameras', '/shop'],
  ['Liked products', '/account/likes'],
  ['View cart', '/cart'],
  ['My orders', '/account/orders'],
  ['Sell your camera', '/sell-your-camera']
];

export default async function Home() {
  const catalog = await getCatalogProducts();
  const featuredProducts = catalog.filter((product) => product.featured).slice(0, 4);
  const featured = featuredProducts.length ? featuredProducts : catalog.slice(0, 4);
  const shelfProducts = featured.slice(0, 3);
  const newArrivals = catalog.slice(0, 6);
  const featuredCategories = featuredCategorySlugs
    .map((slug) => categories.find((category) => category.slug === slug))
    .filter((category): category is Category => Boolean(category));
  const customer = await getCustomerSession();
  const likedProductIds = await getLikedProductIds(
    customer?.id,
    [...featured, ...newArrivals].map((product) => product.id)
  );

  if (customer) {
    return (
      <LoggedInHome
        customer={customer}
        featured={featured}
        newArrivals={newArrivals}
        featuredCategories={featuredCategories}
        likedProductIds={likedProductIds}
      />
    );
  }

  return <LoggedOutHome featured={featured} shelfProducts={shelfProducts} />;
}

function LoggedOutHome({
  featured,
  shelfProducts
}: {
  featured: Product[];
  shelfProducts: Product[];
}) {
  return (
    <>
      <section className="relative overflow-hidden bg-cream">
        <div className="relative mx-auto max-w-7xl px-3 pb-8 pt-3 sm:px-6 sm:pb-10 sm:pt-5 lg:px-8">
          <Link
            href="/shop?sort=featured"
            className="block overflow-hidden rounded-lg border border-ink/10 bg-white shadow-soft transition hover:border-moss/30"
          >
            <Image
              src="/shutterbug-summer-sale-banner.png"
              alt="Shutterbug Camera Shop summer sale on tested vintage digital and film cameras"
              width={2400}
              height={720}
              priority
              sizes="100vw"
              className="w-full bg-sand object-contain"
            />
          </Link>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-moss sm:text-sm">Summer sale</p>
              <h1 className="mt-3 max-w-3xl font-serif text-4xl font-bold tracking-tight text-ink sm:text-6xl">
                Save on tested vintage cameras.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-ink/72 sm:hidden">
                Real photos, clear condition notes, and friendly support.
              </p>
              <p className="mt-5 hidden max-w-3xl text-lg leading-8 text-ink/72 sm:block">
                Shop carefully inspected digital and film cameras with real photos, clear condition notes, and honest
                testing details.
              </p>
            </div>

            <div className="grid gap-3 sm:flex sm:justify-start lg:justify-end">
              <Link
                href="/shop"
                className="rounded-full bg-forest px-7 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-moss"
              >
                Shop the sale
              </Link>
              <Link
                href="/categories/vintage-digital-cameras"
                className="rounded-full border border-ink/20 bg-white px-7 py-3 text-center font-semibold text-ink transition hover:border-moss hover:text-moss"
              >
                Vintage digital
              </Link>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-ink/70 sm:grid-cols-4 sm:text-sm">
            {trustBadges.map((badge) => (
              <div key={badge} className="rounded-full border border-ink/10 bg-white px-3 py-2 text-center shadow-sm">
                <span className="font-semibold text-moss">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.15fr_1fr] lg:items-stretch">
          <Link
            href="/shop?sort=newest"
            className="group relative block min-h-72 overflow-hidden rounded-lg border border-ink/10 bg-sand shadow-sm"
          >
            <Image
              src="/shutterbug-shelf-cameras-display.png"
              alt="Shutterbug shelf display of cameras, lenses, bags, and accessories"
              width={1600}
              height={1000}
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/35 to-transparent p-5 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cream">Fresh finds</p>
              <h2 className="mt-2 font-serif text-3xl font-bold">Browse the Shutterbug shelf</h2>
            </div>
          </Link>

          <div className="grid content-start gap-3">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-moss">Quick picks</p>
                <h2 className="mt-1 font-serif text-2xl font-bold text-ink">Ready to browse</h2>
              </div>
              <Link href="/shop" className="text-sm font-semibold text-moss hover:text-ink">
                View all
              </Link>
            </div>
            {shelfProducts.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.slug}`}
                className="grid grid-cols-[4.5rem_1fr] gap-3 rounded-lg border border-ink/10 bg-white p-3 shadow-sm transition hover:border-moss/35"
              >
                <Image
                  src={product.heroImage}
                  alt={product.title}
                  width={320}
                  height={320}
                  sizes="4.5rem"
                  unoptimized={product.heroImage.endsWith('.svg')}
                  className="aspect-square w-full rounded-md bg-cream object-cover object-center"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-moss">{product.brand}</p>
                  <p className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-ink">{product.title}</p>
                  <p className="mt-1 text-sm font-bold text-forest">{formatPrice(product.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <DirectStoreCallout />

      <section className="bg-cream px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-moss">Shop by category</p>
              <h2 className="mt-3 font-serif text-4xl font-bold text-ink">Start with the gear you want.</h2>
            </div>
            <Link href="/shop" className="font-semibold text-moss hover:text-ink">
              Shop all cameras &rarr;
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {offerCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm transition hover:-translate-y-1 hover:border-moss/30 hover:shadow-soft"
              >
                <Image
                  src={card.image}
                  alt=""
                  width={900}
                  height={675}
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
                  className="aspect-[4/3] w-full bg-sand object-cover object-center transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="p-4">
                  <p className="font-serif text-xl font-bold text-ink">{card.title}</p>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/65">{card.copy}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <TrustCards />

      <CategoryPills title="Popular brands" showPopularBrandsImage />

      <SignupCallout />

      <FeaturedProducts
        eyebrow="Featured inventory"
        title="Fresh camera finds"
        products={featured}
        intro="A few current finds from the Shutterbug shelf."
        featureImage="/shutterbug-fresh-finds.png"
        featureImageAlt="Shutterbug mascot showing a fresh crate of vintage camera finds"
      />

      <TestingProcessCallout />
    </>
  );
}

function LoggedInHome({
  customer,
  featured,
  newArrivals,
  featuredCategories,
  likedProductIds
}: {
  customer: CustomerSession;
  featured: Product[];
  newArrivals: Product[];
  featuredCategories: Category[];
  likedProductIds: Set<string>;
}) {
  const displayName = customer.name?.trim() || customer.email.split('@')[0] || 'friend';

  return (
    <>
      <section className="bg-cream px-4 pb-10 pt-8 sm:px-6 sm:pb-14 lg:px-8 lg:pt-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_24rem] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-moss">Welcome back</p>
            <h1 className="mt-4 font-serif text-5xl font-bold tracking-tight text-ink sm:text-7xl">
              Find your next camera.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/72">
              Browse new arrivals, tested vintage digitals, film cameras, and camera gear picked for Shutterbug
              customers.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop?sort=newest"
                className="rounded-full bg-forest px-7 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-moss"
              >
                Shop new arrivals
              </Link>
              <Link
                href="/account/orders"
                className="rounded-full border border-ink/20 bg-white px-7 py-3 text-center font-semibold text-ink transition hover:border-moss hover:text-moss"
              >
                View my orders
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <Image
                src="/shutterbug-basic-character.png"
                alt=""
                width={80}
                height={80}
                sizes="5rem"
                className="h-20 w-20 rounded-full border border-ink/10 bg-sand object-cover object-center"
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-moss">Customer hub</p>
                <p className="mt-1 font-serif text-2xl font-bold text-ink">Hi, {displayName}</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {quickLinks.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="min-h-12 rounded-lg border border-ink/10 bg-cream px-3 py-3 text-center text-sm font-semibold text-ink transition hover:border-moss/35 hover:text-moss"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FeaturedProducts
        eyebrow="New arrivals"
        title="Fresh from the Shutterbug shelf"
        products={newArrivals}
        intro="Tested cameras and gear ready for a closer look."
        signedIn
        likedProductIds={likedProductIds}
      />

      <CategoryPills title="Recommended brands" />

      <FeaturedProducts
        eyebrow="Featured cameras"
        title="Picked for returning shoppers"
        products={featured}
        intro="A tighter set of current listings with photos, condition notes, and clear availability."
        signedIn
        likedProductIds={likedProductIds}
      />

      <section className="bg-cream px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 rounded-lg border border-ink/10 bg-white p-6 shadow-sm lg:grid-cols-[12rem_1fr_auto] lg:items-center lg:p-8">
          <Image
            src="/shutterbug-trade-in.png"
            alt="Shutterbug trade-in counter"
            width={352}
            height={352}
            sizes="11rem"
            className="aspect-square w-full max-w-44 rounded-lg bg-sand object-cover object-center"
          />
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-moss">Trade in</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-ink">Have a camera you are ready to move on from?</h2>
            <p className="mt-3 max-w-3xl leading-7 text-ink/68">
              Send us the model, photos, and condition details. We will review it for a buyout or trade-in path.
            </p>
          </div>
          <Link
            href="/sell-your-camera"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-forest px-6 text-sm font-semibold text-white transition hover:bg-moss"
          >
            Start a trade-in
          </Link>
        </div>
      </section>

      <CategoryGrid featuredCategories={featuredCategories} />
      <TrustCards />
    </>
  );
}

function DirectStoreCallout() {
  const banner = (
    <Image
      src="/shutterbug-amazon-store-banner.png"
      alt="Visit Shutterbug Camera Shop on Amazon"
      width={2172}
      height={724}
      sizes="(min-width: 1024px) 44vw, 100vw"
      className="aspect-[3/1] w-full bg-cream object-cover object-center"
    />
  );

  return (
    <section className="bg-cream px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 rounded-lg border border-ink/10 bg-white p-4 shadow-sm lg:grid-cols-[minmax(0,1fr)_minmax(24rem,0.95fr)] lg:items-center lg:p-5">
        {site.amazonStoreUrl ? (
          <a
            href={site.amazonStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block overflow-hidden rounded-lg border border-ink/10 bg-cream shadow-sm transition hover:border-moss/35 lg:order-2"
          >
            {banner}
          </a>
        ) : (
          <div className="overflow-hidden rounded-lg border border-ink/10 bg-cream shadow-sm lg:order-2">{banner}</div>
        )}
        <div className="lg:order-1">
          <p className="font-serif text-2xl font-bold text-ink">Shop Shutterbug direct or at Amazon.com</p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/68">
            Buy direct from Shutterbug Camera Shop here, with select camera listings also available through our
            Amazon.com store for shoppers who prefer that checkout experience.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/shop"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-ink/15 bg-cream px-5 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss"
            >
              Shop our site
            </Link>
            {site.amazonStoreUrl ? (
              <a
                href={site.amazonStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-forest px-5 text-sm font-semibold text-white transition hover:bg-moss"
              >
                Shop now at Amazon.com
              </a>
            ) : (
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-forest px-5 text-sm font-semibold text-white transition hover:bg-moss"
              >
                Ask what is available
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryPills({ title, showPopularBrandsImage = false }: { title: string; showPopularBrandsImage?: boolean }) {
  return (
    <section className="bg-cream px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-moss">{title}</p>
        {showPopularBrandsImage ? (
          <Link
            href="/brands"
            className="group mt-5 block overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm transition hover:-translate-y-1 hover:border-moss/30 hover:shadow-soft"
          >
            <Image
              src="/shutterbug-popular-brands.png"
              alt="Popular Shutterbug Camera Shop brands including Canon, Nikon, Sony, Olympus, Fujifilm, Kodak, HP, Epson, Nintendo, and Apple"
              width={1672}
              height={941}
              sizes="(min-width: 1280px) 80rem, 100vw"
              className="aspect-[1672/941] w-full bg-sand object-cover object-center transition duration-500 group-hover:scale-[1.02]"
            />
          </Link>
        ) : null}
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
  );
}

function CategoryGrid({ featuredCategories }: { featuredCategories: Category[] }) {
  return (
    <section className="bg-cream px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-end">
          <SectionHeading eyebrow="Start here" title="Shop by category">
            Find compact digitals, film cameras, accessories, and clearly marked parts/repair gear.
          </SectionHeading>
          <Image
            src="/shutterbug-cameras-general.png"
            alt="Vintage digital and film cameras arranged inside Shutterbug Camera Shop"
            width={900}
            height={675}
            sizes="(min-width: 1024px) 24rem, 100vw"
            className="aspect-[4/3] w-full rounded-lg border border-ink/10 bg-sand object-cover object-center shadow-sm"
          />
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featuredCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-moss/30 hover:shadow-soft"
            >
              <p className="font-serif text-2xl font-bold text-ink">{category.name}</p>
              <p className="mt-3 text-sm leading-6 text-ink/65">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function SignupCallout() {
  return (
    <section className="bg-cream px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-lg border border-ink/10 bg-white p-6 shadow-sm lg:p-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-moss">Become a Shutterbug customer</p>
          <h2 className="mt-3 font-serif text-4xl font-bold text-ink">Find a vintage camera worth keeping.</h2>
          <Image
            src="/shutterbug-customer-account-hero.png"
            alt="Shutterbug customer account, checkout, liked products, and package tracking"
            width={1448}
            height={1086}
            sizes="(min-width: 1280px) 72rem, 100vw"
            className="mt-6 aspect-[4/3] w-full rounded-lg bg-sand object-cover object-center sm:aspect-[16/9]"
          />
          <p className="mt-6 max-w-3xl leading-7 text-ink/70">
            Create your account to shop tested digital and film cameras, track your orders, and keep every Shutterbug
            purchase connected in one place.
          </p>
          <p className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-moss">Why create an account?</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {accountBenefits.map((benefit) => (
              <span
                key={benefit}
                className="rounded-full border border-ink/10 bg-cream px-4 py-2 text-sm font-semibold text-ink/72"
              >
                {benefit}
              </span>
            ))}
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-forest px-6 text-sm font-semibold text-white transition hover:bg-moss"
            >
              Create your account
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-ink/15 bg-cream px-6 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedProducts({
  eyebrow,
  title,
  intro,
  products,
  featureImage,
  featureImageAlt,
  signedIn = false,
  likedProductIds = new Set<string>()
}: {
  eyebrow: string;
  title: string;
  intro: string;
  products: Product[];
  featureImage?: string;
  featureImageAlt?: string;
  signedIn?: boolean;
  likedProductIds?: Set<string>;
}) {
  return (
    <section className="bg-cream px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-moss">{eyebrow}</p>
            <h2 className="mt-3 font-serif text-4xl font-bold text-ink">{title}</h2>
            <p className="mt-3 max-w-2xl leading-7 text-ink/68">{intro}</p>
          </div>
          <Link href="/shop" className="font-semibold text-moss hover:text-ink">
            View all products &rarr;
          </Link>
        </div>
        {featureImage ? (
          <Image
            src={featureImage}
            alt={featureImageAlt ?? ''}
            width={1600}
            height={900}
            sizes="100vw"
            className="mt-8 aspect-[4/3] w-full rounded-lg border border-ink/10 bg-sand object-cover object-center shadow-sm sm:aspect-[16/7]"
          />
        ) : null}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              liked={likedProductIds.has(product.id)}
              signedIn={signedIn}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustCards() {
  return (
    <section className="bg-cream px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
        <Image
          src="/shutterbug-trust-banner.png"
          alt="Shutterbug trust promise with secure shopping, tested cameras, honest service, and careful handling"
          width={1600}
          height={1000}
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="aspect-[4/3] w-full rounded-lg border border-ink/10 bg-cream object-contain object-center shadow-sm sm:aspect-[16/9]"
        />
        <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-moss">Buyer confidence</p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-ink">Trusted cameras, honest service.</h2>
          <div className="mt-5 grid gap-2">
            {['Secure shopping', 'Tested cameras', 'Honest service', 'Careful handling'].map((item) => (
              <span key={item} className="rounded-full bg-cream px-4 py-2 text-sm font-semibold text-ink/72">
                {item}
              </span>
            ))}
          </div>
          <Link
            href="/buyer-guarantee"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-forest px-5 text-sm font-semibold text-white transition hover:bg-moss"
          >
            Buyer guarantee
          </Link>
        </div>
      </div>
    </section>
  );
}

function TestingProcessCallout() {
  return (
    <section className="bg-mint px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 rounded-lg border border-ink/10 bg-white p-6 shadow-sm lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.95fr)] lg:items-center lg:p-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-moss">Testing process preview</p>
          <h2 className="mt-3 font-serif text-4xl font-bold text-ink">Know what works before it arrives.</h2>
          <p className="mt-4 max-w-3xl leading-7 text-ink/70">See how each camera is checked before it is listed.</p>
          <Link
            href="/testing-process"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-forest px-7 text-center font-semibold text-white transition hover:bg-moss"
          >
            See how we test
          </Link>
        </div>
        <Link
          href="/testing-process"
          className="group block overflow-hidden rounded-lg border border-ink/10 bg-cream shadow-sm transition hover:-translate-y-1 hover:border-moss/30 hover:shadow-soft"
        >
          <Image
            src="/shutterbug-testing-process-preview.png"
            alt="Shutterbug testing process checklist for power, lens, flash, buttons, battery, and sample photos"
            width={1672}
            height={941}
            sizes="(min-width: 1024px) 44vw, 100vw"
            className="aspect-[16/9] w-full bg-cream object-cover object-center transition duration-500 group-hover:scale-[1.02]"
          />
        </Link>
      </div>
    </section>
  );
}
