import React from 'react';
import { Box, Chip } from '@mui/material';

export type Position = 'top-left' | 'top' | 'top-right' | 'left' | 'center' | 'right' | 'bottom-left' | 'bottom' | 'bottom-right';

interface TagProps {
  text: string;
  position: Position;
  targetElement: HTMLElement;
  offsetX?: number;
  offsetY?: number;
  theme?: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    borderRadius?: string;
  };
}

const Tag: React.FC<TagProps> = ({ text, position, targetElement, offsetX = 0, offsetY = 0, theme = {} }) => {
  const getPositionStyles = (): React.CSSProperties => {
    const rect = targetElement.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    const elementLeft = rect.left + scrollX;
    const elementTop = rect.top + scrollY;
    const elementWidth = rect.width;
    const elementHeight = rect.height;

    // Default tag dimensions
    const tagWidth = 120;
    const tagHeight = 32;
    const offset = 0; // Distance from element

    let left: number;
    let top: number;

    switch (position) {
      case 'top-left':
        left = elementLeft - tagWidth - offset;
        top = elementTop - tagHeight - offset;
        break;
      case 'top':
        left = elementLeft + (elementWidth - tagWidth) / 2;
        top = elementTop - tagHeight - offset;
        break;
      case 'top-right':
        left = elementLeft + elementWidth + offset;
        top = elementTop - tagHeight - offset;
        break;
      case 'left':
        left = elementLeft - tagWidth - offset;
        top = elementTop + (elementHeight - tagHeight) / 2;
        break;
      case 'center':
        left = elementLeft + (elementWidth - tagWidth) / 2;
        top = elementTop + (elementHeight - tagHeight) / 2;
        break;
      case 'right':
        left = elementLeft + elementWidth + offset;
        top = elementTop + (elementHeight - tagHeight) / 2;
        break;
      case 'bottom-left':
        left = elementLeft - tagWidth - offset;
        top = elementTop + elementHeight + offset;
        break;
      case 'bottom':
        left = elementLeft + (elementWidth - tagWidth) / 2;
        top = elementTop + elementHeight + offset;
        break;
      case 'bottom-right':
        left = elementLeft + elementWidth + offset;
        top = elementTop + elementHeight + offset;
        break;
      default:
        left = elementLeft;
        top = elementTop;
    }

    return {
      position: 'absolute',
      left: `${left + offsetX}px`,
      top: `${top + offsetY}px`,
      zIndex: 999999,
    };
  };

  return (
    <Box sx={getPositionStyles()}>
      <Chip
        label={text}
        size="small"
        sx={{
          backgroundColor: theme.backgroundColor || '#1976d2',
          color: theme.textColor || '#ffffff',
          border: theme.borderColor ? `1px solid ${theme.borderColor}` : 'none',
          borderRadius: theme.borderRadius || '16px',
          fontSize: '12px',
          fontWeight: 500,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          '& .MuiChip-label': {
            padding: '0 12px',
          },
        }}
      />
    </Box>
  );
};

export default Tag;
