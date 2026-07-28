import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography, Chip, Checkbox, IconButton, Tooltip } from '@mui/material';
import { Clock, CheckCircle2, Circle, Trash2, Zap, AlertCircle, Pencil } from 'lucide-react';
import NeumoCard from '../Common/NeumoCard';
import EditTaskModal from '../QuickActions/EditTaskModal';
import { usePlannerStore } from '../../store/usePlannerStore';
import { CATEGORY_COLORS } from '../../constants/plannerData';

const TodayTimeline = ({ onOpenQuickAdd }) => {
  const { tasks, toggleTask, deleteTask } = usePlannerStore();
  const [editingTask, setEditingTask] = useState(null);

  const sortedTasks = [...tasks].sort((a, b) => a.time.localeCompare(b.time));
  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPct = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <NeumoCard style={{ flexGrow: 1 }}>
      {/* Timeline Header & Progress Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ p: 1, borderRadius: 2.5, backgroundColor: '#F4EEFF', color: '#7C5CFC', display: 'flex' }}>
            <Clock size={22} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Outfit', color: '#1F2937' }}>
            Today's Timeline
          </Typography>
        </Box>
        <Chip
          label={`${completedCount}/${tasks.length} Done (${progressPct}%)`}
          sx={{
            fontWeight: 800,
            backgroundColor: 'rgba(34, 197, 94, 0.12)',
            color: '#16A34A',
            border: '1px solid rgba(34, 197, 94, 0.25)',
            px: 0.5
          }}
        />
      </Box>

      {/* Dynamic Progress Bar */}
      <Box className="neumo-inset" sx={{ width: '100%', height: 10, borderRadius: 5, mb: 3, p: 0.3, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            height: '100%',
            borderRadius: 4,
            background: 'linear-gradient(90deg, #7C5CFC, #22C55E)'
          }}
        />
      </Box>

      {/* Task List Timeline Slots */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {sortedTasks.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center', color: '#6B7280' }}>
            <AlertCircle size={32} style={{ marginBottom: 8, opacity: 0.6 }} />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>No activities scheduled for today yet.</Typography>
            <button onClick={onOpenQuickAdd} className="skeuo-btn" style={{ marginTop: 14 }}>
              + Add First Activity
            </button>
          </Box>
        ) : (
          <AnimatePresence>
            {sortedTasks.map((task, index) => {
              const categoryColor = CATEGORY_COLORS[task.category] || CATEGORY_COLORS.work;

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  whileHover={{ y: -2 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      flexDirection: 'row',
                      gap: { xs: 1.5, sm: 2 },
                      p: { xs: 1.8, sm: 2.2 },
                      borderRadius: 3.5,
                      backgroundColor: task.completed ? '#F8F5FF' : '#FFFFFF',
                      borderLeft: `5px solid ${categoryColor.bg}`,
                      borderTop: '1px solid rgba(124, 92, 252, 0.1)',
                      borderRight: '1px solid rgba(124, 92, 252, 0.1)',
                      borderBottom: '1px solid rgba(124, 92, 252, 0.1)',
                      boxShadow: task.completed
                        ? 'inset 2px 2px 6px rgba(124, 92, 252, 0.05)'
                        : '4px 4px 12px rgba(124, 92, 252, 0.06), -4px -4px 10px #FFFFFF',
                      opacity: task.completed ? 0.75 : 1,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'rgba(124, 92, 252, 0.3)',
                        boxShadow: task.completed
                          ? 'inset 2px 2px 6px rgba(124, 92, 252, 0.05)'
                          : '6px 6px 16px rgba(124, 92, 252, 0.12), -4px -4px 10px #FFFFFF'
                      }
                    }}
                  >
                    {/* Time & Duration Display */}
                    <Box sx={{ minWidth: 70, textAlign: 'center' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1F2937', fontSize: '0.9rem' }}>
                        {task.time}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.75rem', fontWeight: 600 }}>
                        {task.duration} mins
                      </Typography>
                    </Box>

                    {/* Completion Checkbox */}
                    <Checkbox
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      icon={<Circle size={22} color="#9CA3AF" />}
                      checkedIcon={<CheckCircle2 size={22} color="#22C55E" />}
                      sx={{ p: 0.5 }}
                    />

                    {/* Task Title & Details */}
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 700,
                          color: task.completed ? '#6B7280' : '#1F2937',
                          textDecoration: task.completed ? 'line-through' : 'none',
                          wordBreak: 'break-word'
                        }}
                      >
                        {task.title}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
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

                        {task.energy && (
                          <Chip
                            icon={<Zap size={12} color="#F59E0B" />}
                            label={`${task.energy} Focus`}
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: '0.725rem',
                              backgroundColor: 'rgba(245, 158, 11, 0.12)',
                              color: '#D97706',
                              fontWeight: 700
                            }}
                          />
                        )}
                      </Box>
                    </Box>

                    {/* Action Controls: Edit & Delete */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Tooltip title="Edit Task Name & Time">
                        <IconButton
                          size="small"
                          onClick={() => setEditingTask(task)}
                          sx={{
                            color: '#7C5CFC',
                            '&:hover': { backgroundColor: 'rgba(124, 92, 252, 0.1)' }
                          }}
                        >
                          <Pencil size={16} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete Task">
                        <IconButton
                          size="small"
                          onClick={() => deleteTask(task.id)}
                          sx={{
                            color: '#9CA3AF',
                            '&:hover': { color: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' }
                          }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
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

export default TodayTimeline;
