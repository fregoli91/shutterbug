import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { SectionHeading } from '@/components/SectionHeading';
import { categories } from '@/lib/categories';
import { products } from '@/lib/products';

const brandLinks = ['Canon', 'Olympus', 'Nikon', 'Sony', 'Kodak', 'Fujifilm', 'Minolta', 'Panasonic'];

const trustCards = [
  {
    title: 'Tested before listing',
    copy: 'Power, zoom, flash, screen, card read/write, and button checks are clearly shown on each premium listing.',
    image: '/shutterbug-mascot-front.png'
  },
  {
    title: 'Built for vintage demand',
    copy: 'Canon PowerShot, Olympus, Nikon Coolpix, Sony Cyber-shot, Kodak EasyShare, and other nostalgic models are the core focus.',
    image: '/shutterbug-mascot-wink.png'
  },
  {
    title: 'A real camera seller',
    copy: 'Inventory is inspected, photographed, and shipped by Shutterbug Camera Shop rather than random third-party sellers.',
    image: '/shutterbug-mascot-wave.png'
  }
];

export default function Home() {
  const featured = products.slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-cream">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-sage/50 blur-3xl" />
        <div className="pointer-events-none absolute right-10 top-24 h-48 w-48 rounded-full bg-sage/25 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-brass">
              Vintage digital cameras, tested
            </p>

            <h1 className="mt-5 max-w-4xl font-serif text-5xl font-bold tracking-tight text-ink sm:text-7xl">
              Real cameras. Real photos. Ready to shoot.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/72">
              Shutterbug Camera Shop specializes in tested vintage digital cameras, film cameras, and camera gear from
              Canon, Olympus, Nikon, Sony, Kodak, Fujifilm, and more.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="rounded-full bg-brass px-7 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-moss"
              >
                Shop tested cameras
              </Link>

              <Link
                href="/sell-your-camera"
                className="rounded-full border border-ink/20 bg-white px-7 py-3 text-center font-semibold text-ink transition hover:border-brass hover:text-brass"
              >
                Sell us your camera
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-2 text-sm text-ink/65">
              {brandLinks.map((brand) => (
                <span key={brand} className="rounded-full border border-ink/10 bg-white px-4 py-2 shadow-sm">
                  {brand}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
            <img
              src="/shutterbug-mascot-wave.png"
              alt="Shutterbug mascot holding a vintage camera"
              className="mx-auto aspect-square max-h-[420px] w-full rounded-lg object-cover object-center"
            />

            <div className="mt-6 rounded-lg bg-sand p-5">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-brass">
                Every premium listing should show
              </p>

              <ul className="mt-4 grid list-disc gap-2 pl-5 text-sm leading-6 text-ink/75">
                <li>Actual photos of the exact camera</li>
                <li>Clear testing checklist</li>
                <li>Included battery, charger, card, and accessories</li>
                <li>Honest cosmetic and functional condition notes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Start here" title="Shop by category">
            Focused camera categories make the site feel professional while leaving room for parts, accessories, and future collectibles.
          </SectionHeading>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brass/30 hover:shadow-soft"
              >
                <p className="font-serif text-2xl font-bold text-ink">{category.name}</p>
                <p className="mt-3 text-sm leading-6 text-ink/65">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-brass">
                Featured inventory
              </p>
              <h2 className="mt-3 font-serif text-4xl font-bold text-ink">Fresh camera finds</h2>
            </div>

            <Link href="/shop" className="font-semibold text-brass hover:text-ink">
              View all products &rarr;
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
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
    </>
  );
}
