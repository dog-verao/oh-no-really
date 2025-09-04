import React from 'react';
import { Box } from '@mui/material';

export type Position = 'top-left' | 'top' | 'top-right' | 'left' | 'center' | 'right' | 'bottom-left' | 'bottom' | 'bottom-right';

interface HighlightProps {
  type: 'pulse' | 'gentle-bounce' | 'attention-shake' | 'color-pulse';
  position: Position;
  targetElement: HTMLElement;
  offsetX?: number;
  offsetY?: number;
  theme?: {
    backgroundColor?: string;
    size?: number;
    animationDuration?: number;
  };
}

const Highlight: React.FC<HighlightProps> = ({
  type,
  position,
  targetElement,
  offsetX = 0,
  offsetY = 0,
  theme = {}
}) => {
  const getPositionStyles = (): React.CSSProperties => {
    const rect = targetElement.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    const elementLeft = rect.left + scrollX;
    const elementTop = rect.top + scrollY;
    const elementWidth = rect.width;
    const elementHeight = rect.height;

    // Default highlight dimensions
    const highlightSize = theme.size || 35;
    const offset = 0; // Distance from element

    let left: number;
    let top: number;

    switch (position) {
      case 'top-left':
        left = elementLeft - highlightSize - offset;
        top = elementTop - highlightSize - offset;
        break;
      case 'top':
        left = elementLeft + (elementWidth - highlightSize) / 2;
        top = elementTop - highlightSize - offset;
        break;
      case 'top-right':
        left = elementLeft + elementWidth + offset;
        top = elementTop - highlightSize - offset;
        break;
      case 'left':
        left = elementLeft - highlightSize - offset;
        top = elementTop + (elementHeight - highlightSize) / 2;
        break;
      case 'center':
        left = elementLeft + (elementWidth - highlightSize) / 2;
        top = elementTop + (elementHeight - highlightSize) / 2;
        break;
      case 'right':
        left = elementLeft + elementWidth + offset;
        top = elementTop + (elementHeight - highlightSize) / 2;
        break;
      case 'bottom-left':
        left = elementLeft - highlightSize - offset;
        top = elementTop + elementHeight + offset;
        break;
      case 'bottom':
        left = elementLeft + (elementWidth - highlightSize) / 2;
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

  const getAnimationStyles = (): React.CSSProperties => {
    const size = theme.size || 35;
    const duration = theme.animationDuration || 2;
    const color = theme.backgroundColor || '#1976d2';

    const baseStyles = {
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      backgroundColor: color,
      boxShadow: `0px 0px 1px 1px ${color}40`,
    };

    switch (type) {
      case 'pulse':
        return {
          ...baseStyles,
          animation: `pulse-animation ${duration}s infinite`,
        };
      case 'gentle-bounce':
        return {
          ...baseStyles,
          animation: `gentle-bounce ${duration}s infinite ease-in-out`,
        };

      case 'attention-shake':
        return {
          ...baseStyles,
          animation: `attention-shake ${duration * 2}s infinite`,
          animationDelay: `${duration}s`,
        };
      case 'color-pulse':
        return {
          ...baseStyles,
          animation: `color-pulse ${duration}s infinite ease-in-out`,
        };
      default:
        return baseStyles;
    }
  };

  return (
    <Box sx={getPositionStyles()}>
      <Box sx={getAnimationStyles()} />
      <style>
        {`
          @keyframes pulse-animation {
            0% { box-shadow: 0 0 0 0px ${theme.backgroundColor || '#1976d2'}40; }
            100% { box-shadow: 0 0 0 ${(theme.size || 35) * 0.6}px ${theme.backgroundColor || '#1976d2'}00; }
          }
          
          @keyframes gentle-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          

          
          @keyframes attention-shake {
            0%, 90%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70% { transform: translateX(-2px); }
            20%, 40%, 60%, 80% { transform: translateX(2px); }
          }
          
          @keyframes color-pulse {
            0%, 100% { 
              background-color: ${theme.backgroundColor || '#1976d2'};
              filter: brightness(1);
            }
            50% { 
              filter: brightness(1.3);
            }
          }
        `}
      </style>
    </Box>
  );
};

export default Highlight;
