'use client';

import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Stack,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Announcement } from '@/hooks/useAnnouncements';

interface AnnouncementModalProps {
  announcement: Announcement;
  open: boolean;
  onClose: () => void;
  isEmbed?: boolean;
}

export function AnnouncementModal({ 
  announcement, 
  open, 
  onClose, 
  isEmbed = false 
}: AnnouncementModalProps) {
  const handleButtonClick = (button: any) => {
    if (button.behavior === 'close') {
      onClose();
    } else if (button.behavior === 'redirect' && button.redirectUrl) {
      window.open(button.redirectUrl, '_blank');
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="announcement-modal-title"
      aria-describedby="announcement-modal-description"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          maxWidth: 500,
          width: '100%',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
      >
        {/* Close button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'grey.500',
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Title */}
        <Typography
          id="announcement-modal-title"
          variant="h6"
          component="h2"
          sx={{ mb: 2, pr: 4 }}
        >
          {announcement.title}
        </Typography>

        {/* Message */}
        <Typography
          id="announcement-modal-description"
          variant="body1"
          sx={{ mb: 3 }}
          dangerouslySetInnerHTML={{ __html: announcement.message }}
        />

        {/* Buttons */}
        {announcement.buttons && announcement.buttons.length > 0 && (
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            {announcement.buttons.map((button, index) => (
              <Button
                key={index}
                variant={button.type === 'primary' ? 'contained' : 'outlined'}
                onClick={() => handleButtonClick(button)}
                sx={{ minWidth: 100 }}
              >
                {button.label}
              </Button>
            ))}
          </Stack>
        )}
      </Box>
    </Modal>
  );
}
