import Link from 'next/link';
import { AccountFeaturePage } from '@/components/account/AccountFeaturePage';
import { requireCustomer } from '@/lib/customer-auth';

export const metadata = {
  title: 'Payment Methods'
};

export default async function AccountPaymentMethodsPage() {
  await requireCustomer();

  return (
    <AccountFeaturePage
      eyebrow="Customer account"
      title="Payment methods"
      intro="Review how payment information is handled for Shutterbug orders. Full card details are not stored in the Shutterbug database."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
          <p className="font-serif text-2xl font-bold text-ink">Secure processors</p>
          <p className="mt-3 leading-7 text-ink/68">
            Payments are processed securely through Stripe and supported checkout providers. Shutterbug does not store
            your full card number or raw payment details.
          </p>
        </div>
        <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
          <p className="font-serif text-2xl font-bold text-ink">Saved cards</p>
          <p className="mt-3 leading-7 text-ink/68">
            Saved payment methods are not enabled yet. A future customer portal can be connected through Stripe if
            Shutterbug chooses to support saved billing methods.
          </p>
        </div>
      </div>
      <Link href="/cart" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-forest px-5 text-sm font-semibold text-white">
        Go to cart
      </Link>
    </AccountFeaturePage>
  );
}
