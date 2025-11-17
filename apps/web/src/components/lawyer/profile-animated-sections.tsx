'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ProfileAnimatedSectionsProps {
  children: ReactNode;
}

/**
 * ProfileAnimatedSections component
 * Wraps profile sections with staggered fade-in animations using Framer Motion
 */
const ProfileAnimatedSections = ({ children }: ProfileAnimatedSectionsProps): JSX.Element => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto"
    >
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div key={index} variants={item}>
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={item}>{children}</motion.div>
      )}
    </motion.div>
  );
};

export default ProfileAnimatedSections;
