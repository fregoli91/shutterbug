import Link from 'next/link';
import Image from 'next/image';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { ProductLikeButton } from '@/components/ProductLikeButton';
import { Product, formatPrice, isPurchasable } from '@/lib/products';

export function ProductCard({ product, liked = false, signedIn = false }: {
  product: Product; liked?: boolean; signedIn?: boolean;
}) {
  const purchasable = isPurchasable(product);
  const productHref = `/shop/${product.slug}`;

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-ink/10 bg-[#fffdf8] transition hover:border-moss/35">
      <Link href={productHref} className="block aspect-[4/3] bg-sand/40 p-2 sm:p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-moss">
        <Image src={product.heroImage} alt={product.title} width={600} height={450}
          sizes="(min-width: 1280px) 300px, (min-width: 1024px) 30vw, (min-width: 768px) 33vw, 50vw"
          unoptimized={product.heroImage.endsWith('.svg')} className="h-full w-full object-contain" />
      </Link>
      <div className="flex flex-1 flex-col px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="flex min-h-11 items-center justify-between gap-1">
          <p className="min-w-0 break-words text-xs font-semibold text-moss">{product.brand}</p>
          <ProductLikeButton productId={product.id} productSlug={product.slug} liked={liked}
            signedIn={signedIn} redirectTo={productHref}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-moss ${liked ? 'text-forest bg-mint' : 'text-ink/65 hover:bg-mint hover:text-forest'}`} />
        </div>
        <Link href={productHref} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-moss">
          <h3 className="line-clamp-3 min-h-[3.75rem] break-words text-sm font-semibold leading-5 text-ink group-hover:text-moss sm:text-base">{product.model || product.title}</h3>
        </Link>
        <p className="mt-2 text-xs leading-5 text-ink/70">{product.condition}</p>
        {product.functionalStatus ? <p className="text-xs leading-5 text-ink/60">{product.functionalStatus}</p> : null}
        <div className="mt-auto pt-3">
          <p className="text-lg font-bold text-ink sm:text-xl">{formatPrice(product.price)}</p>
          <p className="mt-1 text-xs text-ink/65">{purchasable ? 'In stock' : 'Currently unavailable'}</p>
          <div className="mt-3 grid gap-1">
            {purchasable ? <AddToCartButton productId={product.id} className="flex min-h-11 items-center justify-center rounded-md bg-forest px-2 py-2 text-sm font-semibold text-white hover:bg-moss focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss" /> : null}
            <Link href={productHref} className="inline-flex min-h-11 items-center justify-center rounded-md text-sm font-semibold text-forest hover:bg-mint focus-visible:outline focus-visible:outline-2 focus-visible:outline-moss">View details</Link>
          </div>
        </div>
      </div>
    </article>
  );
}