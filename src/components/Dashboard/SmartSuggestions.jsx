import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography, IconButton } from '@mui/material';
import { Sparkles, ArrowRight, X, Cpu, Zap, ShieldAlert } from 'lucide-react';
import { useAIStore } from '../../store/useAIStore';
import { usePlannerStore } from '../../store/usePlannerStore';

const PRIORITY_CONFIG = {
  high: {
    label: 'HIGH PRIORITY',
    badgeBg: 'rgba(255, 122, 89, 0.12)',
    badgeColor: '#C2410C',
    badgeBorder: 'rgba(255, 122, 89, 0.3)',
    accentGradient: 'linear-gradient(90deg, #FF7A59, #FF6B00)',
    btnGradient: 'linear-gradient(145deg, #FF7A59, #E55C3A)',
    btnShadow: '0px 3px 0px #C74223, 0px 5px 12px rgba(255, 122, 89, 0.3)',
    icon: ShieldAlert,
    iconColor: '#FF7A59'
  },
  medium: {
    label: 'RECOMMENDED',
    badgeBg: 'rgba(124, 92, 252, 0.12)',
    badgeColor: '#6D28D9',
    badgeBorder: 'rgba(124, 92, 252, 0.3)',
    accentGradient: 'linear-gradient(90deg, #7C5CFC, #A855F7)',
    btnGradient: 'linear-gradient(145deg, #7C5CFC, #6366F1)',
    btnShadow: '0px 3px 0px #4F32C9, 0px 5px 12px rgba(124, 92, 252, 0.3)',
    icon: Zap,
    iconColor: '#7C5CFC'
  },
  low: {
    label: 'WELLNESS FOCUS',
    badgeBg: 'rgba(59, 130, 246, 0.12)',
    badgeColor: '#1D4ED8',
    badgeBorder: 'rgba(59, 130, 246, 0.3)',
    accentGradient: 'linear-gradient(90deg, #3B82F6, #06B6D4)',
    btnGradient: 'linear-gradient(145deg, #3B82F6, #2563EB)',
    btnShadow: '0px 3px 0px #1D4ED8, 0px 5px 12px rgba(59, 130, 246, 0.3)',
    icon: Cpu,
    iconColor: '#3B82F6'
  }
};

const SmartSuggestions = () => {
  const { suggestions, dismissSuggestion } = useAIStore();
  const { addTask } = usePlannerStore();
  const [acceptingId, setAcceptingId] = useState(null);

  const handleApplySuggestion = (sug) => {
    setAcceptingId(sug.id);

    // Micro-interaction delay: shrink into planner before removal
    setTimeout(() => {
      addTask({
        title: sug.title,
        time: '14:00',
        duration: 45,
        category: sug.category || 'personal',
        energy: 'High'
      });
      dismissSuggestion(sug.id);
      setAcceptingId(null);
    }, 280);
  };

  if (!suggestions.length) return null;

  // Word-by-word reveal variants for Heading
  const titleWords = ["AI", "Smart", "Suggestions"];

  const titleContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05
      }
    }
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.42,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: 0.3, ease: 'easeOut' }
    }
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.35, delay: 0.38, ease: [0.34, 1.56, 0.64, 1] }
    }
  };

  // Cards Container & Child Card Variants (Staggered reveal after heading)
  const cardsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.4
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.45,
        ease: [0.25, 1, 0.5, 1]
      }
    },
    exit: (custom) => ({
      opacity: 0,
      scale: custom?.isAccepted ? 0.75 : 0.9,
      y: custom?.isAccepted ? -30 : 0,
      x: custom?.isAccepted ? 40 : -35,
      filter: 'blur(6px)',
      transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] }
    })
  };

  // Inner card element sequential fade-ins
  const innerTextVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: (delay) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, delay, ease: 'easeOut' }
    })
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.94 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.32, delay: 0.35, ease: [0.34, 1.4, 0.64, 1] }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
    >
      <Box
        className="neumo-card"
        sx={{
          p: { xs: 2.5, md: 4 },
          borderRadius: '22px',
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(124, 92, 252, 0.14)',
          boxShadow: '6px 6px 20px rgba(124, 92, 252, 0.07), -6px -6px 16px #FFFFFF',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Compact Section Header with Word-by-Word Text Reveal & Shining AI Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, flexWrap: 'wrap', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <Box
                className="ai-glow"
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #7C5CFC, #A855F7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 3px 10px rgba(124, 92, 252, 0.28)',
                  flexShrink: 0
                }}
              >
                <Sparkles size={18} color="#ffffff" />
              </Box>
            </motion.div>

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Word-by-Word reveal for main heading */}
                <motion.div
                  variants={titleContainerVariants}
                  initial="hidden"
                  animate="visible"
                  style={{ display: 'flex', gap: '5px' }}
                >
                  {titleWords.map((word, i) => (
                    <motion.span
                      key={i}
                      variants={wordVariants}
                      style={{
                        display: 'inline-block',
                        fontFamily: 'Outfit',
                        fontWeight: 800,
                        fontSize: '1.12rem',
                        color: word === 'Suggestions' ? '#7C5CFC' : '#0F172A',
                        letterSpacing: '-0.3px'
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.div>

                {/* Live AI Engine Badge with Breathing Glow Dot */}
                <motion.div variants={badgeVariants} initial="hidden" animate="visible">
                  <Box
                    sx={{
                      px: 1,
                      py: 0.25,
                      borderRadius: '8px',
                      backgroundColor: 'rgba(124, 92, 252, 0.08)',
                      border: '1px solid rgba(124, 92, 252, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: '#22C55E',
                        animation: 'liveDotPulse 2s infinite ease-in-out'
                      }}
                    />
                    <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#7C5CFC', letterSpacing: '0.4px' }}>
                      LIVE AI ENGINE
                    </Typography>
                  </Box>
                </motion.div>
              </Box>

              {/* Subtitle reveal */}
              <motion.div variants={subtitleVariants} initial="hidden" animate="visible">
                <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.785rem', fontWeight: 600, display: 'block', mt: 0.05 }}>
                  Personalized schedule & focus recommendations tuned to your energy
                </Typography>
              </motion.div>
            </Box>
          </Box>
        </Box>

        {/* Suggestion Cards Grid */}
        <motion.div
          variants={cardsContainerVariants}
          initial="hidden"
          animate="visible"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}
        >
          <AnimatePresence mode="popLayout">
            {suggestions.map((sug, idx) => {
              const priorityKey = sug.priority || (idx === 0 ? 'high' : idx === 1 ? 'medium' : 'low');
              const priorityCfg = PRIORITY_CONFIG[priorityKey] || PRIORITY_CONFIG.medium;
              const PriorityIcon = priorityCfg.icon;

              return (
                <motion.div
                  key={sug.id}
                  custom={{ isAccepted: acceptingId === sug.id }}
                  variants={cardVariants}
                  exit="exit"
                  whileHover={{
                    y: -5,
                    scale: 1.015,
                    transition: { duration: 0.2, ease: 'easeOut' }
                  }}
                  style={{ height: '100%', position: 'relative' }}
                >
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: '16px',
                      backgroundColor: '#FFFFFF',
                      border: `1.5px solid ${priorityCfg.badgeBorder}`,
                      boxShadow: '3px 4px 14px rgba(124, 92, 252, 0.06), -3px -3px 12px #FFFFFF',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'background-color 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease',
                      '&:hover': {
                        borderColor: priorityCfg.iconColor,
                        boxShadow: '0 10px 24px rgba(124, 92, 252, 0.14), -3px -3px 12px #FFFFFF',
                        backgroundColor: '#FDF9FF'
                      }
                    }}
                  >
                    {/* Top Accent Line */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: priorityCfg.accentGradient
                      }}
                    />

                    {/* Dismiss Button */}
                    <IconButton
                      size="small"
                      onClick={() => dismissSuggestion(sug.id)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        padding: '4px',
                        color: '#9CA3AF',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          color: '#EF4444',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      <X size={14} />
                    </IconButton>

                    {/* Category Badge with Glowing Pulse */}
                    <motion.div
                      variants={innerTextVariants}
                      custom={0.08}
                      initial="hidden"
                      animate="visible"
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.2, pr: 3, flexWrap: 'wrap' }}>
                        <Box
                          className="category-badge-glow"
                          sx={{
                            px: 1,
                            py: 0.25,
                            borderRadius: '8px',
                            backgroundColor: priorityCfg.badgeBg,
                            border: `1px solid ${priorityCfg.badgeBorder}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                          }}
                        >
                          <PriorityIcon size={11} color={priorityCfg.badgeColor} />
                          <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.65rem', color: priorityCfg.badgeColor, letterSpacing: '0.3px' }}>
                            {sug.tag || priorityCfg.label}
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>

                    {/* Title & Description with Sequential Fade-In */}
                    <Box sx={{ mb: 1.8 }}>
                      <motion.div
                        variants={innerTextVariants}
                        custom={0.15}
                        initial="hidden"
                        animate="visible"
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 800,
                            fontFamily: 'Outfit',
                            color: '#0F172A',
                            mb: 0.4,
                            lineHeight: 1.28,
                            fontSize: '0.925rem'
                          }}
                        >
                          {sug.title}
                        </Typography>
                      </motion.div>

                      <motion.div
                        variants={innerTextVariants}
                        custom={0.24}
                        initial="hidden"
                        animate="visible"
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#334155',
                            fontSize: '0.8125rem',
                            lineHeight: 1.45,
                            fontWeight: 500
                          }}
                        >
                          {sug.description}
                        </Typography>
                      </motion.div>
                    </Box>

                    {/* Compact Skeuomorphic Action Button */}
                    <motion.div
                      variants={buttonVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleApplySuggestion(sug)}
                        className="skeuo-btn skeuo-btn-shine"
                        style={{
                          padding: '7px 15px',
                          fontSize: '0.775rem',
                          background: priorityCfg.btnGradient,
                          boxShadow: priorityCfg.btnShadow,
                          alignSelf: 'flex-start',
                          marginTop: 'auto',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          color: '#FFFFFF',
                          fontWeight: 750,
                          cursor: 'pointer'
                        }}
                      >
                        <span>{sug.actionLabel}</span>
                        <ArrowRight size={13} />
                      </motion.button>
                    </motion.div>
                  </Box>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default SmartSuggestions;
