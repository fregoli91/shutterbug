import Link from 'next/link';
import { AdminShell } from '@/components/admin/AdminShell';
import { requireAdmin } from '@/lib/admin-auth';
import { getPrisma } from '@/lib/prisma';
import { formatCents } from '@/lib/money';

export const metadata = {
  title: 'Admin Dashboard'
};

const quickActions = [
  {
    href: '/admin/products/new',
    title: 'Create listing',
    copy: 'Add a camera, accessory, parts item, photos, pricing, testing notes, and inventory count.'
  },
  {
    href: '/admin/products',
    title: 'Edit listings',
    copy: 'Update titles, descriptions, condition grades, prices, images, quantity, and sold status.'
  },
  {
    href: '/admin/orders',
    title: 'Manage orders',
    copy: 'Review paid orders, customer shipping details, fulfillment status, and tracking numbers.'
  },
  {
    href: '/shop',
    title: 'View storefront',
    copy: 'Check how listings, filters, product cards, and product pages appear to shoppers.'
  }
];

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
        <AdminActionGrid />
        <SetupChecklist />
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
      <AdminActionGrid />
      <SetupChecklist compact />
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

function AdminActionGrid() {
  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-moss">Dashboard</p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-ink">Store controls</h2>
        </div>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm transition hover:border-moss/40 hover:shadow-soft"
          >
            <p className="font-serif text-2xl font-bold text-ink">{action.title}</p>
            <p className="mt-2 text-sm leading-6 text-ink/65">{action.copy}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function SetupChecklist({ compact = false }: { compact?: boolean }) {
  return (
    <div className="mt-8 rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-moss">Setup</p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-ink">
            {compact ? 'Live store readiness' : 'Connect data before listing products'}
          </h2>
        </div>
        <Link href="/admin/products/new" className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white">
          Add listing
        </Link>
      </div>
      <div className="mt-4 grid gap-3 text-sm leading-6 text-ink/70 md:grid-cols-3">
        <p>Connect Postgres with `DATABASE_URL` and run Prisma migrations.</p>
        <p>Add Cloudinary credentials so product image uploads save outside the repo.</p>
        <p>Set Stripe webhook secrets before accepting live checkout payments.</p>
      </div>
    </div>
  );
}
