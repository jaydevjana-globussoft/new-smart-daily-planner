import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@mui/material';

const SkeuoButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  icon: Icon,
  disabled = false,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          background: 'linear-gradient(145deg, #10b981, #059669)',
          boxShadow: '0px 4px 0px #047857, 0px 8px 15px rgba(16, 185, 129, 0.35)'
        };
      case 'accent':
        return {
          background: 'linear-gradient(145deg, #ec4899, #db2777)',
          boxShadow: '0px 4px 0px #be185d, 0px 8px 15px rgba(236, 72, 153, 0.35)'
        };
      case 'warning':
        return {
          background: 'linear-gradient(145deg, #f59e0b, #d97706)',
          boxShadow: '0px 4px 0px #b45309, 0px 8px 15px rgba(245, 158, 11, 0.35)'
        };
      case 'dark':
        return {
          background: 'linear-gradient(145deg, #334155, #1e293b)',
          boxShadow: '0px 4px 0px #0f172a, 0px 6px 12px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255,255,255,0.1)'
        };
      default: // primary indigo
        return {
          background: 'linear-gradient(145deg, #6366f1, #4f46e5)',
          boxShadow: '0px 4px 0px #3730a3, 0px 8px 15px rgba(99, 102, 241, 0.4)'
        };
    }
  };

  const vStyles = getVariantStyles();

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ y: 2, scale: 0.98 }}
      style={{ display: fullWidth ? 'block' : 'inline-block', width: fullWidth ? '100%' : 'auto' }}
    >
      <button
        onClick={onClick}
        disabled={disabled}
        className={`skeuo-btn ${className}`}
        style={{
          ...vStyles,
          width: fullWidth ? '100%' : 'auto',
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
        {...props}
      >
        {Icon && <Icon size={18} style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.5))' }} />}
        <span>{children}</span>
      </button>
    </motion.div>
  );
};

export default SkeuoButton;
