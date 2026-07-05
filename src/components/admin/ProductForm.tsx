import {
  CameraFormat,
  CameraType,
  ProductCondition,
  ProductStatus,
  type Prisma
} from '@/generated/prisma/client';
import {
  CAMERA_BRANDS,
  FILM_FORMATS,
  FUNCTIONAL_STATUSES,
  LENS_MOUNTS,
  PRODUCT_TYPES,
  STORAGE_TYPES
} from '@/lib/catalog';
import { categories } from '@/lib/categories';
import { AdminImageUploader } from './AdminImageUploader';

type AdminProduct = Prisma.ProductGetPayload<{ include: { images: true } }>;

type Props = {
  action: (formData: FormData) => Promise<void>;
  product?: AdminProduct | null;
  submitLabel: string;
};

const enumLabels = {
  [ProductCondition.NEW]: 'New',
  [ProductCondition.OPEN_BOX]: 'Open Box',
  [CameraType.VINTAGE_DIGITAL]: 'Vintage Digital',
  [CameraType.FILM_CAMERA]: 'Film Camera',
  [CameraType.ACCESSORY]: 'Accessory',
  [CameraType.PARTS_REPAIR]: 'Parts & Repair',
  [CameraFormat.DIGITAL]: 'Digital',
  [CameraFormat.FILM]: 'Film',
  [ProductCondition.MINT]: 'Mint',
  [ProductCondition.EXCELLENT]: 'Excellent',
  [ProductCondition.VERY_GOOD]: 'Very Good',
  [ProductCondition.GOOD]: 'Good',
  [ProductCondition.FAIR]: 'Fair',
  [ProductCondition.HEAVILY_USED]: 'Heavily Used',
  [ProductCondition.FOR_PARTS]: 'For Parts',
  [ProductCondition.UNTESTED]: 'Untested',
  [ProductCondition.REFURBISHED]: 'Refurbished',
  [ProductStatus.IN_STOCK]: 'In stock',
  [ProductStatus.SOLD_OUT]: 'Sold out',
  [ProductStatus.COMING_SOON]: 'Coming soon',
  [ProductStatus.DRAFT]: 'Draft'
};
type SelectOption = string | { value: string; label: string };

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
  defaultValue,
  allowBlank,
  blankLabel = 'Not specified'
}: {
  label: string;
  name: string;
  options: SelectOption[];
  defaultValue?: string;
  allowBlank?: boolean;
  blankLabel?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink">
      {label}
      <select
        name={name}
        defaultValue={defaultValue}
        className="min-h-11 rounded-lg border border-ink/15 bg-cream px-3 text-base font-normal outline-none focus:border-moss"
      >
        {allowBlank ? <option value="">{blankLabel}</option> : null}
        {options.map((option) => (
          <option key={typeof option === 'string' ? option : option.value} value={typeof option === 'string' ? option : option.value}>
            {typeof option === 'string' ? enumLabels[option as keyof typeof enumLabels] ?? option : option.label}
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
  const selectedBrand = product?.brand
    ? CAMERA_BRANDS.includes(product.brand)
      ? product.brand
      : 'Other / Unlisted Brand'
    : 'Canon';
  const customBrand = selectedBrand === 'Other / Unlisted Brand' ? product?.brand : '';
  const categoryOptions = categories.map((category) => ({ value: category.slug, label: category.name }));

  return (
    <form action={action} className="grid gap-6">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}

      <div className="grid gap-4 rounded-lg border border-ink/10 bg-white p-5 shadow-sm md:grid-cols-2">
        <Field label="Product title" name="title" defaultValue={product?.title} required />
        <Field label="Slug" name="slug" defaultValue={product?.slug} />
        <Field label="SKU" name="sku" defaultValue={product?.sku} />
        <Select label="Brand" name="brand" options={CAMERA_BRANDS} defaultValue={selectedBrand} />
        <Field label="Custom brand / other" name="customBrand" defaultValue={customBrand} />
        <Field label="Manufacturer" name="manufacturer" defaultValue={product?.manufacturer || product?.brand} />
        <Field label="Model" name="model" defaultValue={product?.model} required />
        <Field label="Price" name="price" type="number" defaultValue={product ? product.priceCents / 100 : ''} required />
        <Field label="Quantity" name="quantity" type="number" defaultValue={product?.quantity ?? 1} required />
        <Select
          label="Primary category"
          name="categorySlug"
          options={categoryOptions}
          defaultValue={product?.categorySlug ?? categories[0]?.slug}
        />
        <Select
          label="Subcategory"
          name="subcategorySlug"
          options={categoryOptions}
          defaultValue={product?.subcategorySlug ?? ''}
          allowBlank
        />
        <Select
          label="Product type"
          name="productType"
          options={PRODUCT_TYPES}
          defaultValue={product?.productType ?? ''}
          allowBlank
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
          label="Functional status"
          name="functionalStatus"
          options={FUNCTIONAL_STATUSES}
          defaultValue={product?.functionalStatus ?? 'Tested'}
        />
        <Select
          label="Availability"
          name="status"
          options={Object.values(ProductStatus)}
          defaultValue={product?.status ?? ProductStatus.DRAFT}
        />
        <Select
          label="Lens mount"
          name="lensMount"
          options={LENS_MOUNTS}
          defaultValue={product?.lensMount ?? ''}
          allowBlank
        />
        <Select
          label="Film format"
          name="filmFormat"
          options={FILM_FORMATS}
          defaultValue={product?.filmFormat ?? ''}
          allowBlank
        />
        <Select
          label="Storage / media type"
          name="storageType"
          options={STORAGE_TYPES}
          defaultValue={product?.storageType ?? ''}
          allowBlank
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
        <TextArea label="Tags" name="tags" defaultValue={join(product?.tags)} />
        <TextArea label="Internal/public notes" name="notes" defaultValue={join(product?.notes)} />
        <TextArea label="Shipping note" name="shippingNote" defaultValue={product?.shippingNote ?? ''} />
        <TextArea label="Returns note" name="returnsNote" defaultValue={product?.returnsNote ?? ''} />
      </div>

      <div className="grid gap-3 rounded-lg border border-ink/10 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        <Checkbox label="Includes battery" name="includesBattery" defaultChecked={product?.includesBattery} />
        <Checkbox label="Includes charger" name="includesCharger" defaultChecked={product?.includesCharger} />
        <Checkbox label="Includes memory card" name="includesMemoryCard" defaultChecked={product?.includesMemoryCard} />
        <Checkbox label="Includes case" name="includesCase" defaultChecked={product?.includesCase} />
        <Checkbox label="Includes strap" name="includesStrap" defaultChecked={product?.includesStrap} />
        <Checkbox label="Includes manual" name="includesManual" defaultChecked={product?.includesManual} />
        <Checkbox label="Includes original box" name="includesOriginalBox" defaultChecked={product?.includesOriginalBox} />
        <Checkbox label="Actual photos" name="actualPhotos" defaultChecked={product?.actualPhotos} />
        <Checkbox label="Sample photos" name="samplePhotos" defaultChecked={product?.samplePhotos} />
        <Checkbox label="Parts / repair" name="partsRepair" defaultChecked={product?.partsRepair} />
        <Checkbox label="Featured" name="featured" defaultChecked={product?.featured} />
        <Checkbox label="New arrival" name="newArrival" defaultChecked={product?.newArrival} />
      </div>

      <button className="min-h-12 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-moss">
        {submitLabel}
      </button>
    </form>
  );
}
