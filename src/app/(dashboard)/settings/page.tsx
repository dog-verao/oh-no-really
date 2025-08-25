'use client';

import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useState } from 'react';
import { useCurrentAccount } from '@/hooks/useCurrentAccount';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
  const { account, isLoading: isLoadingAccount } = useCurrentAccount();
  const { user } = useAuth();
  const [accountName, setAccountName] = useState(account?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const embedScript = `<script
  src="http://localhost:3000/loader/v1/loader.js"
  data-account="${account?.apiKey || ''}"
  async
></script>`;

  const handleSaveAccountName = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // TODO: Implement API call to update account name
      // await updateAccountName(accountName);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update account name:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedScript);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  if (isLoadingAccount) {
    return (
      <Box sx={{ p: 4, pl: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={58} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, pl: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Configuration
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your account settings and embed script.
          </Typography>
        </Box>
      </Box>

      <Stack spacing={4}>
        {/* Account Settings */}
        <Box sx={{ backgroundColor: 'background.paper', borderRadius: 2, p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Account Settings
          </Typography>

          <Stack spacing={3}>
            <TextField
              label="Account Name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              fullWidth
              size="small"
            />

            <Box>
              <Button
                variant="contained"
                onClick={handleSaveAccountName}
                disabled={isSaving || accountName === account?.name}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>

              {saveSuccess && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Account name updated successfully!
                </Alert>
              )}
            </Box>
          </Stack>
        </Box>

        {/* Embed Script */}
        <Box sx={{ backgroundColor: 'background.paper', borderRadius: 2, p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Embed Script
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add this script to your website to display notifications.
          </Typography>

          <Paper
            variant="outlined"
            sx={{
              p: 2,
              backgroundColor: 'grey.50',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            {embedScript}
          </Paper>

          <Button
            variant="outlined"
            onClick={copyToClipboard}
            sx={{ mt: 2 }}
          >
            Copy to Clipboard
          </Button>
        </Box>

        {/* Account Information */}
        <Box sx={{ backgroundColor: 'background.paper', borderRadius: 2, p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Account Information
          </Typography>

          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Account ID
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                {account?.id || 'Loading...'}
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="body2" color="text.secondary">
                API Key
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                {account?.apiKey || 'Loading...'}
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">
                {user?.email || 'Loading...'}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
