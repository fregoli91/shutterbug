import Link from 'next/link';
import { ProductLikeButton } from '@/components/ProductLikeButton';
import { getCustomerLikedProducts, getLikedProductHeroImage } from '@/lib/customer-likes';
import { requireCustomer } from '@/lib/customer-auth';
import { formatCents } from '@/lib/money';

export const metadata = {
  title: 'Liked Products'
};

export default async function AccountLikesPage() {
  const customer = await requireCustomer('/account/likes');
  const likes = await getCustomerLikedProducts(customer.id);

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-moss">Customer account</p>
            <h1 className="mt-3 font-serif text-5xl font-bold text-ink">Liked products</h1>
            <p className="mt-4 max-w-2xl leading-7 text-ink/68">
              Save cameras for later, compare options, and come back to product details when you are ready.
            </p>
          </div>
          <Link href="/account" className="font-semibold text-moss hover:text-ink">
            Account overview
          </Link>
        </div>

        {likes.length ? (
          <div className="mt-8 grid gap-4">
            {likes.map((like) => {
              const product = like.product;
              const productHref = `/shop/${product.slug}`;

              return (
                <article
                  key={like.id}
                  className="grid gap-4 rounded-lg border border-ink/10 bg-white p-4 shadow-sm sm:grid-cols-[8rem_1fr_auto] sm:items-center"
                >
                  <Link href={productHref} className="block rounded-lg bg-sand p-3">
                    <img
                      src={getLikedProductHeroImage(like)}
                      alt={product.title}
                      className="aspect-square w-full object-contain"
                    />
                  </Link>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-moss">{product.brand}</p>
                    <Link href={productHref} className="mt-2 block">
                      <h2 className="font-serif text-2xl font-bold leading-tight text-ink transition hover:text-moss">
                        {product.title}
                      </h2>
                    </Link>
                    <p className="mt-2 text-sm leading-6 text-ink/65">
                      {product.conditionSummary || product.shortDescription || 'Saved Shutterbug camera listing.'}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.12em]">
                      <span className="rounded-full bg-mint px-3 py-1 text-forest">{formatStatus(product.status)}</span>
                      <span className="rounded-full bg-sage px-3 py-1 text-ink/70">{formatCondition(product.condition)}</span>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:justify-items-end">
                    <p className="text-xl font-bold text-ink">{formatCents(product.priceCents)}</p>
                    <ProductLikeButton
                      productId={product.id}
                      productSlug={product.slug}
                      liked
                      signedIn
                      redirectTo="/account/likes"
                      showText
                    />
                    <Link
                      href={productHref}
                      className="inline-flex min-h-11 items-center justify-center rounded-full border border-ink/15 bg-cream px-5 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss"
                    >
                      View details
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-lg border border-ink/10 bg-white p-8 text-center shadow-sm">
            <img
              src="/shutterbug-basic-character.png"
              alt=""
              className="mx-auto h-24 w-24 rounded-full border border-ink/10 bg-sand object-cover object-center"
            />
            <p className="mt-5 font-serif text-3xl font-bold text-ink">No liked products yet</p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ink/65">
              Tap the heart on a camera card or product page to save it here for later.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex min-h-12 items-center rounded-full bg-forest px-6 text-sm font-semibold text-white"
            >
              Browse cameras
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function formatStatus(status: string) {
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatCondition(condition: string) {
  return condition.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}
