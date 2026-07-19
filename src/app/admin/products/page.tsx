import Link from 'next/link';
import Image from 'next/image';
import { AdminShell } from '@/components/admin/AdminShell';
import { ProductStatus } from '@/generated/prisma/client';
import { requireAdmin } from '@/lib/admin-auth';
import { formatCents } from '@/lib/money';
import { getPrisma } from '@/lib/prisma';

export const metadata = {
  title: 'Admin Products'
};

export default async function AdminProductsPage() {
  await requireAdmin();
  const prisma = getPrisma();
  const products = prisma
    ? await prisma.product.findMany({
        include: { images: true },
        orderBy: [{ updatedAt: 'desc' }]
      })
    : [];

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-moss">Products</p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-ink">Manage inventory</h2>
        </div>
        <Link href="/admin/products/new" className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white">
          Add product
        </Link>
      </div>

      <div className="mt-6 grid gap-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/admin/products/${product.id}/edit`}
            className="grid gap-3 rounded-lg border border-ink/10 bg-white p-4 shadow-sm transition hover:border-moss/40 sm:grid-cols-[5rem_1fr_auto]"
          >
            <Image
              src={product.images[0]?.url ?? '/placeholder-camera.svg'}
              alt=""
              width={80}
              height={80}
              sizes="5rem"
              unoptimized={(product.images[0]?.url ?? '/placeholder-camera.svg').endsWith('.svg')}
              className="aspect-square w-20 rounded-lg bg-sand object-contain"
            />
            <div>
              <p className="font-semibold text-ink">{product.title}</p>
              <p className="mt-1 text-sm text-ink/60">
                {product.brand} {product.model} · Qty {product.quantity} · {product.status === ProductStatus.IN_STOCK ? 'In stock' : product.status}
              </p>
            </div>
            <p className="font-bold text-ink">{formatCents(product.priceCents)}</p>
          </Link>
        ))}
        {products.length === 0 ? (
          <div className="rounded-lg border border-ink/10 bg-white p-6 text-sm leading-6 text-ink/70 shadow-sm">
            No database products yet. Add `DATABASE_URL`, run migrations, then create the first product.
          </div>
        ) : null}
      </div>
    </AdminShell>
  );
}
