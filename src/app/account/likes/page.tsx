import Link from 'next/link';
import { AccountFeaturePage } from '@/components/account/AccountFeaturePage';
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
    <AccountFeaturePage
      eyebrow="Customer account"
      title="Liked products"
      intro="Save cameras for later, compare options, and come back to product details when you are ready."
    >
      {likes.length ? (
          <div className="grid gap-4">
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
          <div className="rounded-lg border border-ink/10 bg-white p-8 text-center shadow-sm">
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
    </AccountFeaturePage>
  );
}

function formatStatus(status: string) {
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatCondition(condition: string) {
  return condition.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}
