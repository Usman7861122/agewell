import { Children, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Staggers its direct children in as the group scrolls into view.
export default function StaggerList({ children, className, step = 0.09 }: { children?: ReactNode; className?: string; step?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className}
      initial={reduce ? false : 'hidden'} whileInView="show" viewport={{ once: true, margin: '-60px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: step } } }}>
      {Children.map(children, (child) => (
        <motion.div className="h-full" variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
