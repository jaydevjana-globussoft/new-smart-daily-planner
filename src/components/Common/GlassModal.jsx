import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Modal, Box, IconButton, Typography } from '@mui/material';

const GlassModal = ({ open, onClose, title, children, maxWidth = 550 }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        backdropFilter: 'blur(12px)',
        backgroundColor: 'rgba(31, 18, 42, 0.4)'
      }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{ width: '100%', maxWidth, outline: 'none' }}
          >
            <Box
              className="glass-overlay"
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                color: '#1F2937',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto',
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                border: '1px solid rgba(124, 92, 252, 0.2)',
                boxShadow: '0 20px 50px rgba(124, 92, 252, 0.18)'
              }}
            >
              {title && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Outfit', color: '#1F2937' }}>
                    {title}
                  </Typography>
                  <IconButton
                    onClick={onClose}
                    sx={{
                      color: '#6B7280',
                      backgroundColor: '#F4EEFF',
                      '&:hover': { color: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' }
                    }}
                  >
                    <X size={20} />
                  </IconButton>
                </Box>
              )}
              {children}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default GlassModal;
