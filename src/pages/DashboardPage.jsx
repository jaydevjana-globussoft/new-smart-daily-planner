import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Typography, Chip } from '@mui/material';
import { Sparkles, Calendar as CalendarIcon, Flame, Target, Zap, Clock } from 'lucide-react';
import { usePlannerStore } from '../store/usePlannerStore';
import { USER_ARCHETYPES } from '../constants/plannerData';
import SmartSuggestions from '../components/Dashboard/SmartSuggestions';
import DayPlannerWidget from '../components/Timeline/DayPlannerWidget';
import TodayTimeline from '../components/Timeline/TodayTimeline';
import PlannerCalendar from '../components/Calendar/PlannerCalendar';
import HabitTracker from '../components/Habits/HabitTracker';
import GoalTracker from '../components/Goals/GoalTracker';
import AnalyticsWidget from '../components/Statistics/AnalyticsWidget';

const DashboardPage = () => {
  const { onOpenQuickAdd } = useOutletContext();
  const { archetype, tasks, habits } = usePlannerStore();

  const currentArchetypeObj = USER_ARCHETYPES.find((a) => a.id === archetype) || USER_ARCHETYPES[0];
  const pendingCount = tasks.filter((t) => !t.completed).length;

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isA = e.key && e.key.toLowerCase() === 'a';
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
      
      if (isA && (e.altKey || (!isInput && e.shiftKey))) {
        e.preventDefault();
        if (onOpenQuickAdd) {
          onOpenQuickAdd();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenQuickAdd]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}
    >
      {/* Today's Flow Banner (Height ~150px, 32px Internal Padding, Matches Content Width) */}
      <Box
        className="neumo-card"
        sx={{
          minHeight: '150px',
          p: { xs: 2.5, md: 4 },
          borderRadius: '22px',
          background: 'linear-gradient(135deg, #7C5CFC 0%, #A855F7 50%, #FF7A59 100%)',
          boxShadow: '0 16px 32px -8px rgba(124, 92, 252, 0.32)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2.5,
          boxSizing: 'border-box'
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 0.4, flexWrap: 'wrap' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Outfit', letterSpacing: -0.5, color: '#FFFFFF', fontSize: { xs: '1.25rem', md: '1.4rem' } }}>
              Today's Flow
            </Typography>
            <Chip
              label={currentArchetypeObj.label}
              size="small"
              sx={{
                fontWeight: 700,
                backgroundColor: 'rgba(255, 255, 255, 0.22)',
                backdropFilter: 'blur(12px)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                px: 0.5,
                height: 24,
                fontSize: '0.75rem'
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: '#F4EEFF', fontSize: '0.875rem', fontWeight: 500 }}>
            {currentArchetypeObj.tagline} • You have <strong style={{ color: '#FFFFFF', fontWeight: 800 }}>{pendingCount} tasks</strong> pending.
          </Typography>
        </Box>

        {/* Quick Action FAB / Button with Keyboard Shortcut Badge */}
        <button
          onClick={onOpenQuickAdd}
          className="skeuo-btn"
          title="Add Activity (Shortcut: Alt + A)"
          style={{
            padding: '7px 16px',
            borderRadius: '14px',
            background: 'linear-gradient(145deg, #FFFFFF, #F4EEFF)',
            color: '#7C5CFC',
            boxShadow: '0px 3px 0px #D8B4FE, 0px 6px 16px rgba(0, 0, 0, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            fontWeight: 800,
            fontSize: '0.825rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <span>+ Add Activity</span>
          <span
            style={{
              fontSize: '0.675rem',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '6px',
              backgroundColor: 'rgba(124, 92, 252, 0.12)',
              color: '#7C5CFC',
              border: '1px solid rgba(124, 92, 252, 0.25)',
              letterSpacing: '0.3px',
              fontFamily: 'monospace'
            }}
          >
            Alt+A
          </span>
        </button>
      </Box>

      {/* AI Smart Suggestions Banner */}
      <SmartSuggestions />

      {/* Day Planner Interactive 24-Hour Horizontal Timeline */}
      <DayPlannerWidget />

      {/* Main Grid Section: Timeline on left, Calendar & Habits on right */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.25fr 0.75fr' }, gap: 3 }}>
        {/* Left Column: Timeline */}
        <TodayTimeline onOpenQuickAdd={onOpenQuickAdd} />

        {/* Right Column: Calendar & Habits */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <PlannerCalendar />
          <HabitTracker onOpenQuickAdd={onOpenQuickAdd} />
        </Box>
      </Box>

      {/* Goals Section */}
      <GoalTracker onOpenQuickAdd={onOpenQuickAdd} />

      {/* 2D Interactive Productivity & Time Analytics */}
      <AnalyticsWidget />
    </motion.div>
  );
};

export default DashboardPage;
