import React from 'react';
import { Box, IconButton } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface ServerAnnouncementRendererProps {
  title: string;
  message: string;
  buttons: Array<{
    label: string;
    type: 'primary' | 'secondary';
    behavior: 'close' | 'redirect';
    redirectUrl?: string;
  }>;
  themeConfig: {
    modal: {
      backgroundColor: string;
      titleColor: string;
      borderRadius: string;
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
  };
  placement: 'modal' | 'toast' | 'tooltip';
}

export default function ServerAnnouncementRenderer({
  title,
  message,
  buttons,
  themeConfig,
  placement,
}: ServerAnnouncementRendererProps) {
  // Sort buttons: secondary first, primary last (rightmost)
  const sortedButtons = buttons.sort((a, b) => {
    if (a.type === 'primary' && b.type !== 'primary') return 1;
    if (a.type !== 'primary' && b.type === 'primary') return -1;
    return 0;
  });

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
      {/* Close button */}
      <IconButton
        data-action="close"
        sx={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          width: 32,
          height: 32,
          color: '#666',
          '&:hover': {
            opacity: 0.8,
          },
        }}
      >
        ×
      </IconButton>

      {/* Title */}
      <Box
        sx={{
          fontWeight: 600,
          fontSize: '16px',
          marginBottom: '8px',
          color: themeConfig.modal.titleColor,
          textAlign: 'center',
          paddingRight: '32px', // Space for close button
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
                  data-action="redirect"
                  data-redirect-url={button.redirectUrl}
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
                data-action="close"
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
        <Box sx={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 2147483000 }}>
          <Box
            sx={{
              backgroundColor: themeConfig.modal.backgroundColor,
              borderRadius: themeConfig.modal.borderRadius,
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
              padding: '16px',
              maxWidth: '400px',
              width: '100%',
              position: 'relative',
            }}
          >
            {/* Close button */}
            <IconButton
              data-action="close"
              sx={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: 24,
                height: 24,
                color: '#999',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              ×
            </IconButton>

            <Box>
              {/* Title */}
              <Box
                sx={{
                  fontWeight: 600,
                  fontSize: '14px',
                  marginBottom: '6px',
                  color: themeConfig.modal.titleColor,
                  paddingRight: '24px', // Space for close button
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

              {/* Buttons */}
              {sortedButtons.length > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-end',
                    marginTop: '12px',
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
                          data-action="redirect"
                          data-redirect-url={button.redirectUrl}
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
                        data-action="close"
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
        </Box>
      );

    case 'tooltip':
      return (
        <Box sx={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 2147483000 }}>
          {/* Tooltip content */}
          <Box
            className="notifications-fyi-tooltip-content"
            sx={{
              backgroundColor: themeConfig.modal.backgroundColor,
              borderRadius: themeConfig.modal.borderRadius,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              padding: '16px',
              maxWidth: '350px',
              marginBottom: '8px',
              display: 'none',
            }}
          >
            {/* Close button */}
            <IconButton
              data-action="close"
              sx={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: 24,
                height: 24,
                color: '#999',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              ×
            </IconButton>

            {/* Title */}
            <Box
              sx={{
                fontWeight: 600,
                fontSize: '14px',
                marginBottom: '8px',
                color: themeConfig.modal.titleColor,
                paddingRight: '24px', // Space for close button
              }}
            >
              {title}
            </Box>

            {/* Message */}
            <Box
              sx={{
                marginBottom: '16px',
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
                        data-action="redirect"
                        data-redirect-url={button.redirectUrl}
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
                      data-action="close"
                      sx={buttonStyles}
                    >
                      {button.label}
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>

          {/* Tooltip trigger button */}
          <IconButton
            data-action="toggle-tooltip"
            sx={{
              width: 48,
              height: 48,
              backgroundColor: themeConfig.button.backgroundColor,
              color: themeConfig.button.textColor,
              borderRadius: '50%',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              '&:hover': {
                backgroundColor: themeConfig.button.backgroundColor,
                opacity: 0.9,
                transform: 'scale(1.05)',
              },
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>
      );

    case 'modal':
    default:
      return (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2147483000,
        }}>
          {renderContent()}
        </Box>
      );
  }
}
