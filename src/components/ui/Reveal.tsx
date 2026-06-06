'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

type Props = {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
};

/** Scroll-triggered reveal — fades and slides content in as it enters view. */
export default function Reveal({ children, delay = 0, y = 28, className, once = true }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '-12% 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
