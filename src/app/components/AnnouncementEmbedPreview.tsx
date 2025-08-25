'use client';

import { Box } from '@mui/material';

interface Button {
  type: 'primary' | 'secondary';
  label: string;
  behavior: 'close' | 'redirect';
  redirectUrl?: string;
}

interface ThemeConfig {
  modal: {
    backgroundColor: string;
    borderRadius: string;
    titleColor: string;
  };
  button: {
    backgroundColor: string;
    textColor: string;
    borderRadius: string;
  };
  secondaryButton: {
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    borderRadius: string;
  };
}

interface AnnouncementEmbedPreviewProps {
  title: string;
  message: string;
  buttons: Button[];
  themeConfig: ThemeConfig;
}

export function AnnouncementEmbedPreview({ title, message, buttons, themeConfig }: AnnouncementEmbedPreviewProps) {
  // Sort buttons: secondary first, primary last (rightmost)
  const sortedButtons = buttons.sort((a, b) => {
    if (a.type === 'primary' && b.type !== 'primary') return 1;
    if (a.type !== 'primary' && b.type === 'primary') return -1;
    return 0;
  });

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      p: 3
    }}>
      <Box
        sx={{
          background: themeConfig.modal.backgroundColor,
          borderRadius: themeConfig.modal.borderRadius,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          maxWidth: '500px',
          minWidth: '350px',
          width: '100%',
          padding: '32px',
          position: 'relative',
        }}
      >
        {/* Title */}
        <Box
          sx={{
            fontWeight: 600,
            fontSize: '16px',
            marginBottom: '8px',
            color: themeConfig.modal.titleColor,
            textAlign: 'center',
          }}
        >
          {title}
        </Box>

        {/* Message */}
        <Box
          sx={{
            marginBottom: '16px',
            color: '#666',
            textAlign: 'left',
            lineHeight: 1.6,
            '& p': {
              margin: 0,
              marginBottom: '8px',
            },
            '& p:last-child': {
              marginBottom: 0,
            },
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              display: 'block',
              margin: '0 auto',
            },
          }}
          dangerouslySetInnerHTML={{ __html: message }}
        />

        {/* Buttons */}
        {sortedButtons.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
            }}
          >
            {sortedButtons.map((button, index) => {
              const isPrimary = button.type === 'primary';
              const buttonStyles = {
                padding: '8px 16px',
                border: isPrimary ? 'none' : `1px solid ${themeConfig.secondaryButton.borderColor}`,
                borderRadius: isPrimary
                  ? themeConfig.button.borderRadius
                  : themeConfig.secondaryButton.borderRadius,
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                backgroundColor: isPrimary
                  ? themeConfig.button.backgroundColor
                  : themeConfig.secondaryButton.backgroundColor,
                color: isPrimary
                  ? themeConfig.button.textColor
                  : themeConfig.secondaryButton.textColor,
                '&:hover': {
                  opacity: 0.9,
                },
              };

              if (button.behavior === 'redirect' && button.redirectUrl) {
                return (
                  <Box
                    key={index}
                    component="a"
                    href={button.redirectUrl}
                    target="_blank"
                    rel="noopener"
                    sx={buttonStyles}
                  >
                    {button.label}
                  </Box>
                );
              }

              return (
                <Box
                  key={index}
                  component="button"
                  sx={buttonStyles}
                >
                  {button.label}
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}
