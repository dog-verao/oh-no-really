'use client';

import {
  Box,
  Button,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useAnnouncements } from '@/contexts/AnnouncementsProvider';
import { AnnouncementEmbedPreview } from './AnnouncementEmbedPreview';

interface AnnouncementDisplayProps {
  onBack?: () => void;
  onEdit?: () => void;
}

export function AnnouncementDisplay({ onBack, onEdit }: AnnouncementDisplayProps) {
  const { formData, theme } = useAnnouncements();

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
    <Box sx={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: 2,
      position: 'relative'
    }}>
      {/* Back and Edit buttons */}
      {(onBack || onEdit) && (
        <Box sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 1,
          display: 'flex',
          gap: 1
        }}>
          {onBack && (
            <Button
              variant="outlined"
              startIcon={<BackIcon />}
              onClick={onBack}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                }
              }}
            >
              Back
            </Button>
          )}
          {onEdit && (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={onEdit}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#000',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                }
              }}
            >
              Edit
            </Button>
          )}
        </Box>
      )}

      <AnnouncementEmbedPreview
        title={formData.title || 'Announcement Title'}
        message={formData.content || 'Announcement content will appear here...'}
        buttons={formData.buttons}
        themeConfig={config}
      />
    </Box>
  );
}
