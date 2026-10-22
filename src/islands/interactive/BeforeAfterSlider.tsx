import { useEffect, useRef, useState } from 'react';

type Props = { before: string; after: string; alt: string; label: string; w: number; h: number };

// Drag (or use the arrow keys) to reveal the "after" photo. A real range input sits on top, so mouse, touch and keyboard all work.
export default function BeforeAfterSlider({ before, after, alt, label, w, h }: Props) {
  const [pos, setPos] = useState(50);
  const [focus, setFocus] = useState(false);
  const touched = useRef(false);
  const box = useRef<HTMLDivElement>(null);

  // A short sweep once the slider comes into view, so people notice it can be moved.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let t0 = 0;
    const run = (t: number) => {
      if (touched.current) return;
      if (!t0) t0 = t;
      const k = (t - t0) / 2600;
      if (k >= 1) { setPos(50); return; }
      setPos(50 + 34 * Math.sin(k * Math.PI * 2) * (1 - k * 0.35));
      raf = requestAnimationFrame(run);
    };
    const timer = setTimeout(() => { raf = requestAnimationFrame(run); }, 500);
    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={box} className="ba" style={{ aspectRatio: `${w} / ${h}` }}>
      <img className="ba-img" src={after} alt={`${alt} After treatment.`} width={w} height={h} loading="lazy" decoding="async" draggable={false} />
      <img className="ba-img ba-before" src={before} alt={`${alt} Before treatment.`} width={w} height={h} loading="lazy" decoding="async" draggable={false}
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
      <span className="ba-tag ba-tag-l" style={{ opacity: pos > 14 ? 1 : 0 }}>Before</span>
      <span className="ba-tag ba-tag-r" style={{ opacity: pos < 86 ? 1 : 0 }}>After</span>
      <div className={`ba-line ${focus ? 'ba-focus' : ''}`} style={{ left: `${pos}%` }} aria-hidden="true">
        <span className="ba-knob">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6-6 6 6 6M15 6l6 6-6 6" /></svg>
        </span>
      </div>
      <input className="ba-range" type="range" min={0} max={100} step={0.5} value={pos}
        aria-label={`${label}: drag to compare before and after`}
        onChange={(e) => { touched.current = true; setPos(Number(e.target.value)); }}
        onPointerDown={() => { touched.current = true; }}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} />
    </div>
  );
}
