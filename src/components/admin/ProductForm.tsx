import {
  CameraFormat,
  CameraType,
  ProductCondition,
  ProductStatus,
  type Prisma
} from '@/generated/prisma/client';
import { categories } from '@/lib/categories';
import { AdminImageUploader } from './AdminImageUploader';

type AdminProduct = Prisma.ProductGetPayload<{ include: { images: true } }>;

type Props = {
  action: (formData: FormData) => Promise<void>;
  product?: AdminProduct | null;
  submitLabel: string;
};

const enumLabels = {
  [CameraType.VINTAGE_DIGITAL]: 'Vintage Digital',
  [CameraType.FILM_CAMERA]: 'Film Camera',
  [CameraType.ACCESSORY]: 'Accessory',
  [CameraType.PARTS_REPAIR]: 'Parts & Repair',
  [CameraFormat.DIGITAL]: 'Digital',
  [CameraFormat.FILM]: 'Film',
  [ProductCondition.MINT]: 'Mint',
  [ProductCondition.EXCELLENT]: 'Excellent',
  [ProductCondition.GOOD]: 'Good',
  [ProductCondition.FAIR]: 'Fair',
  [ProductCondition.FOR_PARTS]: 'For Parts',
  [ProductStatus.IN_STOCK]: 'In stock',
  [ProductStatus.SOLD_OUT]: 'Sold out',
  [ProductStatus.COMING_SOON]: 'Coming soon',
  [ProductStatus.DRAFT]: 'Draft'
};

function join(values: string[] | undefined) {
  return values?.join('\n') ?? '';
}

function Field({
  label,
  name,
  defaultValue,
  required,
  type = 'text'
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink">
      {label}
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ''}
        required={required}
        className="min-h-11 rounded-lg border border-ink/15 bg-cream px-3 text-base font-normal outline-none focus:border-moss"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  rows = 4,
  id
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
  id?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink">
      {label}
      <textarea
        id={id}
        name={name}
        rows={rows}
        defaultValue={defaultValue ?? ''}
        className="rounded-lg border border-ink/15 bg-cream px-3 py-3 text-base font-normal outline-none focus:border-moss"
      />
    </label>
  );
}

function Select({
  label,
  name,
  options,
  defaultValue
}: {
  label: string;
  name: string;
  options: string[];
  defaultValue?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink">
      {label}
      <select
        name={name}
        defaultValue={defaultValue}
        className="min-h-11 rounded-lg border border-ink/15 bg-cream px-3 text-base font-normal outline-none focus:border-moss"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {enumLabels[option as keyof typeof enumLabels] ?? option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Checkbox({ label, name, defaultChecked }: { label: string; name: string; defaultChecked?: boolean }) {
  return (
    <label className="flex min-h-11 items-center gap-3 rounded-lg bg-cream px-3 text-sm font-semibold text-ink">
      <input name={name} type="checkbox" defaultChecked={defaultChecked} className="h-5 w-5 accent-[#24543a]" />
      {label}
    </label>
  );
}

export function ProductForm({ action, product, submitLabel }: Props) {
  const images = [...(product?.images ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
  const heroImage = images[0]?.url ?? '';
  const galleryImages = images.slice(1).map((image) => image.url);

  return (
    <form action={action} className="grid gap-6">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}

      <div className="grid gap-4 rounded-lg border border-ink/10 bg-white p-5 shadow-sm md:grid-cols-2">
        <Field label="Product title" name="title" defaultValue={product?.title} required />
        <Field label="Slug" name="slug" defaultValue={product?.slug} />
        <Field label="SKU" name="sku" defaultValue={product?.sku} />
        <Field label="Brand" name="brand" defaultValue={product?.brand} required />
        <Field label="Model" name="model" defaultValue={product?.model} required />
        <Field label="Price" name="price" type="number" defaultValue={product ? product.priceCents / 100 : ''} required />
        <Field label="Quantity" name="quantity" type="number" defaultValue={product?.quantity ?? 1} required />
        <Select
          label="Primary category"
          name="categorySlug"
          options={categories.map((category) => category.slug)}
          defaultValue={product?.categorySlug ?? categories[0]?.slug}
        />
        <Select
          label="Camera type"
          name="cameraType"
          options={Object.values(CameraType)}
          defaultValue={product?.cameraType ?? CameraType.VINTAGE_DIGITAL}
        />
        <Select
          label="Format"
          name="format"
          options={Object.values(CameraFormat)}
          defaultValue={product?.format ?? CameraFormat.DIGITAL}
        />
        <Select
          label="Condition grade"
          name="condition"
          options={Object.values(ProductCondition)}
          defaultValue={product?.condition ?? ProductCondition.GOOD}
        />
        <Select
          label="Availability"
          name="status"
          options={Object.values(ProductStatus)}
          defaultValue={product?.status ?? ProductStatus.DRAFT}
        />
        <TextArea label="Additional category slugs" name="categorySlugs" defaultValue={join(product?.categorySlugs)} rows={3} />
        <TextArea label="Condition summary" name="conditionSummary" defaultValue={product?.conditionSummary ?? ''} rows={3} />
      </div>

      <div className="grid gap-4 rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        <TextArea label="Short description" name="shortDescription" defaultValue={product?.shortDescription ?? ''} rows={3} />
        <TextArea label="Full product description" name="description" defaultValue={product?.description ?? ''} rows={6} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="SEO title" name="seoTitle" defaultValue={product?.seoTitle} />
          <TextArea label="SEO description" name="seoDescription" defaultValue={product?.seoDescription ?? ''} rows={3} />
        </div>
      </div>

      <div className="grid gap-4 rounded-lg border border-ink/10 bg-white p-5 shadow-sm md:grid-cols-[1fr_16rem]">
        <div className="grid gap-4">
          <Field label="Hero image URL" name="heroImage" defaultValue={heroImage} />
          <TextArea id="galleryImages" label="Gallery image URLs" name="galleryImages" defaultValue={join(galleryImages)} />
        </div>
        <div className="grid gap-3 content-start">
          <AdminImageUploader targetId="heroImage" mode="replace" />
          <AdminImageUploader targetId="galleryImages" />
        </div>
      </div>

      <div className="grid gap-4 rounded-lg border border-ink/10 bg-white p-5 shadow-sm md:grid-cols-2">
        <TextArea label="Included accessories" name="included" defaultValue={join(product?.included)} />
        <TextArea label="Testing checklist" name="tested" defaultValue={join(product?.tested)} />
        <TextArea label="Cosmetic condition notes" name="cosmeticNotes" defaultValue={join(product?.cosmeticNotes)} />
        <TextArea label="Functional condition notes" name="functionalNotes" defaultValue={join(product?.functionalNotes)} />
        <TextArea label="Flaws / issues" name="flaws" defaultValue={join(product?.flaws)} />
        <TextArea label="Good for" name="goodFor" defaultValue={join(product?.goodFor)} />
        <TextArea label="Badges" name="badges" defaultValue={join(product?.badges)} />
        <TextArea label="Internal/public notes" name="notes" defaultValue={join(product?.notes)} />
        <TextArea label="Shipping note" name="shippingNote" defaultValue={product?.shippingNote ?? ''} />
        <TextArea label="Returns note" name="returnsNote" defaultValue={product?.returnsNote ?? ''} />
      </div>

      <div className="grid gap-3 rounded-lg border border-ink/10 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
        <Checkbox label="Includes battery" name="includesBattery" defaultChecked={product?.includesBattery} />
        <Checkbox label="Includes charger" name="includesCharger" defaultChecked={product?.includesCharger} />
        <Checkbox label="Actual photos" name="actualPhotos" defaultChecked={product?.actualPhotos} />
        <Checkbox label="Parts / repair" name="partsRepair" defaultChecked={product?.partsRepair} />
        <Checkbox label="Featured" name="featured" defaultChecked={product?.featured} />
      </div>

      <button className="min-h-12 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-moss">
        {submitLabel}
      </button>
    </form>
  );
}
