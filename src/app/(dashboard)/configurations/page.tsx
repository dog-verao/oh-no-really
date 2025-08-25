'use client';

import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  Divider,
  Chip,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrentAccount } from '@/hooks/useCurrentAccount';
import Image from 'next/image';

export default function ConfigurationsPage() {
  const { user } = useAuth();
  const { account, isLoading } = useCurrentAccount();
  const [copied, setCopied] = useState(false);
  const [embedConfig, setEmbedConfig] = useState<{
    accountId: string;
    widgetUrl: string;
    themes: Array<{ id: string; name: string; config: Record<string, unknown> }>;
    announcements: Array<{ id: string; title: string; message: string; themeId?: string }>;
    version: string;
    cacheTTL: number;
  } | null>(null);
  const [configLoading, setConfigLoading] = useState(false);

  const embedScript = `<script
  src="https://cdn.notifications.fyi/loader/v1/loader.js"
  data-account="${account?.apiKey || 'loading...'}"
  async
></script>`;

  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(embedScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy script:', err);
    }
  };

  const fetchEmbedConfig = async () => {
    if (!account?.apiKey) return;

    setConfigLoading(true);
    try {
      const response = await fetch(`/api/embed/config?account_id=${account.apiKey}&path=/`);
      if (response.ok) {
        const config = await response.json();
        setEmbedConfig(config);
      }
    } catch (error) {
      console.error('Failed to fetch embed config:', error);
    } finally {
      setConfigLoading(false);
    }
  };

  useEffect(() => {
    if (account?.apiKey) {
      fetchEmbedConfig();
    }
  }, [account?.apiKey]);

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Configurations
        </Typography>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Configurations
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Image
            src="/illustrations/Notion-Icons/Regular/svg/ni-code.svg"
            alt="Embed"
            width={24}
            height={24}
          />
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
            Embed Script
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Add this script to your website to display announcements. Paste it before the closing <code>&lt;/body&gt;</code> tag.
        </Typography>

        <Box sx={{ position: 'relative' }}>
          <TextField
            multiline
            rows={4}
            value={embedScript}
            fullWidth
            variant="outlined"
            InputProps={{
              readOnly: true,
              sx: {
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                backgroundColor: 'grey.50',
              },
            }}
          />
          <Tooltip title={copied ? 'Copied!' : 'Copy script'}>
            <IconButton
              onClick={handleCopyScript}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'white',
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              <Image
                src={copied ? "/illustrations/Notion-Icons/Regular/svg/ni-check.svg" : "/illustrations/Notion-Icons/Regular/svg/ni-clipboard.svg"}
                alt={copied ? "Copied" : "Copy"}
                width={16}
                height={16}
              />
            </IconButton>
          </Tooltip>
        </Box>

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>For SPAs:</strong> If you use React, Next.js, or other single-page applications,
            you may need to re-check for announcements on route changes. We&apos;ll provide a helper function soon.
          </Typography>
        </Alert>

        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            size="small"
            href="/test-embed"
            target="_blank"
            sx={{ textTransform: 'none' }}
          >
            Test Embed Script →
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Image
            src="/illustrations/Notion-Icons/Regular/svg/ni-eye.svg"
            alt="Preview"
            width={24}
            height={24}
          />
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
            Live Preview
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          This is what your embed configuration looks like right now:
        </Typography>

        <Box sx={{ position: 'relative' }}>
          <TextField
            multiline
            rows={8}
            value={configLoading ? 'Loading...' : JSON.stringify(embedConfig, null, 2)}
            fullWidth
            variant="outlined"
            InputProps={{
              readOnly: true,
              sx: {
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                backgroundColor: 'grey.50',
              },
            }}
          />
        </Box>

        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Chip
            label={`${embedConfig?.announcements?.length || 0} active announcements`}
            size="small"
            color="primary"
          />
          <Chip
            label={`${embedConfig?.themes?.length || 0} themes`}
            size="small"
            color="secondary"
          />
          <Chip
            label={`Version: ${embedConfig?.version || 'N/A'}`}
            size="small"
            variant="outlined"
          />
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Image
            src="/illustrations/Notion-Icons/Regular/svg/ni-info.svg"
            alt="Account Info"
            width={24}
            height={24}
          />
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
            Account Information
          </Typography>
        </Box>

        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Account Name
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {account?.name || 'Loading...'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Account ID (API Key)
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'monospace',
                  backgroundColor: 'grey.100',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.875rem'
                }}
              >
                {account?.apiKey || 'loading...'}
              </Typography>
              <Chip label="Public" size="small" color="primary" variant="outlined" />
            </Box>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Account ID
            </Typography>
            <Typography variant="body1">
              {account?.id || 'Loading...'}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Image
            src="/illustrations/Notion-Icons/Regular/svg/ni-rocket.svg"
            alt="Status"
            width={24}
            height={24}
          />
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
            Integration Status
          </Typography>
        </Box>

        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2">CDN Loader</Typography>
            <Chip label="Coming Soon" size="small" color="warning" />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2">Widget Bundle</Typography>
            <Chip label="Coming Soon" size="small" color="warning" />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2">Embed API</Typography>
            <Chip label="Coming Soon" size="small" color="warning" />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2">Domain Allowlist</Typography>
            <Chip label="Coming Soon" size="small" color="warning" />
          </Box>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          <strong>TODO:</strong> We&apos;re working on the complete embed infrastructure. The script above will work once we deploy the CDN assets and embed API.
        </Typography>
      </Paper>
    </Box>
  );
}
