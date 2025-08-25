import { Stack, Typography, Box, Button, IconButton, Tooltip } from "@mui/material";
import {
  Visibility as PreviewIcon,
  Save as SaveIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import Image from 'next/image';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: {
    onCancel?: () => void;
    onPreview?: () => void;
    onSave?: () => void;
    isSubmitting?: boolean;
    submitText?: string;
    previewIcon?: string;
    previewTooltip?: string;
    useIconButtons?: boolean;
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
          <Stack direction="row" spacing={actions.useIconButtons ? 1 : 2}>
            {actions.onCancel && (
              actions.useIconButtons ? (
                <Tooltip title="Cancel">
                  <IconButton
                    onClick={actions.onCancel}
                    sx={{
                      backgroundColor: 'background.paper',
                      boxShadow: 1,
                      '&:hover': {
                        backgroundColor: 'background.paper',
                        boxShadow: 2,
                      },
                    }}
                  >
                    <Image
                      src="/illustrations/Notion-Icons/Regular/svg/ni-x.svg"
                      alt="Cancel"
                      width={20}
                      height={20}
                    />
                  </IconButton>
                </Tooltip>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={
                    <Image
                      src="/illustrations/Notion-Icons/Regular/svg/ni-x.svg"
                      alt="Cancel"
                      width={20}
                      height={20}
                    />
                  }
                  onClick={actions.onCancel}
                  sx={{ minWidth: 120 }}
                >
                  Cancel
                </Button>
              )
            )}
            {actions.onPreview && (
              actions.useIconButtons ? (
                <Tooltip title={actions.previewTooltip || "Preview"}>
                  <IconButton
                    onClick={actions.onPreview}
                    sx={{
                      backgroundColor: 'background.paper',
                      boxShadow: 1,
                      '&:hover': {
                        backgroundColor: 'background.paper',
                        boxShadow: 2,
                      },
                    }}
                  >
                    {actions.previewIcon ? (
                      <Image
                        src={actions.previewIcon}
                        alt={actions.previewTooltip || "Preview"}
                        width={20}
                        height={20}
                      />
                    ) : (
                      <PreviewIcon />
                    )}
                  </IconButton>
                </Tooltip>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={
                    <Image
                      src="/illustrations/Notion-Icons/Regular/svg/ni-sidebar-text.svg"
                      alt="Preview"
                      width={20}
                      height={20}
                    />
                  }
                  onClick={actions.onPreview}
                  sx={{ minWidth: 120 }}
                >
                  Preview
                </Button>
              )
            )}
            {actions.onSave && (
              actions.useIconButtons ? (
                <Tooltip title={actions.isSubmitting ? 'Saving...' : (actions.submitText || 'Save Changes')}>
                  <IconButton
                    onClick={actions.onSave}
                    disabled={actions.isSubmitting}
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                      boxShadow: 1,
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                        boxShadow: 2,
                      },
                      '&:disabled': {
                        backgroundColor: 'action.disabledBackground',
                        color: 'action.disabled',
                      },
                    }}
                  >
                    <Image
                      src="/illustrations/Notion-Icons/Regular/svg/ni-double-check.svg"
                      alt="Save"
                      width={20}
                      height={20}
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                  </IconButton>
                </Tooltip>
              ) : (
                <Button
                  variant="contained"
                  startIcon={
                    <Image
                      src="/illustrations/Notion-Icons/Regular/svg/ni-double-check.svg"
                      alt="Save"
                      width={20}
                      height={20}
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                  }
                  onClick={actions.onSave}
                  disabled={actions.isSubmitting}
                  sx={{ minWidth: 120 }}
                >
                  {actions.isSubmitting ? 'Saving...' : (actions.submitText || 'Save Changes')}
                </Button>
              )
            )}
          </Stack>
        )}
      </Box>
    </Box>
  );
};