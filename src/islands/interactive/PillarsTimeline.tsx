import { useRef } from 'react';
import { motion, useInView, useReducedMotion, useScroll } from 'framer-motion';
import { pillars } from '../../data/services';

// Vertical timeline: dashed track + a line that fills as you scroll, icon nodes that light up,
// text alternating left and right, big faint numerals on the opposite side. Collapses to one column on phones.
const icons: Record<string, string> = {
  moon: 'M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z',
  flame: 'M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.2 2-4.2 0 2 1 3 2 3 0-3-1-6 1-8.8z',
  gut: 'M12 4a8 8 0 1 0 8 8 5 5 0 0 0-10 0 2 2 0 0 0 4 0',
  drop: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
  heart: 'M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z',
};

function Item({ p, i }: { p: (typeof pillars)[number]; i: number }) {
  const reduce = useReducedMotion();
  const nodeRef = useRef<HTMLSpanElement>(null);
  const lit = useInView(nodeRef, { once: true, margin: '0px 0px -40% 0px' });
  const left = i % 2 === 0; // text on the left of the line (desktop)
  const num = String(i + 1).padStart(2, '0');

  return (
    <li className="relative grid grid-cols-[3rem_1fr] gap-6 pb-16 last:pb-0 md:grid-cols-[1fr_5rem_1fr] md:gap-0">
      <span className="relative z-10 col-start-1 row-start-1 flex justify-center md:col-start-2">
        <span ref={nodeRef}
          className={`grid h-14 w-14 place-items-center rounded-full ring-1 ring-leaf/40 transition-colors duration-500 ${lit || reduce ? 'bg-leaf text-deep' : 'bg-[#1f4430] text-leaf'}`}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={icons[p.icon]} /></svg>
        </span>
      </span>

      <span aria-hidden="true"
        className={`pointer-events-none row-start-1 hidden self-center font-display text-[7rem] leading-none text-white/[0.08] md:block ${left ? 'col-start-3 pl-10' : 'col-start-1 pr-10 text-right'}`}>
        {num}
      </span>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`spot card-line col-start-2 row-start-1 rounded-2xl p-6 transition-colors duration-300 hover:bg-white/[.04] md:p-8 ${left ? 'md:col-start-1 md:mr-8 md:text-right' : 'md:col-start-3 md:ml-8'}`}>
        <p className="eyebrow text-[12px] text-leaf">Pillar {i + 1}</p>
        <h3 className="mt-2 font-display text-[clamp(1.6rem,2.6vw,2.4rem)] uppercase leading-[1.1] tracking-wide text-white">{p.title}</h3>
        <p className={`mt-3 max-w-md text-[17px] text-white/75 ${left ? 'md:ml-auto' : ''}`}>{p.body}</p>
      </motion.div>
    </li>
  );
}

export default function PillarsTimeline() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });

  return (
    <ol ref={ref} className="relative mx-auto mt-20 max-w-5xl">
      <span aria-hidden="true" className="absolute bottom-0 left-6 top-0 w-px border-l border-dashed border-white/20 md:left-1/2" />
      <motion.span aria-hidden="true" style={{ scaleY: reduce ? 1 : scrollYProgress }}
        className="absolute bottom-0 left-6 top-0 w-[2px] origin-top -translate-x-[0.5px] bg-leaf md:left-1/2" />
      {pillars.map((p, i) => <Item key={p.title} p={p} i={i} />)}
    </ol>
  );
}
