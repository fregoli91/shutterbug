import Link from 'next/link';
import { loginAction } from './actions';

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: 'Admin Login'
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {};
  const hasError = params.error === 'invalid';

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-moss">Admin</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-ink">Sign in</h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          Product and order management is protected by environment-based admin credentials.
        </p>

        {hasError ? (
          <p className="mt-4 rounded-lg bg-sand px-4 py-3 text-sm font-semibold text-ink">
            Invalid username or password.
          </p>
        ) : null}

        <form action={loginAction} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Username
            <input
              name="username"
              autoComplete="username"
              className="min-h-12 rounded-lg border border-ink/15 bg-cream px-3 text-base font-normal outline-none focus:border-moss"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              className="min-h-12 rounded-lg border border-ink/15 bg-cream px-3 text-base font-normal outline-none focus:border-moss"
              required
            />
          </label>
          <button className="min-h-12 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white transition hover:bg-moss">
            Sign in
          </button>
        </form>

        <Link href="/" className="mt-5 inline-flex text-sm font-semibold text-moss hover:text-ink">
          Return to storefront
        </Link>
      </div>
    </section>
  );
}
