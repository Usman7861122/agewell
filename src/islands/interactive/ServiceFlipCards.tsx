import { useRef, useState, type PointerEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { longevityServices } from '../../data/services';
import { src, srcset, photos } from '../../lib/images';

/*
 * Photo cards that show only the title. On hover (mouse), keyboard focus, or tap (touch) the card flips
 * to reveal the description and link. The back side is always in the page for screen readers.
 */
function FlipCard({ s, i }: { s: (typeof longevityServices)[number]; i: number }) {
  const [flipped, setFlipped] = useState(false);
  const touch = useRef(false);
  const reduce = useReducedMotion();

  const onEnter = (e: PointerEvent) => { if (e.pointerType === 'mouse') setFlipped(true); };
  const onLeave = (e: PointerEvent) => { if (e.pointerType === 'mouse') setFlipped(false); };
  const onDown = (e: PointerEvent) => { touch.current = e.pointerType !== 'mouse'; };
  // With reduced motion there is no 3D flip: the two faces simply cross-fade.
  const hidden = reduce ? {} : ({ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' } as const);

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1400 }} className="h-[420px] sm:h-[440px] xl:h-[480px]"
      onPointerEnter={onEnter} onPointerLeave={onLeave} onPointerDown={onDown}
      onClick={() => { if (touch.current) setFlipped((f) => !f); }}
      onFocusCapture={() => setFlipped(true)} onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setFlipped(false); }}>
      <motion.div className="relative h-full w-full" style={{ transformStyle: 'preserve-3d' }}
        animate={reduce ? { rotateY: 0 } : { rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.7, ease: [0.4, 0.2, 0.2, 1] }}>

        {/* FRONT: photo + title only (decorative duplicate of the heading on the back) */}
        <div aria-hidden="true" style={hidden}
          className={`absolute inset-0 overflow-hidden rounded-2xl bg-ink shadow-lg ${reduce && flipped ? 'opacity-0' : ''}`}>
          <img src={src(s.photo, 800)} srcSet={srcset(s.photo, [480, 800, 1200])} sizes="(min-width:1280px) 300px, (min-width:640px) 45vw, 100vw"
            alt="" width={800} height={1000} loading="lazy" decoding="async" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-ink/10" />
          <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-ink/40 text-white backdrop-blur">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" /><path d="M3 21v-5h5" /><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8" /><path d="M21 3v5h-5" /></svg>
          </span>
          <div className="absolute inset-x-0 bottom-0 p-6">
            <h3 className="font-display text-[1.65rem] uppercase leading-[1.15] tracking-wide text-white">{s.title}</h3>
            <span className="mt-3 block h-px w-12 bg-white/70" />
          </div>
        </div>

        {/* BACK: the details */}
        <div style={{ ...hidden, ...(reduce ? {} : { transform: 'rotateY(180deg)' }) }}
          className={`absolute inset-0 flex flex-col overflow-hidden rounded-2xl bg-brand p-7 text-white shadow-lg ${reduce && !flipped ? 'opacity-0' : ''}`}>
          <img src={src(s.photo, 400, 40)} alt="" aria-hidden="true" width={400} height={500} loading="lazy"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.12] mix-blend-luminosity" />
          <div className="relative flex h-full flex-col">
            <h3 className="font-display text-[1.35rem] uppercase leading-snug tracking-wide">{s.title}</h3>
            <span className="mt-4 block h-px w-12 bg-white/60" />
            <p className="mt-5 flex-1 text-[16px] leading-relaxed text-white/95">{s.body}</p>
            <a href={s.href} aria-label={`${s.cta} ${s.title}`} className="mt-6 inline-flex min-h-[44px] items-center gap-2 self-start font-button text-[15px] font-semibold uppercase tracking-[1px] text-white underline-offset-8 hover:underline">
              {s.cta} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </motion.div>
    </motion.li>
  );
}

export default function ServiceFlipCards() {
  return (
    <ul className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {longevityServices.map((s, i) => <FlipCard key={s.title} s={s} i={i} />)}
    </ul>
  );
}
