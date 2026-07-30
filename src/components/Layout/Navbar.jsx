import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Badge, Menu as MuiMenu, MenuItem, Tooltip, Chip } from '@mui/material';
import { Sparkles, Bell, Command, Check, Layers, Plus, Search } from 'lucide-react';
import { usePlannerStore } from '../../store/usePlannerStore';
import { useAIStore } from '../../store/useAIStore';
import { USER_ARCHETYPES } from '../../constants/plannerData';
import NotificationCenter from '../Notifications/NotificationCenter';

const Navbar = ({ onOpenCommandPalette, onOpenQuickAdd }) => {
  const { archetype, setArchetype, notifications } = usePlannerStore();
  const { toggleOpen: toggleAIOpen, isOpen: isAIOpen } = useAIStore();

  const [archetypeMenuAnchor, setArchetypeMenuAnchor] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) {
      setIsMac(true);
    }
  }, []);

  const currentArchetypeObj = USER_ARCHETYPES.find((a) => a.id === archetype) || USER_ARCHETYPES[0];
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  return (
    <Box
      className="glass-header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        px: { xs: 2, sm: 3.5, md: 5 },
        py: 0.8,
        height: 62,
        minHeight: 62,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        boxSizing: 'border-box',
        gap: { xs: 1.5, sm: 2, md: 3 }
      }}
    >
      {/* Brand Logo & User Role Persona Switcher Group */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5, md: 2 }, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7C5CFC, #A855F7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(124, 92, 252, 0.35)',
              flexShrink: 0
            }}
          >
            <Sparkles size={20} color="#ffffff" />
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'Outfit', letterSpacing: -0.5, lineHeight: 1, color: '#1F2937', fontSize: { sm: '0.95rem', md: '1.05rem' } }}>
              Smart <span style={{ color: '#7C5CFC' }}>Daily Planner</span>
            </Typography>
            <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.725rem', fontWeight: 600, display: 'block', mt: 0.1 }}>
              AI Lifestyle Assistant
            </Typography>
          </Box>
        </Box>

        {/* Archetype Quick Switcher Chip */}
        <Tooltip title="Switch lifestyle persona anytime - zero onboarding required!">
          <Chip
            icon={<Layers size={13} style={{ color: '#7C5CFC' }} />}
            label={currentArchetypeObj.label}
            onClick={(e) => setArchetypeMenuAnchor(e.currentTarget)}
            className="skeuo-chip"
            sx={{
              backgroundColor: '#FFFFFF',
              color: '#1F2937',
              border: '1px solid rgba(124, 92, 252, 0.2)',
              fontWeight: 700,
              height: 38,
              fontSize: { xs: '0.75rem', md: '0.8rem' },
              boxShadow: '3px 3px 8px rgba(124, 92, 252, 0.08), -3px -3px 8px #FFFFFF',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: '#F4EEFF',
                borderColor: '#7C5CFC',
                transform: 'translateY(-2px)',
                boxShadow: '4px 6px 12px rgba(124, 92, 252, 0.12)'
              },
              '&:active': {
                transform: 'scale(0.97)'
              }
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

      {/* Flexible Center Search / Command Palette Bar */}
      <Box
        onClick={onOpenCommandPalette}
        className="neumo-inset"
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          gap: 1.5,
          px: 2,
          height: 38,
          cursor: 'pointer',
          flex: '1 1 auto',
          minWidth: { md: 220, lg: 280 },
          maxWidth: 480,
          color: '#4B5563',
          backgroundColor: '#F8F4FF',
          border: '1px solid rgba(124, 92, 252, 0.15)',
          borderRadius: '12px',
          boxSizing: 'border-box',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            color: '#1F2937',
            borderColor: '#7C5CFC',
            backgroundColor: '#FFFFFF',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(124, 92, 252, 0.1)'
          }
        }}
      >
        <Command size={16} color="#7C5CFC" />
        <Typography variant="body2" sx={{ fontSize: '0.825rem', flexGrow: 1, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden' }}>
          Quick Search / Commands...
        </Typography>
        <Chip
          label={isMac ? "Cmd + K" : "Ctrl + K"}
          size="small"
          sx={{
            height: 22,
            fontSize: '0.675rem',
            backgroundColor: '#F4EEFF',
            color: '#7C5CFC',
            fontWeight: 800,
            borderRadius: '6px'
          }}
        />
      </Box>

      {/* Mobile Search Icon Button */}
      <IconButton
        onClick={onOpenCommandPalette}
        sx={{
          display: { xs: 'flex', md: 'none' },
          width: 38,
          height: 38,
          color: '#7C5CFC',
          backgroundColor: '#F8F4FF',
          border: '1px solid rgba(124, 92, 252, 0.15)',
          borderRadius: '12px'
        }}
      >
        <Search size={18} />
      </IconButton>

      {/* Action Controls Group with Equal Height & Precise Spacing */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.8, sm: 1.2, md: 1.5 }, flexShrink: 0 }}>
        {/* Quick Add Button */}
        <button
          onClick={onOpenQuickAdd}
          className="skeuo-btn"
          style={{
            height: '38px',
            padding: '0 14px',
            fontSize: '0.825rem',
            background: 'linear-gradient(145deg, #22C55E, #16A34A)',
            boxShadow: '0px 3px 0px #15803D, 0px 5px 12px rgba(34, 197, 94, 0.28)',
            borderRadius: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>+ Quick Add</Box>
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center' }}><Plus size={16} /></Box>
        </button>

        {/* Notifications Icon Button */}
        <IconButton
          onClick={(e) => setNotifAnchor(e.currentTarget)}
          sx={{
            width: 38,
            height: 38,
            color: '#1F2937',
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(124, 92, 252, 0.15)',
            borderRadius: '12px',
            boxShadow: '3px 3px 8px rgba(124, 92, 252, 0.08), -3px -3px 8px #FFFFFF',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: '#F4EEFF',
              color: '#7C5CFC',
              borderColor: '#7C5CFC',
              transform: 'translateY(-2px)'
            },
            '&:active': {
              transform: 'scale(0.97)'
            }
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
            height: '38px',
            padding: '0 14px',
            fontSize: '0.825rem',
            background: isAIOpen
              ? 'linear-gradient(145deg, #FF7A59, #E55C3A)'
              : 'linear-gradient(145deg, #7C5CFC, #6366F1)',
            boxShadow: isAIOpen
              ? '0px 3px 0px #C74223, 0px 5px 12px rgba(255, 122, 89, 0.3)'
              : '0px 3px 0px #4F32C9, 0px 5px 12px rgba(124, 92, 252, 0.3)',
            borderRadius: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
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
