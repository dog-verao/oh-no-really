'use client';

import { Box, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';

export type HighlightType = 'pulse' | 'gentle-bounce' | 'attention-shake' | 'color-pulse';

interface HighlightTypeSelectorProps {
  selectedType: HighlightType;
  onTypeChange: (type: HighlightType) => void;
}

export default function HighlightTypeSelector({ selectedType, onTypeChange }: HighlightTypeSelectorProps) {
  const highlightTypes: { type: HighlightType; label: string }[] = [
    { type: 'pulse', label: 'Pulse' },
    { type: 'gentle-bounce', label: 'Gentle Bounce' },
    { type: 'attention-shake', label: 'Attention Shake' },
    { type: 'color-pulse', label: 'Color Pulse' },
  ];

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500 }}>
        Highlight Type
      </Typography>

      <FormControl fullWidth size="small">
        <InputLabel>Animation Type</InputLabel>
        <Select
          value={selectedType}
          label="Animation Type"
          onChange={(e) => onTypeChange(e.target.value as HighlightType)}
        >
          {highlightTypes.map(({ type, label }) => (
            <MenuItem key={type} value={type}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
