import Link from 'next/link';
import { Product, formatPrice } from '@/lib/products';

export function ProductCard({ product }: { product: Product }) {
  const statusLabel = product.status === 'in-stock' ? 'In stock' : product.status === 'sold-out' ? 'Sold out' : 'Coming soon';

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brass/30 hover:shadow-soft"
    >
      <div className="aspect-[4/3] bg-sand p-6">
        <img src={product.heroImage} alt={product.title} className="h-full w-full object-contain" />
      </div>
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.16em]">
          <span className="text-brass">{product.brand}</span>
          <span className="rounded-full bg-sage px-3 py-1 text-ink/70">{statusLabel}</span>
        </div>
        <h3 className="line-clamp-2 min-h-12 text-lg font-semibold leading-6 text-ink group-hover:text-brass">
          {product.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-ink/65">{product.shortDescription}</p>
        <div className="mt-5 flex items-center justify-between">
          <p className="text-lg font-bold text-ink">{formatPrice(product.price)}</p>
          <p className="text-sm font-medium text-ink/60">{product.condition}</p>
        </div>
      </div>
    </Link>
  );
}