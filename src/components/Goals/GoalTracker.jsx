import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Chip, IconButton, Tooltip } from '@mui/material';
import { Target, Plus, CheckCircle2 } from 'lucide-react';
import NeumoCard from '../Common/NeumoCard';
import { usePlannerStore } from '../../store/usePlannerStore';
import { CATEGORY_COLORS } from '../../constants/plannerData';

const GoalTracker = ({ onOpenQuickAdd }) => {
  const { goals, updateGoalProgress } = usePlannerStore();

  return (
    <NeumoCard sx={{ p: { xs: 2.5, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ p: 1, borderRadius: 2.5, backgroundColor: 'rgba(168, 85, 247, 0.12)', color: '#A855F7', display: 'flex' }}>
            <Target size={22} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'Outfit', color: '#1F2937' }}>
            Active Goals & Milestones
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={onOpenQuickAdd}
          sx={{
            color: '#A855F7',
            backgroundColor: '#F4EEFF',
            border: '1px solid rgba(168, 85, 247, 0.15)',
            boxShadow: '3px 3px 8px rgba(124, 92, 252, 0.08), -3px -3px 8px #FFFFFF',
            '&:hover': { backgroundColor: '#A855F7', color: '#FFFFFF' }
          }}
        >
          <Plus size={18} />
        </IconButton>
      </Box>

      {/* Goal Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {goals.map((goal) => {
          const categoryColor = CATEGORY_COLORS[goal.category] || CATEGORY_COLORS.personal;

          return (
            <motion.div key={goal.id} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 3.5,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(124, 92, 252, 0.12)',
                  boxShadow: '4px 4px 12px rgba(124, 92, 252, 0.06), -4px -4px 10px #FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.8,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#7C5CFC',
                    boxShadow: '6px 6px 16px rgba(124, 92, 252, 0.12), -4px -4px 10px #FFFFFF'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1F2937' }}>
                      {goal.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 600 }}>
                      Target Date: {goal.targetDate}
                    </Typography>
                  </Box>
                  <Chip
                    label={categoryColor.label}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: '0.725rem',
                      backgroundColor: `${categoryColor.bg}18`,
                      color: categoryColor.bg,
                      fontWeight: 800,
                      border: `1px solid ${categoryColor.bg}33`
                    }}
                  />
                </Box>

                {/* Progress Bar & Percentage */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#6B7280' }}>
                        Progress
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#7C5CFC' }}>
                        {goal.progress}%
                      </Typography>
                    </Box>
                    <Box className="neumo-inset" sx={{ width: '100%', height: 10, borderRadius: 5, p: 0.3 }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${goal.progress}%` }}
                        transition={{ duration: 0.5 }}
                        style={{
                          height: '100%',
                          borderRadius: 4,
                          background: 'linear-gradient(90deg, #7C5CFC, #A855F7)'
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Incremental Controls */}
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Increase progress 10%">
                      <button
                        onClick={() => updateGoalProgress(goal.id, 10)}
                        className="skeuo-btn"
                        style={{
                          padding: '6px 12px',
                          fontSize: '0.75rem',
                          borderRadius: '10px',
                          background: 'linear-gradient(145deg, #7C5CFC, #6366F1)',
                          boxShadow: '0px 3px 0px #4F32C9'
                        }}
                      >
                        +10%
                      </button>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Milestones Chips */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.2 }}>
                  {goal.milestones.map((ms, idx) => (
                    <Chip
                      key={idx}
                      icon={<CheckCircle2 size={13} color="#22C55E" />}
                      label={ms}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: '0.725rem',
                        backgroundColor: '#F4EEFF',
                        color: '#1F2937',
                        fontWeight: 700,
                        border: '1px solid rgba(124, 92, 252, 0.15)'
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </motion.div>
          );
        })}
      </Box>
    </NeumoCard>
  );
};

export default GoalTracker;
