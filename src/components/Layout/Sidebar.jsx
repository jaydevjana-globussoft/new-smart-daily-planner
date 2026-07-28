import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Typography, IconButton } from '@mui/material';
import { LayoutDashboard, Clock, Target, BarChart3, Settings, Zap, CheckCircle2, X } from 'lucide-react';
import { usePlannerStore } from '../../store/usePlannerStore';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/timeline', label: 'Timeline & Calendar', icon: Clock },
  { path: '/habits-goals', label: 'Habits & Goals', icon: Target },
  { path: '/analytics', label: 'Analytics & Insights', icon: BarChart3 },
  { path: '/settings', label: 'Settings & Lifestyle', icon: Settings }
];

const Sidebar = ({ isMobileDrawer = false, onClose }) => {
  const { tasks, habits } = usePlannerStore();

  const completedTasks = tasks.filter((t) => t.completed).length;
  const habitStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);

  return (
    <Box
      className={isMobileDrawer ? '' : 'neumo-card'}
      sx={{
        width: isMobileDrawer ? '100%' : { xs: '100%', md: 240 },
        minWidth: isMobileDrawer ? 'auto' : 240,
        height: 'fit-content',
        p: isMobileDrawer ? 1 : 2.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        position: isMobileDrawer ? 'static' : 'sticky',
        top: 90,
        backgroundColor: '#FFFFFF',
        boxShadow: isMobileDrawer ? 'none' : '8px 8px 24px rgba(124, 92, 252, 0.08), -8px -8px 20px #FFFFFF',
        border: isMobileDrawer ? 'none' : '1px solid rgba(124, 92, 252, 0.12)'
      }}
    >
      {/* Navigation Links */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1, mb: 0.5 }}>
          <Typography variant="caption" sx={{ color: '#7C5CFC', fontWeight: 800, letterSpacing: 1 }}>
            NAVIGATION
          </Typography>
          {isMobileDrawer && (
            <IconButton size="small" onClick={onClose} sx={{ color: '#6B7280' }}>
              <X size={18} />
            </IconButton>
          )}
        </Box>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (isMobileDrawer && onClose) onClose();
              }}
              style={{ textDecoration: 'none' }}
            >
              {({ isActive }) => (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.8,
                    px: 2,
                    py: 1.4,
                    borderRadius: 3,
                    transition: 'all 0.2s ease',
                    backgroundColor: isActive ? '#F4EEFF' : 'transparent',
                    color: isActive ? '#7C5CFC' : '#4B5563',
                    border: isActive ? '1px solid rgba(124, 92, 252, 0.25)' : '1px solid transparent',
                    boxShadow: isActive ? 'inset 2px 2px 5px rgba(124, 92, 252, 0.1), inset -2px -2px 5px #FFFFFF' : 'none',
                    '&:hover': {
                      color: '#1F2937',
                      backgroundColor: '#F8F4FF'
                    }
                  }}
                >
                  <Icon size={18} color={isActive ? '#7C5CFC' : '#6B7280'} />
                  <Typography variant="body2" sx={{ fontWeight: isActive ? 800 : 600 }}>
                    {item.label}
                  </Typography>
                </Box>
              )}
            </NavLink>
          );
        })}
      </Box>

      {/* Quick Summary Widget in Sidebar */}
      <Box
        className="neumo-inset"
        sx={{
          p: 2,
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          backgroundColor: '#F8F4FF',
          boxShadow: 'inset 3px 3px 8px rgba(124, 92, 252, 0.08), inset -3px -3px 8px #FFFFFF'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#7C5CFC' }}>
            DAILY PROGRESS
          </Typography>
          <Zap size={14} color="#FF7A59" />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircle2 size={18} color="#22C55E" />
          <Typography variant="body2" sx={{ fontWeight: 800, color: '#1F2937' }}>
            {completedTasks} / {tasks.length} Completed
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Target size={18} color="#A855F7" />
          <Typography variant="body2" sx={{ fontWeight: 800, color: '#1F2937' }}>
            {habitStreak} Days Streak
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
