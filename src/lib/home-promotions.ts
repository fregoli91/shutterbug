export type HomePromotion = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  desktopImage: string;
  mobileImage?: string;
  href: string;
  ctaLabel: string;
  alt: string;
  objectPosition?: string;
  embeddedCopy?: boolean;
  startsAt?: string;
  endsAt?: string;
};

export const homePromotions: HomePromotion[] = [
  {
    id: 'canon-powershot',
    eyebrow: 'Canon PowerShot',
    title: 'The digicams everyone remembers.',
    description: 'Explore tested Canon compacts with real photos and clear condition notes.',
    desktopImage: '/carousel-canon.png',
    href: '/categories/canon-powershot-cameras',
    ctaLabel: 'Shop Canon',
    alt: 'A Shutterbug Canon PowerShot display featuring compact Canon digital cameras',
    objectPosition: '72% center',
    embeddedCopy: true
  },
  {
    id: 'olympus-stylus',
    eyebrow: 'Olympus favorites',
    title: 'Tiny cameras. Big nostalgia.',
    description: 'Browse pocketable Olympus cameras from the Shutterbug shelf.',
    desktopImage: '/carousel-olympus.png',
    href: '/brands/olympus',
    ctaLabel: 'Shop Olympus',
    alt: 'Olympus Stylus compact cameras arranged in a warm Shutterbug display',
    objectPosition: '72% center',
    embeddedCopy: true
  },
  {
    id: 'nikon-cameras',
    eyebrow: 'Nikon cameras',
    title: 'Legendary performance. Timeless shots.',
    description: 'Explore Nikon digital and film cameras for every kind of photographer.',
    desktopImage: '/carousel-nikon.png',
    href: '/brands/nikon',
    ctaLabel: 'Shop Nikon',
    alt: 'Nikon digital and film cameras displayed in the Shutterbug clay world',
    objectPosition: '72% center',
    embeddedCopy: true
  },
  {
    id: 'sell-your-camera',
    eyebrow: 'Sell Your Camera',
    title: 'Give unused gear its next chapter.',
    description: 'Send us the details for a straightforward camera buyout or trade-in review.',
    desktopImage: '/carousel-trade-in.png',
    href: '/sell-your-camera',
    ctaLabel: 'Start a quote',
    alt: 'Shutterbug camera trade-in program with cameras ready for a new owner',
    objectPosition: '72% center',
    embeddedCopy: true
  },
  {
    id: 'summer-trade-in-bonus',
    eyebrow: 'Summer trade-in bonus',
    title: 'Get 10% extra store credit.',
    description: 'Trade in eligible camera gear this summer and receive an extra store-credit bonus.',
    desktopImage: '/shutterbug-summer-trade-in-bonus.png',
    href: '/sell-your-camera',
    ctaLabel: 'Start your trade-in',
    alt: 'Shutterbug summer trade-in bonus offering 10 percent extra store credit',
    embeddedCopy: true
  }
];

export function getActiveHomePromotions(now = new Date()) {
  const currentTime = now.getTime();

  return homePromotions.filter((promotion) => {
    const startsAt = promotion.startsAt ? new Date(promotion.startsAt).getTime() : null;
    const endsAt = promotion.endsAt ? new Date(promotion.endsAt).getTime() : null;

    return (startsAt === null || startsAt <= currentTime) && (endsAt === null || endsAt > currentTime);
  });
}
