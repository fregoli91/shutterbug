import Link from 'next/link';
import { createProductFromTemplateAction } from '@/app/admin/actions';
import { AdminShell } from '@/components/admin/AdminShell';
import { requireAdmin } from '@/lib/admin-auth';
import { cameraProductTemplatesByBrand } from '@/lib/product-templates';

export const metadata = {
  title: 'Product Model Templates'
};

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProductTemplatesPage({ searchParams }: Props) {
  await requireAdmin();
  const params = searchParams ? await searchParams : {};
  const hasError = firstParam(params.error) === 'template-not-found';
  const templatesByBrand = cameraProductTemplatesByBrand();

  return (
    <AdminShell>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-moss">Products</p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-ink">Start with a camera model</h2>
          <p className="mt-3 text-sm leading-6 text-ink/70">
            Choose a common model to create a private draft with its brand, categories, descriptions, SEO copy, and
            tags already filled in.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="inline-flex min-h-11 items-center rounded-full border border-ink/15 bg-white px-5 text-sm font-semibold text-ink"
        >
          Back to products
        </Link>
      </div>

      <div className="mt-6 rounded-lg border border-moss/25 bg-mint/50 p-5 text-sm leading-6 text-ink/75">
        Every template starts as a hidden draft. Before publishing, add actual product photos and confirm the exact
        price, condition, tested functions, included accessories, and known flaws for that individual camera.
      </div>

      {hasError ? (
        <div className="mt-4 rounded-lg border border-red-900/20 bg-red-50 p-4 text-sm font-semibold text-red-900">
          That template could not be found. Choose one of the models below.
        </div>
      ) : null}

      <div className="mt-8 grid gap-8">
        {Object.entries(templatesByBrand).map(([brand, templates]) => (
          <section key={brand}>
            <div className="flex items-center gap-3">
              <h3 className="font-serif text-2xl font-bold text-ink">{brand}</h3>
              <span className="rounded-full bg-sand px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-ink/65">
                {templates.length} models
              </span>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {templates.map((template) => (
                <article key={template.key} className="grid gap-4 rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-moss">{template.productType}</p>
                    <h4 className="mt-2 text-lg font-bold text-ink">{template.model}</h4>
                    <p className="mt-2 text-sm leading-6 text-ink/65">{template.shortDescription}</p>
                  </div>
                  <form action={createProductFromTemplateAction} className="mt-auto">
                    <input type="hidden" name="templateKey" value={template.key} />
                    <button className="min-h-11 w-full rounded-full bg-forest px-4 text-sm font-semibold text-white transition hover:bg-moss">
                      Create draft
                    </button>
                  </form>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </AdminShell>
  );
}
