import { Box, Stack, Typography, TextField, Paper } from '@mui/material';
import { ColorPicker } from '../ColorPicker';

interface OnboardingThemeTabProps {
  config: {
    backgroundColor: string;
    textColor: string;
    borderRadius: string;
  };
  onUpdate: (field: string, value: string) => void;
}

export function OnboardingThemeTab({ config, onUpdate }: OnboardingThemeTabProps) {
  return (
    <Stack spacing={4}>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Onboarding Configuration
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
          p: 3,
          maxWidth: 300,
          alignSelf: 'center',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Onboarding Step
        </Typography>
        <Typography variant="body2">
          This is how your onboarding steps will appear.
        </Typography>
      </Paper>
    </Stack>
  );
}
