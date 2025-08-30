'use client';

import { Box } from '@mui/material';
import { Header } from '../../../components/Header';
import { AnnouncementForm } from '../../../components/AnnouncementForm';
import { AnnouncementPreview } from '../../../components/AnnouncementPreview';
import { AnnouncementsProvider, useAnnouncements } from '@/contexts/AnnouncementsProvider';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function CreateAnnouncementContent() {
  const router = useRouter();
  const accountId = 'account_1';
  const [showPreview, setShowPreview] = useState(false);
  const { isCreating, formData, createAnnouncement } = useAnnouncements();

  const handleSuccess = () => {
    router.push('/announcements');
  };

  const handleTogglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{
        flex: showPreview ? 1 : 1,
        overflow: 'auto',
        transition: 'flex 0.3s ease-in-out',
        position: 'relative'
      }}>
        <Header
          title="Create Tooltip"
          subtitle="Set up your tooltip announcement flow."
          actions={{
            onCancel: () => router.push('/tooltip'),
            onPreview: handleTogglePreview,
            onSave: async () => {
              if (!formData.title.trim() || !formData.content.trim()) {
                return;
              }
              try {
                await createAnnouncement(formData);
                router.push('/tooltip');
              } catch (error) {
                console.error('Failed to create announcement:', error);
              }
            },
            isSubmitting: isCreating,
            submitText: 'Save',
            previewIcon: showPreview
              ? "/illustrations/Notion-Icons/Regular/svg/ni-side-peek-center.svg"
              : "/illustrations/Notion-Icons/Regular/svg/ni-sidebar-text.svg",
            previewTooltip: showPreview ? "Hide Preview" : "Show Preview",
            useIconButtons: showPreview,
          }}
        />
        <AnnouncementForm
          mode="create"
          accountId={accountId}
          placement="tooltip"
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
          <AnnouncementPreview placement="tooltip" />
        </Box>
      )}
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
