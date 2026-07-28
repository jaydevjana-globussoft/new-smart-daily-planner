import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { Target } from 'lucide-react';
import HabitTracker from '../components/Habits/HabitTracker';
import GoalTracker from '../components/Goals/GoalTracker';

const HabitsGoalsPage = () => {
  const { onOpenQuickAdd } = useOutletContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
    >
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
            <Target size={28} color="#FFFFFF" />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit', color: '#FFFFFF' }}>
              Habits & Long-term Goals
            </Typography>
            <Typography variant="body1" sx={{ color: '#F4EEFF', mt: 0.5, fontWeight: 500 }}>
              Track daily ritual consistency and project milestones in one place.
            </Typography>
          </Box>
        </Box>
      </Box>

      <HabitTracker onOpenQuickAdd={onOpenQuickAdd} />
      <GoalTracker onOpenQuickAdd={onOpenQuickAdd} />
    </motion.div>
  );
};

export default HabitsGoalsPage;
