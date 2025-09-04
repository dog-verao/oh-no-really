import {
  Box,
  Button,
  Typography,
  List,
  Divider,
} from '@mui/material';
import {
  Visibility,
  Save,
} from '@mui/icons-material';
import { ElementCard } from './ElementCard';
import { RefObject } from 'react';

import { Position } from '../PositionSelector';
import { HighlightType } from '../HighlightTypeSelector';

export interface CapturedElement {
  id: string;
  label: string;
  selector: string;
  tagName: string;
  text: string;
  timestamp: number;
  position?: Position;
  tagText?: string;
  highlightType?: HighlightType;
  highlightColor?: string;
  highlightSize?: number;
  highlightDuration?: number;
  offsetX?: number;
  offsetY?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

interface ElementInspectorSidebarProps {
  isInspectMode: boolean;
  onToggleInspectMode: () => void;
  capturedElements: CapturedElement[];
  onDeleteElement: (id: string) => void;
  onSaveElements: () => void;
  onUpdateElement: (id: string, updates: Partial<CapturedElement>) => void;
  hasUrl: boolean;
  iframeRef: RefObject<HTMLIFrameElement | null>;
  isHighlightPage?: boolean;
}

export default function ElementInspectorSidebar({
  isInspectMode,
  onToggleInspectMode,
  capturedElements,
  onDeleteElement,
  onSaveElements,
  onUpdateElement,
  hasUrl,
  iframeRef,
  isHighlightPage = false
}: ElementInspectorSidebarProps) {
  const saveEdit = (id: string, updates: Partial<CapturedElement>) => {
    onUpdateElement(id, updates);
  };

  return (
    <Box sx={{ width: 320, bgcolor: 'white', borderLeft: 1, borderColor: 'grey.200', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'grey.200', height: 72, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Start Inspecting Button */}
        <Button
          onClick={onToggleInspectMode}
          disabled={!hasUrl}
          variant={isInspectMode ? "contained" : "outlined"}
          color={isInspectMode ? "error" : "primary"}
          fullWidth
          startIcon={<img src="/illustrations/Notion-Icons/Regular/svg/ni-code-slash.svg" alt="Inspect" style={{ width: 16, height: 16 }} />}
        >
          {isInspectMode ? "Stop Inspecting" : "Start Inspecting"}
        </Button>
      </Box>

      {capturedElements.length > 0 && (
        <>
          <Box sx={{ p: 2 }}>
            <Button
              onClick={onSaveElements}
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
              <ElementCard
                key={element.id}
                element={element}
                onSaveEdit={saveEdit}
                onDeleteElement={onDeleteElement}
                index={index}
                totalElements={capturedElements.length}
                iframeRef={iframeRef}
                isHighlightPage={isHighlightPage}
              />
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}
