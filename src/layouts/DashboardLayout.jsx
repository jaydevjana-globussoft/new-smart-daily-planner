import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Drawer } from '@mui/material';
import Navbar from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';
import MobileNav from '../components/Layout/MobileNav';
import AIAssistantWidget from '../components/AIChat/AIAssistantWidget';
import CommandPalette from '../components/Layout/CommandPalette';
import QuickAddModal from '../components/QuickActions/QuickAddModal';
import { usePlannerStore } from '../store/usePlannerStore';

const DashboardLayout = () => {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { sidebarCollapsed } = usePlannerStore();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', pb: { xs: 8, md: 0 } }}>
      {/* Top Glassmorphic Navigation */}
      <Navbar
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        onToggleMobileNav={() => setIsMobileNavOpen((prev) => !prev)}
      />

      {/* Main Container (Max Width 1760px, 90% viewport fill on 1920x1080 displays) */}
      <Container
        maxWidth={false}
        sx={{
          maxWidth: '1760px',
          width: '100%',
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4, lg: 5 },
          mt: { xs: 1.5, md: 2 },
          mb: { xs: 3, md: 5 },
          flexGrow: 1
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2, md: 3 } }}>
          {/* Desktop Sidebar (GSAP animated width: 240px ↔ 76px) */}
          <Box sx={{ display: { xs: 'none', md: 'block' }, flexShrink: 0 }}>
            <Sidebar />
          </Box>

          {/* Page Content */}
          <Box sx={{ flexGrow: 1, minWidth: 0, width: '100%', transition: 'all 0.3s ease' }}>
            <Outlet context={{ onOpenQuickAdd: () => setIsQuickAddOpen(true) }} />
          </Box>
        </Box>
      </Container>

      {/* Responsive Slide-Out Navigation Drawer for Screens < 900px */}
      <Drawer
        anchor="left"
        open={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        sx={{ display: { xs: 'block', md: 'none' } }}
        PaperProps={{
          sx: {
            width: 280,
            p: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(16px)',
            boxShadow: '10px 0 30px rgba(124, 92, 252, 0.15)',
            borderRight: '1px solid rgba(124, 92, 252, 0.15)'
          }
        }}
      >
        <Sidebar isMobileDrawer onClose={() => setIsMobileNavOpen(false)} />
      </Drawer>

      {/* Mobile Fixed Bottom Nav Bar */}
      <MobileNav onOpenQuickAdd={() => setIsQuickAddOpen(true)} />

      {/* Floating AI Assistant Chat Overlay */}
      <AIAssistantWidget />

      {/* Command Palette Ctrl+K / Cmd+K Modal */}
      <CommandPalette
        open={isCommandPaletteOpen}
        onOpen={() => setIsCommandPaletteOpen(true)}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
      />

      {/* Quick Add Task/Habit/Goal Modal */}
      <QuickAddModal
        open={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />
    </Box>
  );
};

export default DashboardLayout;
