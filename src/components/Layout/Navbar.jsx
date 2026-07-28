import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Badge, Menu as MuiMenu, MenuItem, Tooltip, Chip } from '@mui/material';
import { Sparkles, Bell, Command, Check, Layers, Menu as MenuIcon, Plus } from 'lucide-react';
import { usePlannerStore } from '../../store/usePlannerStore';
import { useAIStore } from '../../store/useAIStore';
import { USER_ARCHETYPES } from '../../constants/plannerData';
import NotificationCenter from '../Notifications/NotificationCenter';

const Navbar = ({ onOpenCommandPalette, onOpenQuickAdd, onToggleMobileNav }) => {
  const { archetype, setArchetype, notifications, sidebarCollapsed, toggleSidebar } = usePlannerStore();
  const { toggleOpen: toggleAIOpen, isOpen: isAIOpen } = useAIStore();

  const [archetypeMenuAnchor, setArchetypeMenuAnchor] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) {
      setIsMac(true);
    }
  }, []);

  const handleToggle = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 900) {
      if (onToggleMobileNav) onToggleMobileNav();
    } else {
      toggleSidebar();
    }
  };

  const currentArchetypeObj = USER_ARCHETYPES.find((a) => a.id === archetype) || USER_ARCHETYPES[0];
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  return (
    <Box
      className="glass-header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        px: { xs: 1.5, sm: 3, md: 4 },
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}
    >
      {/* Brand & Sidebar Toggle */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
        <Tooltip title={sidebarCollapsed ? "Expand Navigation Bar" : "Collapse Navigation Bar"}>
          <IconButton
            onClick={handleToggle}
            sx={{
              color: '#1F2937',
              backgroundColor: '#FFFFFF',
              boxShadow: '3px 3px 8px rgba(124, 92, 252, 0.08), -3px -3px 8px #FFFFFF',
              border: '1px solid rgba(124, 92, 252, 0.15)',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: '#7C5CFC',
                color: '#FFFFFF'
              }
            }}
          >
            <MenuIcon size={20} />
          </IconButton>
        </Tooltip>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #7C5CFC, #A855F7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(124, 92, 252, 0.35)'
            }}
          >
            <Sparkles size={22} color="#ffffff" />
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5, lineHeight: 1, color: '#1F2937' }}>
              Smart <span style={{ color: '#7C5CFC' }}>Daily Planner</span>
            </Typography>
            <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.75rem', fontWeight: 600 }}>
              AI Lifestyle Assistant
            </Typography>
          </Box>
        </Box>

        {/* Archetype Quick Switcher Chip */}
        <Tooltip title="Switch lifestyle persona anytime - zero onboarding required!">
          <Chip
            icon={<Layers size={14} style={{ color: '#7C5CFC' }} />}
            label={currentArchetypeObj.label}
            onClick={(e) => setArchetypeMenuAnchor(e.currentTarget)}
            className="skeuo-chip"
            sx={{
              backgroundColor: '#FFFFFF',
              color: '#1F2937',
              border: '1px solid rgba(124, 92, 252, 0.2)',
              fontWeight: 700,
              height: 36,
              fontSize: '0.825rem',
              boxShadow: '3px 3px 8px rgba(124, 92, 252, 0.08), -3px -3px 8px #FFFFFF',
              '&:hover': { backgroundColor: '#F4EEFF', borderColor: '#7C5CFC' }
            }}
          />
        </Tooltip>

        <MuiMenu
          anchorEl={archetypeMenuAnchor}
          open={Boolean(archetypeMenuAnchor)}
          onClose={() => setArchetypeMenuAnchor(null)}
          PaperProps={{
            className: 'glass-overlay',
            sx: { mt: 1, minWidth: 260, p: 1, backgroundColor: 'rgba(255, 255, 255, 0.96)' }
          }}
        >
          <Typography variant="subtitle2" sx={{ px: 1.5, py: 1, color: '#6B7280', fontWeight: 800, fontSize: '0.75rem' }}>
            SELECT LIFESTYLE PERSONA
          </Typography>
          {USER_ARCHETYPES.map((arch) => (
            <MenuItem
              key={arch.id}
              onClick={() => {
                setArchetype(arch.id);
                setArchetypeMenuAnchor(null);
              }}
              sx={{
                borderRadius: 2.5,
                py: 1,
                my: 0.3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: archetype === arch.id ? '#F4EEFF' : 'transparent',
                '&:hover': { backgroundColor: '#F8F4FF' }
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: archetype === arch.id ? '#7C5CFC' : '#1F2937' }}>
                  {arch.label}
                </Typography>
                <Typography variant="caption" sx={{ color: '#6B7280', display: 'block' }}>
                  {arch.tagline}
                </Typography>
              </Box>
              {archetype === arch.id && <Check size={16} color="#7C5CFC" />}
            </MenuItem>
          ))}
        </MuiMenu>
      </Box>

      {/* Center Search / Command Palette shortcut */}
      <Box
        onClick={onOpenCommandPalette}
        className="neumo-inset"
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          gap: 1.5,
          px: 2,
          py: 0.9,
          cursor: 'pointer',
          width: 320,
          color: '#4B5563',
          backgroundColor: '#F8F4FF',
          border: '1px solid rgba(124, 92, 252, 0.15)',
          transition: 'all 0.2s ease',
          '&:hover': { color: '#1F2937', borderColor: '#7C5CFC', backgroundColor: '#FFFFFF' }
        }}
      >
        <Command size={16} color="#7C5CFC" />
        <Typography variant="body2" sx={{ fontSize: '0.85rem', flexGrow: 1, fontWeight: 600 }}>
          Quick Search / Commands...
        </Typography>
        <Chip label={isMac ? "Cmd + K" : "Ctrl + K"} size="small" sx={{ height: 22, fontSize: '0.675rem', backgroundColor: '#F4EEFF', color: '#7C5CFC', fontWeight: 800 }} />
      </Box>

      {/* Action Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.8, sm: 1.5 } }}>
        {/* Quick Add Button */}
        <button
          onClick={onOpenQuickAdd}
          className="skeuo-btn"
          style={{
            padding: '8px 14px',
            fontSize: '0.85rem',
            background: 'linear-gradient(145deg, #22C55E, #16A34A)',
            boxShadow: '0px 4px 0px #15803D, 0px 6px 14px rgba(34, 197, 94, 0.3)'
          }}
        >
          <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>+ Quick Add</Box>
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center' }}><Plus size={16} /></Box>
        </button>

        {/* Notifications Icon */}
        <IconButton
          onClick={(e) => setNotifAnchor(e.currentTarget)}
          sx={{
            color: '#1F2937',
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(124, 92, 252, 0.15)',
            boxShadow: '3px 3px 8px rgba(124, 92, 252, 0.08), -3px -3px 8px #FFFFFF',
            '&:hover': { backgroundColor: '#F4EEFF', color: '#7C5CFC' }
          }}
        >
          <Badge badgeContent={unreadNotifs} color="error">
            <Bell size={18} />
          </Badge>
        </IconButton>

        <NotificationCenter
          anchorEl={notifAnchor}
          open={Boolean(notifAnchor)}
          onClose={() => setNotifAnchor(null)}
        />

        {/* AI Assistant Trigger Button */}
        <button
          onClick={toggleAIOpen}
          className={`skeuo-btn ${!isAIOpen ? 'ai-glow' : ''}`}
          style={{
            padding: '8px 16px',
            fontSize: '0.85rem',
            background: isAIOpen
              ? 'linear-gradient(145deg, #FF7A59, #E55C3A)'
              : 'linear-gradient(145deg, #7C5CFC, #6366F1)',
            boxShadow: isAIOpen
              ? '0px 4px 0px #C74223, 0px 6px 14px rgba(255, 122, 89, 0.35)'
              : '0px 4px 0px #4F32C9, 0px 6px 14px rgba(124, 92, 252, 0.35)'
          }}
        >
          <Sparkles size={16} />
          <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>AI Assistant</Box>
        </button>
      </Box>
    </Box>
  );
};

export default Navbar;
