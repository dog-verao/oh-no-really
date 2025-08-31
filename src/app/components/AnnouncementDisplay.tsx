'use client';

import {
  Box,
  Button,
} from '@mui/material';
import { useAnnouncements } from '@/contexts/AnnouncementsProvider';
import { useAnnouncements as useAnnouncementsHook, Announcement } from '@/hooks/useAnnouncements';
import { useCurrentAccount } from '@/hooks/useCurrentAccount';
import { AnnouncementEmbedPreview } from './AnnouncementEmbedPreview';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface AnnouncementDisplayProps {
  onBack?: () => void;
  onEdit?: () => void;
  announcementId?: string;
  placement?: 'modal' | 'toast' | 'tooltip';
  onClose?: () => void;
}

export function AnnouncementDisplay({ onBack, onEdit, announcementId, placement = 'modal', onClose }: AnnouncementDisplayProps) {
  const { account } = useCurrentAccount();
  const { announcements, isLoading, error, publishAnnouncement, isPublishing, getAnnouncementById } = useAnnouncementsHook(account?.id || '', placement);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    if (announcementId) {
      // First try to find in the announcements list
      const foundAnnouncement = announcements.find(ann => ann.id === announcementId);
      if (foundAnnouncement) {
        setAnnouncement(foundAnnouncement);
      } else {
        // If not found, fetch individually
        getAnnouncementById(announcementId).then(setAnnouncement);
      }
    }
  }, [announcementId, announcements, getAnnouncementById]);

  const handlePublish = () => {
    if (announcementId) {
      publishAnnouncement(announcementId);
    }
  };

  const handleClose = () => {
    onClose?.();
  };

  if (isLoading) {
    return (
      <Box sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}>
        <Box sx={{ color: 'white', textAlign: 'center' }}>
          Loading...
        </Box>
      </Box>
    );
  }

  if (error || !announcement) {
    return (
      <Box sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}>
        <Box sx={{ color: 'white', textAlign: 'center' }}>
          {error?.message || 'Announcement not found'}
        </Box>
      </Box>
    );
  }

  const config = {
    modal: {
      backgroundColor: '#ffffff',
      titleColor: '#1a1a1a',
      borderRadius: '12px',
    },
    button: {
      backgroundColor: '#007bff',
      textColor: '#ffffff',
      borderRadius: '8px',
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      textColor: '#1a1a1a',
      borderColor: '#e0e0e0',
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
              startIcon={<Image src="/illustrations/Notion-Icons/Regular/svg/ni-arrow-left-circle.svg" alt="Back" width={20} height={20} />}
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
              startIcon={<Image src="/illustrations/Notion-Icons/Regular/svg/ni-pencil.svg" alt="Edit" width={20} height={20} />}
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

      {announcement?.draft && (
        <Box sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 1,
        }}>
          <Button
            variant="contained"
            onClick={handlePublish}
            disabled={isPublishing}
            startIcon={<Image src="/illustrations/Notion-Icons/Regular/svg/ni-rocket.svg" alt="Publish" width={20} height={20} />}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#000',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              }
            }}
          >
            {isPublishing ? 'Publishing...' : 'Publish'}
          </Button>
        </Box>
      )}

      <AnnouncementEmbedPreview
        title={announcement.title || 'Announcement Title'}
        message={announcement.message || 'Announcement content will appear here...'}
        buttons={announcement.buttons || []}
        themeConfig={config}
        placement={placement}
        onClose={handleClose}
      />
    </Box>
  );
}
