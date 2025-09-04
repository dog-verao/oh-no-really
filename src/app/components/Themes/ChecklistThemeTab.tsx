import { Box, Stack, Typography, TextField, Paper } from '@mui/material';
import { ColorPicker } from '../ColorPicker';

interface ChecklistThemeTabProps {
  config: {
    backgroundColor: string;
    textColor: string;
    borderRadius: string;
    checkboxColor: string;
  };
  onUpdate: (field: string, value: string) => void;
}

export function ChecklistThemeTab({ config, onUpdate }: ChecklistThemeTabProps) {
  return (
    <Stack spacing={4}>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Checklist Configuration
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
          label="Checkbox Color"
          value={config.checkboxColor}
          onChange={(value) => onUpdate('checkboxColor', value)}
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
        <Stack spacing={2}>
          <Typography variant="h6">Checklist Preview</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                border: `2px solid ${config.checkboxColor}`,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: config.checkboxColor,
                  borderRadius: 0.5,
                }}
              />
            </Box>
            <Typography variant="body2">Completed task</Typography>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}
