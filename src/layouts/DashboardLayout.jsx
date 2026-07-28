import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
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
  const { sidebarCollapsed } = usePlannerStore();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', pb: { xs: 8, md: 0 } }}>
      {/* Top Glassmorphic Navigation */}
      <Navbar
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
      />

      {/* Main Container */}
      <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 3 }, mb: { xs: 4, md: 6 }, flexGrow: 1, px: { xs: 1.5, sm: 3, md: 4 } }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Desktop Sidebar (Hidden when sidebarCollapsed is true) */}
          {!sidebarCollapsed && (
            <Box sx={{ display: { xs: 'none', md: 'block' }, transition: 'all 0.3s ease' }}>
              <Sidebar />
            </Box>
          )}

          {/* Page Content (Expands to fill 100% width when sidebar is hidden) */}
          <Box sx={{ flexGrow: 1, minWidth: 0, width: '100%', transition: 'all 0.3s ease' }}>
            <Outlet context={{ onOpenQuickAdd: () => setIsQuickAddOpen(true) }} />
          </Box>
        </Box>
      </Container>

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
