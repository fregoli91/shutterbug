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
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
          <p className="font-serif text-2xl font-bold text-ink">Address book coming soon</p>
          <p className="mt-3 leading-7 text-ink/68">
            Address saving is not enabled yet. For now, shipping addresses are collected during checkout and stored with
            each order record for fulfillment.
          </p>
          <Link href="/account/orders" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-forest px-5 text-sm font-semibold text-white transition hover:bg-moss">
            View order history
          </Link>
        </div>
        <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
          <p className="font-serif text-2xl font-bold text-ink">Delivery tips</p>
          <ul className="mt-3 grid list-disc gap-2 pl-5 text-sm leading-6 text-ink/68">
            <li>Use a shipping address where camera gear can be received safely.</li>
            <li>Double-check apartment, suite, and ZIP code details before payment.</li>
            <li>Contact support quickly if an order address needs attention after checkout.</li>
          </ul>
          <Link href="/shipping" className="mt-5 inline-flex text-sm font-semibold text-moss hover:text-ink">
            Read shipping policy
          </Link>
        </div>
      </div>
    </AccountFeaturePage>
  );
}
