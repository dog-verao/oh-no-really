import { Box, Stack, Typography, TextField } from '@mui/material';
import { ColorPicker } from '../ColorPicker';

interface HighlightsThemeTabProps {
  config: {
    backgroundColor: string;
    size: number;
    animationDuration: number;
  };
  onUpdate: (field: string, value: string | number) => void;
}

export function HighlightsThemeTab({ config, onUpdate }: HighlightsThemeTabProps) {
  return (
    <Stack spacing={4}>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Highlights Configuration
      </Typography>
      <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap" gap={2}>
        <ColorPicker
          label="Background Color"
          value={config.backgroundColor}
          onChange={(value) => onUpdate('backgroundColor', value)}
        />
        <TextField
          label="Size (px)"
          type="number"
          value={config.size}
          onChange={(e) => onUpdate('size', parseInt(e.target.value))}
          size="small"
          inputProps={{ min: 10, max: 100 }}
        />
        <TextField
          label="Animation Duration (s)"
          type="number"
          value={config.animationDuration}
          onChange={(e) => onUpdate('animationDuration', parseFloat(e.target.value))}
          size="small"
          inputProps={{ min: 0.5, max: 5, step: 0.1 }}
        />
      </Stack>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            width: config.size,
            height: config.size,
            backgroundColor: config.backgroundColor,
            borderRadius: '50%',
            animation: `pulse ${config.animationDuration}s infinite`,
            '@keyframes pulse': {
              '0%': { opacity: 1 },
              '50%': { opacity: 0.5 },
              '100%': { opacity: 1 },
            },
          }}
        />
      </Box>
    </Stack>
  );
}
