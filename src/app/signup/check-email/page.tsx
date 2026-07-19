import Link from 'next/link';
import Image from 'next/image';
import { resendVerificationAction } from './actions';

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: 'Verify Your Email'
};

function asString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

const statusMessages: Record<string, string> = {
  sent: 'We sent a verification link to your email.',
  resent: 'We sent a fresh verification link.',
  unverified: 'Please verify your email before logging in.',
  expired: 'That verification link expired. Request a fresh link below.',
  'dev-email': 'Email delivery is not configured locally. Check the development server console for the verification link.',
  'email-error': 'We created your account, but the verification email could not be sent. Try resending it below.'
};

export default async function CheckEmailPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {};
  const email = asString(params.email);
  const redirectTo = asString(params.redirect) || '/account';
  const status = asString(params.status) || 'sent';

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl rounded-lg border border-ink/10 bg-white p-6 text-center shadow-sm sm:p-8">
        <Image
          src="/shutterbug-accent-wave.png"
          alt=""
          width={96}
          height={96}
          sizes="6rem"
          className="mx-auto h-20 w-20 rounded-full border border-ink/10 bg-sand object-cover object-center shadow-sm sm:h-24 sm:w-24"
        />
        <p className="mt-5 text-sm font-bold uppercase tracking-[0.22em] text-moss">Verify your email</p>
        <h1 className="mt-3 font-serif text-4xl font-bold text-ink">Check your inbox</h1>
        <p className="mt-4 leading-7 text-ink/70">
          {statusMessages[status] ?? statusMessages.sent}
        </p>
        {email ? <p className="mt-3 text-sm font-semibold text-ink">{email}</p> : null}

        <form action={resendVerificationAction} className="mt-6">
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="redirect" value={redirectTo} />
          <button className="min-h-12 rounded-full bg-forest px-6 font-semibold text-white transition hover:bg-moss">
            Resend verification email
          </button>
        </form>

        <p className="mt-5 text-sm text-ink/65">
          Already verified?{' '}
          <Link href={`/login?redirect=${encodeURIComponent(redirectTo)}`} className="font-semibold text-moss">
            Log in
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
