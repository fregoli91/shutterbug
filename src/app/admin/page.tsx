import Link from 'next/link';
import { AdminShell } from '@/components/admin/AdminShell';
import { requireAdmin } from '@/lib/admin-auth';
import { getPrisma } from '@/lib/prisma';
import { formatCents } from '@/lib/money';

export const metadata = {
  title: 'Admin Dashboard'
};

export default async function AdminPage() {
  await requireAdmin();
  const prisma = getPrisma();

  if (!prisma) {
    return (
      <AdminShell>
        <div className="grid gap-4 md:grid-cols-3">
          <AdminCard title="Products" value="Setup required" href="/admin/products" />
          <AdminCard title="Orders" value="Setup required" href="/admin/orders" />
          <AdminCard title="Checkout" value="Env required" href="/cart" />
        </div>
      </AdminShell>
    );
  }

  const [productCount, orderCount, paidOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { totalCents: true }, where: { paymentStatus: 'PAID' } })
  ]);

  return (
    <AdminShell>
      <div className="grid gap-4 md:grid-cols-3">
        <AdminCard title="Products" value={String(productCount)} href="/admin/products" />
        <AdminCard title="Orders" value={String(orderCount)} href="/admin/orders" />
        <AdminCard title="Paid revenue" value={formatCents(paidOrders._sum.totalCents ?? 0)} href="/admin/orders" />
      </div>
    </AdminShell>
  );
}

function AdminCard({ title, value, href }: { title: string; value: string; href: string }) {
  return (
    <Link href={href} className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm transition hover:border-moss/40">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-moss">{title}</p>
      <p className="mt-3 font-serif text-3xl font-bold text-ink">{value}</p>
    </Link>
  );
}
