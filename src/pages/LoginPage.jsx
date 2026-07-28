import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Typography, TextField, Divider, Chip } from '@mui/material';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import SkeuoButton from '../components/Common/SkeuoButton';
import { USER_ARCHETYPES } from '../constants/plannerData';
import { usePlannerStore } from '../store/usePlannerStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setArchetype, archetype } = usePlannerStore();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-gradient)',
        p: 2
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: 460 }}
      >
        <Box
          className="glass-overlay"
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 6,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
            border: '1px solid rgba(124, 92, 252, 0.18)',
            boxShadow: '0 20px 50px rgba(124, 92, 252, 0.15)'
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #7C5CFC, #A855F7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 1.5,
                boxShadow: '0 8px 20px rgba(124, 92, 252, 0.35)'
              }}
            >
              <Sparkles size={28} color="#ffffff" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit', letterSpacing: -0.5, color: '#1F2937' }}>
              Welcome to Smart <span style={{ color: '#7C5CFC' }}>Daily Planner</span>
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280', mt: 0.5, fontWeight: 500 }}>
              AI-Powered Daily Planner — Tailored for every lifestyle
            </Typography>
          </Box>

          {/* Form */}
          <form onSubmit={handleLogin}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Email Address"
                defaultValue="user@auraplan.ai"
                type="email"
              />
              <TextField
                fullWidth
                label="Password"
                defaultValue="••••••••••••"
                type="password"
              />

              <SkeuoButton type="submit" fullWidth icon={ArrowRight} style={{ marginTop: 8 }}>
                Sign In to Dashboard
              </SkeuoButton>
            </Box>
          </form>

          <Divider sx={{ borderColor: 'rgba(124, 92, 252, 0.12)' }}>
            <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 700 }}>
              INSTANT PERSONA TRY-OUT
            </Typography>
          </Divider>

          {/* Quick Persona Selector Chips */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
            {USER_ARCHETYPES.map((arch) => (
              <Chip
                key={arch.id}
                label={arch.label}
                onClick={() => {
                  setArchetype(arch.id);
                  navigate('/');
                }}
                className="skeuo-chip"
                sx={{
                  backgroundColor: archetype === arch.id ? '#F4EEFF' : '#FFFFFF',
                  color: archetype === arch.id ? '#7C5CFC' : '#1F2937',
                  fontSize: '0.775rem',
                  fontWeight: 700,
                  border: archetype === arch.id ? '1.5px solid #7C5CFC' : '1px solid rgba(124, 92, 252, 0.15)'
                }}
              />
            ))}
          </Box>

          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Typography variant="caption" sx={{ color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, fontWeight: 600 }}>
              <ShieldCheck size={14} color="#22C55E" /> No multi-step onboarding required
            </Typography>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};

export default LoginPage;
