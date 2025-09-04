import { Box, Stack, Typography, TextField, Paper } from '@mui/material';
import { ColorPicker } from '../ColorPicker';

interface TooltipThemeTabProps {
  config: {
    backgroundColor: string;
    textColor: string;
    borderRadius: string;
  };
  onUpdate: (field: string, value: string) => void;
}

export function TooltipThemeTab({ config, onUpdate }: TooltipThemeTabProps) {
  return (
    <Stack spacing={4}>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Tooltip Configuration
      </Typography>
      <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap" gap={2}>
        <ColorPicker
          label="Background Color"
          value={config.backgroundColor}
          onChange={(value) => onUpdate('backgroundColor', value)}
        />
        <ColorPicker
          label="Text Color"
          value={config.textColor}
          onChange={(value) => onUpdate('textColor', value)}
        />
        <TextField
          label="Border Radius"
          value={config.borderRadius}
          onChange={(e) => onUpdate('borderRadius', e.target.value)}
          size="small"
        />
      </Stack>
      <Paper
        elevation={2}
        sx={{
          backgroundColor: config.backgroundColor,
          color: config.textColor,
          borderRadius: config.borderRadius,
          p: 2,
          maxWidth: 200,
          alignSelf: 'center',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: 20,
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: `8px solid ${config.backgroundColor}`,
          },
        }}
      >
        <Typography variant="body2">
          Tooltip preview
        </Typography>
      </Paper>
    </Stack>
  );
}
