// Details copied from the live site. Brief says: confirm all contact details with the practice before launch.
export const site = {
  name: 'AgeWell Medicine & Aesthetics',
  short: 'AgeWell',
  url: 'https://www.agewellmedicine.com',
  phone: '(908) 458-6874',
  phoneHref: 'tel:+19084586874',
  email: 'info@agewellmedicine.com',
  address: { street: '2436 Lamington Rd Suite 1', city: 'Bedminster', region: 'NJ', zip: '07921' },
  // Map pin of the Google Maps listing for this address (plus code M9H2+RX), the same listing the site's Google link opens.
  geo: { latitude: 40.67956, longitude: -74.64756 },
  hours: 'Mon 10-4 · Tue-Wed 10-7 · Thu 10-6 · Fri 10-4 · Sat 11-4 · Sun closed',
  social: [
    { label: 'Google', href: 'https://www.google.com/maps/search/AgeWell+Medicine+%26+Aesthetics+Bedminster+NJ' },
    { label: 'Facebook', href: 'https://www.facebook.com/people/AgeWell-Medicine-Aesthetics/61575122423533/' },
    { label: 'Instagram', href: 'https://www.instagram.com/agewellmedicalaesthetics/' },
    { label: 'Yelp', href: 'https://www.yelp.com/biz/agewell-medicine-and-aesthetics-bedminster' },
  ],
};

export type Interest = 'longevity' | 'metabolic' | 'hormone' | 'hair' | 'aesthetics' | 'not-sure';

// Every "Request a Consultation" button goes through this, so the right visit type is pre-selected.
// The appointment page has the two booking buttons (existing / new clients), like agewellmedicine.com.
export const book = (_interest?: Interest) => '/appointment/';
export const siteConfig = site;
