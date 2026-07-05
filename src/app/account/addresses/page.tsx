import Link from 'next/link';
import { AccountFeaturePage } from '@/components/account/AccountFeaturePage';
import { requireCustomer } from '@/lib/customer-auth';

export const metadata = {
  title: 'Saved Addresses'
};

export default async function AccountAddressesPage() {
  await requireCustomer();

  return (
    <AccountFeaturePage
      eyebrow="Customer account"
      title="Saved addresses"
      intro="Saved shipping addresses will make future Shutterbug checkouts faster while keeping order delivery details tied to your customer account."
    >
      <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
        <p className="font-serif text-2xl font-bold text-ink">Address book coming soon</p>
        <p className="mt-3 leading-7 text-ink/68">
          Address saving is not enabled yet. For now, shipping addresses are collected securely during checkout and
          stored with each order record for fulfillment.
        </p>
        <Link href="/account/orders" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-forest px-5 text-sm font-semibold text-white">
          View order history
        </Link>
      </div>
    </AccountFeaturePage>
  );
}
