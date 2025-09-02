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

  const getActiveItem = () => {
    switch (pathname) {
      case '/tooltip': return 'tooltip';
      case '/toast': return 'toast';
      case '/themes': return 'themes';
      case '/settings': return 'settings';
      case '/onboarding': return 'onboarding';
      case '/highlights': return 'highlights';
      case '/tags': return 'tags';
      default: return 'modal';
    }
  };

  const handleNavigation = (item: 'modal' | 'tooltip' | 'toast' | 'themes' | 'settings' | 'onboarding' | 'highlights' | 'tags') => {
    switch (item) {
      case 'tooltip':
        router.push('/tooltip');
      case 'toast':
        router.push('/toast');
      case 'themes':
        router.push('/themes');
      case 'settings':
        router.push('/settings');
      case 'onboarding':
        router.push('/onboarding');
      case 'highlights':
        router.push('/highlights');
      case 'tags':
        router.push('/tags');
      default:
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
