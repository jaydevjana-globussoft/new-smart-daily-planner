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
  Pencil,
  Plus,
  ChevronDown,
  GripVertical,
  Zap,
  Info,
  Calendar as CalendarIcon
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

const formatTimeRange = (startStr, durationMins) => {
  const startMin = timeToMinutes(startStr);
  const endMin = (startMin + durationMins) % 1440;
  return `${startStr} – ${minutesToTime(endMin)} (${formatDurationLabel(durationMins)})`;
};

// Rich Hover Tooltip Component for Activity Blocks
const RichTooltipCard = ({ task, startMin, totalDuration }) => {
  const categoryConfig = CATEGORY_COLORS[task.category] || CATEGORY_COLORS.work;
  const endMin = (startMin + totalDuration) % 1440;

  return (
    <Box sx={{ p: 1.5, maxWidth: 280 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.9rem', lineHeight: 1.2 }}>
          {task.title}
        </Typography>
        <Chip
          label={categoryConfig.label}
          size="small"
          sx={{
            height: 20,
            fontSize: '0.65rem',
            fontWeight: 800,
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.4)'
          }}
        />
      </Box>

      {/* Description if available */}
      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.775rem', mb: 1.2, fontStyle: task.description ? 'normal' : 'italic' }}>
        {task.description || 'No description added. Double-click block to add notes.'}
      </Typography>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.25)', my: 1 }} />

      {/* Time & Duration Details */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.725rem', fontWeight: 600 }}>
            Time Window:
          </Typography>
          <Typography variant="caption" sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: '0.75rem' }}>
            {task.time} – {minutesToTime(endMin)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.725rem', fontWeight: 600 }}>
            Duration:
          </Typography>
          <Typography variant="caption" sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: '0.75rem' }}>
            {formatDurationLabel(totalDuration)} ({totalDuration} mins)
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.725rem', fontWeight: 600 }}>
            Focus Level:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Zap size={12} color="#F59E0B" />
            <Typography variant="caption" sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: '0.75rem' }}>
              {task.energy || 'Medium'} Focus
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.725rem', fontWeight: 600 }}>
            Status:
          </Typography>
          <Typography variant="caption" sx={{ color: task.completed ? '#4ADE80' : '#FDE047', fontWeight: 800, fontSize: '0.75rem' }}>
            {task.completed ? '✓ Completed' : '⚡ In Progress'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const DayPlannerWidget = () => {
  const { tasks, addTask, updateTaskTimeAndDuration, deleteTask, toggleTask } = usePlannerStore();

  const [snapInterval, setSnapInterval] = useState(15); // 15 or 30 mins
  const [editingTask, setEditingTask] = useState(null);
  const [currentTimeMinutes, setCurrentTimeMinutes] = useState(
    dayjs().hour() * 60 + dayjs().minute()
  );

  // Custom Activity Dropdown Anchor
  const [presetMenuAnchor, setPresetMenuAnchor] = useState(null);

  // Dragging & Resizing State
  const [dragState, setDragState] = useState(null);
  const trackRef = useRef(null);

  // Keyframes style insertion for CSS marquee description text
  useEffect(() => {
    const styleId = 'day-planner-marquee-style';
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.innerHTML = `
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: inline-flex;
          white-space: nowrap;
          animation: marqueeScroll 10s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `;
      document.head.appendChild(styleEl);
    }
  }, []);

  // Update current time line every 30s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeMinutes(dayjs().hour() * 60 + dayjs().minute());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Mousemove & Mouseup handlers for dragging & resizing activity blocks
  useEffect(() => {
    if (!dragState) return;

    const handleMouseMove = (e) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const deltaX = e.clientX - dragState.initialX;
      const deltaMinutes = (deltaX / rect.width) * 1440;

      if (dragState.type === 'move') {
        const rawNewStart = dragState.initialStartMin + deltaMinutes;
        let snappedStart = Math.round(rawNewStart / snapInterval) * snapInterval;
        snappedStart = Math.max(0, Math.min(1439, (snappedStart + 1440) % 1440));

        // Live calculation for visual indicator
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
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, snapInterval, updateTaskTimeAndDuration]);

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
      // Daytime single block
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
      // Overnight block (wrapping midnight)
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
              Interactive 24-hour visual schedule • Drag blocks to move, resize edges to adjust duration, double-click to edit
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
              height: 155,
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

            {/* Live Moving Current Time Indicator */}
            <Box
              sx={{
                position: 'absolute',
                left: `${currentTimePct}%`,
                top: 0,
                bottom: 0,
                width: '2px',
                backgroundColor: '#FF7A59',
                boxShadow: '0 0 10px #FF7A59',
                zIndex: 10,
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: '#FF7A59',
                  boxShadow: '0 0 8px #FF7A59',
                  mt: -0.5
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
                  px: 0.3
                }}
              />
            </Box>

            {/* Render Activity Blocks (Full Height & 4 Spaced Layout Lines) */}
            <AnimatePresence>
              {renderedSegments.map((seg) => {
                const { task, realStartMin, totalDuration, leftPct, widthPct, segmentId, touchesLeftEdge, touchesRightEdge } = seg;
                const categoryConfig = CATEGORY_COLORS[task.category] || CATEGORY_COLORS.work;
                const isDraggingThis = dragState && dragState.taskId === task.id;

                // Border radius calculation: default small 5px; container rounded edge if touching boundary
                const blockBorderRadius = {
                  borderRadius: '5px',
                  ...(touchesLeftEdge && { borderTopLeftRadius: '16px', borderBottomLeftRadius: '16px' }),
                  ...(touchesRightEdge && { borderTopRightRadius: '16px', borderBottomRightRadius: '16px' })
                };

                return (
                  <Tooltip
                    key={segmentId}
                    title={<RichTooltipCard task={task} startMin={realStartMin} totalDuration={totalDuration} />}
                    arrow
                    placement="top"
                    componentsProps={{
                      tooltip: {
                        sx: {
                          backgroundColor: 'rgba(31, 41, 55, 0.95)',
                          backdropFilter: 'blur(12px)',
                          borderRadius: '14px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
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
                        zIndex: isDraggingThis ? 30 : 5
                      }}
                    >
                      <Box
                        onMouseDown={(e) => startDrag(e, task.id, 'move', realStartMin, totalDuration)}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          setEditingTask(task);
                        }}
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
                          cursor: isDraggingThis ? 'grabbing' : 'grab',
                          boxShadow: isDraggingThis
                            ? '0 14px 32px rgba(124, 92, 252, 0.45), 0 0 0 2px #FFFFFF'
                            : '0 4px 12px rgba(124, 92, 252, 0.2)',
                          border: '1px solid rgba(255, 255, 255, 0.35)',
                          position: 'relative',
                          overflow: 'hidden',
                          opacity: task.completed ? 0.8 : 1,
                          transition: isDraggingThis ? 'none' : 'transform 0.15s ease, box-shadow 0.15s ease',
                          '&:hover': {
                            boxShadow: '0 8px 22px rgba(124, 92, 252, 0.35)',
                            transform: 'translateY(-1px)'
                          }
                        }}
                      >
                        {/* Visible Left Edge Resize Handle */}
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
                            zIndex: 14,
                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.5)' }
                          }}
                        >
                          <GripVertical size={10} color="#FFFFFF" style={{ opacity: 0.8 }} />
                        </Box>

                        {/* LINE 1: HEADING (Task Title HTML Marquee with bottom margin) */}
                        <Box sx={{ px: 0.6, pt: 0.2, mb: 0.8, zIndex: 12, overflow: 'hidden', width: '100%' }}>
                          <marquee
                            behavior="scroll"
                            direction="left"
                            scrollamount="3"
                            style={{
                              color: '#FFFFFF',
                              fontSize: '0.825rem',
                              fontWeight: 800,
                              width: '100%',
                              display: 'block',
                              textDecoration: task.completed ? 'line-through' : 'none',
                              opacity: task.completed ? 0.85 : 1,
                              textShadow: '0 1px 2px rgba(0,0,0,0.4)'
                            }}
                          >
                            {task.title}
                          </marquee>
                        </Box>

                        {/* LINE 2: DESCRIPTION (Description HTML Marquee with bottom margin) */}
                        <Box sx={{ px: 0.6, mb: 0.8, zIndex: 12, width: '100%', overflow: 'hidden' }}>
                          <marquee
                            behavior="scroll"
                            direction="left"
                            scrollamount="3"
                            style={{
                              color: 'rgba(255, 255, 255, 0.95)',
                              fontSize: '0.725rem',
                              fontWeight: 600,
                              width: '100%',
                              display: 'block'
                            }}
                          >
                            {task.description || `Focus activity for ${task.title}`}
                          </marquee>
                        </Box>

                        {/* LINE 3: TIMING (Timing HTML Marquee with bottom margin) */}
                        <Box sx={{ px: 0.6, mb: 0.8, zIndex: 12, width: '100%', overflow: 'hidden' }}>
                          <marquee
                            behavior="scroll"
                            direction="left"
                            scrollamount="3"
                            style={{
                              color: 'rgba(255, 255, 255, 0.95)',
                              fontSize: '0.725rem',
                              fontWeight: 700,
                              width: '100%',
                              display: 'block'
                            }}
                          >
                            ⏰ {formatTimeRange(task.time, totalDuration)} • 🏷️ {categoryConfig.label} • ⚡ {task.energy || 'Medium'} Focus
                          </marquee>
                        </Box>

                        {/* LINE 4: ACTION BUTTONS (Checkin Icon, Edit Option, Delete Option at End) */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, px: 0.6, pb: 0.2, pt: 0.4, zIndex: 12, width: '100%', mt: 'auto' }}>
                          {/* Checkin / Mark Completed Button (Icon Only) */}
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              toggleTask(task.id);
                            }}
                            sx={{
                              p: 0.4,
                              color: '#FFFFFF',
                              backgroundColor: 'rgba(0,0,0,0.22)',
                              borderRadius: '4px',
                              flexShrink: 0,
                              '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
                            }}
                            title={task.completed ? "Mark as pending" : "Check in / Mark completed"}
                          >
                            {task.completed ? <CheckCircle2 size={13} color="#22C55E" /> : <Circle size={13} color="#FFFFFF" />}
                          </IconButton>

                          {/* Edit Option */}
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setEditingTask(task);
                            }}
                            sx={{
                              p: 0.4,
                              color: 'rgba(255,255,255,0.95)',
                              backgroundColor: 'rgba(0,0,0,0.22)',
                              borderRadius: '4px',
                              flexShrink: 0,
                              '&:hover': { color: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.35)' }
                            }}
                            title="Edit Task"
                          >
                            <Pencil size={11} />
                          </IconButton>

                          {/* Delete Option */}
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              deleteTask(task.id);
                            }}
                            sx={{
                              p: 0.4,
                              color: 'rgba(255,255,255,0.9)',
                              backgroundColor: 'rgba(0,0,0,0.22)',
                              borderRadius: '4px',
                              flexShrink: 0,
                              '&:hover': { color: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.3)' }
                            }}
                            title="Delete Task"
                          >
                            <Trash2 size={11} />
                          </IconButton>
                        </Box>

                        {/* Visible Right Edge Resize Handle */}
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
                            zIndex: 12,
                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.5)' }
                          }}
                        >
                          <GripVertical size={10} color="#FFFFFF" style={{ opacity: 0.8 }} />
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
            backgroundColor: 'rgba(31, 41, 55, 0.92)',
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
    </NeumoCard>
  );
};

export default DayPlannerWidget;
