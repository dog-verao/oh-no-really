'use client';

import { Box } from '@mui/material';
import { Sidebar } from '../components/Sidebar';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

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

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar
        open={true}
        activeItem={getActiveItem()}
        onItemClick={handleNavigation}
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
