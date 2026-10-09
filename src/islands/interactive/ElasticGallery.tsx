import { useState } from 'react';

export interface ElasticItem { id: string; title: string; category: string; src: string; alt: string }

// Accordion-style gallery: the hovered (or focused / tapped) photo grows and the others fold into slim strips.
export default function ElasticGallery({ items, defaultId }: { items: ElasticItem[]; defaultId?: string }) {
  const [active, setActive] = useState<string>(defaultId ?? items[0]?.id ?? '');
  return (
    <ul className="eg" aria-label="Photos of our Bedminster office">
      {items.map((it) => {
        const on = active === it.id;
        return (
          <li key={it.id} className={`eg-item${on ? ' is-active' : ''}`} onMouseEnter={() => setActive(it.id)}>
            <button type="button" className="eg-btn" onClick={() => setActive(it.id)} onFocus={() => setActive(it.id)} aria-pressed={on} aria-label={`${it.title}, ${it.category}`}>
              <img src={it.src} alt={it.alt} loading="lazy" decoding="async" className="eg-img" />
              <span className="eg-shade" aria-hidden="true" />
              <span className="eg-content">
                <span className="eg-tag">{it.category}</span>
                <span className="eg-title">{it.title}</span>
              </span>
              <span className="eg-side" aria-hidden="true">
                <span className="eg-side-v">{it.title}</span>
                <span className="eg-side-n">{it.id}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
