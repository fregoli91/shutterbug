import Link from 'next/link';
import { signupAction } from './actions';
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

const errorMessages: Record<string, string> = {
  missing: 'Enter your email and password.',
  password: `Use a stronger password with at least ${PASSWORD_MIN_LENGTH} characters.`,
  mismatch: 'Make sure both password fields match.',
  exists: 'An account already exists for that email. Try logging in instead.',
  config: 'Customer accounts need a configured database before signup can work.'
};

export default async function SignupPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {};
  const redirectTo = asString(params.redirect) || '/account';
  const error = errorMessages[asString(params.error)];

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl rounded-lg border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
        <img
          src="/shutterbug-signup.png"
          alt="Shutterbug welcoming a new customer account"
          className="mx-auto h-20 w-20 rounded-full border border-ink/10 bg-sand object-cover object-center shadow-sm sm:h-24 sm:w-24"
        />
        <div className="mt-5 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-moss">Customer account</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-ink">Create your Shutterbug account</h1>
          <p className="mt-4 leading-7 text-ink/70">
            Create a verified customer profile for order history, tracking, and easier support after checkout.
          </p>

          {error ? <p className="mt-5 rounded-lg bg-sand p-3 text-sm font-semibold text-ink">{error}</p> : null}

          <form action={signupAction} className="mt-6 grid gap-4 text-left">
            <input type="hidden" name="redirect" value={redirectTo} />
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Name
              <input
                name="name"
                autoComplete="name"
                className="min-h-12 rounded-lg border border-ink/15 bg-cream px-3 outline-none focus:border-moss"
              />
            </label>
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
                autoComplete="new-password"
                minLength={PASSWORD_MIN_LENGTH}
                maxLength={PASSWORD_MAX_LENGTH}
                required
                className="min-h-12 rounded-lg border border-ink/15 bg-cream px-3 outline-none focus:border-moss"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Confirm password
              <input
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={PASSWORD_MIN_LENGTH}
                maxLength={PASSWORD_MAX_LENGTH}
                required
                className="min-h-12 rounded-lg border border-ink/15 bg-cream px-3 outline-none focus:border-moss"
              />
            </label>
            <div className="rounded-lg border border-ink/10 bg-cream p-4 text-sm leading-6 text-ink/70">
              <p className="font-semibold text-ink">Password rules</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Use at least {PASSWORD_MIN_LENGTH} characters.</li>
                <li>Passphrases are welcome. Symbols and numbers are allowed, but not required.</li>
                <li>Avoid common passwords, repeated characters, your name, or your email.</li>
              </ul>
            </div>
            <button className="min-h-12 rounded-full bg-forest px-6 font-semibold text-white transition hover:bg-moss">
              Create account
            </button>
          </form>

          <p className="mt-5 text-sm text-ink/65">
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
