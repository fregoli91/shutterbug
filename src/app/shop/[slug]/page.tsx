import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { ProductLikeButton } from '@/components/ProductLikeButton';
import { ProductCard } from '@/components/ProductCard';
import {
  formatPrice,
  getAvailabilityLabel,
  getProductBySlug,
  getSimilarProductsAsync,
  isPurchasable,
  products
} from '@/lib/products';
import { getCategory } from '@/lib/categories';
import { getLikedProductIds } from '@/lib/customer-likes';
import { getCustomerSession } from '@/lib/customer-auth';
import { site } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.seoTitle ?? product.title,
    description: product.seoDescription,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      title: product.title,
      description: product.seoDescription,
      url: `${site.domain}/shop/${product.slug}`,
      type: 'website'
    }
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const category = getCategory(product.categorySlug);
  const similarProducts = await getSimilarProductsAsync(product);
  const customer = await getCustomerSession();
  const likedProductIds = await getLikedProductIds(
    customer?.id,
    [product.id, ...similarProducts.map((similar) => similar.id)]
  );
  const galleryImages = Array.from(new Set([product.heroImage, ...product.gallery]));
  const purchasable = isPurchasable(product);
  const primaryActionLabel = purchasable ? 'Add to cart' : product.status === 'in-stock' ? 'Contact to buy' : 'Ask about restock';
  const primaryActionHref = purchasable ? '/cart' : '/contact';
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
  const availability = product.status === 'in-stock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    brand: { '@type': 'Brand', name: product.brand },
    model: product.model,
    sku: product.sku,
    description: product.seoDescription,
    image: [`${site.domain}${product.heroImage}`],
    category: category?.name,
    offers: {
      '@type': 'Offer',
      price: product.price.toFixed(2),
      priceCurrency: 'USD',
      availability,
      itemCondition:
        product.condition === 'For Parts' ? 'https://schema.org/DamagedCondition' : 'https://schema.org/UsedCondition',
      url: `${site.domain}/shop/${product.slug}`,
      seller: { '@type': 'Organization', name: site.name }
    }
  };

  return (
    <>
      <section className="px-4 pb-28 pt-6 sm:px-6 sm:py-12 lg:px-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <div className="mx-auto grid max-w-7xl gap-8 sm:gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="rounded-lg border border-ink/10 bg-white p-3 shadow-soft sm:p-6">
              <img
                src={product.heroImage}
                alt={product.title}
                className="mx-auto aspect-square max-h-[430px] w-full object-contain"
              />
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:gap-3 sm:overflow-visible sm:pb-0">
              {galleryImages.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="min-w-20 rounded-lg border border-ink/10 bg-white p-2 shadow-sm"
                >
                  <img src={image} alt="" className="aspect-square w-full object-contain" />
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg border border-ink/10 bg-white p-3 text-xs text-ink/70 shadow-sm sm:gap-3 sm:p-5 sm:text-sm">
              <TrustBadge title="Actual photos" copy={product.actualPhotos ? 'Exact item shown' : 'Photos coming soon'} />
              <TrustBadge title="Tested" copy={product.tested[0] === 'Testing pending' ? 'Testing pending' : 'Checklist below'} />
              <TrustBadge title="Ships from" copy="Shutterbug Camera Shop" />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.18em]">
              <Link href={`/categories/${product.categorySlug}`} className="rounded-full bg-mint px-4 py-2 text-moss">
                {category?.name ?? 'Camera Gear'}
              </Link>
              <span className="rounded-full bg-sage px-4 py-2 text-ink/70">{product.condition}</span>
              <span className="rounded-full bg-white px-4 py-2 text-ink/70">{product.functionalStatus ?? 'Tested'}</span>
              <span className="rounded-full bg-white px-4 py-2 text-ink/70">{getAvailabilityLabel(product.status)}</span>
            </div>

            <h1 className="mt-5 font-serif text-3xl font-bold tracking-tight text-ink sm:mt-6 sm:text-5xl lg:text-6xl">
              {product.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-ink/72 sm:mt-5 sm:text-lg sm:leading-8">
              {product.shortDescription}
            </p>

            <div className="mt-6 rounded-lg border border-ink/10 bg-white p-4 shadow-sm sm:mt-7 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink/55">Price</p>
                  <p className="text-3xl font-bold text-ink sm:text-4xl">{formatPrice(product.price)}</p>
                  <p className="mt-2 text-sm text-ink/60">{product.conditionSummary}</p>
                </div>
                <div className="hidden gap-3 sm:flex sm:items-center">
                  <ProductLikeButton
                    productId={product.id}
                    productSlug={product.slug}
                    liked={likedProductIds.has(product.id)}
                    signedIn={Boolean(customer)}
                    redirectTo={`/shop/${product.slug}`}
                    showText
                  />
                  {purchasable ? (
                    <AddToCartButton
                      item={cartItem}
                      className="inline-flex min-h-12 items-center justify-center rounded-full bg-forest px-8 py-3 text-center font-semibold text-white transition hover:bg-moss"
                    />
                  ) : (
                    <a
                      href={primaryActionHref}
                      className="inline-flex min-h-12 items-center justify-center rounded-full border border-ink/20 bg-white px-8 py-3 text-center font-semibold text-ink transition hover:border-moss hover:text-moss"
                    >
                      {primaryActionLabel}
                    </a>
                  )}
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {product.badges.map((badge) => (
                  <div key={badge} className="rounded-lg bg-mint px-4 py-3 text-sm font-semibold text-forest">
                    {badge}
                  </div>
                ))}
                <div className="rounded-lg bg-mint px-4 py-3 text-sm font-semibold text-forest">
                  Secure checkout
                </div>
                <div className="rounded-lg bg-mint px-4 py-3 text-sm font-semibold text-forest">
                  Ships from Shutterbug
                </div>
              </div>

              <div className="mt-6 grid gap-2 border-t border-ink/10 pt-5 text-sm leading-6 text-ink/68">
                <p>
                  <span className="font-semibold text-ink">Functional status:</span> {product.functionalStatus ?? 'Tested'}
                </p>
                {product.productType ? (
                  <p>
                    <span className="font-semibold text-ink">Product type:</span> {product.productType}
                  </p>
                ) : null}
                {product.lensMount ? (
                  <p>
                    <span className="font-semibold text-ink">Lens mount:</span> {product.lensMount}
                  </p>
                ) : null}
                {product.filmFormat ? (
                  <p>
                    <span className="font-semibold text-ink">Film format:</span> {product.filmFormat}
                  </p>
                ) : null}
                {product.storageType ? (
                  <p>
                    <span className="font-semibold text-ink">Storage/media:</span> {product.storageType}
                  </p>
                ) : null}
                <Link href="/contact" className="font-semibold text-moss hover:text-ink">
                  Questions about this camera? Ask before you buy.
                </Link>
              </div>
            </div>

            {product.partsRepair || product.condition === 'For Parts' ? (
              <div className="mt-6 rounded-lg border border-ink/10 bg-sand p-4 text-sm leading-6 text-ink/75 shadow-sm">
                <p className="font-serif text-xl font-bold text-ink">Parts / repair notice</p>
                <p className="mt-2">
                  This item is not presented as ready-to-shoot tested gear. Read the functional notes and flaws before
                  purchasing, and contact Shutterbug if you need clarification.
                </p>
              </div>
            ) : null}

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <InfoList title="Included" items={product.included} />
              <InfoList title="Testing checklist" items={product.tested} />
              <InfoList title="Cosmetic condition" items={product.cosmeticNotes} />
              <InfoList title="Functional notes" items={product.functionalNotes} />
            </div>

            <div className="mt-8 rounded-lg border border-ink/10 bg-white p-4 shadow-sm sm:p-6">
              <p className="font-serif text-2xl font-bold text-ink">Flaws disclosed</p>
              <ul className="mt-4 grid list-disc gap-2 pl-5 text-sm leading-6 text-ink/70">
                {product.flaws.map((flaw) => (
                  <li key={flaw}>{flaw}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          <InfoPanel title="Who this camera is good for" items={product.goodFor} />
          <InfoPanel title="Shipping and returns" items={[product.shippingNote, product.returnsNote]} />
          <InfoPanel
            title="Used-camera promise"
            items={[
              'Condition and included accessories are listed clearly.',
              'Parts/repair gear is marked before purchase.',
              'Friendly support is available before and after checkout.'
            ]}
          />
        </div>
      </section>

      {similarProducts.length > 0 ? (
        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-moss">Similar cameras</p>
                <h2 className="mt-3 font-serif text-4xl font-bold text-ink">More tested finds</h2>
              </div>
              <Link href="/shop" className="font-semibold text-moss hover:text-ink">
                View all
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3">
              {similarProducts.map((similar) => (
                <ProductCard
                  key={similar.id}
                  product={similar}
                  liked={likedProductIds.has(similar.id)}
                  signedIn={Boolean(customer)}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-white/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-soft backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/55">{product.condition}</p>
            <p className="text-lg font-bold text-ink">{formatPrice(product.price)}</p>
          </div>
          <ProductLikeButton
            productId={product.id}
            productSlug={product.slug}
            liked={likedProductIds.has(product.id)}
            signedIn={Boolean(customer)}
            redirectTo={`/shop/${product.slug}`}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${
              likedProductIds.has(product.id)
                ? 'border-forest bg-forest text-white'
                : 'border-ink/15 bg-white text-ink'
            }`}
          />
          {purchasable ? (
            <AddToCartButton
              item={cartItem}
              className="flex min-h-12 items-center justify-center rounded-full bg-forest px-5 py-3 text-center text-sm font-semibold text-white"
            />
          ) : (
            <a
              href={primaryActionHref}
              className="flex min-h-12 items-center justify-center rounded-full bg-forest px-5 py-3 text-center text-sm font-semibold text-white"
            >
              {primaryActionLabel}
            </a>
          )}
        </div>
      </div>
    </>
  );
}

function TrustBadge({ title, copy }: { title: string; copy: string }) {
  return (
    <div>
      <p className="font-semibold text-ink">{title}</p>
      <p className="mt-1 text-ink/60">{copy}</p>
    </div>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white p-4 shadow-sm sm:p-6">
      <p className="font-serif text-xl font-bold text-ink">{title}</p>
      <ul className="mt-4 grid list-disc gap-2 pl-5 text-sm leading-6 text-ink/70">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function InfoPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white p-4 shadow-sm sm:p-6">
      <p className="font-serif text-2xl font-bold text-ink">{title}</p>
      <ul className="mt-4 grid list-disc gap-2 pl-5 text-sm leading-6 text-ink/70">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
