'use client';

import { Box, TextField, Typography, Slider } from '@mui/material';
import { ColorPicker } from './ColorPicker';

interface HighlightThemeSettingsProps {
  backgroundColor: string;
  size: number;
  animationDuration: number;
  onBackgroundColorChange: (color: string) => void;
  onSizeChange: (size: number) => void;
  onAnimationDurationChange: (duration: number) => void;
}

export default function HighlightThemeSettings({
  backgroundColor,
  size,
  animationDuration,
  onBackgroundColorChange,
  onSizeChange,
  onAnimationDurationChange
}: HighlightThemeSettingsProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500 }}>
        Theme Settings
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Color
        </Typography>
        <ColorPicker
          color={backgroundColor}
          onChange={onBackgroundColorChange}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Size: {size}px
        </Typography>
        <Slider
          value={size}
          onChange={(_, value) => onSizeChange(value as number)}
          min={20}
          max={80}
          step={5}
          size="small"
          sx={{ ml: 1, mr: 1 }}
        />
      </Box>

      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Animation Duration: {animationDuration}s
        </Typography>
        <Slider
          value={animationDuration}
          onChange={(_, value) => onAnimationDurationChange(value as number)}
          min={0.5}
          max={5}
          step={0.1}
          size="small"
          sx={{ ml: 1, mr: 1 }}
        />
      </Box>
    </Box>
  );
}
