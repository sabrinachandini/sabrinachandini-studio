'use client';

import { motion } from 'framer-motion';

interface MotionFadeProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function MotionFade({ children, delay = 0, className }: MotionFadeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MotionFadeList({
  children,
  className,
}: {
  children: React.ReactNode[];
  className?: string;
}) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <MotionFade key={index} delay={index * 0.05}>
          {child}
        </MotionFade>
      ))}
    </div>
  );
}
