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
    if (pathname.includes('/tooltip')) return 'tooltip';
    if (pathname.includes('/toast')) return 'toast';
    if (pathname.includes('/themes')) return 'themes';
    if (pathname.includes('/settings')) return 'settings';
    if (pathname.includes('/inspector')) return 'inspector';
    return 'modal';
  };

  const handleNavigation = (item: 'modal' | 'tooltip' | 'toast' | 'themes' | 'settings' | 'inspector') => {
    if (item === 'tooltip') {
      router.push('/tooltip');
    } else if (item === 'toast') {
      router.push('/toast');
    } else if (item === 'themes') {
      router.push('/themes');
    } else if (item === 'settings') {
      router.push('/settings');
    } else if (item === 'inspector') {
      router.push('/inspector');
    } else {
      router.push('/modal');
    }
  };

  // Auto-collapse sidebar when entering announcement edit/create pages
  useEffect(() => {
    if (pathname.includes('/modal/new') || pathname.includes('/modal/') && pathname.includes('/edit') ||
        pathname.includes('/tooltip/new') || pathname.includes('/tooltip/') && pathname.includes('/edit') ||
        pathname.includes('/toast/new') || pathname.includes('/toast/') && pathname.includes('/edit')) {
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
        <CircularProgress size={58} />
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
