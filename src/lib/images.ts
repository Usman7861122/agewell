// Fresh Unsplash photos chosen for this project (free licence). Local copies live in /public/images/photos.
// Swap any entry here and it updates everywhere. Provider portraits are NOT stock: use real photos.

export const photos = {
  hero:       { id: 'photo-1762781960643-abdad9d58750', alt: 'Two adults walking together along a path in an autumn forest', credit: 'Hoseung Han' },
  longevity:  { id: 'photo-1756314355668-7d3056db8600', alt: 'An older woman in a bright gym getting ready to exercise', credit: 'Centre for Ageing Better' },
  consult:    { id: 'photo-1758691461513-88a0aef72160', alt: 'A doctor with a stethoscope in a clinic', credit: 'Vitaly Gariev' },
  virtual:    { id: 'photo-1758691463620-188ca7c1a04f', alt: 'A doctor on a video call with a patient on a laptop', credit: 'Vitaly Gariev' },
  hair:       { id: 'photo-1643604366389-97233678a75f', alt: 'Close view of long, healthy hair', credit: 'Paola Cañas-Valadez' },
  aesthetics: { id: 'photo-1728727217834-b190862837a3', alt: 'A smiling woman gently touching her face', credit: 'Look Studio' },
  d30:        { id: 'photo-1758599880540-8150399824f0', alt: 'A woman doing yoga on a mat in a bright living room', credit: 'Vitaly Gariev' },
  d40:        { id: 'photo-1782744548431-33bd28412f58', alt: 'A man running on a paved park path', credit: 'atelierbyvineeth' },
  d50:        { id: 'photo-1758875568800-29fb434c7b17', alt: 'A woman lifting a barbell while a trainer watches', credit: 'Vitaly Gariev' },
  d60:        { id: 'photo-1625690987114-86f5af994b49', alt: 'An older couple with grey hair walking arm in arm', credit: 'Hector Reyes' },
  d70:        { id: 'photo-1788885917443-1f27c41c294c', alt: 'An older woman and man looking closely at leaves in a green garden', credit: 'Olympia Petrou' },
  cta:        { id: 'photo-1768898548611-2dd94e452538', alt: 'A couple walking by a river at sunset', credit: 'Anna Stampfli' },
  svcEval:       { id: 'photo-1675270427967-b8f09d7c939b', alt: 'Two people sitting at a table writing on a clipboard', credit: 'B Y G' },
  svcMetabolic:  { id: 'photo-1776897874894-782428e7ddc4', alt: 'A woman walking along a path in a park', credit: 'Rashmi Kalburgie' },
  svcHormone:    { id: 'photo-1783602451659-af0d8ae304ed', alt: 'A smiling couple embracing outdoors on a sandy path', credit: 'Ashford Marx' },
  svcFunctional: { id: 'photo-1701960980837-f8a10c704789', alt: 'A lemon, garlic and fresh herbs on a dark surface', credit: 'Serhii Kalyn' },
} as const;

export type PhotoKey = keyof typeof photos;

const SIZES = [480, 768, 1080, 1600] as const;
const pick = (w: number) => SIZES.find((s) => s >= w) ?? SIZES[SIZES.length - 1];

// Photos are saved locally in /public/images/photos (resized copies of the originals).
export const src = (key: PhotoKey, w = 1200, _q = 75) => `/images/photos/${key}-${pick(w)}.jpg`;
export const srcset = (key: PhotoKey, widths: number[]) => [...new Set(widths.map(pick))].map((w) => `${src(key, w)} ${w}w`).join(', ');
