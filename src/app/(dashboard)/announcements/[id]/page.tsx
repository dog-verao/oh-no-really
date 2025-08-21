'use client';

import {
  Box,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { Header } from '../../../components/Header';
import { AnnouncementForm } from '../../../components/AnnouncementForm';
import { useState, useEffect } from 'react';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useParams, useRouter } from 'next/navigation';

export default function EditAnnouncementPage() {
  const params = useParams();
  const router = useRouter();
  const announcementId = params.id as string;
  const accountId = 'account_1';

  const {
    getAnnouncementById,
    updateAnnouncementAsync,
    isUpdating,
    updateError,
  } = useAnnouncements(accountId);

  const [content, setContent] = useState({
    title: '',
    body: '',
    buttons: [] as Array<{
      label: string;
      type: 'primary' | 'secondary';
      behavior: 'close' | 'redirect';
      redirectUrl?: string;
    }>,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Load announcement data
  useEffect(() => {
    const loadAnnouncement = async () => {
      try {
        setIsLoading(true);
        const announcement = await getAnnouncementById(announcementId);

        if (announcement) {
          setContent({
            title: announcement.title || '',
            body: announcement.message || '',
            buttons: (announcement.buttons as Array<{
              label: string;
              type: 'primary' | 'secondary';
              behavior: 'close' | 'redirect';
              redirectUrl?: string;
            }>) || [],
          });
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Failed to load announcement:', error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (announcementId) {
      loadAnnouncement();
    }
  }, [announcementId]);

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
    await updateAnnouncementAsync({
      id: announcementId,
      title: data.title,
      content: data.content,
      buttons: data.buttons,
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 4, pl: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (notFound) {
    return (
      <Box sx={{ p: 4, pl: 6 }}>
        <Header
          title="Announcement Not Found"
          subtitle="The announcement you're looking for doesn't exist."
        />
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={() => router.push('/announcements')}
          sx={{ mt: 2 }}
        >
          Back to Announcements
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Header
        title="Update Announcement"
        subtitle="Update your announcement settings."
      />
      <AnnouncementForm
        mode="edit"
        initialData={content}
        onSubmit={handleSubmit}
        isSubmitting={isUpdating}
        error={updateError}
      />
    </>
  );
}
