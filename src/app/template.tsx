'use client';

import { motion } from 'framer-motion';

/**
 * App Router templates re-mount on every navigation, so this runs an enter
 * animation per route: a butter panel wipes upward to reveal the page, while
 * the content eases in beneath it. (On the very first load the preloader is on
 * top, so this plays unseen — no clash.)
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        style={{ originY: 0 }}
        className="pointer-events-none fixed inset-0 z-[120] origin-top bg-butter"
      />
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
