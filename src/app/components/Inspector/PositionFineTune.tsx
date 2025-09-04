'use client';

import { Box, Slider, Typography } from '@mui/material';

interface PositionFineTuneProps {
  offsetX: number;
  offsetY: number;
  onOffsetXChange: (value: number) => void;
  onOffsetYChange: (value: number) => void;
  onLivePreview?: (offsetX: number, offsetY: number) => void;
}

export default function PositionFineTune({
  offsetX,
  offsetY,
  onOffsetXChange,
  onOffsetYChange,
  onLivePreview
}: PositionFineTuneProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500 }}>
        Fine-tune Position
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Horizontal Offset: {offsetX}px
        </Typography>
        <Slider
          value={offsetX}
          onChange={(_, value) => {
            const newValue = value as number;
            onOffsetXChange(newValue);
            onLivePreview?.(newValue, offsetY);
          }}
          min={-50}
          max={50}
          step={1}
          size="small"
          sx={{ ml: 1, mr: 1 }}
        />
      </Box>

      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Vertical Offset: {offsetY}px
        </Typography>
        <Slider
          value={offsetY}
          onChange={(_, value) => {
            const newValue = value as number;
            onOffsetYChange(newValue);
            onLivePreview?.(offsetX, newValue);
          }}
          min={-50}
          max={50}
          step={1}
          size="small"
          sx={{ ml: 1, mr: 1 }}
        />
      </Box>
    </Box>
  );
}
