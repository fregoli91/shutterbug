import { permanentRedirect } from 'next/navigation';

export default function LegacyBrandIndexPage() {
  permanentRedirect('/brands');
}
