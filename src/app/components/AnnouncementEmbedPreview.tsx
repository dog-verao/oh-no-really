'use client';

import { useState } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import MorphingPopout from './MorphingPopout';

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
  placement?: 'modal' | 'toast' | 'tooltip';
}

export function AnnouncementEmbedPreview({ title, message, buttons, themeConfig, placement = 'modal' }: AnnouncementEmbedPreviewProps) {
  const [toastOpen, setToastOpen] = useState(true);

  // Sort buttons: secondary first, primary last (rightmost)
  const sortedButtons = buttons.sort((a, b) => {
    if (a.type === 'primary' && b.type !== 'primary') return 1;
    if (a.type !== 'primary' && b.type === 'primary') return -1;
    return 0;
  });

  const handleToastClose = () => {
    setToastOpen(false);
  };

  const renderContent = () => (
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
  );

  // Render based on placement type
  switch (placement) {
    case 'toast':
      return (
        <Box sx={{ position: 'relative', minHeight: '400px' }}>
          <Snackbar
            open={toastOpen}
            autoHideDuration={null}
            onClose={handleToastClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            sx={{
              '& .MuiSnackbar-root': {
                bottom: '20px',
                left: '20px',
              },
            }}
          >
            <Alert
              onClose={handleToastClose}
              severity="info"
              sx={{
                backgroundColor: themeConfig.modal.backgroundColor,
                color: themeConfig.modal.titleColor,
                borderRadius: themeConfig.modal.borderRadius,
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                padding: '16px',
                maxWidth: '400px',
                width: '100%',
                '& .MuiAlert-message': {
                  width: '100%',
                },
                '& .MuiAlert-icon': {
                  display: 'none',
                },
                '& .MuiAlert-action': {
                  padding: 0,
                  marginRight: 0,
                },
              }}
              action={
                sortedButtons.length > 0 ? (
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '6px',
                      flexWrap: 'wrap',
                      justifyContent: 'flex-end',
                      marginTop: '8px',
                    }}
                  >
                    {sortedButtons.map((button, index) => {
                      const isPrimary = button.type === 'primary';
                      const buttonStyles = {
                        padding: '6px 12px',
                        border: isPrimary ? 'none' : `1px solid ${themeConfig.secondaryButton.borderColor}`,
                        borderRadius: isPrimary
                          ? themeConfig.button.borderRadius
                          : themeConfig.secondaryButton.borderRadius,
                        fontSize: '12px',
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
                          onClick={button.behavior === 'close' ? handleToastClose : undefined}
                          sx={buttonStyles}
                        >
                          {button.label}
                        </Box>
                      );
                    })}
                  </Box>
                ) : undefined
              }
            >
              <Box>
                {/* Title */}
                <Box
                  sx={{
                    fontWeight: 600,
                    fontSize: '14px',
                    marginBottom: '6px',
                    color: themeConfig.modal.titleColor,
                  }}
                >
                  {title}
                </Box>

                {/* Message */}
                <Box
                  sx={{
                    color: '#666',
                    fontSize: '13px',
                    lineHeight: 1.4,
                    '& p': {
                      margin: 0,
                      marginBottom: '6px',
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
              </Box>
            </Alert>
          </Snackbar>
        </Box>
      );

    case 'tooltip':
      return (
        <MorphingPopout
          title={title}
          message={message}
          buttons={buttons}
          themeConfig={themeConfig}
        />
      );

    case 'modal':
    default:
      return (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          p: 3
        }}>
          {renderContent()}
        </Box>
      );
  }
}
