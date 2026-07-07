import Link from 'next/link';
import { categories } from '@/lib/categories';
import { site } from '@/lib/seo';

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-ink text-cream">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 pb-[calc(2.5rem+env(safe-area-inset-bottom))] sm:px-6 sm:py-12 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img src="/shutterbug-basic-character.png" alt="" className="h-16 w-16 rounded-full bg-sand object-cover" />
            <p className="font-serif text-2xl font-bold">Shutterbug Camera Shop</p>
          </div>
          <p className="mt-3 max-w-xl text-sm leading-6 text-cream/72">
            A camera-first used gear shop focused on tested vintage digital cameras, film cameras, real condition
            notes, clear included accessories, and honest parts/repair listings.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-cream/75">
            <p className="rounded-full border border-cream/10 px-3 py-2">Tested before listing</p>
            <p className="rounded-full border border-cream/10 px-3 py-2">Actual photos when available</p>
            <p className="rounded-full border border-cream/10 px-3 py-2">Honest flaws noted</p>
            <p className="rounded-full border border-cream/10 px-3 py-2">Friendly support</p>
          </div>
          <div className="mt-5 grid gap-1 text-sm text-cream/60">
            <a href={`mailto:${site.supportEmail}`} className="transition hover:text-white">
              {site.supportEmail}
            </a>
            <a href={site.supportPhoneHref} className="transition hover:text-white">
              {site.supportPhone}
            </a>
            {site.amazonStoreUrl ? (
              <a
                href={site.amazonStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white"
              >
                Shop now at Amazon.com
              </a>
            ) : null}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cream/60">Shop</p>
          <div className="mt-4 grid gap-1 text-sm text-cream/75">
            <Link href="/shop" className="flex min-h-9 items-center transition hover:text-white">
              All Cameras
            </Link>
            {categories.slice(0, 5).map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="flex min-h-9 items-center transition hover:text-white"
              >
                {category.navLabel}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cream/60">Trust</p>
          <div className="mt-4 grid gap-1 text-sm text-cream/75">
            <Link href="/testing-process" className="flex min-h-9 items-center transition hover:text-white">
              Testing Process
            </Link>
            <Link href="/returns" className="flex min-h-9 items-center transition hover:text-white">
              Returns
            </Link>
            <Link href="/shipping" className="flex min-h-9 items-center transition hover:text-white">
              Shipping
            </Link>
            <Link href="/sell-your-camera" className="flex min-h-9 items-center transition hover:text-white">
              Sell Your Camera
            </Link>
            <Link href="/contact" className="flex min-h-9 items-center transition hover:text-white">
              Customer Service
            </Link>
            <Link href="/about" className="flex min-h-9 items-center transition hover:text-white">
              About Shutterbug
            </Link>
            <Link href="/privacy" className="flex min-h-9 items-center transition hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="flex min-h-9 items-center transition hover:text-white">
              Terms
            </Link>
            <Link href="/admin" className="flex min-h-9 items-center text-cream/45 transition hover:text-white">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
