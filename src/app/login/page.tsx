import Link from 'next/link';
import { loginAction } from './actions';

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: 'Customer Login'
};

function asString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

const errorMessages: Record<string, string> = {
  missing: 'Enter your email and password.',
  invalid: 'That email and password did not match a customer account.',
  config: 'Customer accounts need a configured database before login can work.',
  'verify-invalid': 'That verification link is invalid or has already been used.'
};

export default async function LoginPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {};
  const redirectTo = asString(params.redirect) || '/account';
  const error = errorMessages[asString(params.error)];
  const status = asString(params.status);

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl rounded-lg border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
        <img
          src="/shutterbug-basic-character.png"
          alt="Shutterbug camera mascot"
          className="mx-auto h-20 w-20 rounded-full border border-ink/10 bg-sand object-cover object-center shadow-sm sm:h-24 sm:w-24"
        />
        <div className="mt-5 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-moss">Customer account</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-ink">Log in to Shutterbug</h1>
          <p className="mt-4 leading-7 text-ink/70">
            Use your customer account to view order history and keep track of Shutterbug purchases.
          </p>

          {status === 'logged-out' ? (
            <p className="mt-5 rounded-lg bg-mint p-3 text-sm font-semibold text-ink">You have been logged out.</p>
          ) : null}
          {status === 'verified' ? (
            <p className="mt-5 rounded-lg bg-mint p-3 text-sm font-semibold text-ink">
              Your email is verified. You can log in now.
            </p>
          ) : null}
          {error ? <p className="mt-5 rounded-lg bg-sand p-3 text-sm font-semibold text-ink">{error}</p> : null}

          <form action={loginAction} className="mt-6 grid gap-4 text-left">
            <input type="hidden" name="redirect" value={redirectTo} />
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Email
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                className="min-h-12 rounded-lg border border-ink/15 bg-cream px-3 outline-none focus:border-moss"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Password
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="min-h-12 rounded-lg border border-ink/15 bg-cream px-3 outline-none focus:border-moss"
              />
            </label>
            <button className="min-h-12 rounded-full bg-forest px-6 font-semibold text-white transition hover:bg-moss">
              Log in
            </button>
          </form>

          <p className="mt-5 text-sm text-ink/65">
            New here?{' '}
            <Link href={`/signup?redirect=${encodeURIComponent(redirectTo)}`} className="font-semibold text-moss">
              Create a customer account
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
