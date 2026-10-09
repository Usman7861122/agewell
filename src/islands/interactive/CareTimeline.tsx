import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { steps } from '../../data/services';

/*
 * Horizontal "journey" timeline: one line draws across, lighting each step in order, and a dashed
 * loop arrow shows that follow-up feeds back into the plan. On phones it turns into a simple vertical list.
 */
export default function CareTimeline() {
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' });
  const reduce = useReducedMotion();
  const go = inView || !!reduce;
  const total = 1.5; // seconds for the line to cross
  const delayFor = (i: number) => (reduce ? 0 : (i / (steps.length - 1)) * total);

  return (
    <ol ref={ref} className="relative mx-auto mt-16 max-w-6xl md:mt-24 md:grid md:grid-cols-4 md:pt-12">
      {/* desktop: track + drawing line, running from the centre of node 1 to the centre of node 4 */}
      <span aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-[calc(3rem+2rem)] hidden h-px bg-white/20 md:block" />
      <motion.span aria-hidden="true" initial={{ scaleX: reduce ? 1 : 0 }} animate={{ scaleX: go ? 1 : 0 }} transition={{ duration: total, ease: 'linear' }}
        className="absolute left-[12.5%] right-[12.5%] top-[calc(3rem+2rem)] hidden h-[2px] origin-left bg-white md:block" />

      {/* desktop: loop arrow from step 4 back to step 2 */}
      <motion.div aria-hidden="true" initial={{ opacity: reduce ? 1 : 0 }} animate={{ opacity: go ? 1 : 0 }} transition={{ duration: 0.8, delay: reduce ? 0 : total + 0.1 }}
        className="absolute left-[37.5%] right-[12.5%] top-3 hidden h-9 rounded-t-3xl border-x border-t border-dashed border-white/50 md:block">
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-ink px-4 font-display text-[11px] uppercase tracking-[.2em] text-white/80">Your plan adjusts as your needs change</span>
        <svg className="absolute -bottom-1 -left-[7px] text-white/70" width="13" height="10" viewBox="0 0 13 10" fill="currentColor"><path d="M6.5 10 0 0h13z" /></svg>
      </motion.div>

      {/* mobile: vertical track */}
      <span aria-hidden="true" className="absolute bottom-6 left-8 top-8 w-px bg-white/20 md:hidden" />
      <motion.span aria-hidden="true" initial={{ scaleY: reduce ? 1 : 0 }} animate={{ scaleY: go ? 1 : 0 }} transition={{ duration: total, ease: 'linear' }}
        className="absolute bottom-6 left-8 top-8 w-[2px] origin-top -translate-x-[0.5px] bg-white md:hidden" />

      {steps.map((s, i) => (
        <li key={s.n} className="relative grid grid-cols-[4rem_1fr] gap-5 pb-10 last:pb-0 md:block md:px-4 md:pb-0 md:text-center">
          <span className="relative z-10 flex justify-center md:mb-8">
            <span style={{ transitionDelay: `${go ? delayFor(i) : 0}s` }}
              className={`grid h-16 w-16 place-items-center rounded-full border-2 font-display text-2xl transition-all duration-500 ${go ? 'scale-100 border-white bg-white text-brand' : 'scale-90 border-white/30 bg-ink text-white/50'}`}>
              {s.n}
            </span>
          </span>
          <div className="spot card-line rounded-2xl p-5 transition-colors duration-300 hover:bg-white/[.04] md:mx-auto md:max-w-[18rem]">
            <h3 className="font-display text-2xl uppercase tracking-wide"><span className="sr-only">Step {s.n}: </span>{s.title}</h3>
            <p className="mt-3 text-[16px] leading-relaxed text-white/80">{s.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
