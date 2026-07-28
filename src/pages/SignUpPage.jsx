import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Typography, TextField } from '@mui/material';
import { Sparkles, ArrowRight } from 'lucide-react';
import SkeuoButton from '../components/Common/SkeuoButton';

const SignUpPage = () => {
  const navigate = useNavigate();

  const handleSignUp = (e) => {
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
        backgroundColor: 'var(--bg-primary)',
        p: 2
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
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
            gap: 3
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit' }}>
              Create Your Account
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
              Zero lengthy onboarding. Start planning immediately.
            </Typography>
          </Box>

          <form onSubmit={handleSignUp}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField fullWidth label="Full Name" defaultValue="Alex Rivera" />
              <TextField fullWidth label="Email Address" defaultValue="alex@example.com" type="email" />
              <TextField fullWidth label="Password" defaultValue="••••••••••••" type="password" />

              <SkeuoButton type="submit" fullWidth icon={ArrowRight} style={{ marginTop: 8 }}>
                Create Account & Open Dashboard
              </SkeuoButton>
            </Box>
          </form>
        </Box>
      </motion.div>
    </Box>
  );
};

export default SignUpPage;
