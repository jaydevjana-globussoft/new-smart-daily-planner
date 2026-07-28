import React, { useState, useEffect } from 'react';
import { Box, Typography, InputBase, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { Search, Plus, Sparkles, Layers } from 'lucide-react';
import GlassModal from '../Common/GlassModal';
import { usePlannerStore } from '../../store/usePlannerStore';
import { useAIStore } from '../../store/useAIStore';
import { USER_ARCHETYPES } from '../../constants/plannerData';

const CommandPalette = ({ open, onOpen, onClose, onOpenQuickAdd }) => {
  const [query, setQuery] = useState('');
  const { setArchetype } = usePlannerStore();
  const { toggleOpen: toggleAI } = useAIStore();

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isK = e.key && e.key.toLowerCase() === 'k';
      if ((e.ctrlKey || e.metaKey) && isK) {
        e.preventDefault();
        if (open) {
          onClose();
        } else if (onOpen) {
          onOpen();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpen, onClose]);

  const COMMANDS = [
    {
      id: 'cmd_quick_add',
      title: 'Quick Add Task / Habit / Goal',
      category: 'Actions',
      icon: Plus,
      action: () => {
        onClose();
        onOpenQuickAdd();
      }
    },
    {
      id: 'cmd_ai',
      title: 'Open Aura AI Assistant Chat',
      category: 'Actions',
      icon: Sparkles,
      action: () => {
        onClose();
        toggleAI();
      }
    },
    ...USER_ARCHETYPES.map((arch) => ({
      id: `arch_${arch.id}`,
      title: `Switch Persona: ${arch.label}`,
      category: 'Lifestyle Archetype',
      icon: Layers,
      action: () => {
        setArchetype(arch.id);
        onClose();
      }
    }))
  ];

  const filteredCommands = COMMANDS.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <GlassModal open={open} onClose={onClose} maxWidth={600}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Search Input */}
        <Box
          className="neumo-inset"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2,
            py: 1.2,
            borderRadius: 3,
            backgroundColor: '#F8F4FF',
            border: '1px solid rgba(124, 92, 252, 0.15)'
          }}
        >
          <Search size={20} color="#7C5CFC" />
          <InputBase
            autoFocus
            placeholder="Type a command or search action..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ flexGrow: 1, color: '#1F2937', fontSize: '1rem', fontWeight: 600 }}
          />
        </Box>

        {/* Command List */}
        <List sx={{ maxHeight: 320, overflowY: 'auto', p: 0 }}>
          {filteredCommands.length === 0 ? (
            <Box sx={{ py: 4, textAlign: 'center', color: '#6B7280' }}>
              <Typography variant="body2">No matching commands found.</Typography>
            </Box>
          ) : (
            filteredCommands.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <ListItem
                  key={cmd.id}
                  button
                  onClick={cmd.action}
                  sx={{
                    borderRadius: 2.5,
                    mb: 0.8,
                    transition: 'all 0.15s ease',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(124, 92, 252, 0.08)',
                    '&:hover': {
                      backgroundColor: '#F4EEFF',
                      borderColor: '#7C5CFC',
                      transform: 'translateX(4px)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: '#7C5CFC' }}>
                    <Icon size={18} />
                  </ListItemIcon>
                  <ListItemText
                    primary={cmd.title}
                    secondary={cmd.category}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 700, color: '#1F2937' }}
                    secondaryTypographyProps={{ variant: 'caption', color: '#6B7280', fontWeight: 600 }}
                  />
                </ListItem>
              );
            })
          )}
        </List>
      </Box>
    </GlassModal>
  );
};

export default CommandPalette;
