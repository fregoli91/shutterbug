import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Shutterbug Camera Shop',
    short_name: 'Shutterbug',
    description:
      'Shop tested vintage digital cameras, film cameras, and used camera gear with clear condition notes.',
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#fde9cd',
    theme_color: '#24543a',
    categories: ['shopping', 'photo', 'lifestyle'],
    icons: [
      {
        src: '/shutterbug-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/shutterbug-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/shutterbug-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ]
  };
}
