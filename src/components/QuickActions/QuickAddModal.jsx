import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Typography, Tabs, Tab, TextField, MenuItem } from '@mui/material';
import { Clock, Flame, Target, Plus } from 'lucide-react';
import GlassModal from '../Common/GlassModal';
import SkeuoButton from '../Common/SkeuoButton';
import { usePlannerStore } from '../../store/usePlannerStore';
import { CATEGORY_COLORS } from '../../constants/plannerData';

const QuickAddModal = ({ open, onClose }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const { addTask, addHabit, addGoal } = usePlannerStore();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  const onSubmit = (data) => {
    if (tabIndex === 0) {
      addTask({
        title: data.title,
        time: data.time || '10:00',
        duration: parseInt(data.duration || 45, 10),
        category: data.category || 'work',
        energy: data.energy || 'Medium'
      });
    } else if (tabIndex === 1) {
      addHabit({
        title: data.title,
        category: data.category || 'health',
        target: data.target || 'Daily'
      });
    } else {
      addGoal({
        title: data.title,
        category: data.category || 'personal',
        targetDate: data.targetDate || '2026-09-01',
        milestones: data.milestones ? data.milestones.split(',') : ['Phase 1 Setup']
      });
    }

    reset();
    onClose();
  };

  return (
    <GlassModal open={open} onClose={onClose} title="Quick Create" maxWidth={500}>
      <Box sx={{ borderBottom: 1, borderColor: 'rgba(124, 92, 252, 0.15)', mb: 3 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': { color: '#6B7280', fontWeight: 700 },
            '& .Mui-selected': { color: '#7C5CFC', fontWeight: 800 },
            '& .MuiTabs-indicator': { backgroundColor: '#7C5CFC', height: 3, borderRadius: 2 }
          }}
        >
          <Tab icon={<Clock size={16} />} iconPosition="start" label="Task" />
          <Tab icon={<Flame size={16} />} iconPosition="start" label="Habit" />
          <Tab icon={<Target size={16} />} iconPosition="start" label="Goal" />
        </Tabs>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Title Field */}
          <TextField
            fullWidth
            label={tabIndex === 0 ? 'Task Name' : tabIndex === 1 ? 'Habit Name' : 'Goal Objective'}
            variant="outlined"
            placeholder={tabIndex === 0 ? 'e.g., Deep Work Roadmap Review' : tabIndex === 1 ? 'e.g., 30m Evening Read' : 'e.g., Run a 10K Marathon'}
            {...register('title', { required: 'Title is required' })}
            error={Boolean(errors.title)}
            helperText={errors.title?.message}
          />

          {/* Category Dropdown */}
          <TextField
            select
            fullWidth
            label="Category"
            defaultValue="work"
            {...register('category')}
          >
            {Object.entries(CATEGORY_COLORS).map(([key, val]) => (
              <MenuItem key={key} value={key}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: val.bg }} />
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#1F2937' }}>
                    {val.label}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </TextField>

          {/* Task Specific Inputs */}
          {tabIndex === 0 && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Start Time"
                type="time"
                defaultValue="10:00"
                InputLabelProps={{ shrink: true }}
                {...register('time')}
              />
              <TextField
                fullWidth
                label="Duration (mins)"
                type="number"
                defaultValue={45}
                {...register('duration')}
              />
            </Box>
          )}

          {/* Goal Specific Inputs */}
          {tabIndex === 2 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Target Date"
                type="date"
                defaultValue="2026-09-01"
                InputLabelProps={{ shrink: true }}
                {...register('targetDate')}
              />
              <TextField
                fullWidth
                label="Milestones (comma separated)"
                placeholder="Initial setup, Midterm test, Final launch"
                {...register('milestones')}
              />
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
            <button
              type="button"
              onClick={onClose}
              className="skeuo-btn"
              style={{
                background: 'linear-gradient(145deg, #FFFFFF, #F4EEFF)',
                color: '#1F2937',
                border: '1px solid rgba(124, 92, 252, 0.2)',
                boxShadow: '0px 2px 5px rgba(0,0,0,0.05)',
                textShadow: 'none'
              }}
            >
              Cancel
            </button>

            <SkeuoButton type="submit" icon={Plus}>
              Create {tabIndex === 0 ? 'Task' : tabIndex === 1 ? 'Habit' : 'Goal'}
            </SkeuoButton>
          </Box>
        </Box>
      </form>
    </GlassModal>
  );
};

export default QuickAddModal;
