import { Box, Stack, Typography, TextField } from '@mui/material';
import { ColorPicker } from '../ColorPicker';

interface TagsThemeTabProps {
  config: {
    backgroundColor: string;
    textColor: string;
    borderRadius: string;
  };
  onUpdate: (field: string, value: string) => void;
}

export function TagsThemeTab({ config, onUpdate }: TagsThemeTabProps) {
  return (
    <Stack spacing={4}>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Tags Configuration
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
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            backgroundColor: config.backgroundColor,
            color: config.textColor,
            borderRadius: config.borderRadius,
            px: 2,
            py: 1,
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          Tag Preview
        </Box>
      </Box>
    </Stack>
  );
}
