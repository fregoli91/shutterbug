import Link from 'next/link';
import { logoutAction } from '@/app/admin/actions';
import { hasDatabaseUrl } from '@/lib/prisma';

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-moss">Admin</p>
            <h1 className="mt-2 font-serif text-4xl font-bold text-ink">Shutterbug Commerce</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/admin" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm">
              Dashboard
            </Link>
            <Link href="/admin/products" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm">
              Products
            </Link>
            <Link href="/admin/orders" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm">
              Orders
            </Link>
            <form action={logoutAction}>
              <button className="rounded-full border border-ink/15 bg-cream px-4 py-2 text-sm font-semibold text-ink">
                Sign out
              </button>
            </form>
          </div>
        </div>
        {hasDatabaseUrl() ? null : <DatabaseSetupNotice />}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

export function DatabaseSetupNotice() {
  return (
    <div className="mt-6 rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
      <p className="font-serif text-2xl font-bold text-ink">Database setup needed</p>
      <p className="mt-3 text-sm leading-6 text-ink/70">
        Add `DATABASE_URL`, run `npm run prisma:migrate`, and set admin/payment/image environment variables before
        product CRUD, checkout, and order management can write real store data.
      </p>
    </div>
  );
}
