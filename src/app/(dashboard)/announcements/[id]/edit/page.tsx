'use client';

import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import { Header } from '../../../../components/Header';
import { AnnouncementForm } from '../../../../components/AnnouncementForm';
import { AnnouncementPreview } from '../../../../components/AnnouncementPreview';
import { AnnouncementsProvider, useAnnouncements } from '@/contexts/AnnouncementsProvider';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

function EditAnnouncementContent() {
  const router = useRouter();
  const params = useParams();
  const announcementId = params.id as string;
  const accountId = 'account_1';

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
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Header
          title="Edit Announcement"
          subtitle="Update your announcement settings."
          actions={{
            onCancel: handleCancel,
            onPreview: () => {
              console.log('Preview is always visible');
            },
            onSave: async () => {
              if (!formData.title.trim() || !formData.content.trim()) {
                return;
              }
              try {
                await updateAnnouncement(announcementId, formData);
                router.push(`/announcements/${announcementId}`);
              } catch (error) {
                console.error('Failed to update announcement:', error);
              }
            },
            isSubmitting: isUpdating,
            submitText: 'Save Changes',
          }}
        />
        <AnnouncementForm
          mode="edit"
          accountId={accountId}
          onSuccess={handleSuccess}
        />
      </Box>
      <Box sx={{ flex: 1, borderLeft: '1px solid', borderColor: 'divider', overflow: 'auto' }}>
        <AnnouncementPreview />
      </Box>
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
