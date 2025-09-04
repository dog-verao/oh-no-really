import { Box, Stack, Typography, TextField, Paper } from '@mui/material';
import { ColorPicker } from '../ColorPicker';

interface ToastThemeTabProps {
  config: {
    backgroundColor: string;
    textColor: string;
    borderRadius: string;
    borderColor: string;
  };
  onUpdate: (field: string, value: string) => void;
}

export function ToastThemeTab({ config, onUpdate }: ToastThemeTabProps) {
  return (
    <Stack spacing={4}>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Toast Configuration
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
        <ColorPicker
          label="Border Color"
          value={config.borderColor}
          onChange={(value) => onUpdate('borderColor', value)}
        />
      </Stack>
      <Paper
        elevation={2}
        sx={{
          backgroundColor: config.backgroundColor,
          color: config.textColor,
          borderRadius: config.borderRadius,
          border: `1px solid ${config.borderColor}`,
          p: 2,
          maxWidth: 300,
          alignSelf: 'center',
        }}
      >
        <Typography variant="body2">
          Toast notification preview
        </Typography>
      </Paper>
    </Stack>
  );
}
