import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography, InputBase, IconButton, Chip, Avatar } from '@mui/material';
import { Sparkles, Send, X } from 'lucide-react';
import { useAIStore } from '../../store/useAIStore';
import { usePlannerStore } from '../../store/usePlannerStore';

const AIAssistantWidget = () => {
  const { isOpen, setIsOpen, messages, sendMessage, isTyping } = useAIStore();
  const { addTask } = usePlannerStore();
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  const handleActionClick = (actionType) => {
    if (actionType === 'optimize') {
      sendMessage('Auto-optimizing today schedule for high productivity window...');
    } else if (actionType === 'add_break' || actionType === 'add_rest') {
      addTask({
        title: '☕ AI Suggested Rest Break',
        time: '15:30',
        duration: 20,
        category: 'health',
        energy: 'Low'
      });
      sendMessage('I have automatically inserted a 20-minute rest break into your timeline at 3:30 PM!');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        style={{
          position: 'fixed',
          zIndex: 1400
        }}
      >
        <Box
          className="glass-overlay"
          sx={{
            position: 'fixed',
            bottom: { xs: 0, sm: 24 },
            right: { xs: 0, sm: 24 },
            left: { xs: 0, sm: 'auto' },
            width: { xs: '100%', sm: 410 },
            maxWidth: { xs: '100vw', sm: 'calc(100vw - 32px)' },
            height: { xs: '85vh', sm: 570 },
            maxHeight: { xs: '85vh', sm: 'calc(100vh - 48px)' },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: { xs: '24px 24px 0 0', sm: '28px' },
            border: '1px solid rgba(124, 92, 252, 0.2)',
            boxShadow: '0 20px 60px rgba(124, 92, 252, 0.22), 0 8px 24px rgba(0,0,0,0.06)',
            backgroundColor: 'rgba(255, 255, 255, 0.96)'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2.2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, #7C5CFC, #A855F7)',
              color: '#FFFFFF',
              flexShrink: 0
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.25)',
                  width: 38,
                  height: 38,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                }}
              >
                <Sparkles size={20} color="#ffffff" />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2, fontFamily: 'Outfit' }}>
                  AI Planner Assistant
                </Typography>
                <Typography variant="caption" sx={{ color: '#F4EEFF', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', backgroundColor: '#22C55E' }} />
                  Adaptive Intelligence Active
                </Typography>
              </Box>
            </Box>

            <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: '#FFFFFF' }}>
              <X size={20} />
            </IconButton>
          </Box>

          {/* Messages Area */}
          <Box
            sx={{
              flexGrow: 1,
              p: 2.2,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.8,
              backgroundColor: '#FFF8FC',
              '&::-webkit-scrollbar': { width: '6px' },
              '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
              '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(124, 92, 252, 0.2)', borderRadius: '3px' }
            }}
          >
            {messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <Box
                  sx={{
                    maxWidth: '85%',
                    p: 1.8,
                    borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.sender === 'user'
                      ? 'linear-gradient(135deg, #7C5CFC, #6366F1)'
                      : '#FFFFFF',
                    color: msg.sender === 'user' ? '#FFFFFF' : '#1F2937',
                    border: msg.sender === 'user' ? 'none' : '1px solid rgba(124, 92, 252, 0.12)',
                    boxShadow: msg.sender === 'user'
                      ? '0 4px 14px rgba(124, 92, 252, 0.3)'
                      : '3px 3px 10px rgba(124, 92, 252, 0.06)'
                  }}
                >
                  <Typography variant="body2" sx={{ color: msg.sender === 'user' ? '#FFFFFF' : '#1F2937', fontSize: '0.875rem', lineHeight: 1.5, fontWeight: 500 }}>
                    {msg.text}
                  </Typography>

                  {/* AI Quick Actions */}
                  {msg.actions && msg.actions.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
                      {msg.actions.map((act, idx) => (
                        <Chip
                          key={idx}
                          label={act.label}
                          onClick={() => handleActionClick(act.type)}
                          className="skeuo-chip"
                          sx={{
                            backgroundColor: '#F4EEFF',
                            color: '#7C5CFC',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            border: '1px solid rgba(124, 92, 252, 0.2)'
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
                <Typography variant="caption" sx={{ color: '#6B7280', mt: 0.5, px: 1, fontSize: '0.7rem' }}>
                  {msg.timestamp}
                </Typography>
              </Box>
            ))}

            {/* AI Typing Indicator */}
            {isTyping && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, borderRadius: 3, backgroundColor: '#FFFFFF', border: '1px solid rgba(124, 92, 252, 0.12)', width: 'fit-content' }}>
                <Sparkles size={14} color="#7C5CFC" className="ai-glow" />
                <Typography variant="caption" sx={{ color: '#6B7280', fontStyle: 'italic', fontWeight: 600 }}>
                  Aura is thinking...
                </Typography>
              </Box>
            )}
            <div ref={chatEndRef} />
          </Box>

          {/* Quick Prompt Chips */}
          <Box sx={{ px: 2, py: 1.2, display: 'flex', gap: 1, overflowX: 'auto', backgroundColor: '#FFFFFF', borderTop: '1px solid rgba(124, 92, 252, 0.1)', flexShrink: 0 }}>
            <Chip
              label="💡 Help me focus"
              size="small"
              onClick={() => sendMessage("Help me structure my afternoon focus hours.")}
              sx={{ backgroundColor: '#F4EEFF', color: '#7C5CFC', fontWeight: 700, cursor: 'pointer', flexShrink: 0, '&:hover': { backgroundColor: '#EAE0FF' } }}
            />
            <Chip
              label="☕ Insert break"
              size="small"
              onClick={() => sendMessage("I feel tired, suggest a healthy break.")}
              sx={{ backgroundColor: '#F4EEFF', color: '#7C5CFC', fontWeight: 700, cursor: 'pointer', flexShrink: 0, '&:hover': { backgroundColor: '#EAE0FF' } }}
            />
          </Box>

          {/* Input Area */}
          <Box
            sx={{
              p: 1.8,
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid rgba(124, 92, 252, 0.1)',
              flexShrink: 0
            }}
          >
            <InputBase
              placeholder="Ask Aura anything about your schedule..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              sx={{
                flexGrow: 1,
                px: 2,
                py: 0.9,
                borderRadius: 3,
                backgroundColor: '#F8F4FF',
                color: '#1F2937',
                fontSize: '0.875rem'
              }}
            />
            <IconButton
              onClick={handleSend}
              sx={{
                background: 'linear-gradient(135deg, #7C5CFC, #6366F1)',
                color: '#FFFFFF',
                boxShadow: '0 4px 10px rgba(124, 92, 252, 0.3)',
                '&:hover': { background: 'linear-gradient(135deg, #6366F1, #4F46E5)' }
              }}
            >
              <Send size={18} />
            </IconButton>
          </Box>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIAssistantWidget;
