import React, { useState } from 'react';
import { Box, Tooltip as MuiTooltip, IconButton, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ThemeConfig } from './ModalAnnouncement';

interface TooltipProps {
  title: string;
  message: string;
  buttons: Array<{
    label: string;
    type: 'primary' | 'secondary';
    behavior: 'close' | 'redirect';
    redirectUrl?: string;
  }>;
  themeConfig: ThemeConfig;
  onClose?: () => void;
}

const TooltipAnnouncement: React.FC<TooltipProps> = ({
  title,
  message,
  buttons,
  themeConfig,
  onClose,
}) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  const handleButtonClick = (button: { behavior: 'close' | 'redirect'; redirectUrl?: string }) => {
    if (button.behavior === 'redirect' && button.redirectUrl) {
      window.open(button.redirectUrl, '_blank');
    }
    if (button.behavior === 'close') {
      setOpen(false);
      onClose?.();
    }
  };

  const sortedButtons = [...buttons].sort((a, b) => {
    if (a.type === 'primary' && b.type === 'secondary') return 1;
    if (a.type === 'secondary' && b.type === 'primary') return -1;
    return 0;
  });

  const tooltipContent = (
    <Box
      sx={{
        background: themeConfig.modal.backgroundColor,
        borderRadius: themeConfig.modal.borderRadius,
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        padding: '24px',
        maxWidth: '400px',
        maxHeight: '500px',
        overflow: 'auto',
        position: 'relative',
      }}
    >
      {/* Close button */}
      <IconButton
        onClick={handleClose}
        sx={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: 24,
          height: 24,
          color: '#666',
          '&:hover': {
            opacity: 0.8,
          },
        }}
      >
        ×
      </IconButton>

      <Box
        sx={{
          fontWeight: 600,
          fontSize: '16px',
          marginBottom: '12px',
          color: themeConfig.modal.titleColor,
          textAlign: 'center',
          paddingRight: '32px', // Space for close button
        }}
      >
        {title}
      </Box>

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
                  padding: '6px 12px',
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
  );

  return (
    <Box sx={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
      <MuiTooltip
        open={open}
        onClose={handleClose}
        title={tooltipContent}
        placement="top"
        disableHoverListener
        disableFocusListener
        disableTouchListener
        arrow
        PopperProps={{
          sx: {
            zIndex: 99999,
            '& .MuiTooltip-tooltip': {
              backgroundColor: 'transparent',
              padding: 0,
              maxWidth: 'none',
            },
            '& .MuiTooltip-arrow': {
              color: themeConfig.modal.backgroundColor,
            },
          },
        }}
      >
        <IconButton
          onClick={handleClick}
          sx={{
            backgroundColor: themeConfig.button.backgroundColor,
            color: themeConfig.button.textColor,
            width: 48,
            height: 48,
            borderRadius: '50%',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            '&:hover': {
              backgroundColor: themeConfig.button.backgroundColor,
              opacity: 0.9,
            },
          }}
        >
          <AddIcon />
        </IconButton>
      </MuiTooltip>
    </Box>
  );
};

export default TooltipAnnouncement;


