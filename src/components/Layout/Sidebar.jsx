import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { LayoutDashboard, Clock, Target, BarChart3, Settings, Zap, CheckCircle2, X, ChevronLeft } from 'lucide-react';
import { usePlannerStore } from '../../store/usePlannerStore';
import gsap from 'gsap';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/timeline', label: 'Timeline & Calendar', icon: Clock },
  { path: '/habits-goals', label: 'Habits & Goals', icon: Target },
  { path: '/analytics', label: 'Analytics & Insights', icon: BarChart3 },
  { path: '/settings', label: 'Settings & Lifestyle', icon: Settings }
];

const Sidebar = ({ isMobileDrawer = false, onClose }) => {
  const { tasks, habits, sidebarCollapsed, toggleSidebar } = usePlannerStore();

  const completedTasks = tasks.filter((t) => t.completed).length;
  const habitStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);

  const sidebarRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const labelsRef = useRef([]);
  const headerTextRef = useRef(null);
  const progressCardRef = useRef(null);
  const isInitialRender = useRef(true);

  // Global Keyboard Shortcut: Ctrl+\ or Cmd+\ to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  // GSAP Animation logic for spring expand/collapse transitions
  useLayoutEffect(() => {
    if (isMobileDrawer || !sidebarRef.current) return;

    const sidebar = sidebarRef.current;
    const labels = labelsRef.current.filter(Boolean);
    const headerText = headerTextRef.current;
    const progressCard = progressCardRef.current;
    const toggleBtnIcon = toggleBtnRef.current;

    if (isInitialRender.current) {
      isInitialRender.current = false;
      if (sidebarCollapsed) {
        gsap.set(sidebar, { width: 76, minWidth: 76, paddingLeft: 12, paddingRight: 12 });
        gsap.set(labels, { opacity: 0, x: -10, display: 'none' });
        if (headerText) gsap.set(headerText, { opacity: 0, display: 'none' });
        if (progressCard) gsap.set(progressCard, { opacity: 0, scale: 0.9, display: 'none', height: 0, margin: 0, padding: 0 });
        if (toggleBtnIcon) gsap.set(toggleBtnIcon, { rotation: 180 });
      } else {
        gsap.set(sidebar, { width: 240, minWidth: 240, paddingLeft: 20, paddingRight: 20 });
        gsap.set(labels, { opacity: 1, x: 0, display: 'inline' });
        if (headerText) gsap.set(headerText, { opacity: 1, display: 'block' });
        if (progressCard) gsap.set(progressCard, { opacity: 1, scale: 1, display: 'flex', height: 'auto', padding: 16 });
        if (toggleBtnIcon) gsap.set(toggleBtnIcon, { rotation: 0 });
      }
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.inOut', duration: 0.35 }
      });

      if (sidebarCollapsed) {
        // Collapse Sequence: rotate arrow 180°, fade labels & progress card, shrink width with spring
        if (toggleBtnIcon) {
          tl.to(toggleBtnIcon, { rotation: 180, duration: 0.35, ease: 'back.out(1.5)' }, 0);
        }

        tl.to(labels, {
          opacity: 0,
          x: -12,
          duration: 0.18,
          stagger: 0.02,
          onComplete: () => gsap.set(labels, { display: 'none' })
        }, 0)
        .to(headerText, {
          opacity: 0,
          duration: 0.15,
          onComplete: () => gsap.set(headerText, { display: 'none' })
        }, 0)
        .to(progressCard, {
          opacity: 0,
          scale: 0.9,
          height: 0,
          paddingTop: 0,
          paddingBottom: 0,
          marginTop: 0,
          marginBottom: 0,
          duration: 0.22,
          onComplete: () => gsap.set(progressCard, { display: 'none' })
        }, 0)
        .to(sidebar, {
          width: 76,
          minWidth: 76,
          paddingLeft: 12,
          paddingRight: 12,
          duration: 0.38,
          ease: 'back.inOut(1.2)'
        }, 0);
      } else {
        // Expand Sequence: rotate arrow back to 0°, expand width with spring, reveal text & cards
        if (toggleBtnIcon) {
          tl.to(toggleBtnIcon, { rotation: 0, duration: 0.35, ease: 'back.out(1.5)' }, 0);
        }

        gsap.set(labels, { display: 'inline', opacity: 0, x: -10 });
        if (headerText) gsap.set(headerText, { display: 'block', opacity: 0 });
        if (progressCard) gsap.set(progressCard, { display: 'flex', opacity: 0, scale: 0.92, height: 'auto', padding: 16 });

        tl.to(sidebar, {
          width: 240,
          minWidth: 240,
          paddingLeft: 20,
          paddingRight: 20,
          duration: 0.38,
          ease: 'back.out(1.2)'
        }, 0)
        .to(headerText, { opacity: 1, duration: 0.25 }, 0.1)
        .to(labels, { opacity: 1, x: 0, stagger: 0.03, duration: 0.25 }, 0.1)
        .to(progressCard, { opacity: 1, scale: 1, duration: 0.28 }, 0.12);
      }
    }, sidebar);

    return () => ctx.revert();
  }, [sidebarCollapsed, isMobileDrawer]);

  return (
    <Box
      ref={sidebarRef}
      className={isMobileDrawer ? '' : 'neumo-card'}
      sx={{
        position: isMobileDrawer ? 'static' : 'sticky',
        top: 90,
        width: isMobileDrawer ? '100%' : (sidebarCollapsed ? 76 : 240),
        minWidth: isMobileDrawer ? 'auto' : (sidebarCollapsed ? 76 : 240),
        height: 'fit-content',
        p: isMobileDrawer ? 1 : (sidebarCollapsed ? '20px 12px' : 2.5),
        display: 'flex',
        flexDirection: 'column',
        gap: sidebarCollapsed && !isMobileDrawer ? 2 : 3,
        backgroundColor: '#FFFFFF',
        boxShadow: isMobileDrawer ? 'none' : '8px 8px 24px rgba(124, 92, 252, 0.08), -8px -8px 20px #FFFFFF',
        border: isMobileDrawer ? 'none' : '1px solid rgba(124, 92, 252, 0.12)',
        borderRadius: isMobileDrawer ? 0 : '24px',
        boxSizing: 'border-box',
        overflow: 'visible',
        zIndex: 10
      }}
    >
      {/* Spring Animated Arrow Toggle Button attached to outer right edge */}
      {!isMobileDrawer && (
        <Tooltip
          title={sidebarCollapsed ? "Expand sidebar (Ctrl+\\)" : "Collapse sidebar (Ctrl+\\)"}
          placement="right"
          arrow
        >
          <IconButton
            onClick={toggleSidebar}
            size="small"
            sx={{
              position: 'absolute',
              top: 24,
              right: -14,
              zIndex: 30,
              width: 28,
              height: 28,
              backgroundColor: '#FFFFFF',
              border: '1.5px solid rgba(124, 92, 252, 0.25)',
              boxShadow: '0 3px 10px rgba(124, 92, 252, 0.18), 0 0 0 2px #FFFFFF',
              color: '#7C5CFC',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              '&:hover': {
                backgroundColor: '#7C5CFC',
                color: '#FFFFFF',
                borderColor: '#7C5CFC',
                boxShadow: '0 4px 14px rgba(124, 92, 252, 0.35)',
                transform: 'scale(1.12)'
              }
            }}
          >
            <Box ref={toggleBtnRef} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={16} />
            </Box>
          </IconButton>
        </Tooltip>
      )}

      {/* Navigation Links */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
        <Box
          ref={headerTextRef}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 1,
            mb: 0.5,
            whiteSpace: 'nowrap',
            overflow: 'hidden'
          }}
        >
          <Typography variant="caption" sx={{ color: '#7C5CFC', fontWeight: 800, letterSpacing: 1 }}>
            NAVIGATION
          </Typography>
          {isMobileDrawer && (
            <IconButton size="small" onClick={onClose} sx={{ color: '#6B7280' }}>
              <X size={18} />
            </IconButton>
          )}
        </Box>

        {NAV_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Tooltip
              key={item.path}
              title={sidebarCollapsed && !isMobileDrawer ? item.label : ''}
              placement="right"
              arrow
              disableHoverListener={!sidebarCollapsed || isMobileDrawer}
            >
              <NavLink
                to={item.path}
                onClick={() => {
                  if (isMobileDrawer && onClose) onClose();
                }}
                style={{ textDecoration: 'none', display: 'block', width: '100%' }}
              >
                {({ isActive }) => (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: sidebarCollapsed && !isMobileDrawer ? 'center' : 'flex-start',
                      gap: sidebarCollapsed && !isMobileDrawer ? 0 : 1.8,
                      px: sidebarCollapsed && !isMobileDrawer ? 0 : 2,
                      py: 1.4,
                      height: 48,
                      width: '100%',
                      boxSizing: 'border-box',
                      borderRadius: 3,
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      backgroundColor: isActive ? '#F4EEFF' : 'transparent',
                      color: isActive ? '#7C5CFC' : '#4B5563',
                      border: isActive ? '1px solid rgba(124, 92, 252, 0.25)' : '1px solid transparent',
                      boxShadow: isActive ? 'inset 2px 2px 5px rgba(124, 92, 252, 0.1), inset -2px -2px 5px #FFFFFF' : 'none',
                      '&:hover': {
                        color: '#1F2937',
                        backgroundColor: '#F8F4FF',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(124, 92, 252, 0.1)'
                      },
                      '&:active': {
                        transform: 'scale(0.97)'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 24,
                        flexShrink: 0
                      }}
                    >
                      <Icon size={18} color={isActive ? '#7C5CFC' : '#6B7280'} />
                    </Box>
                    <Typography
                      ref={(el) => (labelsRef.current[idx] = el)}
                      className="nav-item-label"
                      variant="body2"
                      sx={{
                        fontWeight: isActive ? 800 : 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                )}
              </NavLink>
            </Tooltip>
          );
        })}
      </Box>

      {/* Quick Summary Widget in Sidebar */}
      <Box
        ref={progressCardRef}
        className="neumo-inset daily-progress-card"
        sx={{
          p: 2,
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          backgroundColor: '#F8F4FF',
          boxShadow: 'inset 3px 3px 8px rgba(124, 92, 252, 0.08), inset -3px -3px 8px #FFFFFF',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', whiteSpace: 'nowrap' }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#7C5CFC' }}>
            DAILY PROGRESS
          </Typography>
          <Zap size={14} color="#FF7A59" />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, whiteSpace: 'nowrap' }}>
          <CheckCircle2 size={18} color="#22C55E" />
          <Typography variant="body2" sx={{ fontWeight: 800, color: '#1F2937' }}>
            {completedTasks} / {tasks.length} Completed
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, whiteSpace: 'nowrap' }}>
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
