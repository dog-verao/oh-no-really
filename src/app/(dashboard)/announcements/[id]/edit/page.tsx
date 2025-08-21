'use client';

import { Box, Typography, Alert } from '@mui/material';
import { Header } from '../../../../components/Header';
import { AnnouncementForm } from '../../../../components/AnnouncementForm';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useRouter, useParams } from 'next/navigation';
import { Announcement } from '@/hooks/useAnnouncements';
import { useEffect, useState } from 'react';

export default function EditAnnouncementPage() {
  const router = useRouter();
  const params = useParams();
  const announcementId = params.id as string;
  const accountId = 'account_1';
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const {
    getAnnouncementById,
    updateAnnouncementAsync,
    isUpdating,
    updateError,
  } = useAnnouncements(accountId);

  useEffect(() => {
    const loadAnnouncement = async () => {
      try {
        setIsLoading(true);
        const announcementData = await getAnnouncementById(announcementId);
        setAnnouncement(announcementData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load announcement'));
      } finally {
        setIsLoading(false);
      }
    };

    if (announcementId) {
      loadAnnouncement();
    }
  }, [announcementId, getAnnouncementById]);

  const handleSubmit = async (data: {
    title: string;
    content: string;
    buttons: Array<{
      label: string;
      type: 'primary' | 'secondary';
      behavior: 'close' | 'redirect';
      redirectUrl?: string;
    }>;
  }) => {
    try {
      await updateAnnouncementAsync({
        id: announcementId,
        title: data.title,
        content: data.content,
        buttons: data.buttons,
      });
      router.push(`/announcements/${announcementId}`);
    } catch (error) {
      console.error('Failed to update announcement:', error);
    }
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
          <Typography>Loading announcement...</Typography>
        </Box>
      </Box>
    );
  }

  if (error || !announcement) {
    return (
      <Box sx={{ p: 4, pl: 6 }}>
        <Header
          title="Edit Announcement"
          subtitle="Update announcement configuration."
        />
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">
            {error?.message || 'Announcement not found'}
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, pl: 6 }}>
      <Header
        title={`Edit ${announcement.title}`}
        subtitle="Update your announcement settings."
      />
      <AnnouncementForm
        mode="edit"
        initialData={{
          title: announcement.title,
          body: announcement.message,
          buttons: announcement.buttons || [],
        }}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isUpdating}
        error={updateError}
      />
    </Box>
  );
}
