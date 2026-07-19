import Link from 'next/link';
import Image from 'next/image';
import { AdminShell } from '@/components/admin/AdminShell';
import { Prisma, ProductStatus } from '@/generated/prisma/client';
import { requireAdmin } from '@/lib/admin-auth';
import { categories } from '@/lib/categories';
import { formatCents } from '@/lib/money';
import { getPrisma } from '@/lib/prisma';

export const metadata = {
  title: 'Admin Products'
};

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const statusLabels: Record<ProductStatus, string> = {
  [ProductStatus.DRAFT]: 'Draft',
  [ProductStatus.ACTIVE]: 'Active',
  [ProductStatus.SOLD_OUT]: 'Sold out',
  [ProductStatus.ARCHIVED]: 'Archived'
};

const statusStyles: Record<ProductStatus, string> = {
  [ProductStatus.DRAFT]: 'bg-sand text-ink',
  [ProductStatus.ACTIVE]: 'bg-mint text-forest',
  [ProductStatus.SOLD_OUT]: 'bg-cream text-ink/70',
  [ProductStatus.ARCHIVED]: 'bg-ink/10 text-ink/60'
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminProductsPage({ searchParams }: Props) {
  await requireAdmin();
  const params = searchParams ? await searchParams : {};
  const query = firstParam(params.q)?.trim() ?? '';
  const rawStatus = firstParam(params.status);
  const rawCategory = firstParam(params.category);
  const selectedStatus = Object.values(ProductStatus).includes(rawStatus as ProductStatus)
    ? (rawStatus as ProductStatus)
    : '';
  const selectedCategory = categories.some((category) => category.slug === rawCategory) ? rawCategory ?? '' : '';
  const hasFilters = Boolean(query || selectedStatus || selectedCategory);
  const prisma = getPrisma();

  const where: Prisma.ProductWhereInput = {
    AND: [
      query
        ? {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { sku: { contains: query, mode: 'insensitive' } },
              { brand: { contains: query, mode: 'insensitive' } },
              { model: { contains: query, mode: 'insensitive' } }
            ]
          }
        : {},
      selectedStatus ? { status: selectedStatus } : {},
      selectedCategory
        ? {
            OR: [
              { categorySlug: selectedCategory },
              { subcategorySlug: selectedCategory },
              { categorySlugs: { has: selectedCategory } }
            ]
          }
        : {}
    ]
  };

  const products = prisma
    ? await prisma.product.findMany({
        where,
        include: { images: { orderBy: { sortOrder: 'asc' } } },
        orderBy: [{ updatedAt: 'desc' }]
      })
    : [];

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-moss">Products</p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-ink">Manage inventory</h2>
          <p className="mt-2 text-sm text-ink/60">
            Add, edit, archive, and mark single-seller Shutterbug inventory as active or sold out.
          </p>
        </div>
        <Link href="/admin/products/new" className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white">
          Add product
        </Link>
      </div>

      <form
        action="/admin/products"
        className="mt-6 grid gap-3 rounded-lg border border-ink/10 bg-white p-4 shadow-sm lg:grid-cols-[1fr_14rem_16rem_auto]"
      >
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Search
          <input
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Title, SKU, brand, or model"
            className="min-h-11 rounded-lg border border-ink/15 bg-cream px-3 text-base font-normal outline-none focus:border-moss"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Status
          <select
            name="status"
            defaultValue={selectedStatus}
            className="min-h-11 rounded-lg border border-ink/15 bg-cream px-3 text-base font-normal outline-none focus:border-moss"
          >
            <option value="">All statuses</option>
            {Object.values(ProductStatus).map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Category
          <select
            name="category"
            defaultValue={selectedCategory}
            className="min-h-11 rounded-lg border border-ink/15 bg-cream px-3 text-base font-normal outline-none focus:border-moss"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end gap-2">
          <button className="min-h-11 rounded-full bg-forest px-5 text-sm font-semibold text-white">Filter</button>
          {hasFilters ? (
            <Link
              href="/admin/products"
              className="inline-flex min-h-11 items-center rounded-full border border-ink/15 px-5 text-sm font-semibold text-ink"
            >
              Clear
            </Link>
          ) : null}
        </div>
      </form>

      <div className="mt-6 grid gap-3">
        {products.map((product) => {
          const imageUrl = product.mainImageUrl || product.images[0]?.url || '/placeholder-camera.svg';

          return (
            <Link
              key={product.id}
              href={`/admin/products/${product.id}/edit`}
              className="grid gap-3 rounded-lg border border-ink/10 bg-white p-4 shadow-sm transition hover:border-moss/40 sm:grid-cols-[5rem_1fr_auto]"
            >
              <Image
                src={imageUrl}
                alt={product.title}
                width={80}
                height={80}
                sizes="5rem"
                unoptimized={imageUrl.endsWith('.svg') || imageUrl.startsWith('http')}
                className="aspect-square w-20 rounded-lg bg-sand object-contain"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-ink">{product.title}</p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${statusStyles[product.status]}`}
                  >
                    {statusLabels[product.status]}
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink/60">
                  {product.sku ? `${product.sku} | ` : ''}
                  {product.brand} {product.model} | Qty {product.quantity} | {product.categorySlug}
                </p>
              </div>
              <p className="font-bold text-ink">{formatCents(product.priceCents)}</p>
            </Link>
          );
        })}
        {products.length === 0 ? (
          <div className="rounded-lg border border-ink/10 bg-white p-6 text-sm leading-6 text-ink/70 shadow-sm">
            {hasFilters
              ? 'No products match those filters.'
              : 'No database products yet. Add `DATABASE_URL`, run migrations, then create the first product.'}
          </div>
        ) : null}
      </div>
    </AdminShell>
  );
}
