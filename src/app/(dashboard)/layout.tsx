'use client';

import { Box, CircularProgress } from '@mui/material';
import { Sidebar } from '../components/Sidebar';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Determine active item based on current path
  const getActiveItem = () => {
    if (pathname.includes('/themes')) return 'themes';
    return 'announcements';
  };

  const handleNavigation = (item: 'announcements' | 'themes') => {
    if (item === 'themes') {
      router.push('/themes');
    } else {
      router.push('/announcements');
    }
  };

  // Auto-collapse sidebar when entering announcement edit/create pages
  useEffect(() => {
    if (pathname.includes('/announcements/new') || pathname.includes('/announcements/') && pathname.includes('/edit')) {
      setSidebarCollapsed(true);
    }
  }, [pathname]);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar
        open={true}
        activeItem={getActiveItem()}
        onItemClick={handleNavigation}
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          backgroundColor: 'background.default',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
