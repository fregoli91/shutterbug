import Link from 'next/link';

const helpfulLinks = [
  { label: 'Shop used cameras', href: '/shop' },
  { label: 'Vintage digital cameras', href: '/categories/vintage-digital-cameras' },
  { label: 'Film cameras', href: '/categories/film-cameras' },
  { label: 'Camera buying guides', href: '/guides' },
  { label: 'Contact Shutterbug', href: '/contact' }
];

export default function NotFound() {
  return (
    <main className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-moss">404 - page not found</p>
        <h1 className="mt-3 font-serif text-4xl font-bold text-ink sm:text-6xl">That camera page is out of frame.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-ink/70">
          The address may have changed, or a one-off listing may no longer be available. Use these links to find
          current Shutterbug inventory and camera resources.
        </p>
        <nav className="mt-8 flex flex-wrap justify-center gap-2" aria-label="Helpful pages">
          {helpfulLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={index === 0
                ? 'rounded-full bg-forest px-5 py-3 font-semibold text-white hover:bg-moss'
                : 'rounded-full border border-ink/10 bg-white px-5 py-3 font-semibold text-ink/72 hover:text-moss'}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
