'use client';

import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useAnnouncements } from '@/contexts/AnnouncementsProvider';

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
      <Paper
        elevation={3}
        sx={{
          maxWidth: 500,
          width: '100%',
          backgroundColor: config.modal.backgroundColor,
          borderRadius: config.modal.borderRadius,
          p: 4,
          position: 'relative',
        }}
      >
        {/* Title */}
        <Typography
          variant="h5"
          sx={{
            color: config.modal.titleColor,
            fontWeight: 600,
            mb: 3,
            textAlign: 'center',
          }}
        >
          {formData.title || 'Announcement Title'}
        </Typography>

        {/* Content */}
        <Box
          sx={{
            color: config.modal.titleColor,
            mb: 4,
            lineHeight: 1.6,
            textAlign: 'center',
            '& p': {
              margin: 0,
              marginBottom: 1,
            },
            '& p:last-child': {
              marginBottom: 0,
            },
          }}
          dangerouslySetInnerHTML={{
            __html: formData.content || 'Announcement content will appear here...'
          }}
        />

        {/* Buttons */}
        {formData.buttons.length > 0 && (
          <Stack direction="row" spacing={2} justifyContent="center">
            {formData.buttons.map((button, index) => (
              <Button
                key={index}
                variant={button.type === 'primary' ? 'contained' : 'outlined'}
                size="medium"
                sx={{
                  backgroundColor: button.type === 'primary'
                    ? config.button.backgroundColor
                    : config.secondaryButton.backgroundColor,
                  color: button.type === 'primary'
                    ? config.button.textColor
                    : config.secondaryButton.textColor,
                  borderColor: button.type === 'secondary'
                    ? config.secondaryButton.borderColor
                    : 'transparent',
                  borderRadius: button.type === 'primary'
                    ? config.button.borderRadius
                    : config.secondaryButton.borderRadius,
                  '&:hover': {
                    backgroundColor: button.type === 'primary'
                      ? config.button.backgroundColor
                      : config.secondaryButton.backgroundColor,
                    opacity: 0.9,
                  },
                }}
              >
                {button.label || `Button ${index + 1}`}
              </Button>
            ))}
          </Stack>
        )}
      </Paper>
    </Box>
  );
}
