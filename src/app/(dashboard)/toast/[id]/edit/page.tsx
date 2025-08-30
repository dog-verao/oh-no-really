'use client';

import { Box, Typography, Alert, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { Header } from '../../../../components/Header';
import { AnnouncementForm } from '../../../../components/AnnouncementForm';
import { AnnouncementPreview } from '../../../../components/AnnouncementPreview';
import { AnnouncementsProvider, useAnnouncements } from '@/contexts/AnnouncementsProvider';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

function EditAnnouncementContent() {
  const router = useRouter();
  const params = useParams();
  const announcementId = params.id as string;
  const accountId = 'account_1';
  const [showPreview, setShowPreview] = useState(false);

  const { loadAnnouncement, isLoading, error, isUpdating, formData, updateAnnouncement } = useAnnouncements();

  useEffect(() => {
    if (announcementId) {
      loadAnnouncement(announcementId);
    }
  }, [announcementId, loadAnnouncement]);

  const handleSuccess = () => {
    router.push(`/announcements/${announcementId}`);
  };

  const handleCancel = () => {
    router.push(`/announcements/${announcementId}`);
  };

  const handleTogglePreview = () => {
    setShowPreview(!showPreview);
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 4, pl: 6 }}>
        <Header
          title="Edit Announcement"
          subtitle="Update announcement configuration."
        />
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress size={58} />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, pl: 6 }}>
        <Header
          title="Edit Announcement"
          subtitle="Update announcement configuration."
        />
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">
            {error.message || 'Failed to load announcement'}
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{
        flex: showPreview ? 1 : 1,
        overflow: 'auto',
        transition: 'flex 0.3s ease-in-out',
        position: 'relative'
      }}>
        <Header
          title="Edit Toast"
          subtitle="Update your toast announcement settings."
          actions={{
            onCancel: handleCancel,
            onPreview: handleTogglePreview,
            onSave: async () => {
              if (!formData.title.trim() || !formData.content.trim()) {
                return;
              }
              try {
                await updateAnnouncement(announcementId, formData);
                router.push(`/toast/${announcementId}`);
              } catch (error) {
                console.error('Failed to update announcement:', error);
              }
            },
            isSubmitting: isUpdating,
            submitText: 'Save Changes',
            previewIcon: showPreview
              ? "/illustrations/Notion-Icons/Regular/svg/ni-side-peek-center.svg"
              : "/illustrations/Notion-Icons/Regular/svg/ni-sidebar-text.svg",
            previewTooltip: showPreview ? "Hide Preview" : "Show Preview",
            useIconButtons: showPreview,
          }}
        />
        <AnnouncementForm
          mode="edit"
          accountId={accountId}
          placement="toast"
          onSuccess={handleSuccess}
        />
      </Box>

      {showPreview && (
        <Box sx={{
          flex: 1,
          borderLeft: '1px solid',
          borderColor: 'divider',
          overflow: 'auto',
          animation: 'slideIn 0.3s ease-in-out',
          '@keyframes slideIn': {
            from: {
              transform: 'translateX(100%)',
              opacity: 0,
            },
            to: {
              transform: 'translateX(0)',
              opacity: 1,
            },
          },
        }}>
          <AnnouncementPreview placement="toast" />
        </Box>
      )}
    </Box>
  );
}

export default function EditAnnouncementPage() {
  const accountId = 'account_1';

  return (
    <AnnouncementsProvider accountId={accountId}>
      <EditAnnouncementContent />
    </AnnouncementsProvider>
  );
}
