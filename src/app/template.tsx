'use client';

import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: 'circle(100% at 50% 50%)' }}
      transition={{ ease: 'easeOut', duration: 0.7 }}
    >
      {children}
    </motion.div>
  );
} 