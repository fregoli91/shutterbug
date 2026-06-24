export function SectionHeading({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow ? <p className="text-sm font-bold uppercase tracking-[0.28em] text-brass">{eyebrow}</p> : null}
      <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-ink sm:text-5xl">{title}</h2>
      {children ? <p className="mt-5 text-lg leading-8 text-ink/68">{children}</p> : null}
    </div>
  );
}
