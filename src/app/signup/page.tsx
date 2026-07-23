import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { signupAction } from './actions';
import { getAdminSession } from '@/lib/admin-auth';
import { getCustomerSession } from '@/lib/customer-auth';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@/lib/password-policy';

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: 'Create Customer Account'
};

function asString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

function cleanRedirect(value: string | string[] | undefined) {
  const target = asString(value);
  return target.startsWith('/') && !target.startsWith('//') ? target : '/account';
}

const errorMessages: Record<string, string> = {
  missing: 'Enter your email and password.',
  password: `Use a stronger password with at least ${PASSWORD_MIN_LENGTH} characters.`,
  mismatch: 'Make sure both password fields match.',
  exists: 'An account already exists for that email. Try logging in instead.',
  config: 'Customer accounts need a configured database before signup can work.'
};

const trustItems = [
  'Track your orders',
  'View past purchases',
  'Save products you like',
  'Get help faster if you need support'
];

export default async function SignupPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {};
  const redirectTo = cleanRedirect(params.redirect);
  const admin = await getAdminSession();
  if (admin) redirect('/admin');

  const customer = await getCustomerSession();
  if (customer) redirect(redirectTo);

  const error = errorMessages[asString(params.error)];

  return (
    <section className="bg-cream px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <aside className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm sm:p-7 lg:sticky lg:top-32">
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(15rem,0.9fr)] md:items-center lg:grid-cols-1">
            <div className="text-center md:text-left">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-moss">New customer</p>
              <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-ink sm:text-5xl">
                New to Shutterbug?
              </h1>
              <p className="mt-4 leading-7 text-ink/70">
                Create an account to keep your orders, saved items, and support history in one place.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-1">
              {trustItems.map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-ink/10 bg-cream px-4 py-3 text-sm font-semibold text-ink/75"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-mint p-4 text-sm leading-6 text-ink/72">
              <p className="font-semibold text-ink">What happens next?</p>
              <p className="mt-2">
                After you sign up, we&apos;ll send a verification link to your email. Your payment details are handled
                securely by our checkout provider and are not stored in your Shutterbug account.
              </p>
            </div>

            <div className="overflow-hidden rounded-lg border border-ink/10 bg-cream shadow-sm md:col-start-2 md:row-span-3 md:row-start-1 lg:col-auto lg:row-auto">
              <Image
                src="/shutterbug-signup-customer-illustration.png"
                alt="Clay-style Shutterbug signup scene with a customer account, verified email, order tracking, and support icons"
                width={1536}
                height={1152}
                sizes="(min-width: 1024px) 32vw, (min-width: 768px) 38vw, 100vw"
                className="aspect-[4/3] w-full object-contain object-center"
                priority
              />
            </div>
          </div>
        </aside>

        <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center gap-3 lg:justify-start">
              <Image
                src="/shutterbug-account-badge.png"
                alt=""
                width={56}
                height={56}
                sizes="3.5rem"
                className="h-14 w-14 rounded-full object-cover shadow-sm"
              />
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-moss">Customer account</p>
                <p className="mt-1 font-serif text-2xl font-bold text-ink">Create your account</p>
              </div>
            </div>
            <p className="mt-5 leading-7 text-ink/70">
              Save time at checkout and keep your Shutterbug camera history connected.
            </p>
          </div>

          {error ? <p className="mt-5 rounded-lg bg-sand p-3 text-sm font-semibold text-ink">{error}</p> : null}

          <form action={signupAction} className="mt-6 grid gap-4">
            <input type="hidden" name="redirect" value={redirectTo} />
            <label className="relative block">
              <span className="sr-only">Name</span>
              <input
                name="name"
                autoComplete="name"
                placeholder="Name"
                className="min-h-14 w-full rounded-lg border border-ink/15 bg-cream px-4 pr-12 text-base text-ink outline-none transition placeholder:text-ink/55 focus:border-moss focus:ring-2 focus:ring-sage"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/55">
                <UserIcon />
              </span>
            </label>
            <label className="relative block">
              <span className="sr-only">Email address</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email address"
                required
                className="min-h-14 w-full rounded-lg border border-ink/15 bg-cream px-4 pr-12 text-base text-ink outline-none transition placeholder:text-ink/55 focus:border-moss focus:ring-2 focus:ring-sage"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/55">
                <MailIcon />
              </span>
            </label>
            <label className="relative block">
              <span className="sr-only">Password</span>
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Password"
                minLength={PASSWORD_MIN_LENGTH}
                maxLength={PASSWORD_MAX_LENGTH}
                required
                className="min-h-14 w-full rounded-lg border border-ink/15 bg-cream px-4 pr-12 text-base text-ink outline-none transition placeholder:text-ink/55 focus:border-moss focus:ring-2 focus:ring-sage"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/55">
                <LockIcon />
              </span>
            </label>
            <label className="relative block">
              <span className="sr-only">Confirm password</span>
              <input
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Confirm password"
                minLength={PASSWORD_MIN_LENGTH}
                maxLength={PASSWORD_MAX_LENGTH}
                required
                className="min-h-14 w-full rounded-lg border border-ink/15 bg-cream px-4 pr-12 text-base text-ink outline-none transition placeholder:text-ink/55 focus:border-moss focus:ring-2 focus:ring-sage"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/55">
                <LockIcon />
              </span>
            </label>
            <div className="rounded-lg border border-ink/10 bg-cream p-4 text-sm leading-6 text-ink/70">
              <p className="font-semibold text-ink">Account protection</p>
              <p className="mt-2">
                Use at least {PASSWORD_MIN_LENGTH} characters. Passphrases are welcome. Avoid common passwords,
                repeated characters, your name, or your email.
              </p>
            </div>
            <button className="min-h-14 rounded-lg bg-forest px-6 text-base font-semibold text-white shadow-sm transition hover:bg-moss">
              Create account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink/65">
            Already have an account?{' '}
            <Link href={`/login?redirect=${encodeURIComponent(redirectTo)}`} className="font-semibold text-moss">
              Log in
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

function UserIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16v12H4z" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none" stroke="currentColor" strokeWidth="2">
      <path d="M6 10h12v10H6z" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
