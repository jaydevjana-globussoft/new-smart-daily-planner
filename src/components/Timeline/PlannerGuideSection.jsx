import React, { useLayoutEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import {
  Info,
  MousePointer,
  Move,
  Maximize2,
  Zap,
  Clock,
  Trash2,
  Sparkles
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GESTURE_ITEMS = [
  {
    icon: MousePointer,
    title: 'Single Click',
    desc: 'Mark task Complete / Incomplete',
    iconGradient: 'linear-gradient(135deg, #7C5CFC, #6366F1)',
    glowColor: 'rgba(124, 92, 252, 0.45)',
    side: 'left'
  },
  {
    icon: MousePointer,
    title: 'Double Click',
    desc: 'Open Edit Dialog to edit task',
    iconGradient: 'linear-gradient(135deg, #7C5CFC, #A855F7)',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    side: 'right'
  },
  {
    icon: Move,
    title: 'Drag Block',
    desc: 'Reposition entire task time window',
    iconGradient: 'linear-gradient(135deg, #6366F1, #3B82F6)',
    glowColor: 'rgba(99, 102, 241, 0.45)',
    side: 'left'
  },
  {
    icon: Maximize2,
    title: 'Drag Edges',
    desc: 'Resize left/right edge to adjust duration',
    iconGradient: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
    glowColor: 'rgba(59, 130, 246, 0.45)',
    side: 'right'
  },
  {
    icon: Info,
    title: 'Hover Block',
    desc: 'View complete 9-property task popover',
    iconGradient: 'linear-gradient(135deg, #A855F7, #EC4899)',
    glowColor: 'rgba(236, 72, 153, 0.45)',
    side: 'left'
  },
  {
    icon: Zap,
    title: 'Highlighted Task',
    desc: 'Orange glow = task currently in progress',
    iconGradient: 'linear-gradient(135deg, #FF7A59, #FF6B00)',
    glowColor: 'rgba(255, 122, 89, 0.5)',
    side: 'right'
  },
  {
    icon: Clock,
    title: 'Current Time Line',
    desc: 'Real-time line indicator (Hover for exact time)',
    iconGradient: 'linear-gradient(135deg, #FF7A59, #E55C3A)',
    glowColor: 'rgba(255, 122, 89, 0.5)',
    side: 'left'
  },
  {
    icon: Trash2,
    title: 'Delete Icon',
    desc: 'Click bottom-right icon to delete task',
    iconGradient: 'linear-gradient(135deg, #EF4444, #DC2626)',
    glowColor: 'rgba(239, 68, 68, 0.5)',
    side: 'right'
  }
];

const ENERGY_ITEMS = [
  { emoji: '🟢', label: 'High Energy', desc: 'Deep Work / Coding / Study', bg: 'rgba(34, 197, 94, 0.08)', color: '#15803D', glow: 'rgba(34, 197, 94, 0.4)' },
  { emoji: '🟡', label: 'Medium Energy', desc: 'Meetings / Planning / Learning', bg: 'rgba(245, 158, 11, 0.08)', color: '#B45309', glow: 'rgba(245, 158, 11, 0.4)' },
  { emoji: '🟠', label: 'Low Energy', desc: 'Routine / Admin / Chores', bg: 'rgba(249, 115, 22, 0.08)', color: '#C2410C', glow: 'rgba(249, 115, 22, 0.4)' },
  { emoji: '🔵', label: 'Recovery', desc: 'Break / Lunch / Meditation', bg: 'rgba(59, 130, 246, 0.08)', color: '#1D4ED8', glow: 'rgba(59, 130, 246, 0.4)' },
  { emoji: '🌙', label: 'Sleep & Rest', desc: 'Circadian wind-down & sleep window', bg: 'rgba(139, 92, 246, 0.08)', color: '#6D28D9', glow: 'rgba(139, 92, 246, 0.4)' }
];

const PlannerGuideSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);

  const gestureIconsRef = useRef([]);
  const gestureTextsRef = useRef([]);
  const legendItemsRef = useRef([]);
  const legendIndicatorsRef = useRef([]);
  const legendLabelsRef = useRef([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // ScrollTrigger timeline that resets when scrolled away and replays when returned
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',                // Triggers when ~70% of section is visible
          end: 'bottom top',               // When section leaves viewport
          toggleActions: 'restart reset restart reset' // Resets on leave, replays on return!
        }
      });

      // 1. Section Heading Animation (Fade in + slide up 25px)
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 25, filter: 'drop-shadow(0 0 0px rgba(124, 92, 252, 0))' },
        {
          opacity: 1,
          y: 0,
          filter: 'drop-shadow(0 0 10px rgba(124, 92, 252, 0.35))',
          duration: 0.7,
          ease: 'power3.out'
        },
        0
      );

      // 2. Guide Cards Entrance (Upward motion 20px, increase shadow & brightness)
      tl.fromTo(
        [leftCardRef.current, rightCardRef.current],
        { opacity: 0, y: 20, filter: 'brightness(92%)', boxShadow: '0 2px 6px rgba(124, 92, 252, 0.02)' },
        {
          opacity: 1,
          y: 0,
          filter: 'brightness(100%)',
          boxShadow: '4px 4px 16px rgba(124, 92, 252, 0.08), -4px -4px 14px #FFFFFF',
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out'
        },
        0.18
      );

      // 3. Neon AI Icon Entrance (Scale 0.7 -> 1, rotation 25° -> 0°, brightness 0 -> 100%, outer glow)
      const validIcons = gestureIconsRef.current.filter(Boolean);
      tl.fromTo(
        validIcons,
        { scale: 0.7, opacity: 0, rotation: 25, filter: 'brightness(0%)' },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          filter: 'brightness(100%)',
          duration: 0.8,
          stagger: 0.12,
          ease: 'back.out(1.7)'
        },
        0.3
      );

      // 4. Description Text Slide-ins (Left column slides from left x: -25, Right column slides from right x: 25)
      GESTURE_ITEMS.forEach((item, i) => {
        const textEl = gestureTextsRef.current[i];
        if (!textEl) return;

        const xOffset = item.side === 'left' ? -25 : 25;
        tl.fromTo(
          textEl,
          { opacity: 0, x: xOffset },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: 'power3.out'
          },
          0.38 + i * 0.08
        );
      });

      // 5. Energy Level Legend Items Reveal
      ENERGY_ITEMS.forEach((_, i) => {
        const itemEl = legendItemsRef.current[i];
        const indicatorEl = legendIndicatorsRef.current[i];
        const labelEl = legendLabelsRef.current[i];

        if (!itemEl) return;

        // Container fade in
        tl.fromTo(
          itemEl,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
          0.45 + i * 0.09
        );

        // Indicator soft glow & scale
        if (indicatorEl) {
          tl.fromTo(
            indicatorEl,
            { scale: 0.7, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.6)' },
            0.48 + i * 0.09
          );
        }

        // Label text fade in immediately after
        if (labelEl) {
          tl.fromTo(
            labelEl,
            { opacity: 0, x: 15 },
            { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out' },
            0.54 + i * 0.09
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <Box ref={sectionRef} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
      {/* Section Title with Soft Glow Reveal */}
      <Box ref={titleRef} sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
        <Box
          sx={{
            p: 0.8,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #7C5CFC, #A855F7)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 3px 10px rgba(124, 92, 252, 0.3)'
          }}
        >
          <Info size={18} color="#ffffff" />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 800,
              fontFamily: 'Outfit',
              color: '#0F172A',
              fontSize: '1.05rem',
              letterSpacing: '-0.2px'
            }}
          >
            Planner Guide & Interaction Legend
          </Typography>
          <Sparkles size={16} color="#7C5CFC" />
        </Box>
      </Box>

      {/* 2-Column Grid: Gesture Controls on Left, Energy Legend on Right */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.2fr 0.8fr' }, gap: 2 }}>
        {/* Left Guide Card: Gesture Controls */}
        <Box
          ref={leftCardRef}
          className="guide-card"
          sx={{
            p: 2.25,
            borderRadius: '20px',
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(124, 92, 252, 0.14)',
            boxShadow: '4px 4px 16px rgba(124, 92, 252, 0.07), -4px -4px 14px #FFFFFF',
            transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.25s ease',
            '&:hover': {
              transform: 'translateY(-6px)',
              boxShadow: '0 16px 32px rgba(124, 92, 252, 0.15), -4px -4px 16px #FFFFFF',
              borderColor: 'rgba(124, 92, 252, 0.3)'
            }
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              color: '#7C5CFC',
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              mb: 1.8,
              display: 'block',
              fontSize: '0.7rem'
            }}
          >
            GESTURE & TIMELINE CONTROLS
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.8 }}>
            {GESTURE_ITEMS.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <Box
                  key={idx}
                  className="gesture-item-row"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.2,
                    p: 1,
                    borderRadius: '12px',
                    transition: 'background-color 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(124, 92, 252, 0.04)'
                    }
                  }}
                >
                  {/* Glowing Modern Neon AI-Style Icon Box */}
                  <Box
                    ref={(el) => (gestureIconsRef.current[idx] = el)}
                    className="gesture-icon-box skeuo-btn-shine"
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '10px',
                      background: item.iconGradient,
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: `0 4px 12px ${item.glowColor}, inset 0 1px 0 rgba(255, 255, 255, 0.4)`,
                      transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease',
                      '.gesture-item-row:hover &': {
                        transform: 'scale(1.08)',
                        boxShadow: `0 0 18px ${item.glowColor}`
                      }
                    }}
                  >
                    <IconComponent size={15} color="#ffffff" />
                  </Box>

                  {/* Alternating Slide Description Text */}
                  <Box ref={(el) => (gestureTextsRef.current[idx] = el)}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0F172A', display: 'block', fontSize: '0.785rem', lineHeight: 1.2 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.725rem', fontWeight: 500 }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Right Guide Card: Energy Level Legend */}
        <Box
          ref={rightCardRef}
          className="guide-card"
          sx={{
            p: 2.25,
            borderRadius: '20px',
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(124, 92, 252, 0.14)',
            boxShadow: '4px 4px 16px rgba(124, 92, 252, 0.07), -4px -4px 14px #FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.25s ease',
            '&:hover': {
              transform: 'translateY(-6px)',
              boxShadow: '0 16px 32px rgba(124, 92, 252, 0.15), -4px -4px 16px #FFFFFF',
              borderColor: 'rgba(124, 92, 252, 0.3)'
            }
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: '#7C5CFC',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                mb: 1.8,
                display: 'block',
                fontSize: '0.7rem'
              }}
            >
              ENERGY LEVEL LEGEND
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {ENERGY_ITEMS.map((item, idx) => (
                <Box
                  key={idx}
                  ref={(el) => (legendItemsRef.current[idx] = el)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 0.85,
                    px: 1.2,
                    borderRadius: '12px',
                    backgroundColor: item.bg,
                    border: '1px solid transparent',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: `${item.color}40`,
                      boxShadow: `0 3px 12px ${item.glow}`
                    }
                  }}
                >
                  <Box
                    ref={(el) => (legendIndicatorsRef.current[idx] = el)}
                    sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}
                  >
                    <span style={{ fontSize: '0.9rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>{item.emoji}</span>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: item.color, fontSize: '0.785rem' }}>
                      {item.label}
                    </Typography>
                  </Box>

                  <Typography
                    ref={(el) => (legendLabelsRef.current[idx] = el)}
                    variant="caption"
                    sx={{ color: '#475569', fontSize: '0.725rem', fontWeight: 600 }}
                  >
                    {item.desc}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PlannerGuideSection;
