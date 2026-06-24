import Link from 'next/link';
import { site } from '@/lib/seo';

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-ink text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <p className="font-serif text-2xl font-bold">Shutterbug Camera Shop</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-cream/70">
            Tested vintage digital cameras, film cameras, accessories, and camera gear. Real inventory, real photos,
            and clear condition notes before you buy.
          </p>
          <p className="mt-4 text-sm text-cream/60">{site.supportEmail}</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cream/60">Shop</p>
          <div className="mt-4 grid gap-2 text-sm text-cream/75">
            <Link href="/shop" className="transition hover:text-white">All Cameras</Link>
            <Link href="/categories/vintage-digital-cameras" className="transition hover:text-white">Vintage Digital Cameras</Link>
            <Link href="/categories/film-cameras" className="transition hover:text-white">Film Cameras</Link>
            <Link href="/categories/parts-repair" className="transition hover:text-white">Parts & Repair</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cream/60">Trust</p>
          <div className="mt-4 grid gap-2 text-sm text-cream/75">
            <Link href="/testing-process" className="transition hover:text-white">Testing Process</Link>
            <Link href="/returns" className="transition hover:text-white">Returns</Link>
            <Link href="/sell-your-camera" className="transition hover:text-white">Sell Your Camera</Link>
            <Link href="/contact" className="transition hover:text-white">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}