import Link from 'next/link';
import { redirect } from 'next/navigation';
import { loginAction } from './actions';
import { getAdminSession } from '@/lib/admin-auth';
import { getCustomerSession } from '@/lib/customer-auth';

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: 'Customer Login'
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
  invalid: 'That email and password did not match a customer account.',
  config: 'Customer accounts need a configured database before login can work.',
  'verify-invalid': 'That verification link is invalid or has already been used.'
};

export default async function LoginPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {};
  const redirectTo = cleanRedirect(params.redirect);
  const admin = await getAdminSession();
  if (admin) redirect('/admin');

  const customer = await getCustomerSession();
  if (customer) redirect(redirectTo);

  const error = errorMessages[asString(params.error)];
  const status = asString(params.status);

  return (
    <section className="bg-cream px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-xl overflow-hidden rounded-lg border border-ink/10 bg-cream shadow-sm lg:max-w-7xl lg:rounded-[1.75rem] lg:shadow-soft lg:min-h-[44rem] lg:grid-cols-[1.04fr_0.96fr]">
        <div className="relative hidden min-h-full overflow-hidden bg-ink lg:block">
          <img
            src="/shutterbug-login-hero.png"
            alt="Shutterbug camera mascot with vintage camera and film photos"
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="flex items-center justify-center bg-cream px-5 py-8 sm:px-10 sm:py-10 lg:px-14">
          <div className="w-full max-w-md text-center lg:text-left">
            <div className="flex items-center justify-center gap-3 lg:justify-start">
              <img
                src="/shutterbug-account-badge.png"
                alt=""
                className="h-16 w-16 rounded-full object-cover shadow-sm sm:h-20 sm:w-20"
              />
              <img
                src="/shutterbug-header-logo-transparent.png"
                alt="Shutterbug Camera Shop"
                className="h-16 min-w-0 max-w-64 flex-1 object-contain object-center sm:h-20 lg:object-left"
              />
            </div>

            <div className="mt-9">
              <h1 className="font-serif text-4xl font-bold tracking-tight text-ink">Welcome back!</h1>
              <p className="mt-3 text-base leading-7 text-ink/70">Log in to your account to continue.</p>
            </div>

          {status === 'logged-out' ? (
            <p className="mt-5 rounded-lg bg-mint p-3 text-sm font-semibold text-ink">You have been logged out.</p>
          ) : null}
          {status === 'verified' ? (
            <p className="mt-5 rounded-lg bg-mint p-3 text-sm font-semibold text-ink">
              Your email is verified. You can log in now.
            </p>
          ) : null}
          {error ? <p className="mt-5 rounded-lg bg-sand p-3 text-sm font-semibold text-ink">{error}</p> : null}

          <form action={loginAction} className="mt-7 grid gap-5">
            <input type="hidden" name="redirect" value={redirectTo} />
            <label className="relative block">
              <span className="sr-only">Email address</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email address"
                required
                className="min-h-14 w-full rounded-lg border border-ink/20 bg-cream/60 px-4 pr-12 text-base text-ink outline-none transition placeholder:text-ink/55 focus:border-moss focus:ring-2 focus:ring-sage"
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
                autoComplete="current-password"
                placeholder="Password"
                required
                className="min-h-14 w-full rounded-lg border border-ink/20 bg-cream/60 px-4 pr-12 text-base text-ink outline-none transition placeholder:text-ink/55 focus:border-moss focus:ring-2 focus:ring-sage"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/55">
                <LockIcon />
              </span>
            </label>

            <div className="flex items-center justify-between gap-3 text-sm text-ink/68">
              <label className="inline-flex min-h-9 items-center gap-2">
                <input
                  name="remember"
                  type="checkbox"
                  className="h-5 w-5 rounded border-ink/20 bg-cream text-forest accent-[#24543a]"
                />
                <span>Remember me</span>
              </label>
              <Link href="/contact" className="font-semibold text-forest transition hover:text-moss">
                Forgot password?
              </Link>
            </div>

            <button className="min-h-14 rounded-lg bg-ink px-6 text-base font-semibold text-white shadow-sm transition hover:bg-forest">
              Log in
            </button>
          </form>

            <div className="my-8 flex items-center gap-4 text-sm font-medium text-ink/55">
              <span className="h-px flex-1 bg-ink/12" />
              <span>OR</span>
              <span className="h-px flex-1 bg-ink/12" />
            </div>

            <Link
              href={`/signup?redirect=${encodeURIComponent(redirectTo)}`}
              className="flex min-h-14 items-center justify-center rounded-lg border border-ink/18 bg-cream/50 px-5 text-base font-semibold text-ink transition hover:border-moss hover:text-moss"
            >
              Create your Shutterbug account
            </Link>

            <p className="mt-7 text-center text-sm text-ink/65">
              Don&apos;t have an account?{' '}
              <Link href={`/signup?redirect=${encodeURIComponent(redirectTo)}`} className="font-bold text-forest hover:text-moss">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
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
