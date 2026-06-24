import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { categories, getCategory } from '@/lib/categories';
import { getProductsByCategory } from '@/lib/products';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const categoryProducts = getProductsByCategory(category.slug);

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-brass">Category</p>
          <h1 className="mt-3 font-serif text-5xl font-bold text-ink">{category.name}</h1>
          <p className="mt-5 text-lg leading-8 text-ink/70">{category.description}</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categoryProducts.length > 0 ? categoryProducts.map((product) => <ProductCard key={product.id} product={product} />) : (
            <div className="rounded-lg border border-ink/10 bg-white p-8 text-ink/70">
              Add products to this category in <code>src/lib/products.ts</code>.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}