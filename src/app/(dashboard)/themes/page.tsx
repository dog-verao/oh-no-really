'use client';

import {
  Box,
  Stack,
  Typography,
  TextField,
  Paper,
  Button,
  Grid,
} from '@mui/material';
import { Header } from '../../components/Header';
import { ColorPicker } from '../../components/ColorPicker';
import { useState } from 'react';

interface ThemeConfig {
  modal: {
    backgroundColor: string;
    borderRadius: string;
    titleColor: string;
  };
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
}

export default function ThemesPage() {
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>({
    modal: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      titleColor: '#1a1a1a',
    },
    button: {
      backgroundColor: '#007bff',
      textColor: '#ffffff',
      borderRadius: '8px',
    },
    secondaryButton: {
      backgroundColor: '#ffffff',
      textColor: '#007bff',
      borderColor: '#007bff',
      borderRadius: '8px',
    },
  });

  const updateModalConfig = (field: keyof ThemeConfig['modal'], value: string) => {
    setThemeConfig(prev => ({
      ...prev,
      modal: { ...prev.modal, [field]: value }
    }));
  };

  const updateButtonConfig = (field: keyof ThemeConfig['button'], value: string) => {
    setThemeConfig(prev => ({
      ...prev,
      button: { ...prev.button, [field]: value }
    }));
  };

  const updateSecondaryButtonConfig = (field: keyof ThemeConfig['secondaryButton'], value: string) => {
    setThemeConfig(prev => ({
      ...prev,
      secondaryButton: { ...prev.secondaryButton, [field]: value }
    }));
  };

  return (
    <Box sx={{ p: 4, pl: 6, maxWidth: 1200 }}>
      <Header
        title="Themes"
        subtitle="Customize the appearance of your components."
      />

      <Box sx={{ mt: 4 }}>
        <Stack direction="column" spacing={4}>
          <Stack direction="column" spacing={4}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Modal
            </Typography>
            <Stack spacing={3} direction="row" alignItems="center">
              <ColorPicker
                label="Background Color"
                value={themeConfig.modal.backgroundColor}
                onChange={(value) => updateModalConfig('backgroundColor', value)}
              />

              <TextField
                label="Border Radius"
                value={themeConfig.modal.borderRadius}
                onChange={(e) => updateModalConfig('borderRadius', e.target.value)}
                size="small"
              />

              <ColorPicker
                label="Title Color"
                value={themeConfig.modal.titleColor}
                onChange={(value) => updateModalConfig('titleColor', value)}
              />
            </Stack>
          </Stack>

          <Stack direction="row" justifyContent="center" spacing={4}>
            <Paper
              elevation={2}
              sx={{
                backgroundColor: themeConfig.modal.backgroundColor,
                borderRadius: themeConfig.modal.borderRadius,
                p: 3,
                maxWidth: 300,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: themeConfig.modal.titleColor,
                  mb: 2,
                }}
              >
                Preview Modal
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: themeConfig.modal.titleColor,
                  mb: 3,
                  opacity: 0.7,
                }}
              >
                This is how your modal will appear to users.
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: themeConfig.button.backgroundColor,
                    color: themeConfig.button.textColor,
                    borderRadius: themeConfig.button.borderRadius,
                    '&:hover': {
                      backgroundColor: themeConfig.button.backgroundColor,
                      opacity: 0.9,
                    },
                  }}
                >
                  Primary
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: themeConfig.button.backgroundColor,
                    color: themeConfig.button.backgroundColor,
                    borderRadius: themeConfig.button.borderRadius,
                    '&:hover': {
                      borderColor: themeConfig.button.backgroundColor,
                      backgroundColor: `${themeConfig.button.backgroundColor}10`,
                    },
                  }}
                >
                  Secondary
                </Button>
              </Stack>
            </Paper>
          </Stack>

          <Stack direction="column" spacing={4}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Primary Button
            </Typography>
            <Stack spacing={3} direction="row" alignItems="center">
              <ColorPicker
                label="Background Color"
                value={themeConfig.button.backgroundColor}
                onChange={(value) => updateButtonConfig('backgroundColor', value)}
              />

              <ColorPicker
                label="Text Color"
                value={themeConfig.button.textColor}
                onChange={(value) => updateButtonConfig('textColor', value)}
              />

              <TextField
                label="Border Radius"
                value={themeConfig.button.borderRadius}
                onChange={(e) => updateButtonConfig('borderRadius', e.target.value)}
                size="small"
              />
            </Stack>
          </Stack>

          <Stack direction="column" spacing={4}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Secondary Button
            </Typography>
            <Stack spacing={3} direction="row" alignItems="center">
              <ColorPicker
                label="Background Color"
                value={themeConfig.secondaryButton.backgroundColor}
                onChange={(value) => updateSecondaryButtonConfig('backgroundColor', value)}
              />

              <ColorPicker
                label="Text Color"
                value={themeConfig.secondaryButton.textColor}
                onChange={(value) => updateSecondaryButtonConfig('textColor', value)}
              />

              <ColorPicker
                label="Border Color"
                value={themeConfig.secondaryButton.borderColor}
                onChange={(value) => updateSecondaryButtonConfig('borderColor', value)}
              />

              <TextField
                label="Border Radius"
                value={themeConfig.secondaryButton.borderRadius}
                onChange={(e) => updateSecondaryButtonConfig('borderRadius', e.target.value)}
                size="small"
              />
            </Stack>
          </Stack>

          <Stack direction="row" spacing={4} justifyContent="center">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minHeight: 100 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: themeConfig.button.backgroundColor,
                  color: themeConfig.button.textColor,
                  borderRadius: themeConfig.button.borderRadius,
                  '&:hover': {
                    backgroundColor: themeConfig.button.backgroundColor,
                    opacity: 0.9,
                  },
                }}
              >
                Primary Button
              </Button>
              <Button
                variant="outlined"
                sx={{
                  backgroundColor: themeConfig.secondaryButton.backgroundColor,
                  borderColor: themeConfig.secondaryButton.borderColor,
                  color: themeConfig.secondaryButton.textColor,
                  borderRadius: themeConfig.secondaryButton.borderRadius,
                  '&:hover': {
                    borderColor: themeConfig.secondaryButton.borderColor,
                    backgroundColor: `${themeConfig.secondaryButton.borderColor}10`,
                  },
                }}
              >
                Secondary Button
              </Button>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
