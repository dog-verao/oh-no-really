'use client';

import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';

export type Position =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'left'
  | 'center'
  | 'right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right';

interface PositionSelectorProps {
  selectedPosition: Position;
  onPositionChange: (position: Position) => void;
  onPreviewChange?: (position: Position) => void;
}

const positions: { position: Position; label: string; tooltip: string }[] = [
  { position: 'top-left', label: '↖', tooltip: 'Top Left' },
  { position: 'top', label: '↑', tooltip: 'Top' },
  { position: 'top-right', label: '↗', tooltip: 'Top Right' },
  { position: 'left', label: '←', tooltip: 'Left' },
  { position: 'center', label: '●', tooltip: 'Center' },
  { position: 'right', label: '→', tooltip: 'Right' },
  { position: 'bottom-left', label: '↙', tooltip: 'Bottom Left' },
  { position: 'bottom', label: '↓', tooltip: 'Bottom' },
  { position: 'bottom-right', label: '↘', tooltip: 'Bottom Right' },
];

export default function PositionSelector({
  selectedPosition,
  onPositionChange,
  onPreviewChange
}: PositionSelectorProps) {
  const [hoveredPosition, setHoveredPosition] = useState<Position | null>(null);

  const handlePositionClick = (position: Position) => {
    onPositionChange(position);
  };

  const handlePositionHover = (position: Position) => {
    setHoveredPosition(position);
    onPreviewChange?.(position);
  };

  const handlePositionLeave = () => {
    setHoveredPosition(null);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500 }}>
        Position
      </Typography>

      {/* 3x3 Grid for position selection */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 1,
        width: 'fit-content',
        mx: 'auto'
      }}>
        {positions.map(({ position, label, tooltip }) => (
          <Tooltip key={position} title={tooltip} arrow>
            <IconButton
              size="small"
              onClick={() => handlePositionClick(position)}
              onMouseEnter={() => handlePositionHover(position)}
              onMouseLeave={handlePositionLeave}
              sx={{
                width: 40,
                height: 40,
                border: '1px solid',
                borderColor: selectedPosition === position ? 'primary.main' : 'grey.300',
                backgroundColor: selectedPosition === position
                  ? 'primary.main'
                  : hoveredPosition === position
                    ? 'primary.50'
                    : 'transparent',
                color: selectedPosition === position ? 'white' : 'text.primary',
                '&:hover': {
                  backgroundColor: selectedPosition === position
                    ? 'primary.dark'
                    : 'primary.50',
                  borderColor: 'primary.main',
                },
                fontSize: '1.2rem',
                fontWeight: selectedPosition === position ? 600 : 400,
              }}
            >
              {label}
            </IconButton>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
}

