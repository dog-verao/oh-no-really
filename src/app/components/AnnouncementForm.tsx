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
import { ThemeSelector } from './ThemeSelector';
import { TiptapEditor } from './TiptapEditor';
import { PlacementSelector } from './PlacementSelector';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAnnouncements } from '@/contexts/AnnouncementsProvider';

interface AnnouncementFormProps {
  mode: 'create' | 'edit';
  accountId: string;
  onSuccess?: () => void;
}

export function AnnouncementForm({
  mode,
  accountId,
  onSuccess,
}: AnnouncementFormProps) {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [newButtonLabel, setNewButtonLabel] = useState('');
  const [newButtonType, setNewButtonType] = useState<'primary' | 'secondary'>('secondary');
  const [newButtonBehavior, setNewButtonBehavior] = useState<'close' | 'redirect'>('close');
  const [newButtonRedirectUrl, setNewButtonRedirectUrl] = useState('');

  const {
    formData,
    updateFormData,
    isCreating,
    isUpdating,
    error,
  } = useAnnouncements();


  const addButton = useCallback(() => {
    if (!newButtonLabel.trim()) return;

    const newButton = {
      label: newButtonLabel,
      type: newButtonType,
      behavior: newButtonBehavior,
      ...(newButtonBehavior === 'redirect' && { redirectUrl: newButtonRedirectUrl }),
    };

    updateFormData({
      buttons: [...formData.buttons, newButton],
    });

    // Reset form
    setNewButtonLabel('');
    setNewButtonType('secondary');
    setNewButtonBehavior('close');
    setNewButtonRedirectUrl('');
  }, [newButtonLabel, newButtonType, newButtonBehavior, newButtonRedirectUrl, formData.buttons, updateFormData]);

  const removeButton = useCallback((index: number) => {
    updateFormData({
      buttons: formData.buttons.filter((_, i) => i !== index),
    });
  }, [formData.buttons, updateFormData]);

  const updateButton = useCallback((index: number, updates: Partial<typeof formData.buttons[0]>) => {
    updateFormData({
      buttons: formData.buttons.map((button, i) =>
        i === index ? { ...button, ...updates } : button
      ),
    });
  }, [formData.buttons, updateFormData]);

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
              value={formData.title}
              onChange={(e) => updateFormData({ title: e.target.value })}
            />
            <TiptapEditor
              value={formData.content}
              onChange={(value) => updateFormData({ content: value })}
              placeholder="Write your announcement content here..."
              minHeight={200}
              maxHeight={600}
            />
          </Stack>

          <PlacementSelector
            value={formData.placement || 'modal'}
            onChange={(placement) => updateFormData({ placement })}
            disabled={isCreating || isUpdating}
          />

          {/* Theme Selection */}
          <Stack spacing={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
              Theme
            </Typography>
            <ThemeSelector
              value={formData.themeId}
              onChange={(themeId) => updateFormData({ themeId })}
              accountId={accountId}
              disabled={isCreating || isUpdating}
            />
          </Stack>

          {/* Buttons Field */}
          <Stack spacing={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
              Buttons
            </Typography>

            {formData.buttons.map((button, index) => (
              <Stack key={index} direction="row" spacing={1} alignItems="center">
                <TextField
                  size="small"
                  placeholder="Button label"
                  value={button.label}
                  onChange={(e) => updateButton(index, { label: e.target.value })}
                  sx={{ flex: 1 }}
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={button.type}
                    onChange={(e) => updateButton(index, { type: e.target.value as 'primary' | 'secondary' })}
                  >
                    <MenuItem value="primary">Primary</MenuItem>
                    <MenuItem value="secondary">Secondary</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={button.behavior}
                    onChange={(e) => updateButton(index, { behavior: e.target.value as 'close' | 'redirect' })}
                  >
                    <MenuItem value="close">Close</MenuItem>
                    <MenuItem value="redirect">Redirect</MenuItem>
                  </Select>
                </FormControl>
                {button.behavior === 'redirect' && (
                  <TextField
                    size="small"
                    placeholder="URL"
                    value={button.redirectUrl || ''}
                    onChange={(e) => updateButton(index, { redirectUrl: e.target.value })}
                    sx={{ minWidth: 200 }}
                  />
                )}
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => removeButton(index)}
                >
                  Remove
                </Button>
              </Stack>
            ))}

            <Divider />

            {/* Add New Button */}
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                Add New Button
              </Typography>
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
                  >
                    <MenuItem value="primary">Primary</MenuItem>
                    <MenuItem value="secondary">Secondary</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={newButtonBehavior}
                    onChange={(e) => setNewButtonBehavior(e.target.value as 'close' | 'redirect')}
                  >
                    <MenuItem value="close">Close</MenuItem>
                    <MenuItem value="redirect">Redirect</MenuItem>
                  </Select>
                </FormControl>
                {newButtonBehavior === 'redirect' && (
                  <TextField
                    size="small"
                    placeholder="URL"
                    value={newButtonRedirectUrl}
                    onChange={(e) => setNewButtonRedirectUrl(e.target.value)}
                    sx={{ minWidth: 200 }}
                  />
                )}
                <Button
                  size="small"
                  variant="contained"
                  onClick={addButton}
                  disabled={!newButtonLabel.trim()}
                >
                  Add
                </Button>
              </Stack>
            </Stack>
          </Stack>

          {/* Error Display */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error.message}
            </Alert>
          )}

          {/* Success Snackbar */}
          <Snackbar
            open={showSuccess}
            autoHideDuration={6000}
            onClose={() => setShowSuccess(false)}
            message={mode === 'create' ? 'Announcement created successfully!' : 'Announcement updated successfully!'}
          />
        </Stack>
      </Box>
    </Box>
  );
}
