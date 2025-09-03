'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Alert,
  Snackbar,
  AlertTitle,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import ElementInspectorHeader from './ElementInspectorHeader';
import ElementInspectorSidebar, { CapturedElement } from './ElementInspectorSidebar';
import { Preview } from '@mui/icons-material';

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
  const [currentUrl, setCurrentUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInspectMode, setIsInspectMode] = useState(false);
  const [capturedElements, setCapturedElements] = useState<CapturedElement[]>([]);
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

  const loadSite = (url: string) => {
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

  const updateElement = (id: string, updates: Partial<CapturedElement>) => {
    setCapturedElements(prev =>
      prev.map(el =>
        el.id === id
          ? { ...el, ...updates }
          : el
      )
    );
    showSnackbar('Element updated');
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
        {/* Header */}
        <ElementInspectorHeader
          onLoadSite={loadSite}
          onBack={handleBack}
          showBackButton={showBackButton}
          onShowInfo={showInfoSnackbar}
          isLoading={isLoading}
        />

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
                <Preview sx={{ fontSize: 90, mb: 1 }} />
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
      <ElementInspectorSidebar
        isInspectMode={isInspectMode}
        onToggleInspectMode={toggleInspectMode}
        capturedElements={capturedElements}
        onDeleteElement={deleteElement}
        onSaveElements={saveToBackend}
        onUpdateElement={updateElement}
        hasUrl={!!currentUrl}
      />

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
