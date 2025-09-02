'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  IconButton,
  List,
  ListItem,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  AlertTitle,
} from '@mui/material';
import {
  PlayArrow,
  Visibility,
  Delete,
  Edit,
  Check,
  Close,
  Save,
  ArrowBack,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface CapturedElement {
  id: string;
  label: string;
  selector: string;
  tagName: string;
  text: string;
  timestamp: number;
}

interface ElementInspectorProps {
  title: string;
  description: string;
  onSave: (elements: CapturedElement[]) => Promise<void>;
  onBack?: () => void;
  showBackButton?: boolean;
}

export default function ElementInspector({ 
  title, 
  description, 
  onSave, 
  onBack,
  showBackButton = true 
}: ElementInspectorProps) {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInspectMode, setIsInspectMode] = useState(false);
  const [capturedElements, setCapturedElements] = useState<CapturedElement[]>([]);
  const [editingElement, setEditingElement] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [infoSnackbar, setInfoSnackbar] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const showInfoSnackbar = () => {
    setInfoSnackbar(true);
  };

  const closeInfoSnackbar = () => {
    setInfoSnackbar(false);
  };

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from our iframe
      if (event.source !== iframeRef.current?.contentWindow) return;

      const { type, data } = event.data;

      switch (type) {
        case 'ELEMENT_SELECTED':
          const newElement: CapturedElement = {
            id: Date.now().toString(),
            label: `Element ${capturedElements.length + 1}`,
            selector: data.selector,
            tagName: data.tagName,
            text: data.text,
            timestamp: Date.now(),
          };
          setCapturedElements(prev => [...prev, newElement]);
          showSnackbar('Element captured!');
          break;

        case 'HIGHLIGHT_STARTED':
          setIsInspectMode(true);
          break;

        case 'HIGHLIGHT_STOPPED':
          setIsInspectMode(false);
          break;

        case 'IFRAME_LOADED':
          setIsLoading(false);
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [capturedElements.length]);

  const loadSite = () => {
    if (!url.trim()) {
      showSnackbar('Please enter a URL', 'error');
      return;
    }

    setIsLoading(true);
    setCurrentUrl(url);
    const iframe = iframeRef.current;
    if (iframe) {
      // Clear any existing content
      iframe.src = '';
      // Set the new URL
      iframe.src = url;
    }
  };

  const toggleInspectMode = () => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) {
      showSnackbar('Please load a site first', 'error');
      return;
    }

    const newMode = !isInspectMode;
    setIsInspectMode(newMode);

    // Send message to iframe to start/stop inspect mode
    iframe.contentWindow.postMessage({
      type: newMode ? 'START_INSPECT' : 'STOP_INSPECT'
    }, '*');
  };

  const deleteElement = (id: string) => {
    setCapturedElements(prev => prev.filter(el => el.id !== id));
    showSnackbar('Element removed');
  };

  const startEdit = (element: CapturedElement) => {
    setEditingElement(element.id);
    setEditLabel(element.label);
  };

  const saveEdit = () => {
    if (!editingElement || !editLabel.trim()) return;

    setCapturedElements(prev =>
      prev.map(el =>
        el.id === editingElement
          ? { ...el, label: editLabel.trim() }
          : el
      )
    );
    setEditingElement(null);
    setEditLabel('');
    showSnackbar('Label updated');
  };

  const cancelEdit = () => {
    setEditingElement(null);
    setEditLabel('');
  };

  const saveToBackend = async () => {
    if (capturedElements.length === 0) {
      showSnackbar('No elements to save', 'error');
      return;
    }

    try {
      await onSave(capturedElements);
      showSnackbar('Elements saved successfully!');
    } catch (error) {
      showSnackbar('Failed to save elements', 'error');
      console.error('Save error:', error);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'grey.50' }}>
      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header - Single Row */}
        <Box sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'grey.200', p: 2, height: 72, display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            {/* Back Button */}
            {showBackButton && (
              <IconButton
                onClick={handleBack}
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
              onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && loadSite()}
              sx={{ flex: 1 }}
              size="small"
            />

            {/* Load Site Button */}
            <Button
              onClick={loadSite}
              disabled={!url.trim() || isLoading}
              variant="contained"
              size="small"
              startIcon={isLoading ? <CircularProgress size={16} /> : <PlayArrow />}
            >
              {isLoading ? "Loading..." : "Load Site"}
            </Button>

            {/* Info Button */}
            <IconButton
              onClick={showInfoSnackbar}
              size="small"
            >
              <img src="/illustrations/Notion-Icons/Regular/svg/ni-info.svg" alt="Info" style={{ width: 20, height: 20 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Iframe Container */}
        <Box sx={{ flex: 1, position: 'relative' }}>
          {currentUrl ? (
            <iframe
              ref={iframeRef}
              src={currentUrl}
              style={{ width: '100%', height: '100%', border: 'none' }}
              sandbox="allow-scripts allow-forms allow-popups allow-modals"
              onLoad={() => {
                setIsLoading(false);
              }}
            />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Visibility sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {title}
                </Typography>
                <Typography color="text.secondary">
                  {description}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Sidebar */}
      <Box sx={{ width: 320, bgcolor: 'white', borderLeft: 1, borderColor: 'grey.200', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'grey.200', height: 72, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Start Inspecting Button */}
          <Button
            onClick={toggleInspectMode}
            disabled={!url.trim()}
            variant={isInspectMode ? "contained" : "outlined"}
            color={isInspectMode ? "error" : "primary"}
            fullWidth
            startIcon={<img src="/illustrations/Notion-Icons/Regular/svg/ni-code-slash.svg" alt="Inspect" style={{ width: 16, height: 16 }} />}
          >
            {isInspectMode ? "Stop Inspecting" : "Start Inspecting"}
          </Button>
        </Box>

        {/* Save Button (only when elements exist) */}
        {capturedElements.length > 0 && (
          <>
            <Box sx={{ p: 2 }}>
              <Button
                onClick={saveToBackend}
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<Save />}
                sx={{ bgcolor: 'black', '&:hover': { bgcolor: 'grey.800' } }}
              >
                Save Elements
              </Button>
            </Box>
            <Divider />
          </>
        )}

        {/* Elements List */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {capturedElements.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Visibility sx={{ fontSize: 32, color: 'grey.300', mb: 1 }} />
              <Typography color="text.secondary">No elements captured yet</Typography>
              <Typography variant="body2" color="text.secondary">
                Start inspecting to capture elements
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {capturedElements.map((element, index) => (
                <Box key={element.id}>
                  <ListItem sx={{ p: 0, mb: 1 }}>
                    <Card sx={{ width: '100%' }}>
                      <CardContent sx={{ p: 2 }}>
                        {editingElement === element.id ? (
                          <Box sx={{ space: 1 }}>
                            <TextField
                              value={editLabel}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditLabel(e.target.value)}
                              onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && saveEdit()}
                              size="small"
                              fullWidth
                              sx={{ mb: 1 }}
                            />
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button size="small" onClick={saveEdit} sx={{ flex: 1 }}>
                                <Check sx={{ fontSize: 16, mr: 0.5 }} />
                                Save
                              </Button>
                              <Button size="small" variant="outlined" onClick={cancelEdit} sx={{ flex: 1 }}>
                                <Close sx={{ fontSize: 16, mr: 0.5 }} />
                                Cancel
                              </Button>
                            </Box>
                          </Box>
                        ) : (
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                                  {element.label}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {element.tagName} • {element.text.substring(0, 30)}
                                  {element.text.length > 30 ? '...' : ''}
                                </Typography>
                                <Box
                                  component="code"
                                  sx={{
                                    fontSize: '0.75rem',
                                    bgcolor: 'grey.100',
                                    px: 0.5,
                                    py: 0.25,
                                    borderRadius: 0.5,
                                    display: 'block',
                                    wordBreak: 'break-all',
                                    mt: 0.5,
                                  }}
                                >
                                  {element.selector}
                                </Box>
                              </Box>
                              <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                                <IconButton
                                  size="small"
                                  onClick={() => startEdit(element)}
                                  sx={{ p: 0.5 }}
                                >
                                  <Edit sx={{ fontSize: 16 }} />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => deleteElement(element.id)}
                                  sx={{ p: 0.5, color: 'error.main' }}
                                >
                                  <Delete sx={{ fontSize: 16 }} />
                                </IconButton>
                              </Box>
                            </Box>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </ListItem>
                  {index < capturedElements.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          )}
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Info Snackbar */}
      <Snackbar
        open={infoSnackbar}
        autoHideDuration={5000}
        onClose={closeInfoSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={closeInfoSnackbar} severity="info" sx={{ width: '100%' }}>
          <AlertTitle sx={{ fontWeight: 600 }}>How to use:</AlertTitle>
          Load a site that has the announcements widget installed. The widget will handle element selection and send the data back to this inspector.
        </Alert>
      </Snackbar>
    </Box>
  );
}
