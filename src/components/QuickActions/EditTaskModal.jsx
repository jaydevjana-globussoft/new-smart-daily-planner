import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Typography, TextField, MenuItem } from '@mui/material';
import { Check, Zap } from 'lucide-react';
import GlassModal from '../Common/GlassModal';
import SkeuoButton from '../Common/SkeuoButton';
import { usePlannerStore } from '../../store/usePlannerStore';
import { CATEGORY_COLORS } from '../../constants/plannerData';

const ENERGY_LEVELS = [
  { value: 'High', label: '🟢 High Energy (Deep Work / Coding / Study)' },
  { value: 'Medium', label: '🟡 Medium Energy (Meetings / Planning / Learning)' },
  { value: 'Low', label: '🟠 Low Energy (Routine / Admin / Chores)' },
  { value: 'Recovery', label: '🔵 Recovery (Break / Lunch / Meditation)' },
  { value: 'Rest', label: '🌙 Rest (Sleep / Wind-down)' }
];

const PRIORITY_LEVELS = ['High', 'Medium', 'Low'];

const EditTaskModal = ({ open, onClose, task }) => {
  const { updateTaskDetails } = usePlannerStore();
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

  const categoryValue = watch('category');
  const energyValue = watch('energy');
  const priorityValue = watch('priority');

  useEffect(() => {
    if (task) {
      let energyVal = task.energy || 'Medium';
      if (typeof energyVal === 'string') {
        if (energyVal.includes('High')) energyVal = 'High';
        else if (energyVal.includes('Low')) energyVal = 'Low';
        else if (energyVal.includes('Recovery')) energyVal = 'Recovery';
        else if (energyVal.includes('Rest')) energyVal = 'Rest';
        else if (energyVal.includes('Medium')) energyVal = 'Medium';
      }

      reset({
        title: task.title || '',
        description: task.description || '',
        time: task.time || '10:00',
        duration: task.duration || 45,
        category: task.category || 'work',
        energy: energyVal,
        priority: task.priority || 'Medium'
      });
    }
  }, [task, reset]);

  const onSubmit = (data) => {
    if (!task) return;
    updateTaskDetails(task.id, {
      title: data.title,
      description: data.description,
      time: data.time,
      duration: parseInt(data.duration, 10) || 45,
      category: data.category,
      energy: data.energy,
      priority: data.priority
    });
    onClose();
  };

  if (!task) return null;

  return (
    <GlassModal open={open} onClose={onClose} title="Edit Task Details" maxWidth={520}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          {/* Task Title */}
          <TextField
            fullWidth
            label="Task Name"
            variant="outlined"
            placeholder="e.g., Q3 Product Roadmap Review"
            InputLabelProps={{ shrink: true }}
            {...register('title', { required: 'Task name is required' })}
            error={Boolean(errors.title)}
            helperText={errors.title?.message}
          />

          {/* Task Description */}
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Task Description & Notes"
            variant="outlined"
            placeholder="Detailed notes or focus objectives..."
            InputLabelProps={{ shrink: true }}
            {...register('description')}
          />

          {/* Time & Duration Fields */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Start Time"
              type="time"
              InputLabelProps={{ shrink: true }}
              {...register('time', { required: 'Time is required' })}
            />
            <TextField
              fullWidth
              label="Duration (mins)"
              type="number"
              inputProps={{ min: 15, max: 720, step: 15 }}
              InputLabelProps={{ shrink: true }}
              {...register('duration', { required: 'Duration is required' })}
            />
          </Box>

          {/* Category Dropdown */}
          <TextField
            select
            fullWidth
            label="Category"
            value={categoryValue || 'work'}
            InputLabelProps={{ shrink: true }}
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

          {/* Energy Focus Level & Priority Row */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              select
              fullWidth
              label="Energy Focus Level"
              value={energyValue || 'Medium'}
              InputLabelProps={{ shrink: true }}
              {...register('energy')}
            >
              {ENERGY_LEVELS.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#1F2937' }}>
                    {item.label}
                  </Typography>
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="Priority Level"
              value={priorityValue || 'Medium'}
              InputLabelProps={{ shrink: true }}
              {...register('priority')}
            >
              {PRIORITY_LEVELS.map((p) => (
                <MenuItem key={p} value={p}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#1F2937' }}>
                    {p} Priority
                  </Typography>
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Action Controls */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1.5 }}>
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

            <SkeuoButton type="submit" icon={Check}>
              Save Task Changes
            </SkeuoButton>
          </Box>
        </Box>
      </form>
    </GlassModal>
  );
};

export default EditTaskModal;
