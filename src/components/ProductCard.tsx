import Link from 'next/link';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { ProductLikeButton } from '@/components/ProductLikeButton';
import { Product, formatPrice, getAvailabilityLabel, isPurchasable } from '@/lib/products';

export function ProductCard({
  product,
  liked = false,
  signedIn = false
}: {
  product: Product;
  liked?: boolean;
  signedIn?: boolean;
}) {
  const availabilityLabel = getAvailabilityLabel(product.status);
  const purchasable = isPurchasable(product);
  const productHref = `/shop/${product.slug}`;
  const cartItem = {
    id: product.id,
    slug: product.slug,
    title: product.title,
    image: product.heroImage,
    condition: product.condition,
    priceCents: product.priceCents ?? Math.round(product.price * 100),
    quantity: 1,
    maxQuantity: product.quantity ?? 1
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm transition hover:-translate-y-1 hover:border-moss/35 hover:shadow-soft">
      <div className="relative aspect-[4/3] bg-sand p-3 sm:p-6">
        <Link href={productHref} className="block h-full w-full">
          <img src={product.heroImage} alt={product.title} className="h-full w-full object-contain" />
        </Link>
        <span className="absolute left-2 top-2 max-w-[calc(100%-4rem)] truncate rounded-full bg-white px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-forest shadow-sm sm:left-4 sm:top-4 sm:px-3 sm:text-xs sm:tracking-[0.14em]">
          {availabilityLabel}
        </span>
        <ProductLikeButton
          productId={product.id}
          productSlug={product.slug}
          liked={liked}
          signedIn={signedIn}
          redirectTo={productHref}
          className={`absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition sm:right-4 sm:top-4 ${
            liked
              ? 'border-forest bg-forest text-white hover:bg-moss'
              : 'border-ink/10 bg-white text-ink hover:border-moss hover:text-moss'
          }`}
        />
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <div className="flex flex-wrap gap-1.5 text-[0.68rem] font-semibold sm:gap-2 sm:text-xs">
          <span className="rounded-full bg-mint px-3 py-1 text-forest">{product.functionalStatus ?? 'Tested'}</span>
          <span className="rounded-full bg-sage px-3 py-1 text-ink/70">{product.condition}</span>
          {product.includesBattery ? <span className="rounded-full bg-sage px-3 py-1 text-ink/70">Battery</span> : null}
          {product.includesCharger ? (
            <span className="hidden rounded-full bg-sage px-3 py-1 text-ink/70 sm:inline-flex">Charger</span>
          ) : null}
          {product.condition === 'For Parts' ? (
            <span className="rounded-full bg-sand px-3 py-1 text-ink/70">Parts</span>
          ) : null}
        </div>

        <p className="mt-3 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-moss sm:mt-4 sm:text-xs sm:tracking-[0.16em]">
          {product.brand}
        </p>
        <Link href={productHref} className="mt-2 block">
          <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-ink transition group-hover:text-moss sm:min-h-12 sm:text-lg sm:leading-6">
            {product.title}
          </h3>
        </Link>
        <p className="mt-3 hidden text-sm leading-6 text-ink/65 sm:line-clamp-2">{product.shortDescription}</p>

        <div className="mt-4 hidden gap-1 text-sm text-ink/68 sm:grid">
          <p>
            <span className="font-semibold text-ink">Status:</span> {availabilityLabel}
          </p>
          <p>
            <span className="font-semibold text-ink">Note:</span> {product.conditionSummary}
          </p>
          <p>
            <span className="font-semibold text-ink">Ships:</span> from Shutterbug
          </p>
        </div>
        <label className="mt-3 hidden min-h-9 items-center gap-2 text-sm font-semibold text-ink/60 sm:inline-flex">
          <input type="checkbox" className="h-4 w-4 rounded border-ink/20 accent-[#24543a]" />
          Compare
        </label>

        <div className="mt-auto grid gap-3 pt-4 sm:gap-4 sm:pt-5">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.14em] text-ink/50 sm:text-xs sm:tracking-[0.16em]">
              Price
            </p>
            <p className="text-lg font-bold text-ink sm:text-xl">{formatPrice(product.price)}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {purchasable ? (
              <AddToCartButton
                item={cartItem}
                className="flex min-h-11 items-center justify-center rounded-full bg-forest px-3 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-moss sm:px-4"
              />
            ) : (
              <Link
                href="/contact"
                className="flex min-h-11 items-center justify-center rounded-full bg-forest px-3 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-moss sm:px-4"
              >
                Alert me
              </Link>
            )}
            <Link
              href={productHref}
              className="flex min-h-11 items-center justify-center rounded-full border border-ink/15 bg-white px-3 py-2.5 text-center text-sm font-semibold text-ink transition hover:border-moss hover:text-moss sm:px-4"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
