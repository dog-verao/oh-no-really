import { Box, Stack, Typography, TextField, Button, Divider } from '@mui/material';
import { ColorPicker } from '../ColorPicker';

interface ButtonsThemeTabProps {
  config: {
    button: {
      backgroundColor: string;
      textColor: string;
      borderRadius: string;
    };
    secondaryButton: {
      backgroundColor: string;
      textColor: string;
      borderColor: string;
      borderRadius: string;
    };
  };
  onUpdate: (section: 'button' | 'secondaryButton', field: string, value: string) => void;
}

export function ButtonsThemeTab({ config, onUpdate }: ButtonsThemeTabProps) {
  return (
    <Stack spacing={4}>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Button Configuration
      </Typography>

      {/* Primary Button */}
      <Stack spacing={3}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Primary Button
        </Typography>
        <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap" gap={2}>
          <ColorPicker
            label="Background Color"
            value={config.button.backgroundColor}
            onChange={(value) => onUpdate('button', 'backgroundColor', value)}
          />
          <ColorPicker
            label="Text Color"
            value={config.button.textColor}
            onChange={(value) => onUpdate('button', 'textColor', value)}
          />
          <TextField
            label="Border Radius"
            value={config.button.borderRadius}
            onChange={(e) => onUpdate('button', 'borderRadius', e.target.value)}
            size="small"
          />
        </Stack>
      </Stack>

      <Divider />

      {/* Secondary Button */}
      <Stack spacing={3}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Secondary Button
        </Typography>
        <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap" gap={2}>
          <ColorPicker
            label="Background Color"
            value={config.secondaryButton.backgroundColor}
            onChange={(value) => onUpdate('secondaryButton', 'backgroundColor', value)}
          />
          <ColorPicker
            label="Text Color"
            value={config.secondaryButton.textColor}
            onChange={(value) => onUpdate('secondaryButton', 'textColor', value)}
          />
          <ColorPicker
            label="Border Color"
            value={config.secondaryButton.borderColor}
            onChange={(value) => onUpdate('secondaryButton', 'borderColor', value)}
          />
          <TextField
            label="Border Radius"
            value={config.secondaryButton.borderRadius}
            onChange={(e) => onUpdate('secondaryButton', 'borderRadius', e.target.value)}
            size="small"
          />
        </Stack>
      </Stack>

      {/* Button Preview */}
      <Stack direction="row" spacing={4} justifyContent="center">
        <Button
          variant="contained"
          sx={{
            backgroundColor: config.button.backgroundColor,
            color: config.button.textColor,
            borderRadius: config.button.borderRadius,
            '&:hover': {
              backgroundColor: config.button.backgroundColor,
              opacity: 0.9,
            },
          }}
        >
          Primary Button
        </Button>
        <Button
          variant="outlined"
          sx={{
            backgroundColor: config.secondaryButton.backgroundColor,
            borderColor: config.secondaryButton.borderColor,
            color: config.secondaryButton.textColor,
            borderRadius: config.secondaryButton.borderRadius,
            '&:hover': {
              borderColor: config.secondaryButton.borderColor,
              backgroundColor: `${config.secondaryButton.borderColor}10`,
            },
          }}
        >
          Secondary Button
        </Button>
      </Stack>
    </Stack>
  );
}
