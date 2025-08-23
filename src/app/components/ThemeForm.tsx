'use client';

import {
  Box,
  Stack,
  Typography,
  TextField,
  Paper,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { ColorPicker } from './ColorPicker';
import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Theme, CreateThemeData, UpdateThemeData } from '@/hooks/useThemeQueries';

interface ThemeFormProps {
  mode: 'create' | 'edit';
  initialData?: Theme;
  onSubmit: (data: CreateThemeData | UpdateThemeData) => Promise<void>;
  onCancel?: () => void;
  isSubmitting: boolean;
  error?: Error | null;
  successMessage?: string;
}

export function ThemeForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  error,
  successMessage,
}: ThemeFormProps) {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  const [name, setName] = useState(initialData?.name || '');
  const [themeConfig, setThemeConfig] = useState({
    modal: {
      backgroundColor: initialData?.config.modal.backgroundColor || '#ffffff',
      borderRadius: initialData?.config.modal.borderRadius || '12px',
      titleColor: initialData?.config.modal.titleColor || '#1a1a1a',
    },
    button: {
      backgroundColor: initialData?.config.button.backgroundColor || '#007bff',
      textColor: initialData?.config.button.textColor || '#ffffff',
      borderRadius: initialData?.config.button.borderRadius || '8px',
    },
    secondaryButton: {
      backgroundColor: initialData?.config.secondaryButton.backgroundColor || '#ffffff',
      textColor: initialData?.config.secondaryButton.textColor || '#007bff',
      borderColor: initialData?.config.secondaryButton.borderColor || '#007bff',
      borderRadius: initialData?.config.secondaryButton.borderRadius || '8px',
    },
  });

  const updateModalConfig = (field: keyof typeof themeConfig.modal, value: string) => {
    setThemeConfig(prev => ({
      ...prev,
      modal: { ...prev.modal, [field]: value }
    }));
  };

  const updateButtonConfig = (field: keyof typeof themeConfig.button, value: string) => {
    setThemeConfig(prev => ({
      ...prev,
      button: { ...prev.button, [field]: value }
    }));
  };

  const updateSecondaryButtonConfig = (field: keyof typeof themeConfig.secondaryButton, value: string) => {
    setThemeConfig(prev => ({
      ...prev,
      secondaryButton: { ...prev.secondaryButton, [field]: value }
    }));
  };

  const handleSubmit = useCallback(async () => {
    if (!name.trim()) {
      return;
    }

    try {
      const data = {
        name: name.trim(),
        config: themeConfig,
        ...(mode === 'edit' && { id: initialData!.id }),
      };

      await onSubmit(data as CreateThemeData | UpdateThemeData);

      if (mode === 'create') {
        setShowSuccess(true);
        // Reset form for create mode
        setName('');
        setThemeConfig({
          modal: {
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            titleColor: '#1a1a1a',
          },
          button: {
            backgroundColor: '#007bff',
            textColor: '#ffffff',
            borderRadius: '8px',
          },
          secondaryButton: {
            backgroundColor: '#ffffff',
            textColor: '#007bff',
            borderColor: '#007bff',
            borderRadius: '8px',
          },
        });
      } else {
        setShowSuccess(true);
      }
    } catch (error) {
      console.error('Failed to submit theme:', error);
    }
  }, [name, themeConfig, onSubmit, mode, initialData]);

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    } else {
      router.push('/themes');
    }
  }, [onCancel, router]);

  const isFormValid = useMemo(() => {
    return name.trim();
  }, [name]);

  const title = mode === 'create' ? 'Create Theme' : 'Update Theme';
  const subtitle = mode === 'create'
    ? 'Set up your custom theme configuration.'
    : 'Update your theme settings.';
  const submitButtonText = isSubmitting
    ? (mode === 'create' ? 'Creating...' : 'Saving...')
    : (mode === 'create' ? 'Create Theme' : 'Save Changes');

  return (
    <Box sx={{ p: 4, pl: 6, maxWidth: 1200 }}>
      <Box sx={{ mt: 4 }}>
        <Stack spacing={4}>
          {/* Theme Name */}
          <TextField
            fullWidth
            label="Theme Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter theme name"
            helperText="Give your theme a descriptive name"
          />

          {/* Modal Configuration */}
          <Stack direction="column" spacing={4}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Modal
            </Typography>
            <Stack spacing={3} direction="row" alignItems="center">
              <ColorPicker
                label="Background Color"
                value={themeConfig.modal.backgroundColor}
                onChange={(value) => updateModalConfig('backgroundColor', value)}
              />

              <TextField
                label="Border Radius"
                value={themeConfig.modal.borderRadius}
                onChange={(e) => updateModalConfig('borderRadius', e.target.value)}
                size="small"
              />

              <ColorPicker
                label="Title Color"
                value={themeConfig.modal.titleColor}
                onChange={(value) => updateModalConfig('titleColor', value)}
              />
            </Stack>
          </Stack>

          {/* Preview */}
          <Stack direction="row" justifyContent="center" spacing={4}>
            <Paper
              elevation={2}
              sx={{
                backgroundColor: themeConfig.modal.backgroundColor,
                borderRadius: themeConfig.modal.borderRadius,
                p: 3,
                maxWidth: 300,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: themeConfig.modal.titleColor,
                  mb: 2,
                }}
              >
                Preview Modal
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: themeConfig.modal.titleColor,
                  mb: 3,
                  opacity: 0.7,
                }}
              >
                This is how your modal will appear to users.
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: themeConfig.button.backgroundColor,
                    color: themeConfig.button.textColor,
                    borderRadius: themeConfig.button.borderRadius,
                    '&:hover': {
                      backgroundColor: themeConfig.button.backgroundColor,
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
                    borderColor: themeConfig.secondaryButton.borderColor,
                    color: themeConfig.secondaryButton.textColor,
                    borderRadius: themeConfig.secondaryButton.borderRadius,
                    '&:hover': {
                      borderColor: themeConfig.secondaryButton.borderColor,
                      backgroundColor: `${themeConfig.secondaryButton.borderColor}10`,
                    },
                  }}
                >
                  Secondary
                </Button>
              </Stack>
            </Paper>
          </Stack>

          {/* Primary Button Configuration */}
          <Stack direction="column" spacing={4}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Primary Button
            </Typography>
            <Stack spacing={3} direction="row" alignItems="center">
              <ColorPicker
                label="Background Color"
                value={themeConfig.button.backgroundColor}
                onChange={(value) => updateButtonConfig('backgroundColor', value)}
              />

              <ColorPicker
                label="Text Color"
                value={themeConfig.button.textColor}
                onChange={(value) => updateButtonConfig('textColor', value)}
              />

              <TextField
                label="Border Radius"
                value={themeConfig.button.borderRadius}
                onChange={(e) => updateButtonConfig('borderRadius', e.target.value)}
                size="small"
              />
            </Stack>
          </Stack>

          {/* Secondary Button Configuration */}
          <Stack direction="column" spacing={4}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Secondary Button
            </Typography>
            <Stack spacing={3} direction="row" alignItems="center">
              <ColorPicker
                label="Background Color"
                value={themeConfig.secondaryButton.backgroundColor}
                onChange={(value) => updateSecondaryButtonConfig('backgroundColor', value)}
              />

              <ColorPicker
                label="Text Color"
                value={themeConfig.secondaryButton.textColor}
                onChange={(value) => updateSecondaryButtonConfig('textColor', value)}
              />

              <ColorPicker
                label="Border Color"
                value={themeConfig.secondaryButton.borderColor}
                onChange={(value) => updateSecondaryButtonConfig('borderColor', value)}
              />

              <TextField
                label="Border Radius"
                value={themeConfig.secondaryButton.borderRadius}
                onChange={(e) => updateSecondaryButtonConfig('borderRadius', e.target.value)}
                size="small"
              />
            </Stack>
          </Stack>

          {/* Button Preview */}
          <Stack direction="row" spacing={4} justifyContent="center">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minHeight: 100 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: themeConfig.button.backgroundColor,
                  color: themeConfig.button.textColor,
                  borderRadius: themeConfig.button.borderRadius,
                  '&:hover': {
                    backgroundColor: themeConfig.button.backgroundColor,
                    opacity: 0.9,
                  },
                }}
              >
                Primary Button
              </Button>
              <Button
                variant="outlined"
                sx={{
                  backgroundColor: themeConfig.secondaryButton.backgroundColor,
                  borderColor: themeConfig.secondaryButton.borderColor,
                  color: themeConfig.secondaryButton.textColor,
                  borderRadius: themeConfig.secondaryButton.borderRadius,
                  '&:hover': {
                    borderColor: themeConfig.secondaryButton.borderColor,
                    backgroundColor: `${themeConfig.secondaryButton.borderColor}10`,
                  },
                }}
              >
                Secondary Button
              </Button>
            </Box>
          </Stack>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              startIcon={<BackIcon />}
              onClick={handleCancel}
              sx={{ minWidth: 120 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              sx={{ minWidth: 120 }}
              onClick={handleSubmit}
              disabled={isSubmitting || !isFormValid}
            >
              {submitButtonText}
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
          {successMessage || (mode === 'create' ? 'Theme created successfully!' : 'Theme updated successfully!')}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => { }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          Failed to {mode === 'create' ? 'create' : 'update'} theme. Please try again.
        </Alert>
      </Snackbar>
    </Box>
  );
}
