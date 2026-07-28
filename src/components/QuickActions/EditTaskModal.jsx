import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Typography, TextField, MenuItem } from '@mui/material';
import { Pencil, Check, Zap } from 'lucide-react';
import GlassModal from '../Common/GlassModal';
import SkeuoButton from '../Common/SkeuoButton';
import { usePlannerStore } from '../../store/usePlannerStore';
import { CATEGORY_COLORS } from '../../constants/plannerData';

const ENERGY_LEVELS = ['High', 'Medium', 'Low'];

const EditTaskModal = ({ open, onClose, task }) => {
  const { updateTaskDetails } = usePlannerStore();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (task) {
      setValue('title', task.title || '');
      setValue('description', task.description || '');
      setValue('time', task.time || '10:00');
      setValue('duration', task.duration || 45);
      setValue('category', task.category || 'work');
      setValue('energy', task.energy || 'Medium');
    }
  }, [task, setValue]);

  const onSubmit = (data) => {
    if (!task) return;
    updateTaskDetails(task.id, {
      title: data.title,
      description: data.description,
      time: data.time,
      duration: parseInt(data.duration, 10) || 45,
      category: data.category,
      energy: data.energy
    });
    reset();
    onClose();
  };

  if (!task) return null;

  return (
    <GlassModal open={open} onClose={onClose} title="Edit Task Details" maxWidth={500}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          {/* Task Title */}
          <TextField
            fullWidth
            label="Task Name"
            variant="outlined"
            placeholder="e.g., Q3 Product Roadmap Review"
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
              {...register('duration', { required: 'Duration is required' })}
            />
          </Box>

          {/* Category Dropdown */}
          <TextField
            select
            fullWidth
            label="Category"
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

          {/* Energy Focus Level */}
          <TextField
            select
            fullWidth
            label="Energy Focus Level"
            {...register('energy')}
          >
            {ENERGY_LEVELS.map((lvl) => (
              <MenuItem key={lvl} value={lvl}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Zap size={14} color="#F59E0B" />
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#1F2937' }}>
                    {lvl} Focus
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </TextField>

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
