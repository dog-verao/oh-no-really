'use client';

import {
  Box,
  Stack,
  Typography,
  Paper,
  Button,
  Alert,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { Header } from '../../../components/Header';
import { useThemeQueries } from '@/hooks/useThemeQueries';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Theme } from '@/hooks/useThemeQueries';

export default function ThemeViewPage() {
  const router = useRouter();
  const params = useParams();
  const themeId = params.id as string;
  const accountId = 'account_1';
  const [theme, setTheme] = useState<Theme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { getThemeById } = useThemeQueries(accountId);

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
  }, [themeId]);

  const handleBack = () => {
    router.push('/themes');
  };

  const handleEdit = () => {
    router.push(`/themes/${themeId}/edit`);
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 4, pl: 6 }}>
        <Header
          title="Theme Details"
          subtitle="View theme configuration."
        />
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Typography>Loading theme...</Typography>
        </Box>
      </Box>
    );
  }

  if (error || !theme) {
    return (
      <Box sx={{ p: 4, pl: 6 }}>
        <Header
          title="Theme Details"
          subtitle="View theme configuration."
        />
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">
            {error?.message || 'Theme not found'}
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, pl: 6 }}>
      <Header
        title={theme.name}
        subtitle="Theme configuration details."
      />

      <Box sx={{ mt: 4 }}>
        <Stack spacing={3}>
          {/* Action Buttons */}
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<BackIcon />}
              onClick={handleBack}
            >
              Back to Themes
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
            >
              Edit Theme
            </Button>
          </Stack>

          {/* Theme Configuration Display */}
          <Paper sx={{ p: 4 }}>
            <Stack spacing={4}>
              {/* Modal Configuration */}
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Modal Configuration
                </Typography>
                <Stack direction="row" spacing={4}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Background Color
                    </Typography>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: theme.config.modal.backgroundColor,
                        border: '1px solid #ddd',
                        borderRadius: 1,
                        mt: 1,
                      }}
                    />
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {theme.config.modal.backgroundColor}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Border Radius
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {theme.config.modal.borderRadius}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Title Color
                    </Typography>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: theme.config.modal.titleColor,
                        border: '1px solid #ddd',
                        borderRadius: 1,
                        mt: 1,
                      }}
                    />
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {theme.config.modal.titleColor}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>

              {/* Primary Button Configuration */}
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Primary Button Configuration
                </Typography>
                <Stack direction="row" spacing={4}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Background Color
                    </Typography>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: theme.config.button.backgroundColor,
                        border: '1px solid #ddd',
                        borderRadius: 1,
                        mt: 1,
                      }}
                    />
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {theme.config.button.backgroundColor}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Text Color
                    </Typography>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: theme.config.button.textColor,
                        border: '1px solid #ddd',
                        borderRadius: 1,
                        mt: 1,
                      }}
                    />
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {theme.config.button.textColor}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Border Radius
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {theme.config.button.borderRadius}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>

              {/* Secondary Button Configuration */}
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Secondary Button Configuration
                </Typography>
                <Stack direction="row" spacing={4}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Background Color
                    </Typography>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: theme.config.secondaryButton.backgroundColor,
                        border: '1px solid #ddd',
                        borderRadius: 1,
                        mt: 1,
                      }}
                    />
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {theme.config.secondaryButton.backgroundColor}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Text Color
                    </Typography>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: theme.config.secondaryButton.textColor,
                        border: '1px solid #ddd',
                        borderRadius: 1,
                        mt: 1,
                      }}
                    />
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {theme.config.secondaryButton.textColor}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Border Color
                    </Typography>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: theme.config.secondaryButton.borderColor,
                        border: '1px solid #ddd',
                        borderRadius: 1,
                        mt: 1,
                      }}
                    />
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {theme.config.secondaryButton.borderColor}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Border Radius
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {theme.config.secondaryButton.borderRadius}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>

              {/* Preview */}
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Preview
                </Typography>
                <Paper
                  elevation={2}
                  sx={{
                    backgroundColor: theme.config.modal.backgroundColor,
                    borderRadius: theme.config.modal.borderRadius,
                    p: 3,
                    maxWidth: 400,
                    alignSelf: 'center',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: theme.config.modal.titleColor,
                      mb: 2,
                    }}
                  >
                    Sample Modal Title
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.config.modal.titleColor,
                      mb: 3,
                      opacity: 0.7,
                    }}
                  >
                    This is a preview of how your modal will appear to users.
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: theme.config.button.backgroundColor,
                        color: theme.config.button.textColor,
                        borderRadius: theme.config.button.borderRadius,
                        '&:hover': {
                          backgroundColor: theme.config.button.backgroundColor,
                          opacity: 0.9,
                        },
                      }}
                    >
                      Primary
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        backgroundColor: theme.config.secondaryButton.backgroundColor,
                        borderColor: theme.config.secondaryButton.borderColor,
                        color: theme.config.secondaryButton.textColor,
                        borderRadius: theme.config.secondaryButton.borderRadius,
                        '&:hover': {
                          borderColor: theme.config.secondaryButton.borderColor,
                          backgroundColor: `${theme.config.secondaryButton.borderColor}10`,
                        },
                      }}
                    >
                      Secondary
                    </Button>
                  </Stack>
                </Paper>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
}
