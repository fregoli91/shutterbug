import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartProvider } from '@/components/cart/CartProvider';
import { site } from '@/lib/seo';
import { buildOrganizationJsonLd, buildWebSiteJsonLd, jsonLdGraph } from '@/lib/seo-utils';

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `${site.name} | Tested Vintage Digital Cameras`,
    template: `%s | ${site.name}`
  },
  description: site.description,
  applicationName: site.name,
  creator: site.name,
  publisher: site.name,
  category: 'shopping',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Shutterbug',
    statusBarStyle: 'default'
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/shutterbug-icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/shutterbug-icon-512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }]
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-title': 'Shutterbug',
    'apple-mobile-web-app-status-bar-style': 'default'
  },
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.domain,
    siteName: site.name,
    type: 'website',
    images: [{ url: '/shutterbug-icon-512.png', width: 512, height: 512, alt: site.name }]
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#24543a',
  colorScheme: 'light'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = jsonLdGraph([buildOrganizationJsonLd(), buildWebSiteJsonLd()]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-cream text-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
