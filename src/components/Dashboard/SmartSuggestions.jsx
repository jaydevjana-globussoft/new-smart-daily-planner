import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography, IconButton } from '@mui/material';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import NeumoCard from '../Common/NeumoCard';
import { useAIStore } from '../../store/useAIStore';
import { usePlannerStore } from '../../store/usePlannerStore';

const SmartSuggestions = () => {
  const { suggestions, dismissSuggestion } = useAIStore();
  const { addTask } = usePlannerStore();

  const handleApplySuggestion = (sug) => {
    addTask({
      title: sug.title,
      time: '14:00',
      duration: 45,
      category: sug.category || 'personal',
      energy: 'High'
    });
    dismissSuggestion(sug.id);
  };

  if (!suggestions.length) return null;

  return (
    <NeumoCard sx={{ p: { xs: 2.5, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
        <Box sx={{ p: 1, borderRadius: '20px', backgroundColor: '#F4EEFF', color: '#7C5CFC', display: 'flex', alignItems: 'center' }}>
          <Sparkles size={20} className="ai-glow" />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'Outfit', color: '#1F2937' }}>
            AI Smart Suggestions
          </Typography>
          <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.775rem' }}>
            Personalized recommendations tuned to your current focus flow
          </Typography>
        </Box>
      </Box>

      {/* Suggestion Cards Grid with Responsive Wrapping */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 2.5 }}>
        <AnimatePresence>
          {suggestions.map((sug) => (
            <motion.div
              key={sug.id}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: '20px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(124, 92, 252, 0.15)',
                  boxShadow: '4px 4px 14px rgba(124, 92, 252, 0.08), -4px -4px 12px #FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#7C5CFC',
                    boxShadow: '6px 6px 18px rgba(124, 92, 252, 0.14), -4px -4px 12px #FFFFFF'
                  }
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => dismissSuggestion(sug.id)}
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    color: '#9CA3AF',
                    '&:hover': { color: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' }
                  }}
                >
                  <X size={16} />
                </IconButton>

                <Box sx={{ pr: 3, mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1F2937', mb: 0.8, lineHeight: 1.3 }}>
                    {sug.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4B5563', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    {sug.description}
                  </Typography>
                </Box>

                <button
                  onClick={() => handleApplySuggestion(sug)}
                  className="skeuo-btn"
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.8rem',
                    background: 'linear-gradient(145deg, #7C5CFC, #6366F1)',
                    boxShadow: '0px 3px 0px #4F32C9, 0px 6px 14px rgba(124, 92, 252, 0.3)',
                    alignSelf: 'flex-start',
                    marginTop: 'auto'
                  }}
                >
                  <span>{sug.actionLabel}</span>
                  <ArrowRight size={14} />
                </button>
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>
    </NeumoCard>
  );
};

export default SmartSuggestions;
