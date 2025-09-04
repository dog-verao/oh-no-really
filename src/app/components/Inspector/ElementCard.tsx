import { Box, Button, Card, CardContent, Divider, IconButton, ListItem, TextField, Typography } from "@mui/material"
import PositionSelector, { Position } from "../PositionSelector"
import TagTextInput from "../TagTextInput"
import PositionFineTune from "../PositionFineTune"
import HighlightTypeSelector, { HighlightType } from "../HighlightTypeSelector"
import HighlightThemeSettings from "../HighlightThemeSettings"
import { Check, Close, Delete, Edit } from "@mui/icons-material"
import { CapturedElement } from "./ElementInspectorSidebar";
import { useState, RefObject, useEffect } from "react";

interface ElementCardProps {
  element: CapturedElement;
  onSaveEdit: (id: string, updates: Partial<CapturedElement>) => void;
  onDeleteElement: (id: string) => void;
  index: number;
  totalElements: number;
  iframeRef: RefObject<HTMLIFrameElement | null>;
  isHighlightPage?: boolean;
}

interface EditState {
  label: string;
  position: Position;
  tagText: string;
  offsetX: number;
  offsetY: number;
  highlightType: HighlightType;
  highlightColor: string;
  highlightSize: number;
  highlightDuration: number;
}

export const ElementCard = ({
  element,
  onSaveEdit,
  onDeleteElement,
  index,
  totalElements,
  iframeRef,
  isHighlightPage = false
}: ElementCardProps) => {
  const initialState: EditState = {
    label: element.label,
    position: element.position && ['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right'].includes(element.position)
      ? element.position as Position
      : 'top-right',
    tagText: element.tagText || '',
    offsetX: element.offsetX || 0,
    offsetY: element.offsetY || 0,
    highlightType: element.highlightType || 'pulse',
    highlightColor: element.highlightColor || '#1976d2',
    highlightSize: element.highlightSize || 35,
    highlightDuration: element.highlightDuration || 2
  }

  const [prevState, setPrevState] = useState<EditState>(initialState);
  const [editState, setEditState] = useState<EditState>(initialState);
  const [isEditing, setIsEditing] = useState(false);

  // Sync edit state with element prop changes only when component first mounts or after saving
  useEffect(() => {
    setEditState({
      label: element.label,
      position: element.position && ['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right'].includes(element.position)
        ? element.position as Position
        : 'top-right',
      tagText: element.tagText || '',
      offsetX: element.offsetX || 0,
      offsetY: element.offsetY || 0,
      highlightType: element.highlightType || 'pulse',
      highlightColor: element.highlightColor || '#1976d2',
      highlightSize: element.highlightSize || 35,
      highlightDuration: element.highlightDuration || 2
    });
  }, [element.id]); // Only sync when element ID changes (new element selected)

  // Helper function to send widget render message to iframe
  const sendWidgetMessage = (state: EditState, isHighlight: boolean) => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;

    if (isHighlight) {
      iframe.contentWindow.postMessage({
        type: 'RENDER_WIDGET',
        widgetType: 'highlight',
        selector: element.selector,
        config: {
          placement: state.position,
          offsetX: state.offsetX,
          offsetY: state.offsetY,
          type: state.highlightType,
          theme: {
            backgroundColor: state.highlightColor,
            size: state.highlightSize,
            animationDuration: state.highlightDuration
          }
        }
      }, '*');
    } else {
      iframe.contentWindow.postMessage({
        type: 'RENDER_WIDGET',
        widgetType: 'tag',
        selector: element.selector,
        content: state.tagText,
        config: {
          placement: state.position,
          offsetX: state.offsetX,
          offsetY: state.offsetY,
          theme: {
            backgroundColor: '#1976d2',
            textColor: '#ffffff',
            borderRadius: '16px'
          }
        }
      }, '*');
    }
  };

  const handleSaveEdit = () => {
    if (!editState.label.trim()) return;

    if (isHighlightPage) {
      sendWidgetMessage(editState, true);

      onSaveEdit(element.id, {
        label: editState.label.trim(),
        position: editState.position,
        highlightType: editState.highlightType,
        highlightColor: editState.highlightColor,
        highlightSize: editState.highlightSize,
        highlightDuration: editState.highlightDuration,
        offsetX: editState.offsetX,
        offsetY: editState.offsetY
      });
    } else {
      if (!editState.tagText.trim()) return;

      sendWidgetMessage(editState, false);

      onSaveEdit(element.id, {
        label: editState.label.trim(),
        position: editState.position,
        tagText: editState.tagText.trim(),
        offsetX: editState.offsetX,
        offsetY: editState.offsetY
      });
    }

    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    // Revert to the current element state (last saved values)
    setEditState(prevState);
    setIsEditing(false);

    // Send the reverted state to the iframe
    sendWidgetMessage(prevState, isHighlightPage);
  };

  const handleStartEdit = () => {
    setPrevState(editState);
    setIsEditing(true);
  };

  const handlePositionChange = (newPosition: Position) => {
    const newState = { ...editState, position: newPosition };
    setEditState(newState);
    // Send live update for position change
    sendWidgetMessage(newState, isHighlightPage);
  };

  const handleTagTextChange = (newText: string) => {
    const newState = { ...editState, tagText: newText };
    setEditState(newState);
    // Send live update for text change
    sendWidgetMessage(newState, isHighlightPage);
  };

  const handleOffsetXChange = (newOffsetX: number) => {
    setEditState(prev => ({ ...prev, offsetX: newOffsetX }));
  };

  const handleOffsetYChange = (newOffsetY: number) => {
    setEditState(prev => ({ ...prev, offsetY: newOffsetY }));
  };

  const handleHighlightTypeChange = (newType: HighlightType) => {
    const newState = { ...editState, highlightType: newType };
    setEditState(newState);
    // Send live update for highlight type change
    if (isHighlightPage) {
      sendWidgetMessage(newState, true);
    }
  };

  const handleHighlightColorChange = (newColor: string) => {
    const newState = { ...editState, highlightColor: newColor };
    setEditState(newState);
    // Send live update for highlight color change
    if (isHighlightPage) {
      sendWidgetMessage(newState, true);
    }
  };

  const handleHighlightSizeChange = (newSize: number) => {
    const newState = { ...editState, highlightSize: newSize };
    setEditState(newState);
    // Send live update for highlight size change
    if (isHighlightPage) {
      sendWidgetMessage(newState, true);
    }
  };

  const handleHighlightDurationChange = (newDuration: number) => {
    const newState = { ...editState, highlightDuration: newDuration };
    setEditState(newState);
    // Send live update for highlight duration change
    if (isHighlightPage) {
      sendWidgetMessage(newState, true);
    }
  };

  const handleLivePreview = (newOffsetX: number, newOffsetY: number) => {
    // Send live update to widget without saving
    const newState = { ...editState, offsetX: newOffsetX, offsetY: newOffsetY };
    sendWidgetMessage(newState, isHighlightPage);
  };

  return (
    <Box key={element.id}>
      <ListItem sx={{ p: 0, mb: 1 }}>
        <Card sx={{ width: '100%' }}>
          <CardContent sx={{ p: 2 }}>
            {isEditing ? (
              <Box sx={{ '& > *': { mb: 2 } }}>
                <TextField
                  value={editState.label}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditState(prev => ({ ...prev, label: e.target.value }))
                  }
                  onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSaveEdit()}
                  size="small"
                  fullWidth
                  sx={{}}
                  label="Element Label"
                />

                <PositionSelector
                  selectedPosition={editState.position}
                  onPositionChange={handlePositionChange}
                />

                <PositionFineTune
                  offsetX={editState.offsetX}
                  offsetY={editState.offsetY}
                  onOffsetXChange={handleOffsetXChange}
                  onOffsetYChange={handleOffsetYChange}
                  onLivePreview={handleLivePreview}
                />

                {isHighlightPage ? (
                  <>
                    <HighlightTypeSelector
                      selectedType={editState.highlightType}
                      onTypeChange={handleHighlightTypeChange}
                    />

                    <HighlightThemeSettings
                      backgroundColor={editState.highlightColor}
                      size={editState.highlightSize}
                      animationDuration={editState.highlightDuration}
                      onBackgroundColorChange={handleHighlightColorChange}
                      onSizeChange={handleHighlightSizeChange}
                      onAnimationDurationChange={handleHighlightDurationChange}
                    />
                  </>
                ) : (
                  <TagTextInput
                    value={editState.tagText}
                    onChange={handleTagTextChange}
                    error={!editState.tagText.trim()}
                  />
                )}

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" onClick={handleSaveEdit} sx={{ flex: 1 }}>
                    <Check sx={{ fontSize: 16, mr: 0.5 }} />
                    Save
                  </Button>
                  <Button size="small" variant="outlined" onClick={handleCancelEdit} sx={{ flex: 1 }}>
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
                      {element.position && ` • ${element.position}`}
                      {element.tagText && ` • "${element.tagText}"`}
                      {(element.offsetX !== undefined || element.offsetY !== undefined) &&
                        ` • Offset: (${element.offsetX || 0}, ${element.offsetY || 0})px`}
                      {element.x !== undefined && element.y !== undefined && ` • (${element.x}, ${element.y})`}
                      {element.width !== undefined && element.height !== undefined && ` • ${element.width}×${element.height}`}
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
                    {(element.x !== undefined || element.y !== undefined || element.width !== undefined || element.height !== undefined) && (
                      <Box
                        sx={{
                          fontSize: '0.75rem',
                          bgcolor: 'blue.50',
                          px: 0.5,
                          py: 0.25,
                          borderRadius: 0.5,
                          display: 'block',
                          mt: 0.5,
                          border: '1px solid',
                          borderColor: 'blue.200',
                        }}
                      >
                        {element.x !== undefined && element.y !== undefined && `Position: (${element.x}, ${element.y})`}
                        {element.width !== undefined && element.height !== undefined && ` • Size: ${element.width}×${element.height}px`}
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                    <IconButton
                      size="small"
                      onClick={handleStartEdit}
                      sx={{ p: 0.5 }}
                    >
                      <Edit sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        // Remove widget from iframe before deleting element
                        const iframe = iframeRef.current;
                        if (iframe?.contentWindow) {
                          iframe.contentWindow.postMessage({
                            type: 'REMOVE_WIDGET'
                          }, '*');
                        }
                        onDeleteElement(element.id);
                      }}
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
      {index < totalElements - 1 && <Divider />}
    </Box>
  );
};