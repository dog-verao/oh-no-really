import { Box, Button } from "@mui/material";

export interface ThemeConfig {
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

interface ModalAnnouncementProps {
  title: string;
  message: string;
  buttons: { label: string; type: 'primary' | 'secondary'; behavior: 'close' | 'redirect'; redirectUrl?: string }[];
  themeConfig: ThemeConfig;
}

export default function ModalAnnouncement({ title, message, buttons, themeConfig }: ModalAnnouncementProps) {
  const handleButtonClick = (button: { behavior: 'close' | 'redirect'; redirectUrl?: string }) => {
    if (button.behavior === 'redirect' && button.redirectUrl) {
      window.open(button.redirectUrl, '_blank');
    }
    // For close behavior, the modal will be handled by the parent component
  };

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

        {buttons.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
            }}
          >
            {buttons.map((button, index) => {
              const isPrimary = button.type === 'primary';
              return (
                <Button
                  key={index}
                  variant={isPrimary ? 'contained' : 'outlined'}
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
        )}
      </Box>
    </Box>
  );
}


