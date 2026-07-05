import { logoutAction } from '../actions';
import { AccountFeaturePage } from '@/components/account/AccountFeaturePage';
import { requireCustomer } from '@/lib/customer-auth';

export const metadata = {
  title: 'Account Settings'
};

export default async function AccountSettingsPage() {
  const customer = await requireCustomer();

  return (
    <AccountFeaturePage
      eyebrow="Customer account"
      title="Account settings"
      intro="Manage the basic customer details used for order history and support."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
          <p className="font-serif text-2xl font-bold text-ink">Profile</p>
          <div className="mt-4 grid gap-2 text-sm leading-6 text-ink/68">
            <p>
              <span className="font-semibold text-ink">Name:</span> {customer.name || 'Not added yet'}
            </p>
            <p>
              <span className="font-semibold text-ink">Email:</span> {customer.email}
            </p>
            <p>
              <span className="font-semibold text-ink">Created:</span> {customer.createdAt.toLocaleDateString('en-US')}
            </p>
          </div>
        </div>
        <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
          <p className="font-serif text-2xl font-bold text-ink">Security</p>
          <p className="mt-3 leading-7 text-ink/68">
            Password changes are not self-service yet. Contact Shutterbug support if you need help with account access.
          </p>
          <form action={logoutAction} className="mt-5">
            <button className="min-h-11 rounded-full border border-ink/15 bg-cream px-5 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </AccountFeaturePage>
  );
}
