import { useEffect, useRef, type ComponentProps } from 'react';

export interface SonarGridProps extends ComponentProps<'div'> {
  spacing?: number;      // distance between dots (px)
  dotRadius?: number;    // dot radius at rest (px)
  baseOpacity?: number;  // resting dot opacity (0-1)
  color?: string;        // any CSS color
  pingEvery?: number;    // seconds between ambient pings, 0 = off
  speed?: number;        // wavefront speed (px/s)
  ringWidth?: number;    // wavefront thickness (px)
  amplitude?: number;    // dot growth at wave peak
  interactive?: boolean; // ping where the user taps or clicks
  maxRings?: number;
  seedPing?: boolean;
  pingArea?: [number, number, number, number];
}

interface Ring { x: number; y: number; born: number }
const MAX_DPR = 2;
const TAU = Math.PI * 2;

/** Decorative dot field that answers taps with expanding rings. Canvas based; pauses off-screen and in hidden tabs; still grid under prefers-reduced-motion. */
export default function SonarGrid({
  spacing = 26, dotRadius = 1.4, baseOpacity = 0.28, color, pingEvery = 2.4, speed = 260, ringWidth = 90,
  amplitude = 2.2, interactive = true, maxRings = 6, seedPing = true, pingArea = [0.15, 0.2, 0.85, 0.8],
  className = '', children, ...rest
}: SonarGridProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringsRef = useRef<Ring[]>([]);
  const refreshRef = useRef<() => void>(() => {});
  const opts = useRef({ spacing, dotRadius, baseOpacity, pingEvery, speed, ringWidth, amplitude, interactive, maxRings, seedPing, pingArea });
  opts.current = { spacing, dotRadius, baseOpacity, pingEvery, speed, ringWidth, amplitude, interactive, maxRings, seedPing, pingArea };

  useEffect(() => {
    const host = hostRef.current, canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0, height = 0, raf = 0, timer = 0, visible = true, seeded = false, stroke = '';
    let nextPing = performance.now() + opts.current.pingEvery * 1000;

    const readColor = () => { stroke = getComputedStyle(canvas).color; };
    const addRing = (x: number, y: number, born: number) => {
      readColor();
      const rings = ringsRef.current;
      rings.push({ x, y, born });
      while (rings.length > opts.current.maxRings) rings.shift();
    };

    const draw = (now: number) => {
      const o = opts.current;
      const lifetime = (Math.hypot(width, height) + o.ringWidth) / o.speed;
      ringsRef.current = ringsRef.current.filter((r) => (now - r.born) / 1000 < lifetime);
      const live = ringsRef.current.map((r) => {
        const age = (now - r.born) / 1000;
        const radius = age * o.speed;
        return { x: r.x, y: r.y, radius, reach: radius + o.ringWidth, fade: 1 - age / lifetime };
      });
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = stroke;
      const cols = Math.ceil(width / o.spacing) + 1;
      const rows = Math.ceil(height / o.spacing) + 1;
      const offsetX = (width - (cols - 1) * o.spacing) / 2;
      const offsetY = (height - (rows - 1) * o.spacing) / 2;
      const hot: number[] = [];
      ctx.globalAlpha = o.baseOpacity;
      ctx.beginPath();
      for (let i = 0; i < cols; i++) {
        const cx = offsetX + i * o.spacing;
        for (let j = 0; j < rows; j++) {
          const cy = offsetY + j * o.spacing;
          let energy = 0;
          for (const r of live) {
            if (Math.abs(cx - r.x) > r.reach || Math.abs(cy - r.y) > r.reach) continue;
            const dist = Math.abs(Math.hypot(cx - r.x, cy - r.y) - r.radius);
            if (dist >= o.ringWidth) continue;
            const t = 1 - dist / o.ringWidth;
            const k = t * t * (3 - 2 * t) * r.fade;
            if (k > energy) energy = k;
          }
          if (energy < 0.01) { ctx.moveTo(cx + o.dotRadius, cy); ctx.arc(cx, cy, o.dotRadius, 0, TAU); }
          else hot.push(cx, cy, energy);
        }
      }
      ctx.fill();
      for (let k = 0; k < hot.length; k += 3) {
        const energy = hot[k + 2] ?? 0;
        ctx.globalAlpha = o.baseOpacity + (1 - o.baseOpacity) * energy;
        ctx.beginPath();
        ctx.arc(hot[k] ?? 0, hot[k + 1] ?? 0, o.dotRadius * (1 + o.amplitude * energy), 0, TAU);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!seeded) {
        seeded = true;
        const [x0, y0, x1, y1] = opts.current.pingArea;
        if (opts.current.seedPing && !reduceMotion.matches)
          addRing(width * (x0 + (x1 - x0) * 0.68), height * (y0 + (y1 - y0) * 0.34), performance.now() - 500);
      }
      draw(performance.now());
    };

    const scheduleIdle = (delay: number) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => tick(performance.now()), Math.max(16, delay));
    };
    const tick = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      if (reduceMotion.matches) { ringsRef.current = []; draw(now); return; }
      const o = opts.current;
      if (o.pingEvery > 0 && now >= nextPing) {
        const [x0, y0, x1, y1] = o.pingArea;
        addRing(width * (x0 + Math.random() * (x1 - x0)), height * (y0 + Math.random() * (y1 - y0)), now);
        nextPing = now + o.pingEvery * 1000;
      }
      draw(now);
      if (ringsRef.current.length > 0) raf = requestAnimationFrame(tick);
      else if (o.pingEvery > 0) scheduleIdle(nextPing - now);
    };
    const wake = () => { if (!raf) { window.clearTimeout(timer); raf = requestAnimationFrame(tick); } };

    refreshRef.current = () => {
      readColor();
      nextPing = Math.min(nextPing, performance.now() + opts.current.pingEvery * 1000);
      wake();
    };
    const onDown = (e: PointerEvent) => {
      if (!opts.current.interactive || reduceMotion.matches) return;
      const rect = host.getBoundingClientRect();
      addRing(e.clientX - rect.left, e.clientY - rect.top, performance.now());
      wake();
    };
    const onVisibility = () => { if (!document.hidden) wake(); };

    const ro = new ResizeObserver(resize);
    const io = new IntersectionObserver(([entry]) => { visible = entry?.isIntersecting ?? true; if (visible) wake(); }, { threshold: 0 });

    readColor();
    resize();
    ro.observe(host);
    io.observe(host);
    host.addEventListener('pointerdown', onDown);
    document.addEventListener('visibilitychange', onVisibility);
    reduceMotion.addEventListener('change', wake);
    wake();

    return () => {
      ro.disconnect(); io.disconnect();
      host.removeEventListener('pointerdown', onDown);
      document.removeEventListener('visibilitychange', onVisibility);
      reduceMotion.removeEventListener('change', wake);
      cancelAnimationFrame(raf); window.clearTimeout(timer);
      refreshRef.current = () => {};
    };
  }, []);

  useEffect(() => { refreshRef.current(); }, [spacing, dotRadius, baseOpacity, color, pingEvery, speed, ringWidth, amplitude, interactive, maxRings, pingArea]);

  return (
    <div ref={hostRef} data-slot="sonar-grid" className={`relative isolate overflow-hidden ${interactive ? 'cursor-crosshair' : ''} ${className}`} {...rest}>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 h-full w-full text-brand" style={color ? { color } : undefined} />
      {children}
    </div>
  );
}
