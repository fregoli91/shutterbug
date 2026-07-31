import { notFound } from 'next/navigation';
import { archiveProductAction, deleteProductAction, updateProductAction } from '@/app/admin/actions';
import { AdminShell } from '@/components/admin/AdminShell';
import { ProductForm } from '@/components/admin/ProductForm';
import { requireAdmin } from '@/lib/admin-auth';
import { getPrisma } from '@/lib/prisma';

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: 'Edit Product'
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function EditProductPage({ params, searchParams }: Props) {
  await requireAdmin();
  const { id } = await params;
  const query = searchParams ? await searchParams : {};
  const createdFromTemplate = firstParam(query.template) === '1';
  const prisma = getPrisma();
  if (!prisma) notFound();
  const product = await prisma.product.findUnique({ where: { id }, include: { images: true } });
  if (!product) notFound();

  return (
    <AdminShell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-moss">Products</p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-ink">Edit product</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <form action={archiveProductAction}>
            <input type="hidden" name="id" value={product.id} />
            <button className="rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink">
              Archive
            </button>
          </form>
          <form action={deleteProductAction}>
            <input type="hidden" name="id" value={product.id} />
            <button className="rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink">
              Delete permanently
            </button>
          </form>
        </div>
      </div>
      {createdFromTemplate ? (
        <div className="mb-6 rounded-lg border border-moss/25 bg-mint/50 p-5 text-sm leading-6 text-ink/75">
          Draft created from a model template. Add actual photos and confirm the price, condition, testing, included
          accessories, and flaws before changing its status to Active.
        </div>
      ) : null}
      <ProductForm action={updateProductAction} product={product} submitLabel="Save product" />
    </AdminShell>
  );
}
