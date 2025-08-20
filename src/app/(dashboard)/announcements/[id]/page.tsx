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
  CircularProgress,
} from '@mui/material';
import {
  Visibility as PreviewIcon,
  Save as SaveIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { Header } from '../../../components/Header';
import { TiptapEditor } from '../../../components/TiptapEditor';
import { useState, useEffect } from 'react';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useParams, useRouter } from 'next/navigation';

export default function EditAnnouncementPage() {
  const params = useParams();
  const router = useRouter();
  console.log('params', params);
  const announcementId = params.id as string;
  const accountId = 'account_1';

  const {
    getAnnouncementById,
    updateAnnouncement,
    updateAnnouncementAsync,
    isUpdating,
    updateError,
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
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Load announcement data
  useEffect(() => {
    const loadAnnouncement = async () => {
      try {
        setIsLoading(true);
        const announcement = await getAnnouncementById(announcementId);

        if (announcement) {
          setContent({
            title: announcement.title || '',
            body: announcement.message || '',
          });
          // You can set other fields like type, pagePattern, buttons if they exist in your data
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Failed to load announcement:', error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (announcementId) {
      loadAnnouncement();
    }
  }, [announcementId]);

  const handleSave = async () => {
    if (!content.title.trim() || !content.body.trim()) {
      return;
    }

    try {
      await updateAnnouncementAsync({
        id: announcementId,
        title: content.title,
        content: content.body,
      });

      setShowSuccess(true);
    } catch (error) {
      console.error('Failed to update announcement:', error);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 4, pl: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (notFound) {
    return (
      <Box sx={{ p: 4, pl: 6 }}>
        <Header
          title="Announcement Not Found"
          subtitle="The announcement you're looking for doesn't exist."
        />
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={() => router.push('/announcements')}
          sx={{ mt: 2 }}
        >
          Back to Announcements
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, pl: 6, maxWidth: 800 }}>
      <Header
        title="Update Announcement"
        subtitle="Update your announcement settings."
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
              onClick={() => router.push('/announcements')}
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
              startIcon={<SaveIcon />}
              sx={{ minWidth: 120 }}
              onClick={handleSave}
              disabled={isUpdating || !content.title.trim() || !content.body.trim()}
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
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
          Announcement updated successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!updateError}
        autoHideDuration={6000}
        onClose={() => { }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          Failed to update announcement. Please try again.
        </Alert>
      </Snackbar>
    </Box>
  );
}
