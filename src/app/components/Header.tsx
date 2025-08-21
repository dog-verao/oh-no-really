import { Stack, Typography, Box, Button } from "@mui/material";
import {
  Visibility as PreviewIcon,
  Save as SaveIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: {
    onCancel?: () => void;
    onPreview?: () => void;
    onSave?: () => void;
    isSubmitting?: boolean;
    submitText?: string;
  };
}

export const Header = ({ title, subtitle, actions }: HeaderProps) => {
  return (
    <Box sx={{ pt: 8, pl: 5, pr: 5, pb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Stack spacing={2}>
          <Typography variant="h6">{title}</Typography>
          {subtitle && <Typography variant="body1">{subtitle}</Typography>}
        </Stack>

        {actions && (
          <Stack direction="row" spacing={2}>
            {actions.onCancel && (
              <Button
                variant="outlined"
                startIcon={<BackIcon />}
                onClick={actions.onCancel}
                sx={{ minWidth: 120 }}
              >
                Cancel
              </Button>
            )}
            {actions.onPreview && (
              <Button
                variant="outlined"
                startIcon={<PreviewIcon />}
                onClick={actions.onPreview}
                sx={{ minWidth: 120 }}
              >
                Preview
              </Button>
            )}
            {actions.onSave && (
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={actions.onSave}
                disabled={actions.isSubmitting}
                sx={{ minWidth: 120 }}
              >
                {actions.isSubmitting ? 'Saving...' : (actions.submitText || 'Save Changes')}
              </Button>
            )}
          </Stack>
        )}
      </Box>
    </Box>
  );
};