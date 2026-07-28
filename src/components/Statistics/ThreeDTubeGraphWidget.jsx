import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { Heart, Play, Pause, Volume2, VolumeX, Video, Compass, Sparkles } from 'lucide-react';
import NeumoCard from '../Common/NeumoCard';

/**
 * ThreeDTubeGraphWidget / VideoGraphWidget
 * 
 * HOW TO USE YOUR OWN VIDEO:
 * 1. Place your video file (e.g. 'weekly_3d_graph.mp4') inside the `public/` directory (e.g. `public/my-video.mp4`).
 * 2. Pass the `videoSrc` prop to this component, or update DEFAULT_VIDEO_SRC below:
 *    const DEFAULT_VIDEO_SRC = '/my-video.mp4';
 */
const DEFAULT_VIDEO_SRC = 'https://cdn.dribbble.com/userupload/7490404/file/original-0eece742b37ab81afc04ead04ef38da1.mp4';

const ThreeDTubeGraphWidget = ({ videoSrc = DEFAULT_VIDEO_SRC }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  
  // Interactive 3D Card Tilt States
  const [rotateX, setRotateX] = useState(10);
  const [rotateY, setRotateY] = useState(-8);
  const cardRef = useRef(null);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rY = (mouseX / (rect.width / 2)) * 16;
    const rX = -(mouseY / (rect.height / 2)) * 16;

    setRotateX(rX + 6);
    setRotateY(rY - 5);
  };

  const handleMouseLeave = () => {
    setRotateX(10);
    setRotateY(-8);
  };

  return (
    <NeumoCard style={{ overflow: 'visible', background: 'transparent', boxShadow: 'none', border: 'none', padding: 0 }}>
      {/* 3D Perspective Container */}
      <Box
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        sx={{
          perspective: '1200px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          py: 2
        }}
      >
        <motion.div
          animate={{ rotateX, rotateY }}
          transition={{ type: 'spring', damping: 22, stiffness: 180 }}
          style={{
            width: '100%',
            maxWidth: 780,
            transformStyle: 'preserve-3d',
            position: 'relative'
          }}
        >
          {/* Glassmorphic 3D Card Shell */}
          <Box
            sx={{
              position: 'relative',
              borderRadius: 7,
              p: { xs: 2.5, md: 4 },
              backgroundColor: '#ffffff',
              border: '1.5px solid rgba(232, 158, 184, 0.45)',
              boxShadow: `
                10px 10px 24px rgba(196, 115, 142, 0.4),
                -10px -10px 24px #ffffff,
                0 0 40px rgba(227, 83, 54, 0.15)
              `,
              overflow: 'hidden',
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Ambient Terracotta Background Glow */}
            <Box
              sx={{
                position: 'absolute',
                top: -60,
                right: -60,
                width: 280,
                height: 280,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(232, 158, 184, 0.35) 0%, rgba(244, 164, 96, 0.2) 50%, transparent 80%)',
                pointerEvents: 'none',
                filter: 'blur(30px)'
              }}
            />

            {/* Card Header: Title & Stats with 3D Heart Badge */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2, transformStyle: 'preserve-3d' }}>
              <Box sx={{ transform: 'translateZ(30px)' }}>
                <Typography variant="body1" sx={{ color: '#5e3b48', fontWeight: 700, fontSize: { xs: '0.9rem', sm: '1.05rem' }, letterSpacing: 0.2 }}>
                  Weekly Focus Activity
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, fontFamily: 'Outfit', color: '#1f1217', mt: 0.5, fontSize: { xs: '1.8rem', sm: '2.4rem' }, letterSpacing: -1 }}>
                  2,670 <span style={{ fontSize: '1.1rem', color: '#5e3b48', fontWeight: 600 }}>focus mins</span>
                </Typography>
              </Box>

              {/* 3D Skeuomorphic Heart / Activity Emblem Badge */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 8 }}
                style={{ transform: 'translateZ(45px)' }}
              >
                <Box
                  sx={{
                    width: { xs: 48, sm: 58 },
                    height: { xs: 48, sm: 58 },
                    borderRadius: '50%',
                    background: 'linear-gradient(145deg, rgba(227, 83, 54, 0.35), rgba(244, 164, 96, 0.25))',
                    border: '1px solid rgba(244, 164, 96, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'inset 0 2px 4px rgba(245, 245, 220, 0.4), 0 10px 25px rgba(227, 83, 54, 0.45)',
                    cursor: 'pointer'
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 34, sm: 40 },
                      height: { xs: 34, sm: 40 },
                      borderRadius: '50%',
                      background: 'linear-gradient(145deg, #E35336, #F4A460)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(227, 83, 54, 0.6)'
                    }}
                  >
                    <Heart size={18} color="#F5F5DC" fill="#F5F5DC" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }} />
                  </Box>
                </Box>
              </motion.div>
            </Box>

            {/* Video Container (or SVG Fallback if CDN URL blocked) */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                minHeight: 220,
                borderRadius: 5,
                overflow: 'hidden',
                border: '1px solid rgba(244, 164, 96, 0.2)',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
                backgroundColor: '#fdf2f6',
                transform: 'translateZ(35px)'
              }}
            >
              {!videoError ? (
                <video
                  ref={videoRef}
                  src={videoSrc}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  onError={() => setVideoError(true)}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: 340,
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              ) : (
                /* Animated Volumetric 3D Tube SVG Fallback */
                <svg
                  viewBox="0 0 700 200"
                  style={{
                    width: '100%',
                    height: '100%',
                    minHeight: 220,
                    overflow: 'visible'
                  }}
                >
                  <defs>
                    <linearGradient id="tubeMainGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#E35336" />
                      <stop offset="50%" stopColor="#F4A460" />
                      <stop offset="100%" stopColor="#E35336" />
                    </linearGradient>
                    <linearGradient id="tubeHighlightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#F5F5DC" stopOpacity="0.9" />
                      <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                      <stop offset="100%" stopColor="#F5F5DC" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 50,150 C 120,30 220,180 290,130 C 360,70 460,40 530,110 C 600,150 650,55 650,55"
                    fill="none"
                    stroke="url(#tubeMainGrad)"
                    strokeWidth="18"
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 10px 15px rgba(227, 83, 54, 0.4))' }}
                  />
                  <path
                    d="M 50,150 C 120,30 220,180 290,130 C 360,70 460,40 530,110 C 600,150 650,55 650,55"
                    fill="none"
                    stroke="url(#tubeHighlightGrad)"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    transform="translate(0, -4.5)"
                    opacity="0.9"
                  />
                </svg>
              )}

              {/* Video Controls Overlay */}
              {!videoError && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 12,
                    right: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(10px)',
                    px: 1.5,
                    py: 0.6,
                    borderRadius: 3,
                    border: '1px solid rgba(232, 158, 184, 0.4)'
                  }}
                >
                  <Tooltip title={isPlaying ? "Pause Video" : "Play Video"}>
                    <IconButton size="small" onClick={togglePlay} sx={{ color: '#2d1a22' }}>
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </IconButton>
                  </Tooltip>

                  <Tooltip title={isMuted ? "Unmute Audio" : "Mute Audio"}>
                    <IconButton size="small" onClick={toggleMute} sx={{ color: '#2d1a22' }}>
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>

            {/* Bottom Timeline Markers */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                mt: 2,
                transform: 'translateZ(25px)'
              }}
            >
              {['8am', '10am', '12am', '2pm', '4pm', '6pm'].map((time) => (
                <Typography
                  key={time}
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    color: '#5e3b48',
                    fontSize: '0.95rem',
                    letterSpacing: 0.5
                  }}
                >
                  {time}
                </Typography>
              ))}
            </Box>
          </Box>
        </motion.div>
      </Box>
    </NeumoCard>
  );
};

export default ThreeDTubeGraphWidget;
