export interface Img { src: string; alt: string; w: number; h: number; srcset?: string }
export type Block =
  | { type: 'split'; eyebrow: string; heading: string; paragraphs: string[]; image: Img; flip?: boolean; bullets?: string[]; cta?: { label: string; href: string } }
  | { type: 'cards'; eyebrow: string; heading: string; intro?: string; items: { title: string; body: string; href?: string; tag?: string }[]; tone?: 'mist' | 'white' }
  | { type: 'steps'; eyebrow: string; heading: string; items: { title: string; body: string }[] }
  | { type: 'people'; eyebrow: string; heading: string; intro?: string; items: { name: string; credential?: string; role: string; photo: string; w: number; h: number; paragraphs: string[]; tags: string[] }[] }
  | { type: 'reviews'; eyebrow: string; heading: string; score: string; count: number; googleUrl: string; items: { quote: string; name: string; when: string }[] }
  | { type: 'contact'; eyebrow: string; heading: string; text: string; image: Img }
  | { type: 'gallery'; eyebrow: string; heading: string; intro?: string; ratio?: 'square' | 'wide'; items: { src: string; alt: string }[] }
  | { type: 'band'; heading: string; text: string; primary?: { label: string; href: string }; secondary?: { label: string; href: string } }
  | { type: 'faq'; eyebrow: string; heading: string; items: { q: string; a: string }[] };

