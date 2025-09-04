'use client';

import { Box } from '@mui/material';
import { ThemeForm } from '../../../components/Themes/ThemeForm';
import { useThemeQueries } from '@/hooks/useThemeQueries';
import { useCurrentAccount } from '@/hooks/useCurrentAccount';
import { useRouter } from 'next/navigation';
import { CreateThemeData } from '@/hooks/useThemeQueries';

export default function NewThemePage() {
  const router = useRouter();
  const { account } = useCurrentAccount();

  const {
    createThemeAsync,
    isCreating,
    createError,
  } = useThemeQueries(account?.id || '');

  const handleSubmit = async (data: CreateThemeData) => {
    try {
      await createThemeAsync(data);
      router.push('/themes');
    } catch (error) {
      console.error('Failed to create theme:', error);
    }
  };

  const handleCancel = () => {
    router.push('/themes');
  };

  return (
    <Box sx={{ height: '100vh', overflow: 'hidden' }}>
      <ThemeForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isCreating}
        error={createError}
      />
    </Box>
  );
}
