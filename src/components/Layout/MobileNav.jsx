import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Typography, Drawer, IconButton, Divider } from '@mui/material';
import { LayoutDashboard, Clock, Target, BarChart3, Settings, X, Plus } from 'lucide-react';
import { usePlannerStore } from '../../store/usePlannerStore';
import { USER_ARCHETYPES } from '../../constants/plannerData';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: LayoutDashboard },
  { path: '/timeline', label: 'Timeline', icon: Clock },
  { path: '/habits-goals', label: 'Habits', icon: Target },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings }
];

const MobileNav = ({ onOpenQuickAdd }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { archetype, setArchetype } = usePlannerStore();
  const currentArchetypeObj = USER_ARCHETYPES.find((a) => a.id === archetype) || USER_ARCHETYPES[0];

  return (
    <>
      {/* Fixed Bottom Navigation Bar for Mobile Viewports */}
      <Box
        className="glass-header"
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          py: 1,
          px: 1.5,
          justifyContent: 'space-around',
          alignItems: 'center',
          borderTop: '1px solid rgba(124, 92, 252, 0.15)',
          boxShadow: '0 -10px 30px rgba(124, 92, 252, 0.1)',
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(16px)'
        }}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{ textDecoration: 'none' }}
            >
              {({ isActive }) => (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.3,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 3,
                    color: isActive ? '#7C5CFC' : '#6B7280',
                    backgroundColor: isActive ? '#F4EEFF' : 'transparent',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={20} color={isActive ? '#7C5CFC' : '#6B7280'} />
                  <Typography variant="caption" sx={{ fontSize: '0.675rem', fontWeight: isActive ? 800 : 600 }}>
                    {item.label}
                  </Typography>
                </Box>
              )}
            </NavLink>
          );
        })}

        {/* Quick Add Floating Button in Bottom Bar */}
        <Box
          onClick={onOpenQuickAdd}
          sx={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'linear-gradient(145deg, #7C5CFC, #A855F7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(124, 92, 252, 0.4)',
            cursor: 'pointer'
          }}
        >
          <Plus size={22} color="#FFFFFF" />
        </Box>
      </Box>

      {/* Drawer for Mobile Settings & Persona Quick Switching */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          className: 'glass-overlay',
          sx: {
            borderRadius: '24px 24px 0 0',
            p: 3,
            maxHeight: '80vh',
            backgroundColor: 'rgba(255, 255, 255, 0.96)'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1F2937' }}>
            Lifestyle Personas
          </Typography>
          <IconButton size="small" onClick={() => setDrawerOpen(false)} sx={{ color: '#6B7280' }}>
            <X size={20} />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: 'rgba(124, 92, 252, 0.15)', mb: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {USER_ARCHETYPES.map((arch) => (
            <Box
              key={arch.id}
              onClick={() => {
                setArchetype(arch.id);
                setDrawerOpen(false);
              }}
              sx={{
                p: 2,
                borderRadius: 3,
                backgroundColor: archetype === arch.id ? '#F4EEFF' : '#FFFFFF',
                border: archetype === arch.id ? '1.5px solid #7C5CFC' : '1px solid rgba(124, 92, 252, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 800, color: arch.accent }}>
                  {arch.label}
                </Typography>
                <Typography variant="caption" sx={{ color: '#6B7280', display: 'block' }}>
                  {arch.tagline}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Drawer>
    </>
  );
};

export default MobileNav;
