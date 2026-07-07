import { changePasswordAction, logoutAction, updateProfileAction } from '../actions';
import { AccountFeaturePage } from '@/components/account/AccountFeaturePage';
import { requireCustomer } from '@/lib/customer-auth';
import { PASSWORD_MIN_LENGTH } from '@/lib/password-policy';

export const metadata = {
  title: 'Account Settings'
};

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const statusMessages: Record<string, string> = {
  'profile-updated': 'Your profile details were updated.',
  'password-updated': 'Your password was updated.'
};

const errorMessages: Record<string, string> = {
  'name-too-long': 'Use a shorter display name.',
  'password-missing': 'Enter your current password and the new password twice.',
  'password-mismatch': 'Make sure both new password fields match.',
  'password-too-short': `Use at least ${PASSWORD_MIN_LENGTH} characters for your new password.`,
  'password-too-long': 'Use a shorter password.',
  'password-common': 'Avoid common words, keyboard patterns, and obvious Shutterbug/camera phrases.',
  'password-personal': 'Avoid using your name or email address in the password.',
  'password-repeated': 'Avoid long repeated character runs.',
  'password-invalid': 'Use a stronger password.',
  'current-password': 'Your current password did not match our records.'
};

function asString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

export default async function AccountSettingsPage({ searchParams }: Props) {
  const customer = await requireCustomer();
  const params = searchParams ? await searchParams : {};
  const status = asString(params.status);
  const error = asString(params.error);

  return (
    <AccountFeaturePage
      eyebrow="Customer account"
      title="Account settings"
      intro="Keep your customer profile current, update your password, and control access to your Shutterbug account."
    >
      {statusMessages[status] ? (
        <p className="mb-5 rounded-lg border border-moss/15 bg-mint p-4 text-sm font-semibold text-ink">
          {statusMessages[status]}
        </p>
      ) : null}

      {errorMessages[error] ? (
        <p className="mb-5 rounded-lg border border-red-900/10 bg-red-50 p-4 text-sm font-semibold text-red-900">
          {errorMessages[error]}
        </p>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
          <p className="font-serif text-2xl font-bold text-ink">Profile</p>
          <p className="mt-2 text-sm leading-6 text-ink/65">
            Your name is used for your account greeting and customer support context. Email changes should go through
            support so order history stays connected.
          </p>
          <form action={updateProfileAction} className="mt-5 grid gap-4">
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Display name
              <input
                name="name"
                defaultValue={customer.name ?? ''}
                maxLength={80}
                placeholder="Your name"
                className="min-h-12 rounded-lg border border-ink/15 bg-cream px-4 text-base font-normal outline-none transition focus:border-moss focus:ring-2 focus:ring-sage"
              />
            </label>
            <div className="rounded-lg bg-cream p-4 text-sm leading-6 text-ink/68">
              <p>
                <span className="font-semibold text-ink">Email:</span> {customer.email}
              </p>
              <p>
                <span className="font-semibold text-ink">Account created:</span>{' '}
                {customer.createdAt.toLocaleDateString('en-US')}
              </p>
            </div>
            <button className="min-h-11 rounded-full bg-forest px-5 text-sm font-semibold text-white transition hover:bg-moss">
              Save profile
            </button>
          </form>
        </div>

        <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
          <p className="font-serif text-2xl font-bold text-ink">Change password</p>
          <p className="mt-2 text-sm leading-6 text-ink/65">
            Use a long password or passphrase. Avoid names, email fragments, common words, and repeated characters.
          </p>
          <form action={changePasswordAction} className="mt-5 grid gap-4">
            <input
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              placeholder="Current password"
              className="min-h-12 rounded-lg border border-ink/15 bg-cream px-4 text-base outline-none transition focus:border-moss focus:ring-2 focus:ring-sage"
            />
            <input
              name="newPassword"
              type="password"
              autoComplete="new-password"
              minLength={PASSWORD_MIN_LENGTH}
              placeholder="New password"
              className="min-h-12 rounded-lg border border-ink/15 bg-cream px-4 text-base outline-none transition focus:border-moss focus:ring-2 focus:ring-sage"
            />
            <input
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={PASSWORD_MIN_LENGTH}
              placeholder="Confirm new password"
              className="min-h-12 rounded-lg border border-ink/15 bg-cream px-4 text-base outline-none transition focus:border-moss focus:ring-2 focus:ring-sage"
            />
            <button className="min-h-11 rounded-full bg-forest px-5 text-sm font-semibold text-white transition hover:bg-moss">
              Update password
            </button>
          </form>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
        <p className="font-serif text-2xl font-bold text-ink">Account access</p>
        <p className="mt-2 text-sm leading-6 text-ink/65">
          Sign out when you are finished on shared devices. For email changes, account recovery, or deleting an
          account, contact Shutterbug support.
        </p>
        <form action={logoutAction} className="mt-5">
          <button className="min-h-11 rounded-full border border-ink/15 bg-cream px-5 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss">
            Sign out
          </button>
        </form>
      </div>
    </AccountFeaturePage>
  );
}
