import Link from 'next/link';
import { toggleProductLikeAction } from '@/app/account/likes/actions';

export function ProductLikeButton({
  productId,
  productSlug,
  liked,
  signedIn,
  redirectTo,
  className,
  showText = false
}: {
  productId: string;
  productSlug: string;
  liked: boolean;
  signedIn: boolean;
  redirectTo: string;
  className?: string;
  showText?: boolean;
}) {
  const label = liked ? 'Remove from liked products' : 'Save product for later';
  const defaultClassName =
    'inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-ink/15 bg-white px-3 text-sm font-semibold text-ink shadow-sm transition hover:border-moss hover:text-moss';
  const activeClassName =
    'inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-forest bg-forest px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-moss';
  const buttonClassName = className ?? (liked ? activeClassName : defaultClassName);
  const icon = <HeartIcon filled={liked} />;

  if (!signedIn) {
    return (
      <Link
        href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
        aria-label="Log in to save this product"
        className={className ?? defaultClassName}
      >
        {icon}
        {showText ? <span>Save</span> : null}
      </Link>
    );
  }

  return (
    <form action={toggleProductLikeAction}>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="productSlug" value={productSlug} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <button type="submit" aria-label={label} className={buttonClassName}>
        {icon}
        {showText ? <span>{liked ? 'Unlike' : 'Save'}</span> : null}
      </button>
    </form>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`h-5 w-5 ${filled ? 'fill-current' : 'fill-none'}`}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 4.6c-1.9-1.8-4.9-1.8-6.8.1L12 6.7 10 4.7c-1.9-1.9-4.9-1.9-6.8-.1-2 1.9-2.1 5.1-.2 7.1l9 8.8 9-8.8c1.9-2 1.8-5.2-.2-7.1Z" />
    </svg>
  );
}
