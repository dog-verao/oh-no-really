import { Box, Stack, Typography, TextField, Paper } from '@mui/material';
import { ColorPicker } from '../ColorPicker';

interface ModalThemeTabProps {
  config: {
    backgroundColor: string;
    borderRadius: string;
    titleColor: string;
  };
  onUpdate: (field: string, value: string) => void;
}

export function ModalThemeTab({ config, onUpdate }: ModalThemeTabProps) {
  return (
    <Stack spacing={4}>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Modal Configuration
      </Typography>
      <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap" gap={2}>
        <ColorPicker
          label="Background Color"
          value={config.backgroundColor}
          onChange={(value) => onUpdate('backgroundColor', value)}
        />
        <TextField
          label="Border Radius"
          value={config.borderRadius}
          onChange={(e) => onUpdate('borderRadius', e.target.value)}
          size="small"
        />
        <ColorPicker
          label="Title Color"
          value={config.titleColor}
          onChange={(value) => onUpdate('titleColor', value)}
        />
      </Stack>
      <Paper
        elevation={2}
        sx={{
          backgroundColor: config.backgroundColor,
          borderRadius: config.borderRadius,
          p: 3,
          maxWidth: 300,
          alignSelf: 'center',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: config.titleColor,
            mb: 2,
          }}
        >
          Preview Modal
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: config.titleColor,
            mb: 3,
            opacity: 0.7,
          }}
        >
          This is how your modal will appear to users.
        </Typography>
      </Paper>
    </Stack>
  );
}
