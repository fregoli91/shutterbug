import { notFound } from 'next/navigation';
import { archiveProductAction, deleteProductAction, updateProductAction } from '@/app/admin/actions';
import { AdminShell } from '@/components/admin/AdminShell';
import { ProductForm } from '@/components/admin/ProductForm';
import { requireAdmin } from '@/lib/admin-auth';
import { getPrisma } from '@/lib/prisma';

type Props = { params: Promise<{ id: string }> };

export const metadata = {
  title: 'Edit Product'
};

export default async function EditProductPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
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
      <ProductForm action={updateProductAction} product={product} submitLabel="Save product" />
    </AdminShell>
  );
}
