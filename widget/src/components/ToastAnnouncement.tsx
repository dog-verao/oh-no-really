import { Alert, Box, Snackbar, Button } from "@mui/material";
import { useState } from "react";
import { ThemeConfig } from "./ModalAnnouncement";

interface ToastAnnouncementProps {
  title: string;
  message: string;
  buttons: { label: string; type: 'primary' | 'secondary'; behavior: 'close' | 'redirect'; redirectUrl?: string }[];
  themeConfig: ThemeConfig;
}

const ToastAnnouncement = ({ title, message, buttons, themeConfig }: ToastAnnouncementProps) => {
  const [toastOpen, setToastOpen] = useState(true);

  const handleToastClose = () => {
    setToastOpen(false);
  };

  const handleButtonClick = (button: { behavior: 'close' | 'redirect'; redirectUrl?: string }) => {
    if (button.behavior === 'redirect' && button.redirectUrl) {
      window.open(button.redirectUrl, '_blank');
    }
    if (button.behavior === 'close') {
      setToastOpen(false);
    }
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
                  return (
                    <Button
                      key={index}
                      variant={isPrimary ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => handleButtonClick(button)}
                      sx={{
                        backgroundColor: isPrimary
                          ? themeConfig.button.backgroundColor
                          : themeConfig.secondaryButton.backgroundColor,
                        color: isPrimary
                          ? themeConfig.button.textColor
                          : themeConfig.secondaryButton.textColor,
                        borderColor: themeConfig.secondaryButton.borderColor,
                        borderRadius: isPrimary
                          ? themeConfig.button.borderRadius
                          : themeConfig.secondaryButton.borderRadius,
                        fontSize: '12px',
                        padding: '4px 8px',
                        minWidth: 'auto',
                        '&:hover': {
                          backgroundColor: isPrimary
                            ? themeConfig.button.backgroundColor
                            : themeConfig.secondaryButton.backgroundColor,
                          opacity: 0.9,
                        },
                      }}
                    >
                      {button.label}
                    </Button>
                  );
                })}
              </Box>
            ) : null
          }
        >
          <Box>
            <Box
              sx={{
                fontWeight: 600,
                fontSize: '14px',
                marginBottom: '4px',
                color: themeConfig.modal.titleColor,
              }}
            >
              {title}
            </Box>
            <Box
              sx={{
                fontSize: '12px',
                color: '#666',
                lineHeight: 1.4,
                '& p': {
                  margin: 0,
                  marginBottom: '4px',
                },
                '& p:last-child': {
                  marginBottom: 0,
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


