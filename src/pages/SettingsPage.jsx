import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Switch, FormControlLabel, Divider, MenuItem, TextField } from '@mui/material';
import { Settings, Sparkles, Layers } from 'lucide-react';
import NeumoCard from '../components/Common/NeumoCard';
import { usePlannerStore } from '../store/usePlannerStore';
import { USER_ARCHETYPES } from '../constants/plannerData';

const SettingsPage = () => {
  const { archetype, setArchetype } = usePlannerStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
    >
      <Box
        className="neumo-card"
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: { xs: 5, md: 6 },
          background: 'linear-gradient(135deg, #7C5CFC 0%, #A855F7 50%, #FF7A59 100%)',
          boxShadow: '0 20px 40px -10px rgba(124, 92, 252, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ p: 1.5, borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.22)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.35)' }}>
            <Settings size={28} color="#FFFFFF" />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit', color: '#FFFFFF' }}>
              Settings & Lifestyle Preferences
            </Typography>
            <Typography variant="body1" sx={{ color: '#F4EEFF', mt: 0.5, fontWeight: 500 }}>
              Customize your AI behavior, notification sensitivity, and active lifestyle persona.
            </Typography>
          </Box>
        </Box>
      </Box>

      <NeumoCard sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Active Lifestyle Persona */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1, color: '#1F2937' }}>
            <Layers size={20} color="#7C5CFC" /> Active Lifestyle Persona
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B7280', mb: 2 }}>
            Switch personas anytime. Aura automatically tunes timeline templates and smart recommendations.
          </Typography>
          <TextField
            select
            fullWidth
            value={archetype}
            onChange={(e) => setArchetype(e.target.value)}
            sx={{ maxWidth: 400 }}
          >
            {USER_ARCHETYPES.map((arch) => (
              <MenuItem key={arch.id} value={arch.id}>
                {arch.label} ({arch.tagline})
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Divider sx={{ borderColor: 'rgba(124, 92, 252, 0.12)' }} />

        {/* AI Behavior Toggles */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1, color: '#1F2937' }}>
            <Sparkles size={20} color="#A855F7" /> Adaptive AI Intelligence
          </Typography>

          <FormControlLabel
            control={<Switch defaultChecked color="primary" />}
            label={<Typography variant="body2" sx={{ fontWeight: 700, color: '#1F2937' }}>Auto-Detect Energy Windows & Suggest Breaks</Typography>}
          />

          <FormControlLabel
            control={<Switch defaultChecked color="primary" />}
            label={<Typography variant="body2" sx={{ fontWeight: 700, color: '#1F2937' }}>Lifestyle Context Learning (No Forced Forms)</Typography>}
          />

          <FormControlLabel
            control={<Switch defaultChecked color="primary" />}
            label={<Typography variant="body2" sx={{ fontWeight: 700, color: '#1F2937' }}>Smart Habit Streak Protection Alerts</Typography>}
          />
        </Box>
      </NeumoCard>
    </motion.div>
  );
};

export default SettingsPage;
