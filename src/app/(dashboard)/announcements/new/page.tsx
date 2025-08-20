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
  Add as AddIcon,
} from '@mui/icons-material';
import { Header } from '../../../components/Header';
import { TiptapEditor } from '../../../components/TiptapEditor';
import { useState } from 'react';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useRouter } from 'next/navigation';

export default function CreateAnnouncementPage() {
  const router = useRouter();
  const accountId = 'account_1';

  const {
    createAnnouncement,
    createAnnouncementAsync,
    isCreating,
    createError,
  } = useAnnouncements(accountId);

  const [type, setType] = useState<'modal' | 'banner' | 'tooltip'>('modal');
  const [pagePattern, setPagePattern] = useState('/dashboard/*');
  const [content, setContent] = useState({
    title: '',
    body: '',
  });
  const [buttons, setButtons] = useState<Array<{ label: string; type: 'primary' | 'secondary' }>>([
    { label: 'Got it', type: 'primary' }
  ]);
  const [newButtonLabel, setNewButtonLabel] = useState('');
  const [newButtonType, setNewButtonType] = useState<'primary' | 'secondary'>('secondary');
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle publish announcement
  const handlePublish = async () => {
    if (!content.title.trim() || !content.body.trim()) {
      return;
    }

    try {
      await createAnnouncementAsync({
        title: content.title,
        content: content.body,
        accountId,
        // You can add themeId here if you have theme selection
      });

      setShowSuccess(true);
      // Reset form
      setContent({ title: '', body: '' });
    } catch (error) {
      console.error('Failed to create announcement:', error);
    }
  };

  return (
    <Box sx={{ p: 4, pl: 6, maxWidth: 800 }}>
      <Header
        title="Create Announcement"
        subtitle="Set up your user announcement flow."
      />

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

            {/* Existing Buttons */}
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

            {/* Add New Button */}
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
                startIcon={<AddIcon />}
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
              startIcon={<PreviewIcon />}
              sx={{ minWidth: 120 }}
            >
              Preview
            </Button>
            <Button
              variant="contained"
              startIcon={<PublishIcon />}
              sx={{ minWidth: 120 }}
              onClick={handlePublish}
              disabled={isCreating || !content.title.trim() || !content.body.trim()}
            >
              {isCreating ? 'Publishing...' : 'Publish'}
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
          Announcement published successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!createError}
        autoHideDuration={6000}
        onClose={() => { }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          Failed to publish announcement. Please try again.
        </Alert>
      </Snackbar>
    </Box>
  );
}
