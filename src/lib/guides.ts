export type GuideSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type Guide = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  summary: string;
  image: { src: string; alt: string; width: number; height: number };
  publishedAt: string;
  updatedAt: string;
  sections: GuideSection[];
  relatedLinks: Array<{ label: string; href: string }>;
};

export const guides: Guide[] = [
  {
    slug: 'how-to-buy-a-used-camera',
    title: 'How to Buy a Used Camera',
    seoTitle: 'How to Buy a Used Camera: A Practical Checklist',
    description:
      'Learn how to evaluate a used digital or film camera, including condition, testing, batteries, storage, lenses, accessories, and parts/repair warnings.',
    summary:
      'A model name tells you what a camera was when it was new. A good used listing tells you what that exact camera is today.',
    image: {
      src: '/shutterbug-testing-process-hero.png',
      alt: 'Shutterbug mascot checking the controls and lens on a used camera',
      width: 1672,
      height: 941
    },
    publishedAt: '2026-08-10',
    updatedAt: '2026-08-10',
    sections: [
      {
        heading: 'Start with the exact item, not only the model',
        paragraphs: [
          'Two used cameras with the same model number can have very different histories. One may include a reliable battery and charger, while another has corrosion, a sticky lens, or accessories that no longer work. Look for actual-item photos and notes written for the camera being sold.',
          'A useful listing should separate confirmed functions from assumptions. Phrases such as powers on, flash fires, records to card, shutter releases, or film advance works are more meaningful than a broad claim that a camera looks good.'
        ],
        bullets: [
          'Confirm that photographs show the item you will receive.',
          'Read both cosmetic and functional condition notes.',
          'Treat untested functions as unknown, not working.',
          'Check the return policy before checkout.'
        ]
      },
      {
        heading: 'Check power, storage, and consumables',
        paragraphs: [
          'Older digital cameras may use proprietary batteries, uncommon chargers, Memory Stick, xD Picture Card, CompactFlash, or limited-capacity SD cards. A low-priced camera can become inconvenient if the correct charger or media is difficult to source.',
          'Film cameras introduce different requirements. Confirm the film format, battery type, and whether the meter or shutter depends on power. Instant cameras require a specific film family, and those formats are not interchangeable.'
        ],
        bullets: [
          'Battery model and whether it holds a usable charge',
          'Charger, power cable, or dock included',
          'Memory-card or film format',
          'Any required cable, adapter, ink, toner, or other consumable'
        ]
      },
      {
        heading: 'Read the testing checklist by camera type',
        paragraphs: [
          'A compact digital camera can be checked for power, lens extension, zoom, flash, controls, display, storage, and photo capture. A DSLR or mirrorless body adds sensor, autofocus, viewfinder, port, shutter, and lens-mount considerations.',
          'Film-camera testing varies more. Relevant checks can include shutter speeds, film advance and rewind, meter response, lens focus and aperture, flash, battery compartment, and the film door or latch. Testing without film cannot prove every part of the photographic process.'
        ]
      },
      {
        heading: 'Understand cosmetic wear and optical issues',
        paragraphs: [
          'Normal scratches, finish wear, and small marks may be acceptable on a camera that works well. Damage around the battery door, lens barrel, card slot, hinges, or controls deserves closer attention because it can affect everyday use.',
          'For lenses, distinguish ordinary internal dust from haze, fungus, separation, deep scratches, oil, or mechanical damage. The mount must also match your camera, and an adapter does not guarantee every autofocus or metering feature.'
        ]
      },
      {
        heading: 'Know when parts/repair is the right choice',
        paragraphs: [
          'Parts/repair items are projects, donors, display pieces, or restoration candidates. They should not be treated like ready-to-shoot inventory. A clear listing identifies what was checked, what was not checked, what is missing, and the visible issues.',
          'Choose a tested camera when you need dependable everyday use. Choose parts/repair only when you are comfortable with additional unknown faults and the possibility that repair may not be economical.'
        ]
      }
    ],
    relatedLinks: [
      { label: 'Shop used cameras', href: '/shop' },
      { label: 'Vintage cameras', href: '/categories/vintage-cameras' },
      { label: 'Testing process', href: '/testing-process' },
      { label: 'Parts and repair cameras', href: '/categories/parts-repair' }
    ]
  },
  {
    slug: 'what-is-a-ccd-camera',
    title: 'What Is a CCD Camera?',
    seoTitle: 'What Is a CCD Camera? A Used-Camera Buyer Guide',
    description:
      'Understand what CCD means, why older digital cameras are popular, what the sensor does not guarantee, and what to check before buying one.',
    summary:
      'CCD describes an image-sensor technology, not a single visual recipe. The camera around the sensor still matters.',
    image: {
      src: '/shutterbug-vintage-digital-cameras-page.png',
      alt: 'A collection of older compact digital cameras with memory cards and accessories',
      width: 1448,
      height: 1086
    },
    publishedAt: '2026-08-10',
    updatedAt: '2026-08-10',
    sections: [
      {
        heading: 'CCD is a type of image sensor',
        paragraphs: [
          'CCD stands for charge-coupled device. It is one technology used to turn light into the electronic signal that becomes a digital photograph. Many compact cameras from the 1990s and 2000s used CCD sensors, although the exact technology varies by model and generation.',
          'CMOS sensors eventually became dominant because they can offer advantages in speed, power use, integration, and manufacturing. That history does not mean every CCD camera looks alike or that one sensor technology is automatically better for every photograph.'
        ]
      },
      {
        heading: 'Why older digital cameras are popular again',
        paragraphs: [
          'People often seek older compact cameras for direct flash, small files, simple controls, pocketable bodies, and a break from computational phone photography. The results come from a combination of sensor, lens, image processing, exposure, flash, white balance, and the way the photograph is viewed or edited.',
          'The phrase CCD look can be useful as cultural shorthand, but it should not replace model research or sample images. Some popular cameras use CMOS sensors, and two CCD cameras can render color and noise very differently.'
        ],
        bullets: [
          'Compact size and built-in lenses',
          'Direct-flash snapshot style',
          'Simple operation and lower-resolution files',
          'Distinct model-specific processing and color'
        ]
      },
      {
        heading: 'How to confirm a camera sensor type',
        paragraphs: [
          'Use the manufacturer specifications or a reliable manual for the exact model. Marketplace titles and social posts sometimes call any older digital camera a CCD camera, even when the model uses a different sensor.',
          'Shutterbug avoids using sensor type as a promise about the final aesthetic. Product listings focus first on model identity, actual condition, tested functions, and the accessories needed to use the camera.'
        ]
      },
      {
        heading: 'What to check before buying',
        paragraphs: [
          'Older cameras may have lens errors, weak batteries, dim screens, failing card readers, stuck controls, corrosion, or proprietary accessories. A useful test covers power, lens movement, zoom, flash, controls, display, storage, and image capture when possible.',
          'Check whether the camera uses SD, xD Picture Card, Memory Stick, CompactFlash, or built-in memory. Confirm the battery and charger model, and remember that an old battery may work while still holding less charge than it did when new.'
        ]
      },
      {
        heading: 'Choose the experience you want',
        paragraphs: [
          'If you want a pocket camera for casual flash photographs, controls and portability may matter more than sensor terminology. If you want manual exposure, RAW files, or interchangeable lenses, a different category may suit you better.',
          'Buy an older digital camera because you enjoy the camera itself and its results, not because a single component is guaranteed to reproduce every image you have seen online.'
        ]
      }
    ],
    relatedLinks: [
      { label: 'Shop CCD digital cameras', href: '/categories/ccd-digital-cameras' },
      { label: 'Vintage digital cameras', href: '/categories/vintage-digital-cameras' },
      { label: 'Compact digital cameras', href: '/categories/compact-digital-cameras' },
      { label: 'How Shutterbug tests cameras', href: '/testing-process' }
    ]
  },
  {
    slug: '35mm-film-camera-buying-guide',
    title: '35mm Film Camera Buying Guide',
    seoTitle: '35mm Film Camera Buying Guide for Used Cameras',
    description:
      'Compare used 35mm point-and-shoot, SLR, and rangefinder cameras and learn what to check for shutters, meters, lenses, seals, batteries, and film transport.',
    summary:
      'The best first 35mm camera is the one whose controls, condition, and ongoing costs fit the way you want to shoot.',
    image: {
      src: '/shutterbug-film-cameras-page.png',
      alt: 'Used 35mm film cameras, film rolls, lenses, and accessories arranged for inspection',
      width: 1448,
      height: 1086
    },
    publishedAt: '2026-08-10',
    updatedAt: '2026-08-10',
    sections: [
      {
        heading: 'Choose a camera style',
        paragraphs: [
          'A 35mm point-and-shoot handles most exposure and focusing decisions for you. An SLR shows the scene through the taking lens and can support interchangeable lenses. A rangefinder uses a separate viewing and focusing system and often appeals to photographers who prefer a compact, quiet experience.',
          'There is no universally best style. A simple automatic compact may make more photographs because it is always with you, while a manual SLR may be better for learning exposure and changing lenses.'
        ],
        bullets: [
          'Point-and-shoot: compact and convenient',
          'SLR: direct lens viewing and broad control',
          'Rangefinder: separate finder and distinctive handling',
          'Reusable camera: lower risk than an unknown decorative collectible'
        ]
      },
      {
        heading: 'Understand mechanical and electronic dependence',
        paragraphs: [
          'Some cameras can fire their shutter without a battery, while others need power for nearly every function. A battery-independent mechanical shutter can be reassuring, but it does not eliminate the need to inspect speeds, curtains, advance, rewind, and seals.',
          'Electronic cameras can offer accurate metering, autofocus, and automation. Confirm the battery type is available and inspect the compartment for corrosion or damaged contacts.'
        ]
      },
      {
        heading: 'Read film transport and shutter notes',
        paragraphs: [
          'A camera must load, advance, expose, and rewind film reliably. Dry testing can confirm many controls, but it does not prove frame spacing, light tightness, or image results under every condition.',
          'Shutter observations should identify whether it releases and whether speeds appear to change. Without specialized test equipment, a seller should not claim precise calibration based only on listening to the shutter.'
        ],
        bullets: [
          'Film door and latch close securely',
          'Advance and rewind mechanisms move',
          'Frame counter responds',
          'Shutter releases and speeds visibly or audibly change',
          'Light seals and mirror bumper are described when visible'
        ]
      },
      {
        heading: 'Inspect the lens, finder, and meter',
        paragraphs: [
          'For an included lens, review focus movement, aperture operation, mount condition, glass, and visible dust, haze, fungus, separation, scratches, or oil. A body-only camera needs a compatible lens before it can make photographs.',
          'Viewfinders often show dust without affecting images, but heavy haze, damaged prisms, or misalignment can make composition difficult. Meter response is useful, yet older meters may still be inaccurate and should not be represented as calibrated without proper testing.'
        ]
      },
      {
        heading: 'Budget beyond the camera',
        paragraphs: [
          'Film, processing, scans, batteries, a lens, a strap, and possible service all contribute to the real cost. A more complete tested kit can be a better value than a cheaper body with missing or uncertain essentials.',
          'Start with one camera and one dependable lens. Learn the controls, keep notes on exposures, and use the results to decide what additional gear would genuinely help.'
        ]
      }
    ],
    relatedLinks: [
      { label: 'Shop 35mm film cameras', href: '/categories/35mm-film-cameras' },
      { label: 'All film cameras', href: '/categories/film-cameras' },
      { label: 'Used camera lenses', href: '/categories/lenses' },
      { label: 'How to buy a used camera', href: '/guides/how-to-buy-a-used-camera' }
    ]
  }
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
