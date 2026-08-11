export type SeoLink = { label: string; href: string };

export type CategorySeoProfile = {
  title: string;
  heading: string;
  description: string;
  intro: string;
  supportingHeading: string;
  supportingCopy: string[];
  buyerTips: string[];
  links: SeoLink[];
};

export type BrandSeoProfile = {
  title: string;
  heading: string;
  description: string;
  intro: string;
  knownFor: string[];
  buyingAdvice: string[];
  links: SeoLink[];
  heroImage?: { src: string; alt: string; width: number; height: number };
};

const categoryProfiles: Record<string, CategorySeoProfile> = {
  'vintage-cameras': {
    title: 'Used Vintage Cameras for Sale',
    heading: 'Vintage cameras, tested for their next story.',
    description: 'Shop used vintage digital and film cameras with honest testing details, actual-item photos, condition notes, and clearly listed accessories.',
    intro: 'Shutterbug brings vintage digital character and classic film photography together in one carefully described collection. Every listing explains what was tested, what is included, and the flaws we found.',
    supportingHeading: 'Choosing a vintage camera',
    supportingCopy: ['Vintage digital cameras offer compact size and a distinctive early-digital look, while film cameras deliver a hands-on shooting process. The right choice depends on the experience you want as much as the specifications.', 'Because older cameras vary by individual item, the listing matters more than a generic model description. Check the battery, charger, storage or film format, lens condition, and disclosed functional notes before ordering.'],
    buyerTips: ['Confirm the battery, charger, film, or memory-card format.', 'Read exact-item cosmetic and functional notes.', 'Check what is included before comparing prices.', 'Choose parts/repair only when you want a project item.'],
    links: [
      { label: 'Vintage digital cameras', href: '/categories/vintage-digital-cameras' },
      { label: 'Film cameras', href: '/categories/film-cameras' },
      { label: 'Point-and-shoot cameras', href: '/categories/point-and-shoot-cameras' },
      { label: 'Used-camera buying guide', href: '/guides/how-to-buy-a-used-camera' }
    ]
  },
  'vintage-digital-cameras': {
    title: 'Tested Vintage Digital Cameras for Sale',
    heading: 'Tested vintage digital cameras.',
    description: 'Shop tested vintage digital cameras from Canon, Olympus, Nikon, Sony, Kodak, Fujifilm, Panasonic, and Casio with honest condition notes.',
    intro: 'Browse compact cameras from the early digital era with clear power, lens, flash, screen, storage, and battery notes. Shutterbug listings focus on the exact camera you will receive.',
    supportingHeading: 'What to check on an older digital camera',
    supportingCopy: ['Battery type and storage format can matter as much as megapixels. Some cameras use proprietary batteries, xD Picture Card, Memory Stick, or older SD capacities, so every useful listing should make compatibility clear.', 'A tested vintage digital camera should explain lens movement, flash, controls, display, card reading, and sample-photo results when available. Unknown functions should remain clearly identified as unknown.'],
    buyerTips: ['Confirm the battery and charger are included.', 'Check compatible memory-card formats.', 'Read flash, zoom, screen, and sample-photo notes.', 'Expect normal cosmetic wear on genuine used examples.'],
    links: [
      { label: 'CCD digital cameras', href: '/categories/ccd-digital-cameras' },
      { label: 'Canon PowerShot', href: '/categories/canon-powershot-cameras' },
      { label: 'Olympus digital cameras', href: '/categories/olympus-digital-cameras' },
      { label: 'What is a CCD camera?', href: '/guides/what-is-a-ccd-camera' }
    ]
  },
  'digital-cameras': {
    title: 'Used Digital Cameras for Sale',
    heading: 'Used digital cameras.',
    description: 'Shop used compact, DSLR, mirrorless, bridge, and vintage digital cameras with clear testing, condition, battery, storage, and accessory notes.',
    intro: 'Find used digital cameras across pocketable point-and-shoot models, interchangeable-lens systems, and collectible early-digital designs. Each Shutterbug listing separates confirmed functions from anything untested.',
    supportingHeading: 'Match the camera to how you shoot',
    supportingCopy: ['Compact cameras prioritize portability, DSLRs offer optical viewfinders and broad lens choices, and mirrorless systems balance interchangeable lenses with a smaller body. Older digital cameras may trade speed for character and simplicity.', 'Review the exact listing for battery health, charger, memory format, lens and sensor notes, and accessories. Those details determine whether a used camera is ready to enjoy immediately.'],
    buyerTips: ['Choose compact for easy everyday carry.', 'Check lens mount before buying an interchangeable-lens camera.', 'Verify battery, charger, and storage compatibility.', 'Use the testing notes to compare individual items.'],
    links: [
      { label: 'Compact digital cameras', href: '/categories/compact-digital-cameras' },
      { label: 'DSLR cameras', href: '/categories/dslr-cameras' },
      { label: 'Mirrorless cameras', href: '/categories/mirrorless-cameras' },
      { label: 'Vintage digital cameras', href: '/categories/vintage-digital-cameras' }
    ]
  },
  'compact-digital-cameras': {
    title: 'Used Compact Digital Cameras',
    heading: 'Compact digital cameras for everyday carry.',
    description: 'Shop used compact digital cameras with tested zoom, flash, screen, battery, storage, and photo-capture notes from Shutterbug Camera Shop.',
    intro: 'Compact digital cameras keep photography simple: a small body, a built-in lens, and controls that are easy to carry anywhere. Our listings explain the exact camera condition and the accessories needed to start shooting.',
    supportingHeading: 'Why compact cameras remain popular',
    supportingCopy: ['Pocketable cameras encourage spontaneous photos without the size of an interchangeable-lens kit. Earlier models are also sought for direct-flash snapshots and the visual character associated with older sensors.', 'Model names alone do not reveal whether a used camera includes a working battery, charger, or compatible memory card. Shutterbug puts those details beside the product.'],
    buyerTips: ['Check zoom and lens-extension notes.', 'Confirm flash and screen operation.', 'Look for a charger and compatible storage.', 'Review dimensions when pocketability matters.'],
    links: [
      { label: 'Point-and-shoot cameras', href: '/categories/point-and-shoot-cameras' },
      { label: 'CCD digital cameras', href: '/categories/ccd-digital-cameras' },
      { label: 'Sony Cyber-shot', href: '/categories/sony-cyber-shot-cameras' },
      { label: 'Nikon Coolpix', href: '/categories/nikon-coolpix-cameras' }
    ]
  },
  'point-and-shoot-cameras': {
    title: 'Used Point-and-Shoot Cameras',
    heading: 'Point-and-shoot cameras made simple.',
    description: 'Browse used digital and film point-and-shoot cameras with exact condition, testing, battery, film or storage, and included-accessory details.',
    intro: 'Point-and-shoot cameras are built for quick, approachable photography. Shop compact digital and film options with clear notes about power, flash, lens movement, loading systems, and known issues.',
    supportingHeading: 'Digital or film point-and-shoot?',
    supportingCopy: ['Digital models offer immediate results and reusable storage, while film models provide a slower analog process. Both are compact, but their batteries, media, and testing requirements differ.', 'Use each product page to confirm what has been tested and what you still need, including memory cards, chargers, film, or specialty batteries.'],
    buyerTips: ['Choose digital for immediate photos.', 'Choose film for an analog shooting experience.', 'Verify flash and lens-cover operation.', 'Check the exact battery and media requirements.'],
    links: [
      { label: 'Vintage digital cameras', href: '/categories/vintage-digital-cameras' },
      { label: '35mm film cameras', href: '/categories/35mm-film-cameras' },
      { label: 'Canon PowerShot', href: '/categories/canon-powershot-cameras' },
      { label: 'Olympus cameras', href: '/brands/olympus' }
    ]
  },
  'ccd-digital-cameras': {
    title: 'Used CCD Digital Cameras',
    heading: 'CCD digital cameras.',
    description: 'Shop used CCD digital cameras with honest testing, battery, charger, memory-card, flash, screen, and exact-item condition notes.',
    intro: 'CCD camera is a popular shorthand for older digital cameras associated with direct-flash snapshots and early-digital color. Sensor type is only one part of the result, so condition and complete testing still matter.',
    supportingHeading: 'Buy the camera, not the trend',
    supportingCopy: ['Different models use different sensors, image processing, lenses, and flash behavior. A trustworthy listing should avoid promising a particular aesthetic and instead identify the model and show the actual item.', 'For day-to-day use, prioritize working controls, a clean lens, reliable storage, and an available battery solution.'],
    buyerTips: ['Do not assume every old digital camera uses a CCD sensor.', 'Check sample-photo notes when available.', 'Confirm storage and battery compatibility.', 'Read our CCD guide before comparing models.'],
    links: [
      { label: 'What is a CCD camera?', href: '/guides/what-is-a-ccd-camera' },
      { label: 'Vintage digital cameras', href: '/categories/vintage-digital-cameras' },
      { label: 'Compact digital cameras', href: '/categories/compact-digital-cameras' },
      { label: 'Kodak EasyShare', href: '/categories/kodak-easyshare-cameras' }
    ]
  },
  'film-cameras': {
    title: 'Used Film Cameras for Sale',
    heading: 'Used film cameras.',
    description: 'Shop used 35mm, point-and-shoot, SLR, rangefinder, instant, and medium-format film cameras with clear testing and condition notes.',
    intro: 'Explore film cameras with model-specific notes about shutters, advance and rewind, meters, lenses, flash, battery compartments, and door latches when applicable.',
    supportingHeading: 'Film camera testing varies by design',
    supportingCopy: ['A mechanical SLR, electronic point-and-shoot, and instant camera do not share the same checklist. Shutterbug describes the functions that apply to each item and avoids calling unverified behavior tested.', 'A camera may still require film, batteries, a lens, or light-seal service. Read the included-items and flaws sections before checkout.'],
    buyerTips: ['Confirm the film format.', 'Check whether a lens is included.', 'Review shutter, advance, rewind, and meter notes.', 'Understand whether testing included film.'],
    links: [
      { label: '35mm film cameras', href: '/categories/35mm-film-cameras' },
      { label: 'Instant cameras', href: '/categories/instant-cameras' },
      { label: 'Film camera buying guide', href: '/guides/35mm-film-camera-buying-guide' },
      { label: 'Used camera lenses', href: '/categories/lenses' }
    ]
  },
  '35mm-film-cameras': {
    title: 'Used 35mm Film Cameras',
    heading: 'Used 35mm film cameras.',
    description: 'Shop used 35mm point-and-shoot, SLR, and rangefinder cameras with clear shutter, advance, rewind, meter, lens, and condition notes.',
    intro: '35mm remains the most approachable film format, with broad film availability and camera choices ranging from simple compacts to interchangeable-lens SLRs.',
    supportingHeading: 'Starting with 35mm',
    supportingCopy: ['Point-and-shoot models offer convenience, while SLRs provide manual control and lens flexibility. Electronic models often need a specific battery, and older cameras may have light-seal or meter limitations.', 'Use our listing notes and buying guide to understand what was checked and what accessories or service may still be required.'],
    buyerTips: ['Confirm the shutter and film transport were checked.', 'Check battery requirements for meters and electronic shutters.', 'Inspect lens and viewfinder notes.', 'Plan for film and processing costs.'],
    links: [
      { label: '35mm buying guide', href: '/guides/35mm-film-camera-buying-guide' },
      { label: 'Film cameras', href: '/categories/film-cameras' },
      { label: 'Point-and-shoot cameras', href: '/categories/point-and-shoot-cameras' },
      { label: 'Lenses', href: '/categories/lenses' }
    ]
  },
  'instant-cameras': {
    title: 'Used Instant Cameras',
    heading: 'Instant cameras and analog fun.',
    description: 'Shop used instant cameras from Polaroid, Fujifilm, Kodak, and others with clear film compatibility, testing, condition, and included-item notes.',
    intro: 'Instant cameras produce a physical print moments after the shutter is pressed. Listings identify the film system, power requirements, cosmetic wear, and tested functions when possible.',
    supportingHeading: 'Check film compatibility first',
    supportingCopy: ['Polaroid and Instax cameras use distinct film formats that are not interchangeable. Older instant cameras may use discontinued film, so model-specific compatibility should be confirmed before purchase.', 'Testing may be limited when fresh film is unavailable. Any such limitation belongs plainly in the listing.'],
    buyerTips: ['Confirm the exact film format.', 'Check whether batteries are required.', 'Read roller and ejection notes.', 'Treat untested vintage models as projects unless stated otherwise.'],
    links: [
      { label: 'Polaroid cameras', href: '/categories/polaroid-cameras' },
      { label: 'Film cameras', href: '/categories/film-cameras' },
      { label: 'Fujifilm cameras', href: '/brands/fujifilm' },
      { label: 'Used-camera buying guide', href: '/guides/how-to-buy-a-used-camera' }
    ]
  },
  'dslr-cameras': {
    title: 'Used DSLR Cameras',
    heading: 'Used DSLR cameras and kits.',
    description: 'Shop used DSLR cameras with shutter, sensor, autofocus, controls, battery, charger, lens-mount, and cosmetic condition notes.',
    intro: 'DSLR cameras pair an optical viewfinder with interchangeable lenses and mature systems from Canon, Nikon, Pentax, Sony, and others. Listings clarify whether you are buying a body or a complete kit.',
    supportingHeading: 'Body, lens, and shutter considerations',
    supportingCopy: ['Lens mount compatibility is essential, and not every older lens supports every autofocus or metering feature. Body condition should include sensor, controls, card slot, flash, and shutter observations when available.', 'Check the included list for a battery, charger, body cap, lens, strap, and memory card rather than assuming accessories are present.'],
    buyerTips: ['Confirm the lens mount and whether a lens is included.', 'Review shutter and sensor notes.', 'Check battery, charger, and card type.', 'Compare body-only and kit listings carefully.'],
    links: [
      { label: 'Canon cameras', href: '/brands/canon' },
      { label: 'Nikon cameras', href: '/brands/nikon' },
      { label: 'Pentax cameras', href: '/brands/pentax' },
      { label: 'Used lenses', href: '/categories/lenses' }
    ]
  },
  'mirrorless-cameras': {
    title: 'Used Mirrorless Cameras',
    heading: 'Used mirrorless cameras.',
    description: 'Shop used mirrorless cameras and kits with lens-mount, sensor, autofocus, battery, charger, screen, viewfinder, and exact-item condition notes.',
    intro: 'Mirrorless systems combine interchangeable lenses with compact bodies and electronic viewing. Shutterbug listings make the mount, included lens, battery, charger, and tested functions clear.',
    supportingHeading: 'System compatibility matters',
    supportingCopy: ['A camera body commits you to a lens mount and accessory system. Before buying, compare mount compatibility, sensor size, viewfinder design, video needs, and available lenses.', 'Used mirrorless bodies should be evaluated as individual items, especially for screens, viewfinders, ports, controls, and battery condition.'],
    buyerTips: ['Confirm the exact lens mount.', 'Check whether the listing is body-only.', 'Review screen, EVF, autofocus, and port notes.', 'Budget for batteries and compatible lenses.'],
    links: [
      { label: 'Sony cameras', href: '/brands/sony' },
      { label: 'Fujifilm cameras', href: '/brands/fujifilm' },
      { label: 'Panasonic cameras', href: '/brands/panasonic' },
      { label: 'Used lenses', href: '/categories/lenses' }
    ]
  },
  lenses: {
    title: 'Used Camera Lenses',
    heading: 'Used camera lenses.',
    description: 'Shop used autofocus and manual-focus camera lenses with mount, optics, aperture, focus, zoom, cosmetic, and included-cap notes.',
    intro: 'Find used lenses with the mount and tested functions stated clearly. Product pages call out visible glass issues, focus and zoom behavior, aperture operation, and included caps or hoods when available.',
    supportingHeading: 'Compatibility before condition',
    supportingCopy: ['A clean lens is only useful when it fits your camera and supports the features you need. Confirm the mount, camera compatibility, autofocus expectations, and whether an adapter is required.', 'Used optics can show dust without affecting photographs, while haze, fungus, separation, scratches, or oil can be more significant. Listings should distinguish visible observations rather than collapse everything into a grade.'],
    buyerTips: ['Match the lens mount to your camera.', 'Review glass, aperture, focus, and zoom notes.', 'Check whether front and rear caps are included.', 'Ask about adapters before ordering.'],
    links: [
      { label: 'DSLR cameras', href: '/categories/dslr-cameras' },
      { label: 'Mirrorless cameras', href: '/categories/mirrorless-cameras' },
      { label: 'Lens adapters', href: '/categories/adapters-mounts' },
      { label: 'Camera accessories', href: '/categories/camera-accessories' }
    ]
  },
  'camera-accessories': {
    title: 'Used Camera Accessories',
    heading: 'Camera accessories that complete the kit.',
    description: 'Shop used camera batteries, chargers, bags, straps, cards, flashes, filters, caps, cables, and other accessories with compatibility notes.',
    intro: 'The right charger, battery, card, cable, case, or cap can make an older camera usable again. Shutterbug listings identify compatibility and included pieces whenever they can be confirmed.',
    supportingHeading: 'Small parts need exact compatibility',
    supportingCopy: ['Battery shapes, charger models, memory formats, cable connectors, filter sizes, and lens caps can look similar while remaining incompatible. Match model numbers and dimensions before ordering.', 'Used accessory listings should describe contacts, cables, compartments, wear, and testing rather than relying on generic stock photos.'],
    buyerTips: ['Match exact model numbers when possible.', 'Confirm connector, card, filter, or cap size.', 'Read the included-items list carefully.', 'Ask before buying when compatibility is uncertain.'],
    links: [
      { label: 'Batteries and chargers', href: '/categories/batteries-chargers' },
      { label: 'Memory cards', href: '/categories/memory-cards-storage' },
      { label: 'Camera bags', href: '/categories/camera-bags-cases' },
      { label: 'Flashes and lighting', href: '/categories/flashes-lighting' }
    ]
  },
  printers: {
    title: 'Used Printers | Canon, Brother, HP & Lexmark | Shutterbug Camera Shop',
    heading: 'Used printers, tested and packed with care.',
    description: 'Shop tested used Canon, Brother, HP, and Lexmark printers with clear condition, cable, ink or toner, paper-feed, and packing notes.',
    intro: 'Browse used printers with the exact model, tested functions, included cables, ink or toner status, and known issues described before checkout.',
    supportingHeading: 'What matters on a used printer',
    supportingCopy: ['A useful printer listing should identify power, connectivity, paper feed, controls, print or scan testing, and the supplies included with the exact item.', 'Ink and toner levels can change and consumables may need replacement. Shutterbug separates confirmed accessories from anything the buyer will need to provide.'],
    buyerTips: ['Confirm USB, Ethernet, or wireless connectivity.', 'Check whether power and data cables are included.', 'Read ink, toner, drum, and paper-feed notes.', 'Allow space for secure shipment and setup.'],
    links: [{ label: 'Canon printers and cameras', href: '/brands/canon' }, { label: 'HP products', href: '/brands/hp' }, { label: 'Camera accessories', href: '/categories/camera-accessories' }, { label: 'All inventory', href: '/shop' }]
  },
  'parts-repair': {
    title: 'Parts and Repair Cameras',
    heading: 'Parts and repair cameras, clearly described.',
    description: 'Shop as-is parts and repair cameras with clear checked, unchecked, included, missing, and visible-issue notes for projects and restoration.',
    intro: 'Parts and repair items are not presented as ready-to-shoot cameras. Every listing should explain what was checked, what remains unknown, what is included, and the visible issues.',
    supportingHeading: 'Know what as-is means before checkout',
    supportingCopy: ['A parts/repair camera may have partial power, missing accessories, lens or screen problems, damaged components, or functions that could not be tested.', 'These items are best for repair, restoration, display, modification, or parts harvesting. Unknown functions remain unknown instead of being treated as working.'],
    buyerTips: ['Read every functional and cosmetic note.', 'Assume no unlisted accessory is included.', 'Plan for additional faults that testing could not reveal.', 'Choose a tested listing when you need a ready-to-shoot camera.'],
    links: [{ label: 'Testing process', href: '/testing-process' }, { label: 'Used-camera buying guide', href: '/guides/how-to-buy-a-used-camera' }, { label: 'Vintage cameras', href: '/categories/vintage-cameras' }, { label: 'Contact Shutterbug', href: '/contact' }]
  }
};

const cameraFamilyProfiles: Record<string, Omit<CategorySeoProfile, 'links'> & { links?: SeoLink[] }> = {
  'canon-powershot-cameras': {
    title: 'Used Canon PowerShot Cameras', heading: 'Used Canon PowerShot cameras.', description: 'Shop used Canon PowerShot and Digital ELPH cameras with tested zoom, flash, screen, battery, charger, storage, and condition notes.', intro: 'Canon PowerShot covers pocket compacts, superzooms, and enthusiast cameras across many generations. Exact model numbers matter because batteries, chargers, and memory formats vary.', supportingHeading: 'Shopping Canon PowerShot', supportingCopy: ['Digital ELPH and PowerShot SD models are known for compact bodies, while A, G, and SX families serve different shooting needs.', 'Review the exact listing for lens movement, flash, controls, battery, charger, storage, and sample-photo notes.'], buyerTips: ['Confirm the complete model number.', 'Check battery and charger compatibility.', 'Review lens-error and flash notes.', 'Verify SD or older card support.']
  },
  'nikon-coolpix-cameras': {
    title: 'Used Nikon Coolpix Cameras', heading: 'Used Nikon Coolpix cameras.', description: 'Shop used Nikon Coolpix compact, bridge, and rugged cameras with clear battery, charger, storage, zoom, flash, screen, and condition notes.', intro: 'Nikon Coolpix spans slim pocket cameras, long-zoom bridge models, and rugged compacts. Listings identify the exact model and the accessories needed to use it.', supportingHeading: 'Shopping Nikon Coolpix', supportingCopy: ['Coolpix model families vary significantly in size, zoom range, battery, and controls.', 'Prioritize a clean lens, reliable zoom, working flash, readable screen, and a practical battery and memory-card setup.'], buyerTips: ['Match the exact Coolpix model.', 'Check zoom and lens-cover operation.', 'Confirm battery, charger, and card type.', 'Review flash and screen notes.']
  },
  'olympus-digital-cameras': {
    title: 'Used Olympus Digital Cameras', heading: 'Used Olympus digital cameras.', description: 'Shop used Olympus Stylus, mju, Tough, and compact digital cameras with testing, battery, charger, xD card, lens, flash, and condition notes.', intro: 'Olympus compact cameras range from slim Stylus and mju models to weather-ready Tough cameras. Storage and battery compatibility can be model-specific.', supportingHeading: 'Shopping Olympus compact cameras', supportingCopy: ['Many older Olympus cameras use xD Picture Card or proprietary batteries, while later models may use SD cards.', 'Check weather-seal claims carefully on used Tough cameras; age and wear mean they should not be assumed waterproof without current manufacturer-level testing.'], buyerTips: ['Confirm xD or SD card compatibility.', 'Check battery and charger model.', 'Review lens cover, zoom, flash, and screen notes.', 'Do not assume an older Tough camera remains waterproof.']
  },
  'sony-cyber-shot-cameras': {
    title: 'Used Sony Cyber-shot Cameras', heading: 'Used Sony Cyber-shot cameras.', description: 'Shop used Sony Cyber-shot cameras with Memory Stick or SD compatibility, battery, charger, zoom, flash, screen, and condition notes.', intro: 'Sony Cyber-shot includes slim pocket cameras, travel zooms, bridge cameras, and premium compacts. Exact model details help identify the right battery and storage.', supportingHeading: 'Shopping Sony Cyber-shot', supportingCopy: ['Older models may use Memory Stick media and proprietary batteries, while later models may support SD cards.', 'Review lens movement, stabilization, flash, display, controls, and included accessories on each exact item.'], buyerTips: ['Confirm Memory Stick or SD support.', 'Check the battery and charger model.', 'Review lens and stabilization notes.', 'Verify USB or proprietary cable needs.']
  },
  'polaroid-cameras': {
    title: 'Used Polaroid Cameras', heading: 'Used Polaroid instant cameras.', description: 'Shop used Polaroid instant cameras with film compatibility, roller, flash, power, cosmetic, and exact-item testing notes.', intro: 'Polaroid cameras make physical photographs immediately, but film compatibility varies across vintage and modern systems.', supportingHeading: 'Shopping Polaroid cameras', supportingCopy: ['Confirm whether the camera takes 600, i-Type, SX-70, Go, or another film format before purchase.', 'When fresh film was not used for a complete test, the listing should say exactly what could and could not be checked.'], buyerTips: ['Confirm the film format.', 'Check battery and power design.', 'Review rollers, flash, ejection, and body notes.', 'Treat incomplete testing as a meaningful limitation.']
  },
  'kodak-easyshare-cameras': {
    title: 'Used Kodak EasyShare Cameras', heading: 'Used Kodak EasyShare cameras.', description: 'Shop used Kodak EasyShare digital cameras with battery, dock, cable, SD card, lens, flash, screen, and condition notes.', intro: 'Kodak EasyShare cameras are popular for approachable controls and early-digital character. Some models rely on docks or less common battery arrangements.', supportingHeading: 'Shopping Kodak EasyShare', supportingCopy: ['Confirm whether the camera charges directly, uses replaceable batteries, or needs an EasyShare dock.', 'Review lens, flash, controls, screen, storage, and image-capture notes for the exact item.'], buyerTips: ['Check battery and charging method.', 'Confirm whether a dock or cable is needed.', 'Review SD card compatibility.', 'Read lens and flash test notes.']
  },
  'fujifilm-finepix-cameras': {
    title: 'Used Fujifilm FinePix Cameras', heading: 'Used Fujifilm FinePix cameras.', description: 'Shop used Fujifilm FinePix cameras with battery, charger, xD or SD storage, zoom, flash, display, and condition notes.', intro: 'Fujifilm FinePix spans pocket compacts, bridge cameras, and distinctive early digital models. Storage and power requirements vary widely.', supportingHeading: 'Shopping Fujifilm FinePix', supportingCopy: ['Some FinePix cameras use xD Picture Card while others use SD; battery systems range from AA cells to proprietary packs.', 'Exact-item testing should cover lens movement, flash, display, controls, storage, and image capture where possible.'], buyerTips: ['Confirm xD or SD storage.', 'Check AA versus proprietary battery power.', 'Review zoom, flash, and screen notes.', 'Verify included cables and charger.']
  },
  'panasonic-lumix-cameras': {
    title: 'Used Panasonic Lumix Cameras', heading: 'Used Panasonic Lumix cameras.', description: 'Shop used Panasonic Lumix compact, bridge, and mirrorless cameras with lens, battery, charger, storage, screen, autofocus, and condition notes.', intro: 'Panasonic Lumix covers travel compacts, long-zoom bridge cameras, and Micro Four Thirds mirrorless systems.', supportingHeading: 'Shopping Panasonic Lumix', supportingCopy: ['Identify whether you need a fixed-lens compact or an interchangeable-lens body, then confirm battery, charger, mount, and included lens.', 'Review zoom, autofocus, stabilization, display, controls, and card-slot notes on the exact item.'], buyerTips: ['Confirm fixed lens or Micro Four Thirds mount.', 'Check battery and charger.', 'Review zoom or autofocus operation.', 'Verify included lens and storage.']
  }
};

Object.entries(cameraFamilyProfiles).forEach(([slug, profile]) => {
  categoryProfiles[slug] = {
    ...profile,
    links: profile.links ?? [
      { label: 'Vintage digital cameras', href: '/categories/vintage-digital-cameras' },
      { label: 'Compact digital cameras', href: '/categories/compact-digital-cameras' },
      { label: 'Used-camera buying guide', href: '/guides/how-to-buy-a-used-camera' },
      { label: 'All camera brands', href: '/brands' }
    ]
  };
});

const brandProfiles: Record<string, BrandSeoProfile> = {
  canon: {
    title: 'Used Canon Cameras and Lenses', heading: 'Used Canon cameras and gear.', description: 'Shop used Canon PowerShot, Digital ELPH, EOS, film cameras, lenses, and printers with clear testing and condition notes.', intro: 'Canon spans pocket PowerShot cameras, EOS film and digital systems, lenses, and photo printers. Shutterbug describes the exact used item, its tested functions, and included accessories.', knownFor: ['PowerShot and Digital ELPH compact cameras', 'EOS DSLR, mirrorless, and film systems', 'EF, EF-S, RF, and vintage lenses'], buyingAdvice: ['Match the exact battery, charger, storage format, or lens mount.', 'For PowerShot cameras, review lens movement and flash notes.', 'For EOS systems, confirm body-only versus kit contents.'], links: [{ label: 'Canon PowerShot cameras', href: '/categories/canon-powershot-cameras' }, { label: 'DSLR cameras', href: '/categories/dslr-cameras' }, { label: 'Mirrorless cameras', href: '/categories/mirrorless-cameras' }, { label: 'Camera lenses', href: '/categories/lenses' }], heroImage: { src: '/shutterbug-canon-powershot-page.png', alt: 'Canon cameras, lenses, and printer displayed at Shutterbug Camera Shop', width: 1672, height: 941 }
  },
  olympus: {
    title: 'Used Olympus Cameras', heading: 'Used Olympus cameras and gear.', description: 'Shop used Olympus Stylus, mju, Tough, compact digital, film, and interchangeable-lens cameras with honest testing notes.', intro: 'Olympus is known for compact Stylus and mju cameras, rugged Tough models, film systems, and small interchangeable-lens cameras.', knownFor: ['Stylus and mju compact cameras', 'Tough rugged digital cameras', 'OM film and digital systems'], buyingAdvice: ['Check xD Picture Card or SD compatibility.', 'Confirm battery and charger model.', 'Do not assume an older rugged camera remains waterproof.'], links: [{ label: 'Olympus digital cameras', href: '/categories/olympus-digital-cameras' }, { label: 'Compact digital cameras', href: '/categories/compact-digital-cameras' }, { label: 'Film cameras', href: '/categories/film-cameras' }, { label: 'What is a CCD camera?', href: '/guides/what-is-a-ccd-camera' }], heroImage: { src: '/shutterbug-olympus-digital-cameras-page.png', alt: 'Olympus compact digital and film cameras displayed at Shutterbug Camera Shop', width: 1448, height: 1086 }
  },
  nikon: {
    title: 'Used Nikon Cameras and Lenses', heading: 'Used Nikon cameras and gear.', description: 'Shop used Nikon Coolpix, DSLR, film cameras, and lenses with clear testing, condition, mount, battery, and accessory notes.', intro: 'Nikon ranges from pocketable Coolpix cameras to long-running SLR and DSLR systems. Exact model and mount information make used Nikon shopping much easier.', knownFor: ['Coolpix compact and bridge cameras', 'Nikon F-mount film and DSLR systems', 'Nikkor lenses'], buyingAdvice: ['Confirm the complete Coolpix model or lens mount.', 'Check body-only versus kit contents.', 'Review battery, charger, shutter, sensor, and lens notes.'], links: [{ label: 'Nikon Coolpix cameras', href: '/categories/nikon-coolpix-cameras' }, { label: 'DSLR cameras', href: '/categories/dslr-cameras' }, { label: 'Film cameras', href: '/categories/film-cameras' }, { label: 'Camera lenses', href: '/categories/lenses' }], heroImage: { src: '/shutterbug-nikon-coolpix-page.png', alt: 'Nikon Coolpix compact and DSLR cameras displayed at Shutterbug Camera Shop', width: 1448, height: 1086 }
  },
  sony: {
    title: 'Used Sony Cameras', heading: 'Used Sony cameras and gear.', description: 'Shop used Sony Cyber-shot, Alpha, Handycam, compact, mirrorless, and video cameras with clear testing and accessory notes.', intro: 'Sony combines pocket Cyber-shot cameras, Alpha interchangeable-lens systems, and Handycam video gear. Storage, batteries, lenses, and cables vary by generation.', knownFor: ['Cyber-shot compact cameras', 'Alpha mirrorless and DSLR-style systems', 'Handycam video cameras'], buyingAdvice: ['Confirm Memory Stick or SD compatibility.', 'Check E-mount or A-mount before buying lenses.', 'Review battery, charger, cable, and port notes.'], links: [{ label: 'Sony Cyber-shot cameras', href: '/categories/sony-cyber-shot-cameras' }, { label: 'Mirrorless cameras', href: '/categories/mirrorless-cameras' }, { label: 'Camcorders', href: '/categories/camcorders' }, { label: 'Camera accessories', href: '/categories/camera-accessories' }], heroImage: { src: '/shutterbug-sony-cyber-shot-page.png', alt: 'Sony Cyber-shot compact and Alpha mirrorless cameras displayed at Shutterbug Camera Shop', width: 1448, height: 1086 }
  },
  polaroid: {
    title: 'Used Polaroid Cameras', heading: 'Used Polaroid instant cameras.', description: 'Shop used Polaroid cameras with film compatibility, testing, roller, flash, power, cosmetic, and condition details.', intro: 'Polaroid cameras turn a shutter press into a physical print. Film format and tested condition are the most important details when comparing vintage and modern models.', knownFor: ['600 and i-Type instant cameras', 'SX-70 folding and box cameras', 'Vintage and modern instant photography'], buyingAdvice: ['Confirm the exact film format.', 'Read ejection, roller, flash, and power notes.', 'Understand when film testing was not possible.'], links: [{ label: 'Polaroid cameras', href: '/categories/polaroid-cameras' }, { label: 'Instant cameras', href: '/categories/instant-cameras' }, { label: 'Film cameras', href: '/categories/film-cameras' }, { label: 'Used-camera buying guide', href: '/guides/how-to-buy-a-used-camera' }], heroImage: { src: '/shutterbug-polaroid-cameras-page.png', alt: 'Polaroid instant cameras and instant photographs displayed at Shutterbug Camera Shop', width: 1448, height: 1086 }
  },
  kodak: { title: 'Used Kodak Cameras', heading: 'Used Kodak cameras and gear.', description: 'Shop used Kodak EasyShare, film, instant, and compact cameras with clear battery, storage, testing, and condition notes.', intro: 'Kodak cameras span easy-to-use digital compacts, familiar film formats, and instant photography. Older EasyShare systems can have specific battery, dock, and cable needs.', knownFor: ['EasyShare digital cameras', '35mm film cameras', 'Instant photography'], buyingAdvice: ['Confirm charging method and dock needs.', 'Check SD card and battery compatibility.', 'Review lens, flash, and display tests.'], links: [{ label: 'Kodak EasyShare cameras', href: '/categories/kodak-easyshare-cameras' }, { label: 'Vintage digital cameras', href: '/categories/vintage-digital-cameras' }, { label: 'Film cameras', href: '/categories/film-cameras' }, { label: 'What is a CCD camera?', href: '/guides/what-is-a-ccd-camera' }] },
  fujifilm: { title: 'Used Fujifilm Cameras', heading: 'Used Fujifilm cameras and gear.', description: 'Shop used Fujifilm FinePix, Instax, film, compact, and mirrorless cameras with clear testing and condition notes.', intro: 'Fujifilm covers FinePix digital compacts, Instax instant cameras, film heritage, and modern mirrorless systems.', knownFor: ['FinePix compact and bridge cameras', 'Instax instant cameras', 'X-series mirrorless systems'], buyingAdvice: ['Confirm xD or SD storage on older models.', 'Match Instax film format exactly.', 'Check lens mount and included lens on mirrorless bodies.'], links: [{ label: 'Fujifilm FinePix', href: '/categories/fujifilm-finepix-cameras' }, { label: 'Instant cameras', href: '/categories/instant-cameras' }, { label: 'Mirrorless cameras', href: '/categories/mirrorless-cameras' }, { label: 'Film cameras', href: '/categories/film-cameras' }] },
  pentax: { title: 'Used Pentax Cameras and Lenses', heading: 'Used Pentax cameras and gear.', description: 'Shop used Pentax film cameras, DSLRs, compact cameras, and K-mount lenses with clear testing and condition notes.', intro: 'Pentax is closely associated with compact SLR bodies, K-mount lenses, durable DSLRs, and distinctive film cameras.', knownFor: ['K-mount film and DSLR systems', 'Compact 35mm SLRs', 'Pentax and Takumar lenses'], buyingAdvice: ['Confirm mount and lens compatibility.', 'Check meter, shutter, advance, and seals on film bodies.', 'Review sensor, battery, charger, and controls on DSLRs.'], links: [{ label: 'DSLR cameras', href: '/categories/dslr-cameras' }, { label: 'Film cameras', href: '/categories/film-cameras' }, { label: 'Camera lenses', href: '/categories/lenses' }, { label: '35mm buying guide', href: '/guides/35mm-film-camera-buying-guide' }] },
  minolta: { title: 'Used Minolta Cameras and Lenses', heading: 'Used Minolta cameras and gear.', description: 'Shop used Minolta film cameras, Maxxum autofocus bodies, compact cameras, and lenses with clear testing and condition notes.', intro: 'Minolta produced influential manual-focus SLRs, Maxxum autofocus systems, compact film cameras, and early digital models.', knownFor: ['SR-mount manual-focus SLRs', 'Maxxum autofocus cameras and lenses', 'Compact film cameras'], buyingAdvice: ['Distinguish SR/MD and A-mount compatibility.', 'Check shutter, meter, advance, rewind, and seals.', 'Review battery-compartment condition.'], links: [{ label: 'Film cameras', href: '/categories/film-cameras' }, { label: '35mm film cameras', href: '/categories/35mm-film-cameras' }, { label: 'Camera lenses', href: '/categories/lenses' }, { label: '35mm buying guide', href: '/guides/35mm-film-camera-buying-guide' }] },
  panasonic: { title: 'Used Panasonic Lumix Cameras', heading: 'Used Panasonic cameras and gear.', description: 'Shop used Panasonic Lumix compact, bridge, and mirrorless cameras with clear lens, battery, mount, testing, and condition notes.', intro: 'Panasonic Lumix cameras range from pocket travel models to superzooms and Micro Four Thirds mirrorless systems.', knownFor: ['Lumix compact cameras', 'Long-zoom bridge cameras', 'Micro Four Thirds mirrorless systems'], buyingAdvice: ['Confirm fixed lens or interchangeable mount.', 'Check battery and charger.', 'Review zoom, stabilization, autofocus, and display notes.'], links: [{ label: 'Panasonic Lumix', href: '/categories/panasonic-lumix-cameras' }, { label: 'Bridge cameras', href: '/categories/bridge-cameras' }, { label: 'Mirrorless cameras', href: '/categories/mirrorless-cameras' }, { label: 'Camera lenses', href: '/categories/lenses' }] }
};

export const priorityCategorySlugs = Object.keys(categoryProfiles);
export const priorityBrandSlugs = Object.keys(brandProfiles);

export function getCategorySeoProfile(slug: string) {
  return categoryProfiles[slug];
}

export function getBrandSeoProfile(slug: string) {
  return brandProfiles[slug];
}

export function isPriorityCategory(slug: string) {
  return Boolean(categoryProfiles[slug]);
}

export function isPriorityBrand(slug: string) {
  return Boolean(brandProfiles[slug]);
}
