import React from 'react';
import { Menu, Box, Typography, IconButton, Divider } from '@mui/material';
import { Bell, Sparkles, Trophy, Clock, CheckCheck, Trash2 } from 'lucide-react';
import { usePlannerStore } from '../../store/usePlannerStore';

const NotificationCenter = ({ anchorEl, open, onClose }) => {
  const { notifications, markAllNotificationsRead, clearNotifications } = usePlannerStore();

  const getNotifIcon = (type) => {
    switch (type) {
      case 'ai':
        return <Sparkles size={16} color="#7C5CFC" />;
      case 'achievement':
        return <Trophy size={16} color="#F59E0B" />;
      default:
        return <Clock size={16} color="#22C55E" />;
    }
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        className: 'glass-overlay',
        sx: {
          width: 340,
          maxHeight: 420,
          mt: 1.5,
          p: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          border: '1px solid rgba(124, 92, 252, 0.18)',
          boxShadow: '0 10px 30px rgba(124, 92, 252, 0.12)'
        }
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Bell size={18} color="#7C5CFC" />
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1F2937', fontFamily: 'Outfit' }}>
            Notifications
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" onClick={markAllNotificationsRead} title="Mark all read" sx={{ color: '#6B7280' }}>
            <CheckCheck size={16} />
          </IconButton>
          <IconButton size="small" onClick={clearNotifications} title="Clear all" sx={{ color: '#6B7280' }}>
            <Trash2 size={16} />
          </IconButton>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(124, 92, 252, 0.12)', mb: 1.5 }} />

      {/* Notifications List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {notifications.length === 0 ? (
          <Box sx={{ py: 3, textAlign: 'center', color: '#6B7280' }}>
            <Typography variant="body2">No active notifications</Typography>
          </Box>
        ) : (
          notifications.map((n) => (
            <Box
              key={n.id}
              sx={{
                p: 1.5,
                borderRadius: 2.5,
                backgroundColor: n.read ? '#FFFFFF' : '#F4EEFF',
                border: n.read ? '1px solid rgba(124, 92, 252, 0.08)' : '1px solid rgba(124, 92, 252, 0.25)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.5,
                transition: 'all 0.2s ease'
              }}
            >
              <Box sx={{ pt: 0.2 }}>{getNotifIcon(n.type)}</Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1F2937', fontSize: '0.875rem' }}>
                  {n.title}
                </Typography>
                <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.75rem', fontWeight: 600 }}>
                  {n.time}
                </Typography>
              </Box>
              {!n.read && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#7C5CFC',
                    mt: 0.8
                  }}
                />
              )}
            </Box>
          ))
        )}
      </Box>
    </Menu>
  );
};

export default NotificationCenter;
