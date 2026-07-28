import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography, Chip, Tooltip, IconButton } from '@mui/material';
import { Layers, Network, BarChart2, Cpu, Zap, Activity, Eye, RefreshCw, Compass } from 'lucide-react';
import NeumoCard from '../Common/NeumoCard';
import SkeuoButton from '../Common/SkeuoButton';

// 3D Nodes Dataset for Network Mode
const THREE_D_NODES = [
  { id: 'n1', label: 'Deep Work Focus', x: 22, y: 35, z: 45, val: '94%', color: '#E35336', category: 'Work', connections: ['n2', 'n4'] },
  { id: 'n2', label: 'Physical Wellness', x: 75, y: 25, z: 30, val: '88%', color: '#F4A460', category: 'Health', connections: ['n3', 'n5'] },
  { id: 'n3', label: 'Mindful Rest', x: 80, y: 72, z: 60, val: '95%', color: '#A0522D', category: 'Personal', connections: ['n1'] },
  { id: 'n4', label: 'Skill Mastery', x: 28, y: 78, z: 20, val: '82%', color: '#E35336', category: 'Study', connections: ['n1', 'n5'] },
  { id: 'n5', label: 'Household Rhythm', x: 50, y: 50, z: 80, val: '90%', color: '#F4A460', category: 'Household', connections: ['n2', 'n3'] }
];

// 3D Bar Chart Dataset
const THREE_D_BARS = [
  { day: 'Mon', height: 140, focus: 85, color: '#E35336', label: '8.5 hrs' },
  { day: 'Tue', height: 180, focus: 95, color: '#F4A460', label: '9.5 hrs' },
  { day: 'Wed', height: 120, focus: 75, color: '#A0522D', label: '7.0 hrs' },
  { day: 'Thu', height: 195, focus: 98, color: '#E35336', label: '10.2 hrs' },
  { day: 'Fri', height: 110, focus: 68, color: '#F4A460', label: '6.5 hrs' },
  { day: 'Sat', height: 90, focus: 60, color: '#A0522D', label: '5.0 hrs' },
  { day: 'Sun', height: 130, focus: 80, color: '#F5F5DC', label: '7.5 hrs' }
];

const ThreeDGraphWidget = () => {
  const [activeTab, setActiveTab] = useState('network'); // 'network' | 'bars' | 'matrix'
  const [selectedNode, setSelectedNode] = useState(THREE_D_NODES[0]);
  const [hoveredBar, setHoveredBar] = useState(null);
  
  // Interactive Mouse Tilt relative state
  const [rotateX, setRotateX] = useState(18);
  const [rotateY, setRotateY] = useState(-14);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Smooth calculate tilt angle limits
    const rY = (mouseX / (rect.width / 2)) * 25;
    const rX = -(mouseY / (rect.height / 2)) * 25;

    setRotateX(rX + 15);
    setRotateY(rY - 10);
  };

  const handleMouseLeave = () => {
    setRotateX(18);
    setRotateY(-14);
  };

  return (
    <NeumoCard style={{ overflow: 'hidden' }}>
      {/* Header & Controls */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
            }}
          >
            <Activity size={20} color="#ffffff" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'Outfit', letterSpacing: -0.5 }}>
              Interactive 3D Activity Graph & Spatial Network
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Compass size={12} color="#34d399" /> Drag or move cursor to tilt 3D perspective viewport
            </Typography>
          </Box>
        </Box>

        {/* View Mode Switcher */}
        <Box sx={{ display: 'flex', gap: 1, backgroundColor: 'rgba(15,23,42,0.6)', p: 0.6, borderRadius: 3 }}>
          <button
            onClick={() => setActiveTab('network')}
            className="skeuo-chip"
            style={{
              backgroundColor: activeTab === 'network' ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
              color: activeTab === 'network' ? '#818cf8' : '#94a3b8',
              border: activeTab === 'network' ? '1px solid #6366f1' : 'none'
            }}
          >
            <Network size={14} style={{ marginRight: 6 }} /> 3D Network Nodes
          </button>
          <button
            onClick={() => setActiveTab('bars')}
            className="skeuo-chip"
            style={{
              backgroundColor: activeTab === 'bars' ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
              color: activeTab === 'bars' ? '#818cf8' : '#94a3b8',
              border: activeTab === 'bars' ? '1px solid #6366f1' : 'none'
            }}
          >
            <BarChart2 size={14} style={{ marginRight: 6 }} /> 3D Perspective Bars
          </button>
        </Box>
      </Box>

      {/* Main 3D Perspective Viewport */}
      <Box
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        sx={{
          height: 380,
          width: '100%',
          position: 'relative',
          borderRadius: 5,
          backgroundColor: '#fdf2f6',
          background: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #f7d5e1 100%)',
          perspective: '1000px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1.5px solid rgba(232, 158, 184, 0.45)',
          boxShadow: 'inset 4px 4px 10px rgba(196, 115, 142, 0.25), inset -4px -4px 10px #ffffff'
        }}
      >
        {/* 3D Grid Plane */}
        <motion.div
          animate={{ rotateX, rotateY }}
          transition={{ type: 'spring', damping: 20, stiffness: 150 }}
          style={{
            width: '85%',
            height: '80%',
            position: 'relative',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Floor Grid Lines */}
          <Box
            sx={{
              position: 'absolute',
              inset: -50,
              backgroundImage: 'linear-gradient(to right, rgba(99, 102, 241, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.12) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
              transform: 'rotateX(90deg) translateZ(-100px)',
              pointerEvents: 'none'
            }}
          />

          {/* TAB 1: 3D NETWORK NODES VIEW */}
          {activeTab === 'network' && (
            <Box sx={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d' }}>
              {/* SVG Line Connections */}
              <svg
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  overflow: 'visible'
                }}
              >
                {THREE_D_NODES.map((node) =>
                  node.connections.map((targetId) => {
                    const targetNode = THREE_D_NODES.find((n) => n.id === targetId);
                    if (!targetNode) return null;

                    return (
                      <line
                        key={`${node.id}-${targetId}`}
                        x1={`${node.x}%`}
                        y1={`${node.y}%`}
                        x2={`${targetNode.x}%`}
                        y2={`${targetNode.y}%`}
                        stroke="url(#lineGradient)"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        opacity="0.7"
                      />
                    );
                  })
                )}
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Floating 3D Nodes */}
              {THREE_D_NODES.map((node) => {
                const isSelected = selectedNode.id === node.id;

                return (
                  <motion.div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    whileHover={{ scale: 1.25, zIndex: 10 }}
                    style={{
                      position: 'absolute',
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      transform: `translate(-50%, -50%) translateZ(${node.z}px)`,
                      transformStyle: 'preserve-3d',
                      cursor: 'pointer'
                    }}
                  >
                    {/* Glowing Outer Ring */}
                    <Box
                      sx={{
                        width: isSelected ? 56 : 42,
                        height: isSelected ? 56 : 42,
                        borderRadius: '50%',
                        backgroundColor: `${node.color}22`,
                        border: `2px solid ${node.color}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isSelected
                          ? `0 0 30px ${node.color}, inset 0 0 15px ${node.color}`
                          : `0 0 15px ${node.color}88`,
                        transition: 'all 0.3s ease',
                        position: 'relative'
                      }}
                    >
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          backgroundColor: node.color,
                          boxShadow: `0 0 10px ${node.color}`
                        }}
                      />

                      {/* Floating Badge Label */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -30,
                          whiteSpace: 'nowrap',
                          px: 1.2,
                          py: 0.3,
                          borderRadius: 2,
                          backgroundColor: 'rgba(15, 23, 42, 0.85)',
                          backdropFilter: 'blur(8px)',
                          border: `1px solid ${node.color}66`,
                          color: '#f8fafc',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          pointerEvents: 'none'
                        }}
                      >
                        {node.label} ({node.val})
                      </Box>
                    </Box>
                  </motion.div>
                );
              })}
            </Box>
          )}

          {/* TAB 2: 3D PERSPECTIVE BARS VIEW */}
          {activeTab === 'bars' && (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-around',
                px: 2,
                pb: 4,
                transformStyle: 'preserve-3d'
              }}
            >
              {THREE_D_BARS.map((bar, idx) => {
                const isHovered = hoveredBar === idx;

                return (
                  <motion.div
                    key={bar.day}
                    onMouseEnter={() => setHoveredBar(idx)}
                    onMouseLeave={() => setHoveredBar(null)}
                    animate={{
                      y: isHovered ? -15 : 0,
                      scale: isHovered ? 1.08 : 1
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {/* Floating Value Card on Hover */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: -10 }}
                          exit={{ opacity: 0, y: 10 }}
                          style={{
                            position: 'absolute',
                            top: -45,
                            zIndex: 20,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <Box
                            sx={{
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 2,
                              backgroundColor: 'rgba(15, 23, 42, 0.9)',
                              backdropFilter: 'blur(8px)',
                              border: `1px solid ${bar.color}`,
                              color: '#ffffff',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              boxShadow: `0 4px 15px ${bar.color}66`
                            }}
                          >
                            {bar.day}: {bar.label} ({bar.focus}% Focus)
                          </Box>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* 3D Prism Bar Block */}
                    <Box
                      sx={{
                        width: { xs: 24, sm: 36 },
                        height: bar.height,
                        background: `linear-gradient(180deg, ${bar.color}, ${bar.color}99)`,
                        borderRadius: '8px 8px 0 0',
                        position: 'relative',
                        boxShadow: `0 0 20px ${bar.color}44, inset 2px 2px 4px rgba(255,255,255,0.4)`,
                        borderTop: '2px solid rgba(255, 255, 255, 0.6)',
                        borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s ease',
                        '&:hover': {
                          boxShadow: `0 0 35px ${bar.color}, inset 2px 2px 8px rgba(255,255,255,0.8)`
                        }
                      }}
                    />

                    {/* Day Label on 3D Base */}
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 1.5,
                        fontWeight: 700,
                        color: isHovered ? '#ffffff' : '#94a3b8',
                        fontSize: '0.8rem'
                      }}
                    >
                      {bar.day}
                    </Typography>
                  </motion.div>
                );
              })}
            </Box>
          )}
        </motion.div>
      </Box>

      {/* Selected Node Inspector Footer (Glassmorphism overlay panel) */}
      {activeTab === 'network' && selectedNode && (
        <Box
          className="neumo-inset"
          sx={{
            mt: 2.5,
            p: 2,
            borderRadius: 3.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: selectedNode.color,
                boxShadow: `0 0 10px ${selectedNode.color}`
              }}
            />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                Selected Spatial Node: {selectedNode.label}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Category: {selectedNode.category} • Peak Intensity: {selectedNode.val}
              </Typography>
            </Box>
          </Box>

          <Chip
            icon={<Zap size={12} color={selectedNode.color} />}
            label="Optimal Cognitive Window"
            size="small"
            sx={{
              backgroundColor: `${selectedNode.color}22`,
              color: selectedNode.color,
              fontWeight: 700,
              border: `1px solid ${selectedNode.color}44`
            }}
          />
        </Box>
      )}
    </NeumoCard>
  );
};

export default ThreeDGraphWidget;
