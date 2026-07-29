import React, { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Typography,
  Chip,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Paper
} from '@mui/material';
import {
  Clock,
  Trash2,
  CheckCircle2,
  Circle,
  Sparkles,
  Plus,
  ChevronDown,
  GripVertical,
  Zap,
  Info,
  MousePointer,
  Move,
  Maximize2,
  Calendar as CalendarIcon,
  Flame,
  Coffee,
  Moon
} from 'lucide-react';
import NeumoCard from '../Common/NeumoCard';
import EditTaskModal from '../QuickActions/EditTaskModal';
import { usePlannerStore } from '../../store/usePlannerStore';
import { CATEGORY_COLORS } from '../../constants/plannerData';

// Primary Quick Add Presets (Displayed inline)
const PRIMARY_PRESETS = [
  { label: 'Morning Routine', category: 'personal', duration: 45, color: '#A855F7', icon: '🌅' },
  { label: 'Deep Work', category: 'work', duration: 120, color: '#7C5CFC', icon: '💻' },
  { label: 'Meetings & Sync', category: 'work', duration: 45, color: '#3B82F6', icon: '📅' },
  { label: 'Lunch Break', category: 'health', duration: 60, color: '#FF7A59', icon: '🥗' }
];

// Additional Presets in "+ Custom Activity" Menu Dropdown
const MORE_PRESETS = [
  { label: 'Study & Learning', category: 'study', duration: 90, color: '#6366F1', icon: '📚' },
  { label: 'Exercise & Fitness', category: 'health', duration: 60, color: '#22C55E', icon: '🏃' },
  { label: 'Rest & Break', category: 'health', duration: 30, color: '#F59E0B', icon: '☕' },
  { label: 'Sleep & Wind-down', category: 'personal', duration: 360, color: '#8B5CF6', icon: '🌙' },
  { label: 'Household & Errands', category: 'household', duration: 60, color: '#F4A460', icon: '🏠' },
  { label: 'Finance & Admin', category: 'finance', duration: 45, color: '#E35336', icon: '💰' }
];

// Time Utility Helpers
const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};

const minutesToTime = (totalMinutes) => {
  const clamped = Math.max(0, Math.min(1439, (totalMinutes + 1440) % 1440));
  const hours = Math.floor(clamped / 60);
  const mins = Math.floor(clamped % 60);
  const hh = String(hours).padStart(2, '0');
  const mm = String(mins).padStart(2, '0');
  return `${hh}:${mm}`;
};

const formatDurationLabel = (durationMins) => {
  if (durationMins >= 60) {
    const hours = (durationMins / 60).toFixed(1).replace('.0', '');
    return `${hours}h`;
  }
  return `${durationMins}m`;
};

// Rich Glassmorphism Hover Tooltip Component for Activity Blocks
const RichTooltipCard = ({ task, startMin, totalDuration, isActiveNow }) => {
  const categoryConfig = CATEGORY_COLORS[task.category] || CATEGORY_COLORS.work;
  const endMin = (startMin + totalDuration) % 1440;

  const getEnergyConfig = (energyStr) => {
    const e = (energyStr || 'Medium').toLowerCase();
    if (e.includes('high')) return { icon: '🟢', label: 'High Energy', color: '#4ADE80' };
    if (e.includes('low')) return { icon: '🟠', label: 'Low Energy', color: '#FB923C' };
    if (e.includes('recovery')) return { icon: '🔵', label: 'Recovery', color: '#60A5FA' };
    if (e.includes('rest')) return { icon: '🌙', label: 'Rest', color: '#C084FC' };
    return { icon: '🟡', label: 'Medium Energy', color: '#FACC15' };
  };

  const energyInfo = getEnergyConfig(task.energy);

  return (
    <Box sx={{ p: 2, minWidth: 260, maxWidth: 320 }}>
      {/* Title & Category Chip */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 1.2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.95rem', lineHeight: 1.3 }}>
          {task.title}
        </Typography>
        <Chip
          label={categoryConfig.label}
          size="small"
          sx={{
            height: 22,
            fontSize: '0.675rem',
            fontWeight: 800,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.35)',
            backdropFilter: 'blur(8px)',
            flexShrink: 0
          }}
        />
      </Box>

      {/* Description */}
      <Typography
        variant="body2"
        sx={{
          color: 'rgba(255, 255, 255, 0.88)',
          fontSize: '0.785rem',
          mb: 1.5,
          lineHeight: 1.4,
          fontStyle: task.description ? 'normal' : 'italic'
        }}
      >
        {task.description || 'No description provided for this activity.'}
      </Typography>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', my: 1 }} />

      {/* 2-Column Attributes Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.2 }}>
        <Box>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.65)', display: 'block', fontSize: '0.675rem', fontWeight: 700, letterSpacing: '0.5px' }}>
            START TIME
          </Typography>
          <Typography variant="caption" sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: '0.8rem' }}>
            {task.time || minutesToTime(startMin)}
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.65)', display: 'block', fontSize: '0.675rem', fontWeight: 700, letterSpacing: '0.5px' }}>
            END TIME
          </Typography>
          <Typography variant="caption" sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: '0.8rem' }}>
            {minutesToTime(endMin)}
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.65)', display: 'block', fontSize: '0.675rem', fontWeight: 700, letterSpacing: '0.5px' }}>
            DURATION
          </Typography>
          <Typography variant="caption" sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: '0.8rem' }}>
            {formatDurationLabel(totalDuration)} ({totalDuration}m)
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.65)', display: 'block', fontSize: '0.675rem', fontWeight: 700, letterSpacing: '0.5px' }}>
            PRIORITY
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: task.priority === 'High' ? '#FF7A59' : task.priority === 'Low' ? '#60A5FA' : '#FACC15',
              fontWeight: 800,
              fontSize: '0.8rem'
            }}
          >
            {task.priority || 'Medium'}
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.65)', display: 'block', fontSize: '0.675rem', fontWeight: 700, letterSpacing: '0.5px' }}>
            ENERGY LEVEL
          </Typography>
          <Typography variant="caption" sx={{ color: energyInfo.color, fontWeight: 800, fontSize: '0.8rem' }}>
            {energyInfo.icon} {energyInfo.label}
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.65)', display: 'block', fontSize: '0.675rem', fontWeight: 700, letterSpacing: '0.5px' }}>
            STATUS
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: task.completed ? '#4ADE80' : isActiveNow ? '#FF7A59' : '#FDE047',
              fontWeight: 800,
              fontSize: '0.8rem'
            }}
          >
            {task.completed ? '✓ Completed' : isActiveNow ? '⚡ Active Now' : '⏳ Scheduled'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const DayPlannerWidget = () => {
  const { tasks, addTask, updateTaskTimeAndDuration, deleteTask, toggleTask } = usePlannerStore();

  const [snapInterval, setSnapInterval] = useState(15);
  const [editingTask, setEditingTask] = useState(null);
  const [currentTimeMinutes, setCurrentTimeMinutes] = useState(
    dayjs().hour() * 60 + dayjs().minute()
  );

  // Custom Activity Dropdown Anchor
  const [presetMenuAnchor, setPresetMenuAnchor] = useState(null);

  // Dragging & Resizing State
  const [dragState, setDragState] = useState(null);
  const trackRef = useRef(null);
  const clickTimerRef = useRef(null);
  const hasDraggedRef = useRef(false);

  // Keyframes style insertion for CSS marquee title animation
  useEffect(() => {
    const styleId = 'day-planner-css-marquee-style';
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.innerHTML = `
        @keyframes cssMarqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .css-marquee-container {
          overflow: hidden;
          white-space: nowrap;
          width: 100%;
          display: block;
          position: relative;
        }
        .css-marquee-track {
          display: inline-block;
          white-space: nowrap;
          animation: cssMarqueeScroll 12s linear infinite;
        }
        .css-marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes activeTaskPulse {
          0% { box-shadow: 0 0 12px rgba(255, 122, 89, 0.7), inset 0 0 8px rgba(255, 255, 255, 0.5); }
          50% { box-shadow: 0 0 24px rgba(255, 122, 89, 1), inset 0 0 14px rgba(255, 255, 255, 0.8); }
          100% { box-shadow: 0 0 12px rgba(255, 122, 89, 0.7), inset 0 0 8px rgba(255, 255, 255, 0.5); }
        }
        .active-task-glow {
          animation: activeTaskPulse 2.5s ease-in-out infinite;
          border: 2px solid #FF7A59 !important;
        }
      `;
      document.head.appendChild(styleEl);
    }
  }, []);

  // Update current time line every 10 seconds automatically
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeMinutes(dayjs().hour() * 60 + dayjs().minute());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Mousemove & Mouseup handlers for dragging & resizing activity blocks
  useEffect(() => {
    if (!dragState) return;

    const handleMouseMove = (e) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const deltaX = e.clientX - dragState.initialX;
      
      // If mouse moved more than 3px, mark as dragged so single click is ignored
      if (Math.abs(deltaX) > 3) {
        hasDraggedRef.current = true;
      }

      const deltaMinutes = (deltaX / rect.width) * 1440;

      if (dragState.type === 'move') {
        const rawNewStart = dragState.initialStartMin + deltaMinutes;
        let snappedStart = Math.round(rawNewStart / snapInterval) * snapInterval;
        snappedStart = Math.max(0, Math.min(1439, (snappedStart + 1440) % 1440));

        setDragState((prev) => (prev ? { ...prev, currentStartMin: snappedStart } : null));

        updateTaskTimeAndDuration(dragState.taskId, minutesToTime(snappedStart), dragState.initialDuration);
      } else if (dragState.type === 'resize-right') {
        const rawNewDuration = dragState.initialDuration + deltaMinutes;
        const snappedDuration = Math.max(snapInterval, Math.round(rawNewDuration / snapInterval) * snapInterval);
        const clampedDuration = Math.min(1440, snappedDuration);

        setDragState((prev) => (prev ? { ...prev, currentDuration: clampedDuration } : null));

        updateTaskTimeAndDuration(dragState.taskId, minutesToTime(dragState.initialStartMin), clampedDuration);
      } else if (dragState.type === 'resize-left') {
        const rawNewStart = dragState.initialStartMin + deltaMinutes;
        let snappedStart = Math.round(rawNewStart / snapInterval) * snapInterval;
        snappedStart = Math.max(0, Math.min(1439, (snappedStart + 1440) % 1440));

        const delta = snappedStart - dragState.initialStartMin;
        const newDuration = Math.max(snapInterval, dragState.initialDuration - delta);

        setDragState((prev) => (prev ? { ...prev, currentStartMin: snappedStart, currentDuration: newDuration } : null));

        updateTaskTimeAndDuration(dragState.taskId, minutesToTime(snappedStart), newDuration);
      }
    };

    const handleMouseUp = () => {
      setDragState(null);
      if (hasDraggedRef.current) {
        setTimeout(() => {
          hasDraggedRef.current = false;
        }, 150);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, snapInterval, updateTaskTimeAndDuration]);

  // Handle single click (toggle completion) and double click (edit modal) without conflict
  const handleBlockSingleClick = (taskId) => {
    if (hasDraggedRef.current) return;

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    clickTimerRef.current = setTimeout(() => {
      toggleTask(taskId);
      clickTimerRef.current = null;
    }, 220);
  };

  const handleBlockDoubleClick = (task) => {
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    setEditingTask(task);
  };

  // Quick Add Preset Handler
  const handleAddPreset = (preset) => {
    let nextStartMin = 540; // Default 09:00 AM
    if (tasks.length > 0) {
      const sorted = [...tasks].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
      const last = sorted[sorted.length - 1];
      nextStartMin = (timeToMinutes(last.time) + (last.duration || 45)) % 1440;
    }

    addTask({
      title: `${preset.icon} ${preset.label}`,
      description: `Preset activity for ${preset.label.toLowerCase()}`,
      time: minutesToTime(nextStartMin),
      duration: preset.duration,
      category: preset.category,
      energy: 'Medium'
    });
    setPresetMenuAnchor(null);
  };

  // Drag start initializer
  const startDrag = (e, taskId, type, startMin, duration) => {
    e.stopPropagation();
    e.preventDefault();
    hasDraggedRef.current = false;
    setDragState({
      taskId,
      type,
      initialX: e.clientX,
      initialStartMin: startMin,
      initialDuration: duration,
      currentStartMin: startMin,
      currentDuration: duration
    });
  };

  const currentTimePct = (currentTimeMinutes / 1440) * 100;

  // Construct renderable timeline segments, properly handling overnight tasks (22:00 to 04:00 AM)
  const renderedSegments = [];
  tasks.forEach((task) => {
    const startMin = timeToMinutes(task.time);
    const totalDuration = task.duration || 45;
    const endMin = startMin + totalDuration;

    if (endMin <= 1440) {
      renderedSegments.push({
        task,
        realStartMin: startMin,
        totalDuration,
        leftPct: (startMin / 1440) * 100,
        widthPct: (totalDuration / 1440) * 100,
        segmentId: `${task.id}-single`,
        touchesLeftEdge: startMin === 0,
        touchesRightEdge: endMin >= 1439
      });
    } else {
      const eveningDuration = 1440 - startMin;
      renderedSegments.push({
        task,
        realStartMin: startMin,
        totalDuration,
        leftPct: (startMin / 1440) * 100,
        widthPct: (eveningDuration / 1440) * 100,
        segmentId: `${task.id}-evening`,
        touchesLeftEdge: false,
        touchesRightEdge: true
      });

      const morningDuration = endMin - 1440;
      renderedSegments.push({
        task,
        realStartMin: startMin,
        totalDuration,
        leftPct: 0,
        widthPct: (morningDuration / 1440) * 100,
        segmentId: `${task.id}-morning`,
        touchesLeftEdge: true,
        touchesRightEdge: false
      });
    }
  });

  return (
    <NeumoCard sx={{ p: { xs: 2.5, md: 3.5 } }}>
      {/* Widget Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ p: 1, borderRadius: 2.5, background: 'linear-gradient(135deg, #7C5CFC, #A855F7)', color: '#FFFFFF' }}>
            <Clock size={22} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'Outfit', color: '#1F2937' }}>
              Day Planner
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280' }}>
              Interactive 24-hour visual schedule • Single click complete, double click edit, drag edges to resize
            </Typography>
          </Box>
        </Box>

        {/* Snap Interval Selector */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Box className="neumo-inset" sx={{ p: 0.5, borderRadius: 3, display: 'flex', gap: 0.5, backgroundColor: '#F8F4FF' }}>
            <button
              onClick={() => setSnapInterval(15)}
              style={{
                padding: '5px 12px',
                borderRadius: 8,
                border: 'none',
                backgroundColor: snapInterval === 15 ? '#7C5CFC' : 'transparent',
                color: snapInterval === 15 ? '#FFFFFF' : '#6B7280',
                fontWeight: 800,
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              15m Snap
            </button>
            <button
              onClick={() => setSnapInterval(30)}
              style={{
                padding: '5px 12px',
                borderRadius: 8,
                border: 'none',
                backgroundColor: snapInterval === 30 ? '#7C5CFC' : 'transparent',
                color: snapInterval === 30 ? '#FFFFFF' : '#6B7280',
                fontWeight: 800,
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              30m Snap
            </button>
          </Box>

          <Chip
            icon={<Sparkles size={13} color="#7C5CFC" />}
            label="Live Synced"
            size="small"
            sx={{ backgroundColor: '#F4EEFF', color: '#7C5CFC', fontWeight: 800, fontSize: '0.725rem' }}
          />
        </Box>
      </Box>

      {/* Reduced Quick Add Preset Bar with + Custom Activity Dropdown */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 2, mb: 2, borderBottom: '1px solid rgba(124, 92, 252, 0.1)', flexWrap: 'wrap' }}>
        <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 800, textTransform: 'uppercase', flexShrink: 0, mr: 0.5 }}>
          Quick Add:
        </Typography>

        {/* Primary Row Presets */}
        {PRIMARY_PRESETS.map((preset, idx) => (
          <Chip
            key={idx}
            label={`${preset.icon} ${preset.label}`}
            size="small"
            onClick={() => handleAddPreset(preset)}
            className="skeuo-chip"
            sx={{
              backgroundColor: '#FFFFFF',
              color: '#1F2937',
              fontSize: '0.75rem',
              fontWeight: 700,
              flexShrink: 0,
              border: '1px solid rgba(124, 92, 252, 0.15)',
              '&:hover': { backgroundColor: '#F4EEFF', borderColor: '#7C5CFC', transform: 'translateY(-1px)' }
            }}
          />
        ))}

        {/* + Custom Activity / More Presets Dropdown Trigger */}
        <Chip
          icon={<Plus size={14} color="#7C5CFC" />}
          deleteIcon={<ChevronDown size={14} color="#7C5CFC" />}
          onDelete={(e) => setPresetMenuAnchor(e.currentTarget.parentElement)}
          label="+ Custom Activity"
          size="small"
          onClick={(e) => setPresetMenuAnchor(e.currentTarget)}
          className="skeuo-chip"
          sx={{
            backgroundColor: '#F4EEFF',
            color: '#7C5CFC',
            fontSize: '0.75rem',
            fontWeight: 800,
            border: '1px solid rgba(124, 92, 252, 0.25)',
            boxShadow: '0 2px 8px rgba(124, 92, 252, 0.12)',
            '&:hover': { backgroundColor: '#EAE0FF', borderColor: '#7C5CFC' }
          }}
        />

        {/* Preset Menu Dropdown */}
        <Menu
          anchorEl={presetMenuAnchor}
          open={Boolean(presetMenuAnchor)}
          onClose={() => setPresetMenuAnchor(null)}
          PaperProps={{
            className: 'glass-overlay',
            sx: { mt: 1, minWidth: 220, p: 1, backgroundColor: 'rgba(255, 255, 255, 0.98)' }
          }}
        >
          <Typography variant="caption" sx={{ px: 1.5, py: 0.5, color: '#6B7280', fontWeight: 800, display: 'block', fontSize: '0.7rem' }}>
            MORE PRESET ACTIVITIES
          </Typography>
          {MORE_PRESETS.map((preset, idx) => (
            <MenuItem
              key={idx}
              onClick={() => handleAddPreset(preset)}
              sx={{
                borderRadius: 2,
                py: 0.8,
                my: 0.2,
                fontSize: '0.825rem',
                fontWeight: 700,
                color: '#1F2937',
                '&:hover': { backgroundColor: '#F4EEFF', color: '#7C5CFC' }
              }}
            >
              <span style={{ marginRight: 8 }}>{preset.icon}</span>
              {preset.label} ({preset.duration}m)
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* Main 24-Hour Timeline Track Container */}
      <Box sx={{ width: '100%', overflowX: 'auto', pt: 1, pb: 2 }}>
        <Box sx={{ minWidth: 960, position: 'relative' }}>
          {/* Hour Ticks Header (00:00 - 24:00) */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, px: 0.5, borderBottom: '1px solid rgba(124, 92, 252, 0.12)', pb: 0.5 }}>
            {[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24].map((hour) => (
              <Typography key={hour} variant="caption" sx={{ fontWeight: 800, color: '#6B7280', fontSize: '0.725rem' }}>
                {String(hour).padStart(2, '0')}:00
              </Typography>
            ))}
          </Box>

          {/* Interactive Timeline Canvas Track Container (`neumo-inset`) */}
          <Box
            ref={trackRef}
            className="neumo-inset"
            sx={{
              position: 'relative',
              height: 120,
              borderRadius: '16px',
              backgroundColor: '#F8F4FF',
              border: '1px solid rgba(124, 92, 252, 0.18)',
              boxShadow: 'inset 3px 3px 8px rgba(124, 92, 252, 0.09), inset -3px -3px 8px #FFFFFF',
              overflow: 'hidden',
              userSelect: 'none'
            }}
          >
            {/* Hour Vertical Grid Lines */}
            {Array.from({ length: 24 }).map((_, i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  left: `${(i / 24) * 100}%`,
                  top: 0,
                  bottom: 0,
                  width: '1px',
                  backgroundColor: i % 6 === 0 ? 'rgba(124, 92, 252, 0.2)' : 'rgba(124, 92, 252, 0.08)',
                  pointerEvents: 'none'
                }}
              />
            ))}

            {/* Live Moving Current Time Indicator Line with Hover Tooltip */}
            <Tooltip
              title={`Current Time: ${dayjs().format('HH:mm A')}`}
              arrow
              placement="top"
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: '#1F2937',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    borderRadius: '8px',
                    px: 1.2,
                    py: 0.6
                  }
                }
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: `${currentTimePct}%`,
                  top: 0,
                  bottom: 0,
                  width: '3px',
                  backgroundColor: '#FF7A59',
                  boxShadow: '0 0 12px #FF7A59, 0 0 4px #FF7A59',
                  zIndex: 25,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'left 0.5s ease-out'
                }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: '#FF7A59',
                    boxShadow: '0 0 10px #FF7A59',
                    mt: -0.6
                  }}
                />
                <Chip
                  label={minutesToTime(currentTimeMinutes)}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.625rem',
                    backgroundColor: '#FF7A59',
                    color: '#FFFFFF',
                    fontWeight: 900,
                    mt: 0.2,
                    px: 0.3,
                    boxShadow: '0 2px 6px rgba(255, 122, 89, 0.4)'
                  }}
                />
              </Box>
            </Tooltip>

            {/* Render Activity Blocks */}
            <AnimatePresence>
              {renderedSegments.map((seg) => {
                const { task, realStartMin, totalDuration, leftPct, widthPct, segmentId, touchesLeftEdge, touchesRightEdge } = seg;
                const categoryConfig = CATEGORY_COLORS[task.category] || CATEGORY_COLORS.work;
                const isDraggingThis = dragState && dragState.taskId === task.id;

                // Detect if task block contains current time (in-progress active task)
                const realEndMin = realStartMin + totalDuration;
                const isActiveNow = currentTimeMinutes >= realStartMin && currentTimeMinutes < realEndMin;

                // Border radius calculation
                const blockBorderRadius = {
                  borderRadius: '10px',
                  ...(touchesLeftEdge && { borderTopLeftRadius: '16px', borderBottomLeftRadius: '16px' }),
                  ...(touchesRightEdge && { borderTopRightRadius: '16px', borderBottomRightRadius: '16px' })
                };

                return (
                  <Tooltip
                    key={segmentId}
                    title={
                      <RichTooltipCard
                        task={task}
                        startMin={realStartMin}
                        totalDuration={totalDuration}
                        isActiveNow={isActiveNow}
                      />
                    }
                    arrow
                    placement="top"
                    componentsProps={{
                      tooltip: {
                        sx: {
                          backgroundColor: 'rgba(31, 41, 55, 0.94)',
                          backdropFilter: 'blur(16px)',
                          borderRadius: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.22)',
                          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.35)',
                          p: 0
                        }
                      }
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.18 }}
                      style={{
                        position: 'absolute',
                        left: `${leftPct}%`,
                        width: `${Math.max(2.8, widthPct)}%`,
                        top: 0,
                        bottom: 0,
                        height: '100%',
                        zIndex: isDraggingThis ? 30 : isActiveNow ? 15 : 5
                      }}
                    >
                      <Box
                        onMouseDown={(e) => startDrag(e, task.id, 'move', realStartMin, totalDuration)}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBlockSingleClick(task.id);
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          handleBlockDoubleClick(task);
                        }}
                        className={isActiveNow ? 'active-task-glow' : ''}
                        sx={{
                          height: '100%',
                          ...blockBorderRadius,
                          backgroundColor: task.completed ? '#C4B5FD' : categoryConfig.bg,
                          color: '#FFFFFF',
                          p: 1,
                          px: 1.2,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: isDraggingThis ? 'grabbing' : 'grab',
                          boxShadow: isDraggingThis
                            ? '0 14px 32px rgba(124, 92, 252, 0.5), 0 0 0 2px #FFFFFF'
                            : isActiveNow
                            ? '0 0 20px rgba(255, 122, 89, 0.7)'
                            : '0 4px 12px rgba(124, 92, 252, 0.2)',
                          border: '1px solid rgba(255, 255, 255, 0.35)',
                          position: 'relative',
                          overflow: 'hidden',
                          opacity: task.completed ? 0.8 : 1,
                          transition: isDraggingThis ? 'none' : 'transform 0.15s ease, box-shadow 0.15s ease',
                          '&:hover': {
                            boxShadow: '0 8px 24px rgba(124, 92, 252, 0.4)',
                            transform: 'translateY(-1px)'
                          }
                        }}
                      >
                        {/* Left Edge Resize Handle */}
                        <Box
                          onMouseDown={(e) => startDrag(e, task.id, 'resize-left', realStartMin, totalDuration)}
                          sx={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: 10,
                            cursor: 'ew-resize',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.18)',
                            transition: 'background-color 0.2s ease',
                            zIndex: 18,
                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.5)' }
                          }}
                        >
                          <GripVertical size={10} color="#FFFFFF" style={{ opacity: 0.85 }} />
                        </Box>

                        {/* Title ONLY with CSS Marquee overflow animation */}
                        <Box
                          sx={{
                            width: '100%',
                            px: 1,
                            mt: 'auto',
                            mb: 'auto',
                            zIndex: 12,
                            textAlign: 'center',
                            overflow: 'hidden'
                          }}
                        >
                          <div className="css-marquee-container">
                            <div
                              className={task.title.length > 18 ? 'css-marquee-track' : ''}
                              style={{
                                color: '#FFFFFF',
                                fontSize: '0.85rem',
                                fontWeight: 800,
                                fontFamily: 'Outfit, sans-serif',
                                textDecoration: task.completed ? 'line-through' : 'none',
                                opacity: task.completed ? 0.85 : 1,
                                textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)'
                              }}
                            >
                              {task.title}
                              {task.title.length > 18 && (
                                <span style={{ marginLeft: 24, opacity: 0.8 }}>{task.title}</span>
                              )}
                            </div>
                          </div>
                        </Box>

                        {/* Bottom Right Single Delete Button */}
                        <Box
                          sx={{
                            position: 'absolute',
                            right: 6,
                            bottom: 6,
                            zIndex: 18
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              deleteTask(task.id);
                            }}
                            sx={{
                              p: 0.35,
                              color: 'rgba(255, 255, 255, 0.9)',
                              backgroundColor: 'rgba(0, 0, 0, 0.25)',
                              borderRadius: '6px',
                              '&:hover': { color: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.35)' }
                            }}
                            title="Delete Task"
                          >
                            <Trash2 size={12} />
                          </IconButton>
                        </Box>

                        {/* Right Edge Resize Handle */}
                        <Box
                          onMouseDown={(e) => startDrag(e, task.id, 'resize-right', realStartMin, totalDuration)}
                          sx={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            bottom: 0,
                            width: 10,
                            cursor: 'ew-resize',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.18)',
                            transition: 'background-color 0.2s ease',
                            zIndex: 18,
                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.5)' }
                          }}
                        >
                          <GripVertical size={10} color="#FFFFFF" style={{ opacity: 0.85 }} />
                        </Box>
                      </Box>
                    </motion.div>
                  </Tooltip>
                );
              })}
            </AnimatePresence>
          </Box>
        </Box>
      </Box>

      {/* Floating Live Drag/Resize Indicator Badge */}
      {dragState && (
        <Paper
          elevation={6}
          className="glass-overlay"
          sx={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1500,
            px: 2.5,
            py: 1.2,
            borderRadius: '20px',
            backgroundColor: 'rgba(31, 41, 55, 0.94)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 12px 32px rgba(124, 92, 252, 0.35)'
          }}
        >
          <Clock size={18} color="#7C5CFC" />
          <Typography variant="body2" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
            {dragState.type === 'move' ? 'Repositioning Task:' : 'Adjusting Duration:'}{' '}
            <span style={{ color: '#FF7A59' }}>
              {minutesToTime(dragState.currentStartMin)} – {minutesToTime((dragState.currentStartMin + dragState.currentDuration) % 1440)}
            </span>{' '}
            ({formatDurationLabel(dragState.currentDuration)})
          </Typography>
          <Chip
            label={`${snapInterval}m Snap`}
            size="small"
            sx={{ backgroundColor: '#7C5CFC', color: '#FFFFFF', fontWeight: 800, height: 20, fontSize: '0.675rem' }}
          />
        </Paper>
      )}

      {/* Compact Glassmorphism Edit Modal */}
      <EditTaskModal
        open={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        task={editingTask}
      />

      <Divider sx={{ my: 3, borderColor: 'rgba(124, 92, 252, 0.12)' }} />

      {/* Dedicated "Planner Guide" & Energy Level Legend Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Info size={18} color="#7C5CFC" />
          <Typography variant="subtitle1" sx={{ fontWeight: 800, fontFamily: 'Outfit', color: '#1F2937' }}>
            Planner Guide & Interaction Legend
          </Typography>
        </Box>

        {/* 2-Column Responsive Layout: Interactions on Left, Energy Legend on Right */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.2fr 0.8fr' }, gap: 2 }}>
          {/* Interaction Gestures */}
          <Box
            sx={{
              p: 2,
              borderRadius: '30px',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(124, 92, 252, 0.12)',
              boxShadow: '3px 3px 10px rgba(124, 92, 252, 0.05), -3px -3px 8px #FFFFFF'
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#7C5CFC', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 1.5, display: 'block' }}>
              GESTURE & TIMELINE CONTROLS
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <Box sx={{ p: 0.8, borderRadius: 2, backgroundColor: '#F4EEFF', color: '#7C5CFC', display: 'flex' }}>
                  <MousePointer size={14} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#1F2937', display: 'block' }}>
                    Single Click
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.725rem' }}>
                    Mark task Complete / Incomplete
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <Box sx={{ p: 0.8, borderRadius: 2, backgroundColor: '#F4EEFF', color: '#7C5CFC', display: 'flex' }}>
                  <MousePointer size={14} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#1F2937', display: 'block' }}>
                    Double Click
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.725rem' }}>
                    Open Edit Dialog to edit task
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <Box sx={{ p: 0.8, borderRadius: 2, backgroundColor: '#F4EEFF', color: '#7C5CFC', display: 'flex' }}>
                  <Move size={14} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#1F2937', display: 'block' }}>
                    Drag Block
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.725rem' }}>
                    Reposition entire task time window
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <Box sx={{ p: 0.8, borderRadius: 2, backgroundColor: '#F4EEFF', color: '#7C5CFC', display: 'flex' }}>
                  <Maximize2 size={14} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#1F2937', display: 'block' }}>
                    Drag Edges
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.725rem' }}>
                    Resize left/right edge to adjust duration
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <Box sx={{ p: 0.8, borderRadius: 2, backgroundColor: '#F4EEFF', color: '#7C5CFC', display: 'flex' }}>
                  <Info size={14} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#1F2937', display: 'block' }}>
                    Hover Block
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.725rem' }}>
                    View complete 9-property task popover
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <Box sx={{ p: 0.8, borderRadius: 2, backgroundColor: 'rgba(255, 122, 89, 0.15)', color: '#FF7A59', display: 'flex' }}>
                  <Zap size={14} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#1F2937', display: 'block' }}>
                    Highlighted Task
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.725rem' }}>
                    Orange glow = task currently in progress
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <Box sx={{ p: 0.8, borderRadius: 2, backgroundColor: 'rgba(255, 122, 89, 0.15)', color: '#FF7A59', display: 'flex' }}>
                  <Clock size={14} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#1F2937', display: 'block' }}>
                    Current Time Line
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.725rem' }}>
                    Real-time line indicator (Hover for exact time)
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <Box sx={{ p: 0.8, borderRadius: 2, backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', display: 'flex' }}>
                  <Trash2 size={14} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#1F2937', display: 'block' }}>
                    Delete Icon
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.725rem' }}>
                    Click bottom-right icon to delete task
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Energy Level Legend */}
          <Box
            sx={{
              p: 2,
              borderRadius: '30px',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(124, 92, 252, 0.12)',
              boxShadow: '3px 3px 10px rgba(124, 92, 252, 0.05), -3px -3px 8px #FFFFFF'
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#7C5CFC', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 1.5, display: 'block' }}>
              ENERGY LEVEL LEGEND
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 0.8, px: 1.2, borderRadius: 2, backgroundColor: 'rgba(34, 197, 94, 0.08)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>🟢</span>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#15803D', fontSize: '0.785rem' }}>
                    High Energy
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.725rem', fontWeight: 600 }}>
                  Deep Work / Coding / Study
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 0.8, px: 1.2, borderRadius: 2, backgroundColor: 'rgba(245, 158, 11, 0.08)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>🟡</span>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#B45309', fontSize: '0.785rem' }}>
                    Medium Energy
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.725rem', fontWeight: 600 }}>
                  Meetings / Planning / Learning
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 0.8, px: 1.2, borderRadius: 2, backgroundColor: 'rgba(249, 115, 22, 0.08)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>🟠</span>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#C2410C', fontSize: '0.785rem' }}>
                    Low Energy
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.725rem', fontWeight: 600 }}>
                  Routine / Admin / Chores
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 0.8, px: 1.2, borderRadius: 2, backgroundColor: 'rgba(59, 130, 246, 0.08)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>🔵</span>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#1D4ED8', fontSize: '0.785rem' }}>
                    Recovery
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.725rem', fontWeight: 600 }}>
                  Break / Lunch / Meditation
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 0.8, px: 1.2, borderRadius: 2, backgroundColor: 'rgba(139, 92, 246, 0.08)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>🌙</span>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#6D28D9', fontSize: '0.785rem' }}>
                    Rest
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.725rem', fontWeight: 600 }}>
                  Sleep / Wind-down
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </NeumoCard>
  );
};

export default DayPlannerWidget;
