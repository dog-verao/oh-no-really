'use client';

import { Box } from '@mui/material';
import { Header } from '../../../components/Header';
import { AnnouncementForm } from '../../../components/AnnouncementForm';
import { AnnouncementPreview } from '../../../components/AnnouncementPreview';
import { AnnouncementsProvider, useAnnouncements } from '@/contexts/AnnouncementsProvider';
import { useRouter } from 'next/navigation';

function CreateAnnouncementContent() {
  const router = useRouter();
  const accountId = 'account_1';
  const { isCreating, formData, createAnnouncement } = useAnnouncements();

  const handleSuccess = () => {
    router.push('/announcements');
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Header
          title="Create Announcement"
          subtitle="Set up your user announcement flow."
          actions={{
            onCancel: () => router.push('/announcements'),
            onPreview: () => {
              console.log('Preview is always visible');
            },
            onSave: async () => {
              if (!formData.title.trim() || !formData.content.trim()) {
                return;
              }
              try {
                await createAnnouncement(formData);
                router.push('/announcements');
              } catch (error) {
                console.error('Failed to create announcement:', error);
              }
            },
            isSubmitting: isCreating,
            submitText: 'Save',
          }}
        />
        <AnnouncementForm
          mode="create"
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

export default function CreateAnnouncementPage() {
  const accountId = 'account_1';

  return (
    <AnnouncementsProvider accountId={accountId}>
      <CreateAnnouncementContent />
    </AnnouncementsProvider>
  );
}
