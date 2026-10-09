import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { NavItem } from '../../data/navigation';

interface Props { items: NavItem[]; cta: { label: string; href: string }; current: string }

const Chevron = ({ open }: { open: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}><path d="m6 9 6 6 6-6" /></svg>
);

export default function SiteNav({ items, cta, current }: Props) {
  const [open, setOpen] = useState<string | null>(null);
  const root = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    const onDown = (e: MouseEvent) => root.current && !root.current.contains(e.target as Node) && setOpen(null);
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown); };
  }, []);

  const isCurrent = (href: string) => current === href || current.startsWith(href + '/');

  return (
    <nav ref={root} aria-label="Primary" className="hidden items-center gap-6 min-[1400px]:flex">
      <ul className="flex items-center">
        {items.map((item) => {
          const hasMenu = !!item.children;
          const isOpen = open === item.label;
          return (
            <li key={item.label} className="relative"
              onMouseEnter={() => hasMenu && setOpen(item.label)} onMouseLeave={() => setOpen(null)}
              onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen((o) => (o === item.label ? null : o)); }}>
              <div className="flex items-center">
                <a href={item.href} aria-current={isCurrent(item.href) ? 'page' : undefined}
                  className={`whitespace-nowrap font-display text-[15px] uppercase tracking-[.05em] py-3 pl-3 ${hasMenu ? 'pr-0.5' : 'pr-3'} transition-colors hover:text-brand ${isCurrent(item.href) ? 'text-brand' : 'text-ink'}`}>
                  {item.label}
                </a>
                {hasMenu && (
                  <button type="button" aria-expanded={isOpen} aria-label={`${item.label} submenu`}
                    onClick={() => setOpen(isOpen ? null : item.label)}
                    className="flex h-11 w-8 items-center justify-center text-ink hover:text-brand">
                    <Chevron open={isOpen} />
                  </button>
                )}
              </div>
              <AnimatePresence>
                {hasMenu && isOpen && (
                  <div className="absolute left-0 top-full z-50 pt-3">
                    <motion.div
                      initial={reduce ? false : { opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduce ? undefined : { opacity: 0, y: 8 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="relative w-[22rem] overflow-hidden rounded-2xl bg-deep text-white shadow-[0_30px_60px_-15px_rgba(22,50,31,.55)] ring-1 ring-white/10">
                      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-leaf to-transparent" />
                      <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-leaf/10 blur-2xl" />
                      <div className="flex items-center justify-between px-6 pb-3 pt-5">
                        <span className="font-display text-xs uppercase tracking-[.22em] text-leaf">{item.label}</span>
                        <a href={item.href} className="text-xs font-semibold uppercase tracking-[.14em] text-white/70 transition-colors hover:text-white">View all</a>
                      </div>
                      <ul className="px-3 pb-3">
                        {item.children!.map((c, i) => (
                          <motion.li key={c.href}
                            initial={reduce ? false : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: reduce ? 0 : 0.05 + i * 0.045, duration: 0.3 }}>
                            <a href={c.href} className="group/item flex items-center gap-4 rounded-xl px-3 py-3.5 transition-colors duration-200 hover:bg-white/[.07] focus-visible:bg-white/[.07]">
                              <span aria-hidden="true" className="w-6 font-display text-sm text-leaf/70 transition-colors group-hover/item:text-leaf">{String(i + 1).padStart(2, '0')}</span>
                              <span className="flex-1 text-[15px] leading-snug text-white/90 transition-transform duration-200 group-hover/item:translate-x-1 group-hover/item:text-white">{c.label}</span>
                              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 -translate-x-2 text-leaf opacity-0 transition-all duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100 group-focus-visible/item:translate-x-0 group-focus-visible/item:opacity-100"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                            </a>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
      <a href={cta.href} className="btn btn-primary btn-sm whitespace-nowrap">{cta.label}</a>
    </nav>
  );
}
