'use client';

import { Header } from '../../../components/Header';
import { AnnouncementForm } from '../../../components/AnnouncementForm';
import { useAnnouncements } from '@/hooks/useAnnouncements';

export default function CreateAnnouncementPage() {
  const accountId = 'account_1';

  const {
    createAnnouncementAsync,
    isCreating,
    createError,
  } = useAnnouncements(accountId);

  const handleSubmit = async (data: {
    title: string;
    content: string;
    type: 'modal' | 'banner' | 'tooltip';
    pagePattern: string;
  }) => {
    await createAnnouncementAsync({
      title: data.title,
      content: data.content,
      // You can add themeId here if you have theme selection
    });
  };

  return (
    <>
      <Header
        title="Create Announcement"
        subtitle="Set up your user announcement flow."
      />
      <AnnouncementForm
        mode="create"
        onSubmit={handleSubmit}
        isSubmitting={isCreating}
        error={createError}
      />
    </>
  );
}
