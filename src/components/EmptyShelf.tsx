import Link from 'next/link';

export function EmptyShelf({
  title = 'Fresh finds are on the way.',
  description = 'We’re photographing and testing new inventory now. Each item is listed with clear condition details once it’s ready.',
  filtered = false,
  sellLabel = 'Sell Your Camera',
  printer = false,
  showWatchlist = false,
  guidesHref = '/guides'
}: {
  title?: string;
  description?: string;
  filtered?: boolean;
  sellLabel?: string;
  printer?: boolean;
  showWatchlist?: boolean;
  guidesHref?: string;
}) {
  return (
    <div className="w-full rounded-lg border border-forest/10 bg-mint/40 px-4 py-7 text-center shadow-sm sm:px-6 sm:py-9">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-moss">{filtered ? 'Adjust your search' : 'The shelf is being stocked'}</p>
      <h2 className="mt-2 font-serif text-2xl font-bold leading-tight text-ink sm:text-3xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-ink/70">{description}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="inline-flex min-h-11 items-center justify-center rounded-md bg-forest px-4 text-sm font-semibold text-white hover:bg-moss focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss">
          {filtered ? 'Clear filters' : printer ? 'Browse all inventory' : 'Browse categories'}
        </Link>
        {!filtered ? (
          <Link href={guidesHref} className="inline-flex min-h-11 items-center justify-center rounded-md border border-forest/20 bg-white/70 px-4 text-sm font-semibold text-forest hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-moss">
            Explore guides
          </Link>
        ) : null}
        {showWatchlist && !filtered ? (
          <Link href="/account/watchlist" className="inline-flex min-h-11 items-center justify-center rounded-md border border-forest/20 bg-white/70 px-4 text-sm font-semibold text-forest hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-moss">
            Model watchlist
          </Link>
        ) : null}
        {!filtered ? (
          <Link href={printer ? '/contact' : '/sell-your-camera'} className="inline-flex min-h-11 items-center justify-center rounded-md border border-forest/20 px-4 text-sm font-semibold text-forest hover:bg-mint focus-visible:outline focus-visible:outline-2 focus-visible:outline-moss">
            {printer ? 'Ask about a printer' : sellLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
