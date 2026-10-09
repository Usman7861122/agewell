import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { NavItem } from '../../data/navigation';

interface Props {
  items: NavItem[]; cta: { label: string; href: string };
  secondary: { label: string; href: string }[]; phone: string; phoneHref: string;
}

export default function MobileMenu({ items, cta, secondary, phone, phoneHref }: Props) {
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState<string | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); opener.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey); };
  }, [open]);

  const dur = reduce ? 0 : 0.28;

  return (
    <div className="flex items-center gap-2 min-[1400px]:hidden">
      <a href={phoneHref} aria-label={`Call ${phone}`} className="flex h-11 w-11 items-center justify-center rounded-full text-brand hover:bg-brand-50 md:hidden">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>
      </a>
      <a href={cta.href} className="btn btn-primary btn-sm hidden sm:inline-flex">{cta.label}</a>
      <button ref={opener} type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} aria-controls="mobile-menu"
        className="flex h-11 w-11 items-center justify-center rounded-lg border border-line text-ink hover:bg-brand-50">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div key="scrim" className="fixed inset-0 z-[60] bg-ink/60" onClick={() => setOpen(false)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: dur }} aria-hidden="true" />
            <motion.aside key="panel" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Site menu"
              className="fixed inset-y-0 right-0 z-[70] flex w-[min(92vw,420px)] flex-col bg-white shadow-2xl"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: dur, ease: 'easeOut' }}>
              <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <span className="font-display text-xl uppercase tracking-[.18em]">Menu</span>
                <button ref={closeBtn} type="button" onClick={() => { setOpen(false); opener.current?.focus(); }} aria-label="Close menu"
                  className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-brand-50">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
                </button>
              </div>

              <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-3">
                <ul>
                  {items.map((item) => {
                    const isOpen = group === item.label;
                    return (
                      <li key={item.label} className="border-b border-line/70">
                        {item.children ? (
                          <>
                            <button type="button" aria-expanded={isOpen} onClick={() => setGroup(isOpen ? null : item.label)}
                              className="flex min-h-[52px] w-full items-center justify-between px-3 text-left font-display text-lg uppercase tracking-wide">
                              {item.label}
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                                style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}><path d="m6 9 6 6 6-6" /></svg>
                            </button>
                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: dur }} className="overflow-hidden">
                                  <li><a href={item.href} className="block min-h-[44px] rounded-lg px-6 py-2.5 text-[15px] font-semibold text-brand">Overview</a></li>
                                  {item.children.map((c) => (
                                    <li key={c.href}><a href={c.href} className="block min-h-[44px] rounded-lg px-6 py-2.5 text-[15px] hover:bg-brand-50">{c.label}</a></li>
                                  ))}
                                </motion.ul>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <a href={item.href} className="flex min-h-[52px] items-center px-3 font-display text-lg uppercase tracking-wide">{item.label}</a>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <ul className="mt-4 flex gap-6 px-3 text-sm">
                  {secondary.map((s) => <li key={s.href}><a href={s.href} className="inline-block py-2.5 text-ink/80 underline underline-offset-4">{s.label}</a></li>)}
                </ul>
              </nav>

              <div className="space-y-3 border-t border-line p-4">
                <a href={cta.href} className="btn btn-primary w-full" onClick={() => setOpen(false)}>{cta.label}</a>
                <a href={phoneHref} className="btn btn-outline w-full text-brand">Call {phone}</a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
