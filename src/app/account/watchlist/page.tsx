import Link from 'next/link';
import { AccountFeaturePage } from '@/components/account/AccountFeaturePage';
import { requireCustomer } from '@/lib/customer-auth';
import { getCustomerModelWatches } from '@/lib/model-watchlist';
import { removeModelWatchAction } from './actions';

export const metadata = { title: 'Model Watchlist', robots: { index: false, follow: false } };

export default async function AccountWatchlistPage() {
  const customer = await requireCustomer('/account/watchlist');
  const watches = await getCustomerModelWatches(customer.id);
  return (
    <AccountFeaturePage
      eyebrow="Customer account"
      title="Model watchlist"
      intro="Keep hard-to-find camera and printer models together while you wait for another unit to reach the shop."
    >
      <div className="mb-6 rounded-lg border border-moss/20 bg-mint p-4 text-sm leading-6 text-ink/70">
        This list saves the models you care about. Automatic email or text alerts are not active yet.
      </div>
      {watches.length ? (
        <div className="grid gap-4">
          {watches.map((watch) => (
            <article key={watch.id} className="flex flex-col gap-4 rounded-lg border border-ink/10 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-moss">{watch.brand}</p>
                <h2 className="mt-2 font-serif text-2xl font-bold text-ink">{watch.model}</h2>
                <p className="mt-2 text-sm text-ink/60">Saved {watch.createdAt.toLocaleDateString('en-US')}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href={`/shop?q=${encodeURIComponent(`${watch.brand} ${watch.model}`)}`} className="inline-flex min-h-11 items-center rounded-full bg-forest px-5 text-sm font-semibold text-white">
                  Search available inventory
                </Link>
                <form action={removeModelWatchAction}>
                  <input type="hidden" name="watchId" value={watch.id} />
                  <button className="min-h-11 rounded-full border border-ink/15 bg-cream px-5 text-sm font-semibold text-ink hover:border-moss">Remove</button>
                </form>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-ink/10 bg-white p-8 text-center shadow-sm">
          <p className="font-serif text-3xl font-bold text-ink">No watched models yet</p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ink/65">
            Open a sold product and choose <strong>Watch this model</strong> to save it here.
          </p>
          <Link href="/shop?availability=sold_out" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-forest px-6 text-sm font-semibold text-white">
            Browse sold finds
          </Link>
        </div>
      )}
    </AccountFeaturePage>
  );
}