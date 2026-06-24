import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProduct, products, formatPrice } from '@/lib/products';
import { getCategory } from '@/lib/categories';
import { site } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.title,
    description: product.shortDescription,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      title: product.title,
      description: product.shortDescription,
      url: `${site.domain}/shop/${product.slug}`,
      type: 'website'
    }
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const category = getCategory(product.categorySlug);
  const availability = product.status === 'in-stock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    brand: { '@type': 'Brand', name: product.brand },
    model: product.model,
    sku: product.sku,
    description: product.shortDescription,
    image: [`${site.domain}${product.heroImage}`],
    offers: {
      '@type': 'Offer',
      price: product.price.toFixed(2),
      priceCurrency: 'USD',
      availability,
      itemCondition: product.condition === 'For Parts' ? 'https://schema.org/DamagedCondition' : 'https://schema.org/UsedCondition',
      url: `${site.domain}/shop/${product.slug}`,
      seller: { '@type': 'Organization', name: site.name }
    }
  };

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <div className="rounded-lg border border-ink/10 bg-white p-8 shadow-soft">
            <img src={product.heroImage} alt={product.title} className="mx-auto h-[430px] w-full object-contain" />
          </div>
          <p className="mt-4 text-sm text-ink/55">Replace this placeholder with actual photos of the exact unit before publishing.</p>
        </div>
        <div>
          <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.2em]">
            <Link href={`/categories/${product.categorySlug}`} className="rounded-full bg-brass/10 px-4 py-2 text-brass">
              {category?.name ?? 'Camera Gear'}
            </Link>
            <span className="rounded-full bg-sage px-4 py-2 text-ink/70">{product.condition}</span>
          </div>
          <h1 className="mt-6 font-serif text-4xl font-bold tracking-tight text-ink sm:text-6xl">{product.title}</h1>
          <p className="mt-5 text-lg leading-8 text-ink/72">{product.shortDescription}</p>
          <div className="mt-7 flex flex-col gap-4 rounded-lg border border-ink/10 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-ink/55">Price</p>
              <p className="text-3xl font-bold text-ink">{formatPrice(product.price)}</p>
            </div>
            {product.status === 'in-stock' ? (
              <a href={product.checkoutUrl || '#'} className="rounded-full bg-brass px-8 py-3 text-center font-semibold text-white transition hover:bg-moss">
                Buy now
              </a>
            ) : (
              <a href="/contact" className="rounded-full border border-ink/20 bg-white px-8 py-3 text-center font-semibold text-ink transition hover:border-brass hover:text-brass">
                Ask about restock
              </a>
            )}
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <InfoList title="Tested functions" items={product.tested} />
            <InfoList title="Included" items={product.included} />
            <InfoList title="Good for" items={product.goodFor} />
            <InfoList title="Condition notes" items={product.notes} />
          </div>
          <div className="mt-8 rounded-lg border border-ink/10 bg-sand p-6">
            <p className="font-semibold text-ink">Before launch note</p>
            <p className="mt-2 text-sm leading-7 text-ink/70">
              For each real camera, add sample images, exact accessories, any flaws, and a working checkout URL from Shopify, Stripe Payment Links, PayPal, Amazon, or Mercari.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
      <p className="font-serif text-xl font-bold text-ink">{title}</p>
      <ul className="mt-4 grid list-disc gap-2 pl-5 text-sm leading-6 text-ink/70">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}