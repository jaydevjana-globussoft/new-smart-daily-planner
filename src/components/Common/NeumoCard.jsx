import React from 'react';
import { motion } from 'framer-motion';

const NeumoCard = ({
  children,
  className = '',
  inset = false,
  hoverEffect = true,
  style = {},
  onClick,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={hoverEffect ? { y: -3, transition: { duration: 0.2 } } : {}}
      onClick={onClick}
      className={`${inset ? 'neumo-inset' : 'neumo-card'} ${className}`}
      style={{
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default NeumoCard;
