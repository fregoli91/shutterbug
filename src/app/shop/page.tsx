import { ProductCard } from '@/components/ProductCard';
import { products } from '@/lib/products';

export const metadata = {
  title: 'Shop Tested Vintage Cameras',
  description: 'Shop tested vintage digital cameras, film cameras, accessories, and camera gear from Shutterbug Camera Shop.'
};

export default function ShopPage() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-brass">Shop cameras</p>
          <h1 className="mt-3 font-serif text-5xl font-bold text-ink">Tested vintage cameras and gear</h1>
          <p className="mt-5 text-lg leading-8 text-ink/70">
            Replace the sample listings with your real Canon, Olympus, Nikon, Sony, Kodak, and Fujifilm inventory. Each product should use real photos and clear testing notes.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  );
}
