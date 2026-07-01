import { ProductForm } from '@/components/admin/ProductForm';
import { AdminShell } from '@/components/admin/AdminShell';
import { createProductAction } from '@/app/admin/actions';
import { requireAdmin } from '@/lib/admin-auth';

export const metadata = {
  title: 'Add Product'
};

export default async function NewProductPage() {
  await requireAdmin();
  return (
    <AdminShell>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-moss">Products</p>
        <h2 className="mt-2 font-serif text-3xl font-bold text-ink">Add product</h2>
      </div>
      <ProductForm action={createProductAction} submitLabel="Create product" />
    </AdminShell>
  );
}
