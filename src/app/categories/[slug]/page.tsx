import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { categories, getCategory, getRelatedCategories } from '@/lib/categories';
import { getProductsByCategoryAsync } from '@/lib/products';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: category.seoTitle,
    description: category.description
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const categoryProducts = await getProductsByCategoryAsync(category.slug);
  const relatedCategories = getRelatedCategories(category.slug);
  const categoryHeroImage = category.slug === 'parts-repair' ? '/shutterbug-parts-repair.png' : null;

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-moss">Camera category</p>
            <h1 className="mt-3 font-serif text-5xl font-bold text-ink">{category.seoTitle}</h1>
            <p className="mt-5 text-lg leading-8 text-ink/70">{category.intro}</p>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            {categoryHeroImage ? (
              <img
                src={categoryHeroImage}
                alt="Shutterbug mascot repairing a vintage camera"
                className="mb-5 aspect-square w-full rounded-lg bg-sand object-cover object-center"
              />
            ) : null}
            <p className="font-serif text-2xl font-bold text-ink">Shutterbug standard</p>
            <ul className="mt-4 grid list-disc gap-2 pl-5 text-sm leading-6 text-ink/70">
              <li>Tested gear is clearly marked.</li>
              <li>Parts/repair items stay separate and honest.</li>
              <li>Included accessories and flaws are disclosed.</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {category.keywords.map((keyword) => (
            <Link
              key={keyword}
              href={`/shop?q=${encodeURIComponent(keyword)}`}
              className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink/70 shadow-sm transition hover:border-moss/40 hover:text-moss"
            >
              {keyword}
            </Link>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {categoryProducts.length > 0 ? (
            categoryProducts.map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            <div className="col-span-2 rounded-lg border border-ink/10 bg-white p-8 text-ink/70 lg:col-span-3">
              <p className="font-serif text-2xl font-bold text-ink">No active inventory in this category yet</p>
              <p className="mt-3 leading-7">
                This category is ready for SEO and future listings. Contact Shutterbug if you are looking for a
                specific camera model or want to sell gear in this category.
              </p>
            </div>
          )}
        </div>

        <div className="mt-14 rounded-lg border border-ink/10 bg-mint p-6">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-moss">Related categories</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {relatedCategories.map((related) => (
              <Link
                key={related.slug}
                href={`/categories/${related.slug}`}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink/70 shadow-sm transition hover:text-moss"
              >
                {related.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
