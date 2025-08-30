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
}

export function AnnouncementDisplay({ onBack, onEdit, announcementId, placement = 'modal' }: AnnouncementDisplayProps) {
  const { formData, theme } = useAnnouncements();
  const { account } = useCurrentAccount();
  const { publishAnnouncement, isPublishing, getAnnouncementById } = useAnnouncementsHook(account?.id || '');
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    if (announcementId && account?.id) {
      getAnnouncementById(announcementId).then(setAnnouncement);
    }
  }, [announcementId, account?.id, getAnnouncementById]);

  const handlePublish = () => {
    if (announcementId) {
      publishAnnouncement(announcementId);
    }
  };

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
        title={formData.title || 'Announcement Title'}
        message={formData.content || 'Announcement content will appear here...'}
        buttons={formData.buttons}
        themeConfig={config}
        placement={placement}
      />
    </Box>
  );
}
