export interface NavItem { label: string; href: string; children?: { label: string; href: string }[] }

// Order and labels come straight from the redesign brief.
export const navItems: NavItem[] = [
  { label: 'Longevity Medicine', href: '/longevity', children: [
    { label: 'Longevity Evaluation', href: '/longevity/evaluation' },
    { label: 'Metabolic Health and Medical Weight Management', href: '/longevity/metabolic-health' },
    { label: 'Hormone Care', href: '/longevity/hormone-care' },
    { label: 'Functional Medicine', href: '/longevity/functional-medicine' },
  ]},
  { label: 'Hair Restoration', href: '/hair-restoration' },
  { label: 'Aesthetics', href: '/aesthetics', children: [
    { label: 'Botox', href: '/aesthetics/botox' },
    { label: 'Dysport', href: '/aesthetics/dysport' },
    { label: 'Dermal Fillers', href: '/aesthetics/dermal-fillers' },
    { label: 'Sculptra', href: '/aesthetics/sculptra' },
    { label: 'Microneedling', href: '/aesthetics/microneedling' },
    { label: 'Medical-Grade Skincare', href: '/aesthetics/skincare' },
  ]},
  { label: 'Our Providers', href: '/providers' },
  { label: 'Resources', href: '/resources', children: [
    { label: 'New Patients', href: '/resources/new-patients' },
    { label: 'Virtual Visits', href: '/resources/virtual-visits' },
    { label: 'FAQs', href: '/resources/faqs' },
    { label: 'Financing', href: '/resources/financing' },
    { label: 'Reviews', href: '/reviews' },
    { label: 'Feedback', href: '/resources/feedback' },
    { label: 'Library', href: '/resources/library' },
    { label: 'Executive Reset', href: '/resources/executive-reset' },
    { label: 'Before and After', href: '/resources/before-and-after' },
    { label: 'Local Resources', href: '/resources/local-resources' },
    { label: 'Social Media', href: '/resources/social-media' },
    { label: 'Educational Articles', href: '/blog' },
  ]},
  { label: 'Store', href: '/store', children: [
    { label: 'Skinbetter', href: '/store/skinbetter' },
    { label: 'Biote Nutraceuticals', href: '/store/biote-nutraceuticals' },
  ]},
  { label: 'Contact', href: '/contact' },
];

// Secondary navigation (utility bar). Store moved to the main nav.
export const secondaryNav = [
  { label: 'Reviews', href: '/reviews' },
];

export const footerGroups = [
  { title: 'Longevity', links: navItems[0].children! },
  { title: 'Care', links: [
    { label: 'Hair Restoration', href: '/hair-restoration' },
    { label: 'Aesthetics', href: '/aesthetics' },
    { label: 'Our Providers', href: '/providers' },
  ]},
  { title: 'Patient Resources', links: [
    ...navItems[4].children!,
    { label: 'Store', href: '/store' },
  ]},
];
