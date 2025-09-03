import { Box, Button, Card, CardContent, Divider, IconButton, ListItem, TextField, Typography } from "@mui/material"
import PositionSelector, { Position } from "../PositionSelector"
import TagTextInput from "../TagTextInput"
import { Check, Close, Delete, Edit } from "@mui/icons-material"
import { CapturedElement } from "./ElementInspectorSidebar";
import { useState } from "react";

interface ElementCardProps {
  element: CapturedElement;
  onSaveEdit: (id: string, updates: Partial<CapturedElement>) => void;
  onDeleteElement: (id: string) => void;
  index: number;
  totalElements: number;
}

export const ElementCard = ({
  element,
  onSaveEdit,
  onDeleteElement,
  index,
  totalElements
}: ElementCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(element.label);
  const [editPosition, setEditPosition] = useState<Position>(
    element.position && ['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right'].includes(element.position)
      ? element.position as Position
      : 'top-right'
  );
  const [editTagText, setEditTagText] = useState(element.tagText || '');

  const handleSaveEdit = () => {
    console.log('Saving edit for element:', element);
    if (!editLabel.trim()) return;
    if (!editTagText.trim()) {
      // You might want to show an error message here
      return;
    }

    onSaveEdit(element.id, {
      label: editLabel.trim(),
      position: editPosition,
      tagText: editTagText.trim()
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditLabel(element.label);
    setEditPosition(
      element.position && ['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right'].includes(element.position)
        ? element.position as Position
        : 'top-right'
    );
    setEditTagText(element.tagText || '');
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handlePositionChange = (newPosition: Position) => {
    setEditPosition(newPosition);
  };

  const handleTagTextChange = (newText: string) => {
    setEditTagText(newText);
  };

  return (
    <Box key={element.id}>
      <ListItem sx={{ p: 0, mb: 1 }}>
        <Card sx={{ width: '100%' }}>
          <CardContent sx={{ p: 2 }}>
            {isEditing ? (
              <Box sx={{ space: 1 }}>
                <TextField
                  value={editLabel}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditLabel(e.target.value)}
                  onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSaveEdit()}
                  size="small"
                  fullWidth
                  sx={{ mb: 2 }}
                  label="Element Label"
                />

                <PositionSelector
                  selectedPosition={editPosition}
                  onPositionChange={handlePositionChange}
                />

                <TagTextInput
                  value={editTagText}
                  onChange={handleTagTextChange}
                  error={!editTagText.trim()}
                />

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
                      onClick={() => onDeleteElement(element.id)}
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