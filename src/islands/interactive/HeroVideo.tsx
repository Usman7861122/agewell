import { useEffect, useRef, useState } from 'react';

interface Props { src: string; poster: string; alt?: string }

/*
 * Background video for the hero (like the old site), done responsibly:
 *  - a still poster image is always rendered first, so there is no blank flash and it is the fallback
 *  - video only plays on screens 768px+ wide, and never for reduced-motion or data-saver visitors
 *  - muted, looping, no controls, with a visible pause button (accessibility)
 */
export default function HeroVideo({ src, poster, alt = '' }: Props) {
  const [allowed, setAllowed] = useState(false);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 768px)').matches;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saver = !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    setAllowed(wide && !calm && !saver);
  }, []);

  useEffect(() => {
    const v = video.current;
    if (!v || !allowed) return;
    v.muted = true;
    v.play().catch(() => setPaused(true)); // autoplay blocked: stay on the poster
  }, [allowed]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) { v.play(); setPaused(false); } else { v.pause(); setPaused(true); }
  };

  return (
    <>
      <img src={poster} alt={alt} width={1600} height={900} className="absolute inset-0 -z-20 h-full w-full object-cover" fetchPriority="high" />
      {allowed && (
        <>
          <video ref={video} className={`absolute inset-0 -z-20 h-full w-full object-cover transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}
            src={src} poster={poster} autoPlay muted loop playsInline preload="auto" aria-hidden="true" tabIndex={-1} onCanPlay={() => setReady(true)} />
          <button type="button" onClick={toggle} aria-label={paused ? 'Play background video' : 'Pause background video'}
            className="absolute bottom-5 right-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-ink/50 text-white backdrop-blur hover:bg-ink/70">
            {paused
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" /></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>}
          </button>
        </>
      )}
    </>
  );
}
