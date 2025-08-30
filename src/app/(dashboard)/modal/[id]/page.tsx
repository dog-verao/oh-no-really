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
import { AnnouncementDisplay } from '../../../components/AnnouncementDisplay';
import { AnnouncementsProvider, useAnnouncements } from '@/contexts/AnnouncementsProvider';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

function AnnouncementDetailContent() {
  const params = useParams();
  const router = useRouter();
  const announcementId = params.id as string;

  const { loadAnnouncement, isLoading, error } = useAnnouncements();

  useEffect(() => {
    if (announcementId) {
      loadAnnouncement(announcementId);
    }
  }, [announcementId, loadAnnouncement]);

  const handleEdit = () => {
    router.push(`/modal/${announcementId}/edit`);
  };

  const handleBack = () => {
    router.push('/modal');
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 4, pl: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={58} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, pl: 6 }}>
        <Header
          title="Announcement Not Found"
          subtitle="The announcement you're looking for doesn't exist."
        />
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Announcements
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh' }}>
      <AnnouncementDisplay
        onBack={handleBack}
        onEdit={handleEdit}
        announcementId={announcementId}
        placement="modal"
      />
    </Box>
  );
}

export default function AnnouncementDetailPage() {
  const accountId = 'account_1';

  return (
    <AnnouncementsProvider accountId={accountId}>
      <AnnouncementDetailContent />
    </AnnouncementsProvider>
  );
}
