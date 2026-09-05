'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

export function ShopFilterDrawer({ children, count }: { children: ReactNode; count: number }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    dialog?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      trigger?.focus();
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button ref={triggerRef} type="button" onClick={() => setOpen(true)}
        aria-haspopup="dialog" aria-expanded={open} aria-controls={id}
        className="inline-flex min-h-11 items-center gap-2 rounded-md border border-forest/20 bg-white px-4 text-sm font-semibold text-forest hover:bg-mint focus-visible:outline focus-visible:outline-2 focus-visible:outline-moss">
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" /> Filter{count ? ` (${count})` : ''}
      </button>
      <dialog ref={dialogRef} id={id} aria-labelledby={`${id}-title`}
        onCancel={(event) => { event.preventDefault(); setOpen(false); }}
        onClose={() => setOpen(false)}
        onClick={(event) => { if (event.target === event.currentTarget) setOpen(false); }}
        className="fixed inset-0 m-0 h-[100dvh] max-h-none w-full max-w-none bg-cream p-0 text-ink backdrop:bg-ink/40 sm:ml-auto sm:max-w-md">
        <div className="flex h-full flex-col">
          <div className="flex shrink-0 items-center justify-between border-b border-forest/15 px-4 py-3">
            <h2 id={`${id}-title`} className="text-lg font-semibold">Filter cameras & gear</h2>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close filters" className="flex h-11 w-11 items-center justify-center rounded-md hover:bg-mint focus-visible:outline focus-visible:outline-2 focus-visible:outline-moss">
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4">{children}</div>
        </div>
      </dialog>
    </div>
  );
}