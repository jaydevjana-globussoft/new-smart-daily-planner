import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { Clock } from 'lucide-react';
import DayPlannerWidget from '../components/Timeline/DayPlannerWidget';
import TodayTimeline from '../components/Timeline/TodayTimeline';
import PlannerCalendar from '../components/Calendar/PlannerCalendar';

const TimelinePage = () => {
  const { onOpenQuickAdd } = useOutletContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
    >
      {/* Timeline & Calendar Banner */}
      <Box
        className="neumo-card"
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: { xs: 5, md: 6 },
          background: 'linear-gradient(135deg, #7C5CFC 0%, #A855F7 50%, #FF7A59 100%)',
          boxShadow: '0 20px 40px -10px rgba(124, 92, 252, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ p: 1.5, borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.22)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.35)' }}>
            <Clock size={28} color="#FFFFFF" />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit', letterSpacing: -0.5, color: '#FFFFFF' }}>
              Timeline & Interactive Calendar
            </Typography>
            <Typography variant="body1" sx={{ color: '#F4EEFF', mt: 0.5, fontWeight: 500 }}>
              Visual 24-hour drag-and-drop schedule, daily focus blocks, and full planner calendar.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* 24-Hour Visual Drag-and-Drop Timeline Widget */}
      <DayPlannerWidget />

      {/* Main Grid: Today Timeline on Left, Planner Calendar on Right */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.25fr 0.75fr' }, gap: 3 }}>
        <TodayTimeline onOpenQuickAdd={onOpenQuickAdd} />
        <PlannerCalendar />
      </Box>
    </motion.div>
  );
};

export default TimelinePage;
