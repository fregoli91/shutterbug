'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

type ManagedImage = {
  id: string;
  url: string;
};

function uniqueImages(urls: string[]) {
  const seen = new Set<string>();
  return urls
    .map((url) => url.trim())
    .filter(Boolean)
    .filter((url) => {
      if (seen.has(url)) return false;
      seen.add(url);
      return true;
    })
    .map((url, index) => ({ id: `${index}-${url}`, url }));
}

function isAllowedUrl(url: string) {
  return url.startsWith('https://') || url.startsWith('/');
}

function isSvg(url: string) {
  return url.toLowerCase().endsWith('.svg');
}

export function AdminProductImageManager({
  mainImageUrl,
  galleryImageUrls,
  productTitle
}: {
  mainImageUrl?: string;
  galleryImageUrls?: string[];
  productTitle?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<ManagedImage[]>(() => uniqueImages([mainImageUrl ?? '', ...(galleryImageUrls ?? [])]));
  const [manualUrl, setManualUrl] = useState('');
  const [status, setStatus] = useState('');
  const [uploading, setUploading] = useState(false);

  const heroImage = images[0]?.url ?? '';
  const galleryImages = images.slice(1).map((image) => image.url);

  function addUrls(urls: string[]) {
    setImages((current) => uniqueImages([...current.map((image) => image.url), ...urls]));
  }

  async function uploadFiles(files: FileList | null) {
    const selectedFiles = Array.from(files ?? []);
    if (!selectedFiles.length) return;

    setUploading(true);
    setStatus(`Uploading ${selectedFiles.length} image${selectedFiles.length === 1 ? '' : 's'}...`);

    const uploadedUrls: string[] = [];
    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.set('file', file);
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const payload = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !payload.url) {
        setStatus(payload.error || `Upload failed for ${file.name}`);
        setUploading(false);
        return;
      }
      uploadedUrls.push(payload.url);
    }

    addUrls(uploadedUrls);
    setStatus(`Uploaded ${uploadedUrls.length} image${uploadedUrls.length === 1 ? '' : 's'}.`);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function addManualUrl() {
    const url = manualUrl.trim();
    if (!url) return;
    if (!isAllowedUrl(url)) {
      setStatus('Use an HTTPS image URL or a local site image path.');
      return;
    }
    addUrls([url]);
    setManualUrl('');
    setStatus('Image URL added.');
  }

  function removeImage(index: number) {
    setImages((current) => current.filter((_, currentIndex) => currentIndex !== index));
  }

  function moveImage(index: number, direction: -1 | 1) {
    setImages((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;
      const copy = [...current];
      [copy[index], copy[nextIndex]] = [copy[nextIndex], copy[index]];
      return copy;
    });
  }

  function makeMain(index: number) {
    setImages((current) => {
      if (index === 0) return current;
      const copy = [...current];
      const [selected] = copy.splice(index, 1);
      return selected ? [selected, ...copy] : current;
    });
  }

  return (
    <div className="grid gap-4 rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
      <input id="heroImage" name="heroImage" type="hidden" value={heroImage} readOnly />
      <textarea id="galleryImages" name="galleryImages" value={galleryImages.join('\n')} readOnly hidden />

      <div>
        <p className="font-serif text-2xl font-bold text-ink">Product images</p>
        <p className="mt-2 text-sm leading-6 text-ink/65">
          Upload product photos, set the main image, and arrange the gallery in the order customers should see it.
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
        <label className="grid gap-2 rounded-lg border border-ink/10 bg-mint p-3 text-sm font-semibold text-ink">
          Upload images
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            disabled={uploading}
            onChange={(event) => void uploadFiles(event.target.files)}
            className="text-sm font-normal"
          />
        </label>

        <div className="grid gap-2 rounded-lg border border-ink/10 bg-cream p-3">
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Add image URL
            <input
              type="url"
              value={manualUrl}
              placeholder="https://..."
              onChange={(event) => setManualUrl(event.target.value)}
              className="min-h-11 rounded-lg border border-ink/15 bg-white px-3 text-base font-normal outline-none focus:border-moss"
            />
          </label>
          <button
            type="button"
            onClick={addManualUrl}
            className="min-h-10 rounded-full bg-forest px-4 text-sm font-semibold text-white"
          >
            Add URL
          </button>
        </div>
      </div>

      {status ? <p className="rounded-lg bg-sand px-3 py-2 text-xs font-semibold text-ink/70">{status}</p> : null}

      {images.length ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {images.map((image, index) => (
            <div key={image.id} className="grid gap-3 rounded-lg border border-ink/10 bg-cream p-3">
              <div className="relative aspect-square rounded-lg bg-white">
                <Image
                  src={image.url}
                  alt={productTitle ? `${productTitle} image ${index + 1}` : `Product image ${index + 1}`}
                  width={360}
                  height={360}
                  sizes="(min-width: 1280px) 16rem, (min-width: 640px) 50vw, 100vw"
                  unoptimized={isSvg(image.url)}
                  className="h-full w-full rounded-lg object-contain"
                />
                {index === 0 ? (
                  <span className="absolute left-2 top-2 rounded-full bg-forest px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-white">
                    Main
                  </span>
                ) : null}
              </div>

              <p className="break-all text-xs text-ink/55">{image.url}</p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => makeMain(index)}
                  disabled={index === 0}
                  className="min-h-9 rounded-full border border-ink/15 bg-white px-3 text-xs font-semibold text-ink disabled:opacity-45"
                >
                  Set main
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="min-h-9 rounded-full border border-ink/15 bg-white px-3 text-xs font-semibold text-ink"
                >
                  Remove
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(index, -1)}
                  disabled={index === 0}
                  className="min-h-9 rounded-full border border-ink/15 bg-white px-3 text-xs font-semibold text-ink disabled:opacity-45"
                >
                  Move up
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(index, 1)}
                  disabled={index === images.length - 1}
                  className="min-h-9 rounded-full border border-ink/15 bg-white px-3 text-xs font-semibold text-ink disabled:opacity-45"
                >
                  Move down
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-ink/20 bg-cream p-6 text-center text-sm leading-6 text-ink/65">
          No product images yet. Upload actual item photos before publishing the product.
        </div>
      )}
    </div>
  );
}
