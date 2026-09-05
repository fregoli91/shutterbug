import Link from 'next/link';

export function EmptyShelf({
  title = 'Nothing on the shelf right now.',
  description = 'Our inventory changes as cameras arrive. Check back soon or explore another collection.',
  filtered = false,
  sellLabel = 'Sell Your Camera'
}: { title?: string; description?: string; filtered?: boolean; sellLabel?: string }) {
  return (
    <div className="w-full border-y border-forest/10 bg-mint/40 px-4 py-8 text-center sm:px-6 sm:py-10">
      <h2 className="text-2xl font-semibold leading-tight text-ink">{title}</h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-ink/70">{description}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="inline-flex min-h-11 items-center justify-center rounded-md bg-forest px-4 text-sm font-semibold text-white hover:bg-moss focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss">
          {filtered ? 'Clear filters' : 'Browse Cameras'}
        </Link>
        <Link href="/sell-your-camera" className="inline-flex min-h-11 items-center justify-center rounded-md border border-forest/20 px-4 text-sm font-semibold text-forest hover:bg-mint focus-visible:outline focus-visible:outline-2 focus-visible:outline-moss">
          {sellLabel}
        </Link>
      </div>
    </div>
  );
}