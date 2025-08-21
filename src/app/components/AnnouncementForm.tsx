'use client';

import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Visibility as PreviewIcon,
  Send as PublishIcon,
  Save as SaveIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { TiptapEditor } from './TiptapEditor';
import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '../../hooks/useDebounce';

interface AnnouncementFormProps {
  mode: 'create' | 'edit';
  initialData?: {
    title: string;
    body: string;
    buttons?: Array<{
      label: string;
      type: 'primary' | 'secondary';
      behavior: 'close' | 'redirect';
      redirectUrl?: string;
    }>;
  };
  onSubmit: (data: {
    title: string;
    content: string;
    buttons: Array<{
      label: string;
      type: 'primary' | 'secondary';
      behavior: 'close' | 'redirect';
      redirectUrl?: string;
    }>;
  }) => Promise<void>;
  onCancel?: () => void;
  isSubmitting: boolean;
  error?: Error | null;
  successMessage?: string;
}

export function AnnouncementForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  error,
  successMessage,
}: AnnouncementFormProps) {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  const [content, setContent] = useState({
    title: initialData?.title || '',
    body: initialData?.body || '',
  });
  const [buttons, setButtons] = useState<Array<{
    label: string;
    type: 'primary' | 'secondary';
    behavior: 'close' | 'redirect';
    redirectUrl?: string;
  }>>(
    initialData?.buttons || [{ label: 'Got it', type: 'primary', behavior: 'close' }]
  );
  const [newButtonLabel, setNewButtonLabel] = useState('');
  const [newButtonType, setNewButtonType] = useState<'primary' | 'secondary'>('secondary');
  const [newButtonBehavior, setNewButtonBehavior] = useState<'close' | 'redirect'>('close');
  const [newButtonRedirectUrl, setNewButtonRedirectUrl] = useState('');

  // Debounced content to prevent excessive re-renders
  const debouncedContent = useDebounce(content, 300);

  const handleSubmit = useCallback(async () => {
    if (!content.title.trim() || !content.body.trim()) {
      return;
    }

    try {
      await onSubmit({
        title: content.title,
        content: content.body,
        buttons,
      });

      if (mode === 'create') {
        setShowSuccess(true);
        // Reset form for create mode
        setContent({ title: '', body: '' });
      } else {
        setShowSuccess(true);
      }
    } catch (error) {
      console.error('Failed to submit announcement:', error);
    }
  }, [content, onSubmit, mode]);

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    } else {
      router.push('/announcements');
    }
  }, [onCancel, router]);

  const isFormValid = useMemo(() => {
    return content.title.trim() && content.body.trim();
  }, [content.title, content.body]);

  const title = mode === 'create' ? 'Create Announcement' : 'Update Announcement';
  const subtitle = mode === 'create'
    ? 'Set up your user announcement flow.'
    : 'Update your announcement settings.';
  const submitButtonText = isSubmitting
    ? (mode === 'create' ? 'Publishing...' : 'Saving...')
    : (mode === 'create' ? 'Publish' : 'Save Changes');
  const submitIcon = mode === 'create' ? <PublishIcon /> : <SaveIcon />;

  return (
    <Box sx={{ p: 4, pl: 6, maxWidth: 800 }}>
      <Box sx={{ mt: 4 }}>
        <Stack spacing={4}>
          <Stack spacing={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
              Content
            </Typography>
            <TextField
              fullWidth
              placeholder="Announcement title"
              size="small"
              value={content.title}
              onChange={(e) => setContent(prev => ({ ...prev, title: e.target.value }))}
            />
            <TiptapEditor
              value={content.body}
              onChange={(value) => setContent(prev => ({ ...prev, body: value }))}
              placeholder="Write your announcement content here..."
              minHeight={160}
            />
          </Stack>

          {/* Buttons Field */}
          <Stack spacing={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
              Buttons
            </Typography>

            {buttons.map((button, index) => (
              <Stack key={index} direction="row" spacing={1} alignItems="center">
                <TextField
                  fullWidth
                  value={button.label}
                  size="small"
                  onChange={(e) => {
                    const newButtons = [...buttons];
                    newButtons[index] = { ...newButtons[index], label: e.target.value };
                    setButtons(newButtons);
                  }}
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={button.type}
                    onChange={(e) => {
                      const newButtons = [...buttons];
                      newButtons[index] = { ...newButtons[index], type: e.target.value as 'primary' | 'secondary' };
                      setButtons(newButtons);
                    }}
                    size="small"
                  >
                    <MenuItem value="primary">Primary</MenuItem>
                    <MenuItem value="secondary">Secondary</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={button.behavior}
                    onChange={(e) => {
                      const newButtons = [...buttons];
                      newButtons[index] = {
                        ...newButtons[index],
                        behavior: e.target.value as 'close' | 'redirect',
                        redirectUrl: e.target.value === 'redirect' ? newButtons[index].redirectUrl : undefined
                      };
                      setButtons(newButtons);
                    }}
                    size="small"
                  >
                    <MenuItem value="close">Close Modal</MenuItem>
                    <MenuItem value="redirect">Redirect</MenuItem>
                  </Select>
                </FormControl>
                {button.behavior === 'redirect' && (
                  <TextField
                    size="small"
                    placeholder="Redirect URL"
                    value={button.redirectUrl || ''}
                    onChange={(e) => {
                      const newButtons = [...buttons];
                      newButtons[index] = { ...newButtons[index], redirectUrl: e.target.value };
                      setButtons(newButtons);
                    }}
                    sx={{ minWidth: 200 }}
                  />
                )}
                {buttons.length > 1 && (
                  <Button
                    size="small"
                    onClick={() => {
                      const newButtons = buttons.filter((_, i) => i !== index);
                      setButtons(newButtons);
                    }}
                    sx={{ minWidth: 'auto', px: 1 }}
                  >
                    Remove
                  </Button>
                )}
              </Stack>
            ))}

            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                size="small"
                placeholder="Button label"
                value={newButtonLabel}
                onChange={(e) => setNewButtonLabel(e.target.value)}
                sx={{ flex: 1 }}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={newButtonType}
                  onChange={(e) => setNewButtonType(e.target.value as 'primary' | 'secondary')}
                  size="small"
                >
                  <MenuItem value="primary">Primary</MenuItem>
                  <MenuItem value="secondary">Secondary</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={newButtonBehavior}
                  onChange={(e) => setNewButtonBehavior(e.target.value as 'close' | 'redirect')}
                  size="small"
                >
                  <MenuItem value="close">Close Modal</MenuItem>
                  <MenuItem value="redirect">Redirect</MenuItem>
                </Select>
              </FormControl>
              {newButtonBehavior === 'redirect' && (
                <TextField
                  size="small"
                  placeholder="Redirect URL"
                  value={newButtonRedirectUrl}
                  onChange={(e) => setNewButtonRedirectUrl(e.target.value)}
                  sx={{ minWidth: 200 }}
                />
              )}
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  if (newButtonLabel.trim()) {
                    const newButton = {
                      label: newButtonLabel.trim(),
                      type: newButtonType,
                      behavior: newButtonBehavior,
                      ...(newButtonBehavior === 'redirect' && { redirectUrl: newButtonRedirectUrl })
                    };
                    setButtons([...buttons, newButton]);
                    setNewButtonLabel('');
                    setNewButtonRedirectUrl('');
                  }
                }}
                disabled={!newButtonLabel.trim() || (newButtonBehavior === 'redirect' && !newButtonRedirectUrl.trim())}
              >
                Add
              </Button>
            </Stack>
          </Stack>

          <Divider sx={{ my: 2 }} />

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
              variant="outlined"
              startIcon={<PreviewIcon />}
              sx={{ minWidth: 120 }}
            >
              Preview
            </Button>
            <Button
              variant="contained"
              startIcon={submitIcon}
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
          {successMessage || (mode === 'create' ? 'Announcement published successfully!' : 'Announcement updated successfully!')}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => { }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          Failed to {mode === 'create' ? 'publish' : 'update'} announcement. Please try again.
        </Alert>
      </Snackbar>
    </Box>
  );
}
