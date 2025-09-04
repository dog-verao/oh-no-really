'use client';

import { Box, Typography, Alert } from '@mui/material';
import { ThemeForm } from '../../../../components/Themes/ThemeForm';
import { useThemeQueries } from '@/hooks/useThemeQueries';
import { useCurrentAccount } from '@/hooks/useCurrentAccount';
import { useRouter, useParams } from 'next/navigation';
import { UpdateThemeData, CreateThemeData, Theme } from '@/hooks/useThemeQueries';
import { useEffect, useState } from 'react';

export default function EditThemePage() {
  const router = useRouter();
  const params = useParams();
  const themeId = params.id as string;
  const { account } = useCurrentAccount();
  const [theme, setTheme] = useState<Theme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const {
    getThemeById,
    updateThemeAsync,
    isUpdating,
    updateError,
  } = useThemeQueries(account?.id || '');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        setIsLoading(true);
        const themeData = await getThemeById(themeId);
        setTheme(themeData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load theme'));
      } finally {
        setIsLoading(false);
      }
    };

    if (themeId) {
      loadTheme();
    }
  }, [themeId, getThemeById]);

  const handleSubmit = async (data: CreateThemeData | UpdateThemeData) => {
    try {
      if ('id' in data) {
        await updateThemeAsync(data as UpdateThemeData);
      }
      router.push(`/themes/${themeId}`);
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  };

  const handleCancel = () => {
    router.push(`/themes/${themeId}`);
  };

  if (isLoading) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>Loading theme...</Typography>
      </Box>
    );
  }

  if (error || !theme) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Alert severity="error">
          {error?.message || 'Theme not found'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', overflow: 'hidden' }}>
      <ThemeForm
        mode="edit"
        initialData={theme}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isUpdating}
        error={updateError}
      />
    </Box>
  );
}
