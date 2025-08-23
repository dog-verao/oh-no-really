'use client';

import { Stack, TextField, Box } from '@mui/material';
import { useState, useEffect } from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  size?: 'small' | 'medium';
}

export const ColorPicker = ({ label, value, onChange, size = 'small' }: ColorPickerProps) => {
  const [textValue, setTextValue] = useState(value);

  useEffect(() => {
    setTextValue(value);
  }, [value]);

  const handleColorChange = (color: string) => {
    setTextValue(color);
  };

  const handleTextChange = (text: string) => {
    setTextValue(text);
  };

  const handleColorBlur = () => {
    onChange(textValue);
  };

  const handleTextBlur = () => {
    // Only update if it's a valid hex color
    if (/^#[0-9A-F]{6}$/i.test(textValue)) {
      onChange(textValue);
    } else {
      // Reset to current value if invalid
      setTextValue(value);
    }
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Box
        sx={{
          width: 24,
          height: 24,
          borderRadius: 1,
          backgroundColor: value,
          border: '1px solid',
          borderColor: 'divider',
          position: 'relative',
          cursor: 'pointer',
        }}
      >
        <input
          type="color"
          value={value}
          onChange={(e) => handleColorChange(e.target.value)}
          onBlur={handleColorBlur}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
          }}
        />
      </Box>
      <TextField
        label={label}
        value={textValue}
        onChange={(e) => handleTextChange(e.target.value)}
        onBlur={handleTextBlur}
        size={size}
        sx={{ flex: 1 }}
        placeholder="#000000"
      />
    </Stack>
  );
};
