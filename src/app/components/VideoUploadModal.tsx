'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
} from '@mui/material';

interface VideoUploadModalProps {
  open: boolean;
  onClose: () => void;
  onVideoAdd: (videoUrl: string) => void;
}

export const VideoUploadModal = ({ open, onClose, onVideoAdd }: VideoUploadModalProps) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!videoUrl.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    // Extract YouTube video ID from various URL formats
    const videoId = extractYouTubeVideoId(videoUrl);

    if (!videoId) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    // Pass the original YouTube URL directly to the extension
    onVideoAdd(videoUrl);
    setVideoUrl('');
    setError('');
    onClose();
  };

  const handleClose = () => {
    setVideoUrl('');
    setError('');
    onClose();
  };

  const extractYouTubeVideoId = (url: string): string | null => {
    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add YouTube Video</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter a YouTube video URL to embed it in your announcement.
          </Typography>

          <TextField
            fullWidth
            label="YouTube URL"
            placeholder="https://www.youtube.com/watch?v=..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            error={!!error}
            helperText={error || "Supports YouTube watch URLs, youtu.be links, and embed URLs"}
            sx={{ mb: 2 }}
          />

          {videoUrl && !error && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Supported formats:
              <br />• https://www.youtube.com/watch?v=VIDEO_ID
              <br />• https://youtu.be/VIDEO_ID
              <br />• https://www.youtube.com/embed/VIDEO_ID
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Add Video
        </Button>
      </DialogActions>
    </Dialog>
  );
};
