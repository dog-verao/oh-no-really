'use client';

import {
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useAnnouncements } from '@/contexts/AnnouncementsProvider';
import { AnnouncementEmbedPreview } from './AnnouncementEmbedPreview';

interface AnnouncementPreviewProps {
  placement?: 'modal' | 'toast' | 'tooltip';
}

export function AnnouncementPreview({ placement = 'modal' }: AnnouncementPreviewProps) {
  const { formData, theme, isLoadingTheme } = useAnnouncements();

  // Use theme config or fallback to default
  const config = theme?.config || {
    modal: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      titleColor: '#1a1a1a',
    },
    button: {
      backgroundColor: '#007bff',
      textColor: '#ffffff',
      borderRadius: '8px',
    },
    secondaryButton: {
      backgroundColor: '#ffffff',
      textColor: '#6c757d',
      borderColor: '#6c757d',
      borderRadius: '8px',
    },
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Preview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          How your announcement will look
        </Typography>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0 }}>
        {isLoadingTheme ? (
          <CircularProgress />
        ) : (
          <AnnouncementEmbedPreview
            title={formData.title || 'Your announcement title'}
            message={formData.content || 'Your announcement content will appear here...'}
            buttons={formData.buttons}
            themeConfig={config}
            placement={placement}
          />
        )}
      </Box>
    </Box>
  );
}
