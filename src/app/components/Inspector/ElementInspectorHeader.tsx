'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';

interface ElementInspectorHeaderProps {
  onLoadSite: (url: string) => void;
  onBack?: () => void;
  showBackButton?: boolean;
  onShowInfo: () => void;
  isLoading: boolean;
}

export default function ElementInspectorHeader({
  onLoadSite,
  onBack,
  showBackButton = true,
  onShowInfo,
  isLoading
}: ElementInspectorHeaderProps) {
  const [url, setUrl] = useState('');

  const handleLoadSite = () => {
    if (!url.trim()) return;
    onLoadSite(url);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLoadSite();
    }
  };

  return (
    <Box sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'grey.200', p: 2, height: 72, display: 'flex', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
        {/* Back Button */}
        {showBackButton && (
          <IconButton
            onClick={onBack}
            size="small"
          >
            <img src="/illustrations/Notion-Icons/Regular/svg/ni-arrow-left.svg" alt="Back" style={{ width: 20, height: 20 }} />
          </IconButton>
        )}

        {/* URL Input */}
        <TextField
          type="url"
          placeholder="Enter site URL (e.g., https://example.com)"
          value={url}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{ flex: 1 }}
          size="small"
        />

        {/* Load Site Button */}
        <Button
          onClick={handleLoadSite}
          disabled={!url.trim() || isLoading}
          variant="contained"
          size="small"
          startIcon={isLoading ? <CircularProgress size={16} /> : <PlayArrow />}
        >
          {isLoading ? "Loading..." : "Load Site"}
        </Button>

        {/* Info Button */}
        <IconButton
          onClick={onShowInfo}
          size="small"
        >
          <img src="/illustrations/Notion-Icons/Regular/svg/ni-info.svg" alt="Info" style={{ width: 20, height: 20 }} />
        </IconButton>
      </Box>
    </Box>
  );
}
