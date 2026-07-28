import React, { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography, Chip, Tooltip, IconButton } from '@mui/material';
import {
  Clock,
  Trash2,
  CheckCircle2,
  Circle,
  Sparkles,
  Pencil
} from 'lucide-react';
import NeumoCard from '../Common/NeumoCard';
import EditTaskModal from '../QuickActions/EditTaskModal';
import { usePlannerStore } from '../../store/usePlannerStore';
import { CATEGORY_COLORS } from '../../constants/plannerData';

// Activity Presets for Quick Creation
const ACTIVITY_PRESETS = [
  { label: 'Morning Routine', category: 'personal', duration: 45, color: '#A855F7', icon: '🌅' },
  { label: 'Deep Work', category: 'work', duration: 120, color: '#7C5CFC', icon: '💻' },
  { label: 'Meetings & Sync', category: 'work', duration: 45, color: '#3B82F6', icon: '📅' },
  { label: 'Study & Learning', category: 'study', duration: 90, color: '#6366F1', icon: '📚' },
  { label: 'Lunch Break', category: 'health', duration: 60, color: '#FF7A59', icon: '🥗' },
  { label: 'Exercise & Fitness', category: 'health', duration: 60, color: '#22C55E', icon: '🏃' },
  { label: 'Rest & Break', category: 'health', duration: 30, color: '#F59E0B', icon: '☕' },
  { label: 'Sleep & Wind-down', category: 'personal', duration: 360, color: '#8B5CF6', icon: '🌙' },
  { label: 'Custom Activity', category: 'personal', duration: 45, color: '#EC4899', icon: '✨' }
];

// Helper Time Functions
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

const formatTimeRange = (startStr, durationMins) => {
  const startMin = timeToMinutes(startStr);
  const endMin = (startMin + durationMins) % 1440;
  const formattedDuration = durationMins >= 60
    ? `${(durationMins / 60).toFixed(1).replace('.0', '')}h`
    : `${durationMins}m`;
  return `${startStr} - ${minutesToTime(endMin)} (${formattedDuration})`;
};

const DayPlannerWidget = () => {
  const { tasks, addTask, updateTaskTimeAndDuration, deleteTask, toggleTask } = usePlannerStore();

  const [snapInterval, setSnapInterval] = useState(15); // 15 or 30 mins
  const [editingTask, setEditingTask] = useState(null);
  const [currentTimeMinutes, setCurrentTimeMinutes] = useState(
    dayjs().hour() * 60 + dayjs().minute()
  );
  
  // Dragging state
  const [dragState, setDragState] = useState(null);
  const trackRef = useRef(null);

  // Update current time line every 30s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeMinutes(dayjs().hour() * 60 + dayjs().minute());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Global mousemove & mouseup handlers for smooth timeline dragging & resizing
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
        
        updateTaskTimeAndDuration(dragState.taskId, minutesToTime(snappedStart), dragState.initialDuration);
      } else if (dragState.type === 'resize-right') {
        const rawNewDuration = dragState.initialDuration + deltaMinutes;
        const snappedDuration = Math.max(snapInterval, Math.round(rawNewDuration / snapInterval) * snapInterval);
        const clampedDuration = Math.min(1440, snappedDuration);
        
        updateTaskTimeAndDuration(dragState.taskId, minutesToTime(dragState.initialStartMin), clampedDuration);
      } else if (dragState.type === 'resize-left') {
        const rawNewStart = dragState.initialStartMin + deltaMinutes;
        let snappedStart = Math.round(rawNewStart / snapInterval) * snapInterval;
        snappedStart = Math.max(0, Math.min(1439, (snappedStart + 1440) % 1440));
        const delta = (snappedStart - dragState.initialStartMin + 1440) % 1440;
        const newDuration = Math.max(snapInterval, dragState.initialDuration - delta);

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

  // Quick Add preset handler
  const handleAddPreset = (preset) => {
    let nextStartMin = 540;
    if (tasks.length > 0) {
      const sorted = [...tasks].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
      const last = sorted[sorted.length - 1];
      nextStartMin = (timeToMinutes(last.time) + last.duration) % 1440;
    }

    addTask({
      title: `${preset.icon} ${preset.label}`,
      time: minutesToTime(nextStartMin),
      duration: preset.duration,
      category: preset.category,
      energy: 'Medium'
    });
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
      initialDuration: duration
    });
  };

  const currentTimePct = (currentTimeMinutes / 1440) * 100;

  // Construct renderable timeline segments, properly splitting tasks that wrap across midnight (24:00 -> 00:00)
  const renderedSegments = [];
  tasks.forEach((task) => {
    const startMin = timeToMinutes(task.time);
    const totalDuration = task.duration || 45;
    const endMin = startMin + totalDuration;

    if (endMin <= 1440) {
      // Daytime single block
      renderedSegments.push({
        task,
        startMin,
        totalDuration,
        leftPct: (startMin / 1440) * 100,
        widthPct: (totalDuration / 1440) * 100,
        segmentId: `${task.id}-single`,
        label: task.title
      });
    } else {
      // Overnight block (e.g. 22:00 for 360m -> covers 22:00 to 24:00 AND 00:00 to 04:00 AM)
      // 1. Evening segment (22:00 to 24:00)
      const eveningDuration = 1440 - startMin;
      renderedSegments.push({
        task,
        startMin,
        totalDuration,
        leftPct: (startMin / 1440) * 100,
        widthPct: (eveningDuration / 1440) * 100,
        segmentId: `${task.id}-evening`,
        label: `${task.title} (Part 1)`
      });

      // 2. Early morning segment wrapped (00:00 to 04:00 AM)
      const morningDuration = endMin - 1440;
      renderedSegments.push({
        task,
        startMin,
        totalDuration,
        leftPct: 0,
        widthPct: (morningDuration / 1440) * 100,
        segmentId: `${task.id}-morning`,
        label: `${task.title} (Part 2)`
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
              Interactive 24-hour visual timeline • Drag blocks to move, resize handles to adjust duration (Overnight tasks wrap seamlessly from 22:00 to 04:00)
            </Typography>
          </Box>
        </Box>

        {/* Controls: Snap Interval & Quick Presets */}
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

      {/* Activity Presets Quick Add Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflowX: 'auto', pb: 2, mb: 2, borderBottom: '1px solid rgba(124, 92, 252, 0.1)' }}>
        <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 800, textTransform: 'uppercase', flexShrink: 0, mr: 0.5 }}>
          Quick Add Block:
        </Typography>
        {ACTIVITY_PRESETS.map((preset, idx) => (
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

          {/* Interactive Timeline Canvas Track */}
          <Box
            ref={trackRef}
            className="neumo-inset"
            sx={{
              position: 'relative',
              height: 115,
              borderRadius: 4,
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

            {/* Live Moving Current Time Line */}
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

            {/* Render Task Segments (With Midnight Wrapping Support) */}
            <AnimatePresence>
              {renderedSegments.map((seg) => {
                const { task, startMin, totalDuration, leftPct, widthPct, segmentId } = seg;
                const categoryConfig = CATEGORY_COLORS[task.category] || CATEGORY_COLORS.work;
                const isDraggingThis = dragState && dragState.taskId === task.id;

                return (
                  <motion.div
                    key={segmentId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      left: `${leftPct}%`,
                      width: `${Math.max(3.5, widthPct)}%`,
                      top: 10,
                      bottom: 10,
                      zIndex: isDraggingThis ? 20 : 5
                    }}
                  >
                    <Box
                      onMouseDown={(e) => startDrag(e, task.id, 'move', startMin, totalDuration)}
                      sx={{
                        height: '100%',
                        borderRadius: 3,
                        backgroundColor: task.completed ? '#E2D9F8' : categoryConfig.bg,
                        color: '#FFFFFF',
                        p: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        cursor: isDraggingThis ? 'grabbing' : 'grab',
                        boxShadow: isDraggingThis
                          ? '0 12px 28px rgba(124, 92, 252, 0.4), 0 0 0 2px #7C5CFC'
                          : '0 4px 12px rgba(124, 92, 252, 0.25)',
                        border: '1.5px solid rgba(255, 255, 255, 0.4)',
                        position: 'relative',
                        overflow: 'hidden',
                        opacity: task.completed ? 0.75 : 1,
                        transition: isDraggingThis ? 'none' : 'all 0.15s ease',
                        '&:hover': {
                          boxShadow: '0 8px 20px rgba(124, 92, 252, 0.35)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      {/* Left Resize Handle */}
                      <Box
                        onMouseDown={(e) => startDrag(e, task.id, 'resize-left', startMin, totalDuration)}
                        sx={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: 8,
                          cursor: 'ew-resize',
                          backgroundColor: 'rgba(0,0,0,0.15)',
                          '&:hover': { backgroundColor: '#FFFFFF' }
                        }}
                      />

                      {/* Block Info */}
                      <Box sx={{ px: 0.5, overflow: 'hidden' }}>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 800,
                            color: '#FFFFFF',
                            display: 'block',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontSize: '0.775rem',
                            lineHeight: 1.2,
                            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                          }}
                        >
                          {task.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: '0.675rem',
                            fontWeight: 700,
                            display: 'block',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {formatTimeRange(task.time, totalDuration)}
                        </Typography>
                      </Box>

                      {/* Action Bar inside block: Checkmark, Edit Pencil, Delete Trash */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto', px: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTask(task.id);
                          }}
                          sx={{ p: 0.2, color: '#FFFFFF' }}
                        >
                          {task.completed ? <CheckCircle2 size={13} color="#22C55E" /> : <Circle size={13} />}
                        </IconButton>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2 }}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingTask(task);
                            }}
                            sx={{ p: 0.2, color: 'rgba(255,255,255,0.9)', '&:hover': { color: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.2)' } }}
                          >
                            <Pencil size={13} />
                          </IconButton>

                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTask(task.id);
                            }}
                            sx={{ p: 0.2, color: 'rgba(255,255,255,0.8)', '&:hover': { color: '#EF4444' } }}
                          >
                            <Trash2 size={13} />
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Right Resize Handle */}
                      <Box
                        onMouseDown={(e) => startDrag(e, task.id, 'resize-right', startMin, totalDuration)}
                        sx={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          bottom: 0,
                          width: 8,
                          cursor: 'ew-resize',
                          backgroundColor: 'rgba(0,0,0,0.15)',
                          '&:hover': { backgroundColor: '#FFFFFF' }
                        }}
                      />
                    </Box>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </Box>
        </Box>
      </Box>

      {/* Edit Task Modal */}
      <EditTaskModal
        open={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        task={editingTask}
      />
    </NeumoCard>
  );
};

export default DayPlannerWidget;
