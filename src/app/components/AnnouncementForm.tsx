'use client';

import {
  Box,
  Button,
  FormControl,
  InputLabel,
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
  Add as AddIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { TiptapEditor } from './TiptapEditor';
import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';

interface AnnouncementFormProps {
  mode: 'create' | 'edit';
  initialData?: {
    title: string;
    body: string;
    type?: 'modal' | 'banner' | 'tooltip';
    pagePattern?: string;
  };
  onSubmit: (data: {
    title: string;
    content: string;
    type: 'modal' | 'banner' | 'tooltip';
    pagePattern: string;
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

  const [type, setType] = useState<'modal' | 'banner' | 'tooltip'>(
    initialData?.type || 'modal'
  );
  const [pagePattern, setPagePattern] = useState(initialData?.pagePattern || '/dashboard/*');
  const [content, setContent] = useState({
    title: initialData?.title || '',
    body: initialData?.body || '',
  });
  const [buttons, setButtons] = useState<Array<{ label: string; type: 'primary' | 'secondary' }>>([
    { label: 'Got it', type: 'primary' }
  ]);
  const [newButtonLabel, setNewButtonLabel] = useState('');
  const [newButtonType, setNewButtonType] = useState<'primary' | 'secondary'>('secondary');

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
        type,
        pagePattern,
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
  }, [content, type, pagePattern, onSubmit, mode]);

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
          <FormControl fullWidth>
            <InputLabel id="type-label">Type</InputLabel>
            <Select
              onChange={(e) => setType(e.target.value as 'modal' | 'banner' | 'tooltip')}
              labelId="type-label"
              id="type-select"
              value={type}
              label="Type"
            >
              <MenuItem value="modal">Modal</MenuItem>
              <MenuItem value="banner">Banner</MenuItem>
              <MenuItem value="tooltip">Tooltip</MenuItem>
            </Select>
          </FormControl>

          {/* Page Pattern Field */}
          <TextField
            fullWidth
            label="Page Pattern"
            value={pagePattern}
            onChange={(e) => setPagePattern(e.target.value)}
            helperText="Specify which pages this announcement should appear on."
          />

          {/* Content Fields */}
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
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  if (newButtonLabel.trim()) {
                    setButtons([...buttons, { label: newButtonLabel.trim(), type: newButtonType }]);
                    setNewButtonLabel('');
                  }
                }}
                disabled={!newButtonLabel.trim()}
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
