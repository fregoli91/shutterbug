'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'shutterbug-soft-launch-announcement-dismissed';

export function SoftLaunchAnnouncement() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (window.localStorage.getItem(STORAGE_KEY) === 'true') setVisible(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="border-b border-forest/15 bg-mint text-forest" role="status">
      <div className="mx-auto flex min-h-8 max-w-7xl items-center justify-center gap-2 px-3 py-1.5 text-center text-[0.7rem] leading-4 sm:text-xs">
        <p>
          <span className="font-bold uppercase tracking-[0.12em]">Soft launch</span>
          <span aria-hidden="true"> — </span>
          Fresh inventory is added as each item is tested &amp; photographed.
        </p>
        <button
          type="button"
          aria-label="Dismiss soft-launch announcement"
          onClick={() => {
            window.localStorage.setItem(STORAGE_KEY, 'true');
            setVisible(false);
          }}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-base leading-none transition hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-moss"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </div>
  );
}
