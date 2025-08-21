'use client';

import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Chip,
} from '@mui/material';
import { useAnnouncements } from '@/contexts/AnnouncementsProvider';

export function AnnouncementPreview() {
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

      <Box sx={{ flex: 1, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0 }}>
        {isLoadingTheme ? (
          <Typography>Loading theme...</Typography>
        ) : (
          <Paper
            elevation={3}
            sx={{
              maxWidth: 400,
              minWidth: 350,
              width: '100%',
              backgroundColor: config.modal.backgroundColor,
              borderRadius: config.modal.borderRadius,
              p: 3,
              position: 'relative',
            }}
          >
            {/* Title */}
            <Typography
              variant="h6"
              sx={{
                color: config.modal.titleColor,
                fontWeight: 600,
                mb: 2,
                textAlign: 'center',
              }}
            >
              {formData.title || 'Your announcement title'}
            </Typography>

            {/* Content */}
            <Box
              sx={{
                color: config.modal.titleColor,
                mb: 3,
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
                __html: formData.content || 'Your announcement content will appear here...'
              }}
            />

            {/* Buttons */}
            {formData.buttons.length > 0 && (
              <Stack direction="row" spacing={2} justifyContent="center">
                {formData.buttons.map((button, index) => (
                  <Button
                    key={index}
                    variant={button.type === 'primary' ? 'contained' : 'outlined'}
                    size="small"
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

            {formData.buttons.length === 0 && (
              <Box sx={{ textAlign: 'center' }}>
                <Chip
                  label="No buttons configured"
                  size="small"
                  color="default"
                  variant="outlined"
                />
              </Box>
            )}
          </Paper>
        )}
      </Box>
    </Box>
  );
}
