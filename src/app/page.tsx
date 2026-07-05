import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { SectionHeading } from '@/components/SectionHeading';
import { categories, featuredCategorySlugs, type Category } from '@/lib/categories';
import { getCustomerSession } from '@/lib/customer-auth';
import { formatPrice, getAvailabilityLabel, getCatalogProducts, type Product } from '@/lib/products';
import { site } from '@/lib/seo';

type CustomerSession = NonNullable<Awaited<ReturnType<typeof getCustomerSession>>>;

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
    title: 'Tested before listing',
    copy: 'Power, lens, screen, flash, buttons, and card checks are listed before sale.',
    image: '/shutterbug-tested-cameras.png'
  },
  {
    title: 'Real photos and notes',
    copy: 'Exact item photos, included accessories, cosmetic notes, and flaws are easy to scan.',
    image: '/shutterbug-storefront.png'
  },
  {
    title: 'Friendly support',
    copy: 'Ask about a model, an order, or a trade-in before you buy.',
    image: '/shutterbug-customer-service.png'
  }
];

const trustBadges = ['Tested gear', 'Actual photos', 'Condition notes', 'Secure checkout'];

const offerCards = [
  {
    title: 'Vintage digital cameras',
    copy: 'Canon PowerShot, Olympus, Nikon Coolpix, Sony Cyber-shot, Kodak EasyShare, and other compact digital finds.',
    href: '/categories/vintage-digital-cameras'
  },
  {
    title: 'Film cameras',
    copy: 'Classic 35mm cameras and point-and-shoot film gear with clear condition notes.',
    href: '/categories/film-cameras'
  },
  {
    title: 'Accessories',
    copy: 'Batteries, chargers, memory cards, straps, bags, and useful add-ons for older cameras.',
    href: '/categories/camera-accessories'
  },
  {
    title: 'Parts and repair',
    copy: 'As-is cameras and gear are clearly marked so repair projects stay separate from ready-to-shoot listings.',
    href: '/categories/parts-repair'
  },
  {
    title: 'Sell or trade in',
    copy: 'Send us your camera details and we will review it for a buyout or trade-in path.',
    href: '/sell-your-camera'
  }
];

const accountBenefits = [
  'Track orders',
  'View purchase history',
  'Smoother checkout',
  'Easier support for past purchases'
];

const quickLinks = [
  ['Shop all cameras', '/shop'],
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

  if (customer) {
    return (
      <LoggedInHome
        customer={customer}
        featured={featured}
        newArrivals={newArrivals}
        featuredCategories={featuredCategories}
      />
    );
  }

  return (
    <LoggedOutHome featured={featured} shelfProducts={shelfProducts} featuredCategories={featuredCategories} />
  );
}

function LoggedOutHome({
  featured,
  shelfProducts,
  featuredCategories
}: {
  featured: Product[];
  shelfProducts: Product[];
  featuredCategories: Category[];
}) {
  return (
    <>
      <section className="relative overflow-hidden bg-cream">
        <div className="relative mx-auto max-w-7xl px-3 pb-8 pt-3 sm:px-6 sm:pb-10 sm:pt-5 lg:px-8">
          <Link
            href="/shop?sort=featured"
            className="block overflow-hidden rounded-lg border border-ink/10 bg-white shadow-soft transition hover:border-moss/30"
          >
            <img
              src="/shutterbug-summer-sale-banner.png"
              alt="Shutterbug Camera Shop summer sale on tested vintage digital and film cameras"
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

      <section className="bg-cream px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-lg border border-ink/10 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-moss">Quick picks</p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-ink">Fresh finds ready to browse</h2>
            </div>
            <Link href="/shop" className="hidden text-sm font-semibold text-moss hover:text-ink sm:inline-flex">
              View all
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {shelfProducts.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.slug}`}
                className="grid grid-cols-[4.5rem_1fr] gap-3 rounded-lg border border-ink/10 bg-cream p-3 transition hover:border-moss/35 hover:bg-white"
              >
                <img
                  src={product.heroImage}
                  alt={product.title}
                  className="aspect-square w-full rounded-md bg-white object-cover object-center"
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

      <section className="bg-cream px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="What we offer" title="Vintage cameras with the details buyers need">
            Browse ready-to-shoot tested gear, clearly labeled accessories, and repair items that are never mixed in
            with tested cameras.
          </SectionHeading>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {offerCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-moss/30 hover:shadow-soft"
              >
                <p className="font-serif text-2xl font-bold text-ink">{card.title}</p>
                <p className="mt-3 text-sm leading-6 text-ink/65">{card.copy}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <TrustCards />

      <CategoryPills title="Popular searches" />

      <CategoryGrid featuredCategories={featuredCategories} />

      <SignupCallout />

      <FeaturedProducts
        eyebrow="Featured inventory"
        title="Fresh camera finds"
        products={featured}
        intro="A few current finds from the Shutterbug shelf."
      />

      <TestingProcessCallout />
    </>
  );
}

function LoggedInHome({
  customer,
  featured,
  newArrivals,
  featuredCategories
}: {
  customer: CustomerSession;
  featured: Product[];
  newArrivals: Product[];
  featuredCategories: Category[];
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
              <img
                src="/shutterbug-basic-character.png"
                alt=""
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
      />

      <CategoryPills title="Recommended categories" />

      <FeaturedProducts
        eyebrow="Featured cameras"
        title="Picked for returning shoppers"
        products={featured}
        intro="A tighter set of current listings with photos, condition notes, and clear availability."
      />

      <section className="bg-cream px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 rounded-lg border border-ink/10 bg-white p-6 shadow-sm lg:grid-cols-[12rem_1fr_auto] lg:items-center lg:p-8">
          <img
            src="/shutterbug-trade-in.png"
            alt="Shutterbug trade-in counter"
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

function CameraShelf({ products }: { products: Product[] }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft sm:p-5">
      <img
        src="/shutterbug-home-hero.png"
        alt="Shutterbug Camera Shop mascot with vintage digital and film cameras"
        className="aspect-[4/3] w-full rounded-lg bg-sand object-cover object-center"
      />
      <div>
        <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-moss">Camera shelf</p>
        <h2 className="mt-2 font-serif text-3xl font-bold text-ink">Fresh finds, ready to browse.</h2>
      </div>

      <div className="mt-5 grid gap-3">
        {products.map((product) => (
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
  );
}

function DirectStoreCallout() {
  return (
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
  );
}

function CategoryPills({ title }: { title: string }) {
  return (
    <section className="bg-cream px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-moss">{title}</p>
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
          <img
            src="/shutterbug-cameras-general.png"
            alt="Vintage digital and film cameras arranged inside Shutterbug Camera Shop"
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
      <div className="mx-auto grid max-w-7xl gap-8 rounded-lg border border-ink/10 bg-white p-6 shadow-sm lg:grid-cols-[1fr_20rem] lg:items-center lg:p-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-moss">Customer account</p>
          <h2 className="mt-3 font-serif text-4xl font-bold text-ink">A simpler way to buy your next camera.</h2>
          <p className="mt-4 max-w-3xl leading-7 text-ink/70">
            Create an account to keep your Shutterbug purchases, order tracking, and support history connected.
          </p>
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
        <img
          src="/shutterbug-signup.png"
          alt="Shutterbug mascot at the customer signup desk"
          className="aspect-[4/5] w-full rounded-lg bg-sand object-cover object-center"
        />
      </div>
    </section>
  );
}

function FeaturedProducts({
  eyebrow,
  title,
  intro,
  products
}: {
  eyebrow: string;
  title: string;
  intro: string;
  products: Product[];
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
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustCards() {
  return (
    <section className="bg-cream px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">
        {trustCards.map(({ title, copy, image }) => (
          <div key={title} className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
            <img src={image} alt="" className="mb-6 aspect-[4/3] w-full rounded-lg bg-sand object-cover object-center" />
            <p className="font-serif text-2xl font-bold text-ink">{title}</p>
            <p className="mt-4 text-sm leading-7 text-ink/68">{copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TestingProcessCallout() {
  return (
    <section className="bg-mint px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 rounded-lg border border-ink/10 bg-white p-8 shadow-sm lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-moss">Testing process preview</p>
          <h2 className="mt-3 font-serif text-4xl font-bold text-ink">Know what works before it arrives.</h2>
          <p className="mt-4 max-w-3xl leading-7 text-ink/70">See how each camera is checked before it is listed.</p>
        </div>
        <Link
          href="/testing-process"
          className="rounded-full bg-forest px-7 py-3 text-center font-semibold text-white transition hover:bg-moss"
        >
          See how we test
        </Link>
      </div>
    </section>
  );
}
