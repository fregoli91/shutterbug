import { permanentRedirect } from 'next/navigation';

type Props = { params: Promise<{ slug: string }> };

export default async function LegacyBrandPage({ params }: Props) {
  const { slug } = await params;
  permanentRedirect(`/brands/${slug}`);
}
