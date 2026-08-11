export type BlogTextSegment = { text: string; href?: string };

export type BlogSection = {
  heading: string;
  paragraphs: BlogTextSegment[][];
  callout?: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  summary: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  featured: boolean;
  image: { src: string; alt: string; width: number; height: number };
  introduction: BlogTextSegment[][];
  sections: BlogSection[];
  relatedLinks: Array<{ label: string; href: string }>;
};

const text = (value: string): BlogTextSegment[] => [{ text: value }];

export const blogCategories = [
  'Shutterbug Journal',
  'Camera Guides',
  'Vintage Digital',
  'Film Photography',
  'Camera History',
  'Behind the Scenes'
];

export const blogPosts: BlogPost[] = [
  {
    slug: 'building-shutterbug-camera-shop',
    title: "Building Shutterbug Camera Shop: Cameras, Clay Art, and What's Ahead",
    seoTitle: "Building Shutterbug Camera Shop | Our Story & What's Next",
    description:
      'The story behind Shutterbug Camera Shop, its clay-art world, our experience with used cameras, and what we are building next.',
    summary:
      'A first look at the years of camera experience, real inventory, and handmade clay world coming together behind Shutterbug Camera Shop.',
    author: 'Shutterbug Camera Shop',
    category: 'Shutterbug Journal',
    tags: ['Behind the Scenes', 'Our Story'],
    publishedAt: '2026-08-11',
    updatedAt: '2026-08-11',
    readingTime: '7 min read',
    featured: true,
    image: {
      src: '/blog/building-shutterbug-camera-shop.webp',
      alt: 'A clay-art camera shop filled with vintage cameras and Shutterbug characters browsing the shelves',
      width: 1448,
      height: 1086
    },
    introduction: [
      text(
        'Shutterbug Camera Shop began with something much less polished than a finished storefront: years of buying, selling, packing, testing, and learning from used cameras and other electronics. The business started in 2012, and cameras gradually became one of the most interesting and important parts of what we handled.'
      ),
      [
        {
          text: 'We have sold cameras through established marketplaces, where every box, customer question, and unexpected condition issue taught us something useful. This standalone website is the next step: a dedicated place where used photography equipment can be presented with more care, context, and personality. You can read a little more on our '
        },
        { text: 'About Shutterbug', href: '/about' },
        { text: ' page.' }
      ]
    ],
    sections: [
      {
        heading: 'A store shaped by the cameras that passed through our hands',
        paragraphs: [
          text(
            'Used cameras are never just model numbers. Two examples of the same camera can arrive with completely different stories: one carefully stored with its charger and manual, another carried everywhere until the finish softened at the corners. Learning to recognize those differences is part of what made cameras such a lasting focus for us.'
          ),
          [
            { text: 'Shutterbug is being built around used, vintage, film, and digital photography equipment. That includes pocketable ' },
            { text: 'vintage digital cameras', href: '/categories/vintage-digital-cameras' },
            { text: ', compact point-and-shoot cameras, ' },
            { text: 'film cameras', href: '/categories/film-cameras' },
            { text: ', interchangeable lenses, and the chargers, batteries, cases, and accessories that make older gear usable again.' }
          ],
          text(
            'Some cameras are ready for another family trip or everyday carry. Others are better suited to a collector, a repair bench, or someone who simply enjoys the tactile pleasure of an older design. The point is not to pretend every used item is perfect. It is to describe the item clearly enough that the right person can recognize it.'
          )
        ]
      },
      {
        heading: 'Why older cameras remain interesting',
        paragraphs: [
          text(
            'Older cameras often ask for a little more participation than a phone. You might wait for a compact lens to extend, choose whether to use direct flash, load a roll of film, or work within the limits of a small memory card. Those limits can become part of the fun. They make the act of taking a photograph feel deliberate without making it precious.'
          ),
          [
            { text: 'Different camera families also have distinct personalities. ' },
            { text: 'Canon PowerShot cameras', href: '/categories/canon-powershot-cameras' },
            { text: ' range from tiny everyday compacts to feature-rich bridge models. Olympus Stylus cameras are remembered for compact designs and, in some cases, weather-resistant bodies. ' },
            { text: 'Sony Cyber-shot cameras', href: '/categories/sony-cyber-shot-cameras' },
            { text: ' and ' },
            { text: 'Nikon Coolpix cameras', href: '/categories/nikon-coolpix-cameras' },
            { text: ' cover years of changing digital-camera ideas, while ' },
            { text: 'Polaroid and instant cameras', href: '/categories/polaroid-cameras' },
            { text: ' make the photograph itself part of the experience.' }
          ],
          [
            { text: 'There is no single best vintage camera. The interesting part is finding one whose controls, results, condition, and required accessories fit the way you want to shoot. Our growing collection of ' },
            { text: 'camera guides', href: '/guides' },
            { text: ' is meant to make that search less mysterious.' }
          ]
        ]
      },
      {
        heading: 'Why Shutterbug lives in a clay world',
        paragraphs: [
          text(
            'Most used-electronics stores are visually practical, and understandably so. We wanted Shutterbug to be useful without feeling anonymous. The handcrafted-looking clay scenes give the shop a recognizable world: warm shelves, friendly characters, small cameras, and the sense that someone has taken time with the details.'
          ),
          text(
            'The clay artwork is not meant to make the store less serious. It is meant to make the experience more human. Used cameras already carry history and personality, so a warm visual identity felt more honest to us than a generic wall of gray product tiles.'
          ),
          text(
            'You will see the clay style around category pages, testing information, customer support, and stories like this one. It is the visual language that surrounds the inventory and ties the different parts of Shutterbug together.'
          )
        ],
        callout: "The clay cameras are part of Shutterbug's art direction. The products for sale are real."
      },
      {
        heading: 'Real products need real photographs and honest notes',
        paragraphs: [
          text(
            'The clay world never replaces accurate product information. Actual listings and product-detail pages will use photographs of the real camera, lens, printer, accessory, or other item being sold. When you are deciding whether to buy a used item, you should be able to inspect that exact item rather than a decorative stand-in.'
          ),
          text(
            'Listings are being designed to show condition information, included accessories, known flaws, and testing details when available. If a charger is missing, a battery is weak, a screen is scratched, or a function was not tested, that information belongs close to the purchase decision. Parts and repair items should be unmistakably different from ready-to-use inventory.'
          ),
          [
            { text: 'The goal is a simple relationship: the artwork gives Shutterbug its personality, while the ' },
            { text: 'shop listings', href: '/shop' },
            { text: ' give customers the evidence they need to understand what they are buying.' }
          ]
        ]
      },
      {
        heading: 'An early look at a shop still being built',
        paragraphs: [
          text(
            'Shutterbug Camera Shop has not reached its complete public launch yet. The site is active and getting close, but this is still an early look at the storefront while we put the working pieces in place.'
          ),
          text(
            'We are adding inventory, refining categories, building camera brand pages, improving search and shopping, expanding testing and condition information, strengthening search visibility, and adding editorial work like this journal. Some shelves will look fuller than others while that work continues.'
          ),
          text(
            'That unfinished stage is worth sharing. A camera shop becomes useful through accumulated details: another well-described item, a clearer condition note, a better guide, and a more thoughtful answer to a customer question. Readers who arrive now get to see those pieces come together.'
          )
        ]
      },
      {
        heading: "What's ahead",
        paragraphs: [
          text(
            'The immediate work is practical: real inventory, dependable product pages, clearer testing notes, and a shopping experience that feels comfortable on a phone. Beyond that, the Shutterbug Journal will give us room to explore camera histories, model guides, collections, film photography, vintage digital photography, and the discoveries that happen when another box of used gear reaches the worktable.'
          ),
          [
            { text: 'We also want Shutterbug to be a useful place for people who have gear to move along. The ' },
            { text: 'Sell Your Camera', href: '/sell-your-camera' },
            { text: ' area is part of that direction, helping good equipment find its next owner instead of being forgotten in a closet.' }
          ],
          [
            { text: "We're building Shutterbug Camera Shop one shelf at a time. Check back as new cameras, collections, guides, and stories are added, or start by browsing our " },
            { text: 'camera brands', href: '/brands' },
            { text: ' and the inventory already taking shape.' }
          ]
        ]
      }
    ],
    relatedLinks: [
      { label: 'Shop Cameras', href: '/shop' },
      { label: 'Vintage Digital Cameras', href: '/categories/vintage-digital-cameras' },
      { label: 'Film Cameras', href: '/categories/film-cameras' },
      { label: 'Camera Brands', href: '/brands' },
      { label: 'Sell Your Camera', href: '/sell-your-camera' },
      { label: 'About Shutterbug', href: '/about' }
    ]
  }
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function formatBlogDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(value + 'T00:00:00Z'));
}
