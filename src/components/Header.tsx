import Link from 'next/link';

const nav = [
  { href: '/shop', label: 'Shop' },
  { href: '/categories/vintage-digital-cameras', label: 'Vintage Digital' },
  { href: '/sell-your-camera', label: 'Sell Your Camera' },
  { href: '/testing-process', label: 'Testing Process' },
  { href: '/about', label: 'About' }
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center" aria-label="Shutterbug Camera Shop home">
          <img
            src="/shutterbug-header-logo.png"
            alt="Shutterbug Camera Shop"
            className="h-12 w-44 object-contain object-left sm:h-14 sm:w-56"
          />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-ink/75 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/shop"
          className="rounded-full bg-brass px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-moss"
        >
          Shop Cameras
        </Link>
      </div>
    </header>
  );
}
