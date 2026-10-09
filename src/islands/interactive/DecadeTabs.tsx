import { useRef, useState, type KeyboardEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { decades } from '../../data/decades';
import { src, srcset, photos } from '../../lib/images';
import { book } from '../../lib/site';

/*
 * Copy of the live agewellmedicine.com decade section (measured at 1440px):
 *  - Desktop (>=1025px): one full-width 900px-high photo "slide". Decade buttons are stacked
 *    vertically at the left (left:60px, 146x74 each, Open Sans 700 45px, active = 21% white + underline).
 *    Text block sits on the right (550px wide, padding 20/60/20/20, right-aligned):
 *    "I AM IN MY" (Aboreto 50/60) -> decade (120/120, 600) -> paragraph (Inter 16/30, 470px) -> green button.
 *  - Tablet/mobile: tabs become a horizontal bar above the photo; same right-aligned text.
 *  - Slides change instantly (swiper speed 0); the heading fades and number + text slide in from the left.
 */
export default function DecadeTabs() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = useReducedMotion();
  const d = decades[active];
  const label = (id: string, tab: string) => (id === '70s' ? '70 and beyond' : tab);

  const onKey = (e: KeyboardEvent) => {
    let next = active;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (active + 1) % decades.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (active - 1 + decades.length) % decades.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = decades.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };

  const slideIn = (delay: number) => reduce
    ? { initial: false as const }
    : { initial: { opacity: 0, x: -60 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <div className="relative overflow-hidden bg-mist">
      {/* Decade buttons: vertical column on desktop, horizontal bar on smaller screens */}
      <div role="tablist" aria-label="Healthy aging by decade" onKeyDown={onKey}
        className="relative z-10 flex items-stretch justify-start overflow-x-auto bg-sage/80 px-2 min-[560px]:justify-center
                   min-[1025px]:absolute min-[1025px]:inset-y-0 min-[1025px]:left-[60px] min-[1025px]:w-[150px] min-[1025px]:flex-col
                   min-[1025px]:items-start min-[1025px]:justify-center min-[1025px]:overflow-visible min-[1025px]:bg-transparent min-[1025px]:px-0">
        {decades.map((x, i) => (
          <button key={x.id} ref={(el) => { refs.current[i] = el; }} role="tab" id={`tab-${x.id}`} aria-selected={i === active}
            aria-controls="decade-panel" aria-label={label(x.id, x.tab)} tabIndex={i === active ? 0 : -1} onClick={() => setActive(i)}
            className={`shrink-0 whitespace-nowrap font-tab font-bold text-black transition-colors
                        min-h-[56px] px-4 text-[22px] leading-[1.2] min-[560px]:text-[25px]
                        min-[1025px]:h-[74px] min-[1025px]:w-[146px] min-[1025px]:px-[30px] min-[1025px]:py-[10px] min-[1025px]:text-[45px] min-[1025px]:leading-[54px]
                        ${i === active ? 'bg-white/60 underline min-[1025px]:bg-white/20' : 'hover:bg-white/25'}`}>
            {x.id === '70s' ? '70+' : x.tab}
          </button>
        ))}
      </div>

      {/* Slide */}
      <div id="decade-panel" role="tabpanel" aria-labelledby={`tab-${d.id}`} tabIndex={0}
        className="relative flex min-h-[640px] flex-col items-end justify-center gap-5 p-[10px] min-[1025px]:min-h-[900px]">
        <img key={d.photo} src={src(d.photo, 1080)} srcSet={srcset(d.photo, [640, 1080, 1600, 2400])} sizes="100vw" alt={photos[d.photo].alt}
          className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: active === 0 ? '100% 50%' : '50% 50%' }}
          width={1600} height={900} loading="lazy" decoding="async" />
        {/* soft veil on the text side only, so black text stays readable on every photo */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white/70 min-[1025px]:bg-gradient-to-r min-[1025px]:from-transparent min-[1025px]:via-white/20 min-[1025px]:to-white/60" aria-hidden="true" />

        <div key={d.id} className="relative flex w-full max-w-[550px] flex-col items-end gap-5 pb-5 pl-5 pr-5 pt-5 text-right min-[1025px]:w-[550px] min-[1025px]:pr-[60px]">
          <motion.h2 className="pb-5 font-display text-[32px] font-medium uppercase leading-[40px] text-black min-[1025px]:text-[50px] min-[1025px]:leading-[60px]"
            {...(reduce ? { initial: false as const } : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.6 } })}>
            I am in my
          </motion.h2>
          <motion.p className="font-tab text-[80px] font-semibold leading-[80px] text-black min-[1025px]:text-[120px] min-[1025px]:leading-[120px]"
            aria-label={d.id === '70s' ? '70 and beyond' : d.big} {...slideIn(0.1)}>
            {d.big}
          </motion.p>
          <motion.p className="w-full max-w-[470px] font-sans text-base leading-[30px] tracking-[0.2px] text-black" {...slideIn(0.2)}>
            <strong className="font-semibold">{d.title}: </strong>{d.body}
          </motion.p>
          <a href={book('longevity')}
            className="inline-block rounded-[10px] border border-brand bg-brand px-10 py-5 text-center font-button text-base font-light uppercase leading-4 tracking-[1px] text-white transition-transform duration-200 hover:scale-95 active:scale-90">
            Consultation
          </a>
        </div>
      </div>
    </div>
  );
}
