import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Chip, IconButton } from '@mui/material';
import { Flame, Check, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';
import NeumoCard from '../Common/NeumoCard';
import { usePlannerStore } from '../../store/usePlannerStore';
import { CATEGORY_COLORS } from '../../constants/plannerData';

const HabitTracker = ({ onOpenQuickAdd }) => {
  const { habits, toggleHabit } = usePlannerStore();

  const handleCheckIn = (habitId, currentStatus) => {
    toggleHabit(habitId);
    if (!currentStatus) {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  return (
    <NeumoCard sx={{ p: { xs: 2.5, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ p: 1, borderRadius: 2.5, backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#D97706', display: 'flex' }}>
            <Flame size={22} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'Outfit', color: '#1F2937' }}>
            Habits & Streaks
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={onOpenQuickAdd}
          sx={{
            color: '#7C5CFC',
            backgroundColor: '#F4EEFF',
            border: '1px solid rgba(124, 92, 252, 0.15)',
            boxShadow: '3px 3px 8px rgba(124, 92, 252, 0.08), -3px -3px 8px #FFFFFF',
            '&:hover': { backgroundColor: '#7C5CFC', color: '#FFFFFF' }
          }}
        >
          <Plus size={18} />
        </IconButton>
      </Box>

      {/* Habit List Grid */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {habits.map((habit) => {
          const categoryColor = CATEGORY_COLORS[habit.category] || CATEGORY_COLORS.health;

          return (
            <motion.div key={habit.id} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <Box
                sx={{
                  p: 2.2,
                  borderRadius: 3.5,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(124, 92, 252, 0.12)',
                  boxShadow: '4px 4px 12px rgba(124, 92, 252, 0.06), -4px -4px 10px #FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#7C5CFC',
                    boxShadow: '6px 6px 16px rgba(124, 92, 252, 0.12), -4px -4px 10px #FFFFFF'
                  }
                }}
              >
                {/* Habit Details */}
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8, flexWrap: 'wrap' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1F2937' }}>
                      {habit.title}
                    </Typography>
                    <Chip
                      icon={<Flame size={12} color="#D97706" />}
                      label={`${habit.streak} day streak`}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: '0.725rem',
                        backgroundColor: 'rgba(245, 158, 11, 0.12)',
                        color: '#D97706',
                        fontWeight: 800
                      }}
                    />
                  </Box>

                  {/* Last 7 Days Matrix Dots */}
                  <Box sx={{ display: 'flex', gap: 0.8, mt: 1 }}>
                    {habit.history.map((done, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: 1.5,
                          backgroundColor: done ? '#7C5CFC' : '#F4EEFF',
                          border: done ? 'none' : '1px solid rgba(124, 92, 252, 0.12)',
                          boxShadow: done ? '0 2px 6px rgba(124, 92, 252, 0.3)' : 'none'
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Skeuomorphic Check-In Button */}
                <button
                  onClick={() => handleCheckIn(habit.id, habit.completedToday)}
                  className="skeuo-btn"
                  style={{
                    padding: '8px 16px',
                    borderRadius: 12,
                    fontSize: '0.825rem',
                    background: habit.completedToday
                      ? 'linear-gradient(145deg, #22C55E, #16A34A)'
                      : 'linear-gradient(145deg, #7C5CFC, #6366F1)',
                    boxShadow: habit.completedToday
                      ? '0px 4px 0px #15803D, 0px 6px 14px rgba(34, 197, 94, 0.3)'
                      : '0px 4px 0px #4F32C9, 0px 6px 14px rgba(124, 92, 252, 0.3)'
                  }}
                >
                  {habit.completedToday ? <Check size={16} color="#ffffff" /> : 'Check In'}
                </button>
              </Box>
            </motion.div>
          );
        })}
      </Box>
    </NeumoCard>
  );
};

export default HabitTracker;
