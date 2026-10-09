import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

// Hero content fades up once on load. Hero photo itself stays static (brief: no obstructive video).
export default function HeroMotion({ children, className }: { children?: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}
