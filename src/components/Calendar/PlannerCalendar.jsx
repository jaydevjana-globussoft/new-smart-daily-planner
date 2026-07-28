import React, { useState } from 'react';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import NeumoCard from '../Common/NeumoCard';
import { usePlannerStore } from '../../store/usePlannerStore';

const PlannerCalendar = () => {
  const { selectedDate, setSelectedDate } = usePlannerStore();
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next

  const startOfMonth = currentMonth.startOf('month');
  const daysInMonth = currentMonth.daysInMonth();
  const startDayOfWeek = startOfMonth.day(); // 0 = Sun

  const daysArray = [];
  // Empty padding slots
  for (let i = 0; i < startDayOfWeek; i++) {
    daysArray.push(null);
  }
  // Days of month
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(currentMonth.date(d));
  }

  const handlePrevMonth = () => {
    setDirection(-1);
    setCurrentMonth(currentMonth.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setDirection(1);
    setCurrentMonth(currentMonth.add(1, 'month'));
  };

  return (
    <NeumoCard sx={{ p: { xs: 2.5, md: 3 } }}>
      {/* Calendar Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ p: 1, borderRadius: 2.5, backgroundColor: '#F4EEFF', color: '#7C5CFC', display: 'flex' }}>
            <CalendarIcon size={20} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'Outfit', color: '#1F2937' }}>
            {currentMonth.format('MMMM YYYY')}
          </Typography>
        </Box>

        {/* Tactile Neumorphic Navigation Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="small"
            onClick={handlePrevMonth}
            sx={{
              color: '#1F2937',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(124, 92, 252, 0.15)',
              boxShadow: '3px 3px 8px rgba(124, 92, 252, 0.08), -3px -3px 8px #FFFFFF',
              transition: 'all 0.18s ease',
              '&:hover': {
                backgroundColor: '#F4EEFF',
                borderColor: '#7C5CFC',
                color: '#7C5CFC'
              }
            }}
          >
            <ChevronLeft size={18} />
          </IconButton>

          <IconButton
            size="small"
            onClick={handleNextMonth}
            sx={{
              color: '#1F2937',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(124, 92, 252, 0.15)',
              boxShadow: '3px 3px 8px rgba(124, 92, 252, 0.08), -3px -3px 8px #FFFFFF',
              transition: 'all 0.18s ease',
              '&:hover': {
                backgroundColor: '#F4EEFF',
                borderColor: '#7C5CFC',
                color: '#7C5CFC'
              }
            }}
          >
            <ChevronRight size={18} />
          </IconButton>
        </Box>
      </Box>

      {/* Weekday Header Labels */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.8, mb: 1.5, textAlign: 'center' }}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, idx) => (
          <Typography key={idx} variant="caption" sx={{ fontWeight: 800, color: '#7C5CFC', fontSize: '0.8rem' }}>
            {day}
          </Typography>
        ))}
      </Box>

      {/* Days Grid with Framer Motion Transition */}
      <Box sx={{ overflow: 'hidden', position: 'relative' }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentMonth.format('YYYY-MM')}
            initial={{ opacity: 0, x: direction * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 30 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}
          >
            {daysArray.map((dateObj, idx) => {
              if (!dateObj) {
                return <Box key={`empty_${idx}`} sx={{ aspectRatio: '1', minHeight: 36 }} />;
              }

              const isSelected = selectedDate === dateObj.format('YYYY-MM-DD');
              const isToday = dayjs().format('YYYY-MM-DD') === dateObj.format('YYYY-MM-DD');

              return (
                <Box
                  key={dateObj.format('YYYY-MM-DD')}
                  onClick={() => setSelectedDate(dateObj.format('YYYY-MM-DD'))}
                  sx={{
                    aspectRatio: '1',
                    minHeight: { xs: 34, sm: 38 },
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: isSelected || isToday ? 800 : 600,
                    background: isSelected
                      ? 'linear-gradient(135deg, #7C5CFC 0%, #A855F7 100%)'
                      : isToday
                      ? '#F4EEFF'
                      : 'transparent',
                    color: isSelected ? '#FFFFFF' : isToday ? '#7C5CFC' : '#1F2937',
                    border: isToday && !isSelected
                      ? '2px solid #A855F7'
                      : isSelected
                      ? '1px solid rgba(255,255,255,0.4)'
                      : '1px solid transparent',
                    boxShadow: isSelected
                      ? '0 6px 16px rgba(124, 92, 252, 0.4)'
                      : 'none',
                    transition: 'all 0.18s ease',
                    userSelect: 'none',
                    '&:hover': {
                      backgroundColor: isSelected
                        ? '#6B4BEB'
                        : '#F4EEFF',
                      borderColor: !isSelected ? 'rgba(124, 92, 252, 0.3)' : undefined,
                      transform: 'scale(1.04)'
                    }
                  }}
                >
                  {dateObj.date()}
                </Box>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </Box>
    </NeumoCard>
  );
};

export default PlannerCalendar;
