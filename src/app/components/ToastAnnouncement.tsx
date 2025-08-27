'use client';
import { Alert, Box, Snackbar } from "@mui/material";
import { useState } from "react";
import { ThemeConfig } from "./ModalAnnouncement";

interface ToastAnnouncementProps {
  title: string;
  message: string;
  buttons: { label: string; type: 'primary' | 'secondary'; behavior: 'close' | 'redirect'; redirectUrl?: string }[];
  themeConfig: ThemeConfig;
}


const ToastAnnouncement = ({ title, message, buttons, themeConfig }: ToastAnnouncementProps) => {
  const [toastOpen, setToastOpen] = useState(false);
  const handleToastClose = () => {
    setToastOpen(false);
  };

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
            buttons.length > 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  gap: '6px',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-end',
                  marginTop: '8px',
                }}
              >
                {buttons.map((button, index) => {
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
};

export default ToastAnnouncement;