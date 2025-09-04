'use client';

import {
  Box,
  Stack,
  Typography,
  TextField,
  Paper,
  Button,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { ColorPicker } from './ColorPicker';
import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Theme, CreateThemeData, UpdateThemeData } from '@/hooks/useThemeQueries';

interface ThemeFormProps {
  mode: 'create' | 'edit';
  initialData?: Theme;
  onSubmit: (data: CreateThemeData | UpdateThemeData) => Promise<void>;
  onCancel?: () => void;
  isSubmitting: boolean;
  error?: Error | null;
  successMessage?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`theme-tabpanel-${index}`}
      aria-labelledby={`theme-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `theme-tab-${index}`,
    'aria-controls': `theme-tabpanel-${index}`,
  };
}

export function ThemeForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  error,
  successMessage,
}: ThemeFormProps) {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const [name, setName] = useState(initialData?.name || '');
  const [themeConfig, setThemeConfig] = useState({
    modal: {
      backgroundColor: initialData?.config.modal?.backgroundColor || '#ffffff',
      borderRadius: initialData?.config.modal?.borderRadius || '12px',
      titleColor: initialData?.config.modal?.titleColor || '#1a1a1a',
    },
    tooltip: {
      backgroundColor: initialData?.config.tooltip?.backgroundColor || '#333333',
      textColor: initialData?.config.tooltip?.textColor || '#ffffff',
      borderRadius: initialData?.config.tooltip?.borderRadius || '8px',
    },
    toast: {
      backgroundColor: initialData?.config.toast?.backgroundColor || '#ffffff',
      textColor: initialData?.config.toast?.textColor || '#1a1a1a',
      borderRadius: initialData?.config.toast?.borderRadius || '8px',
      borderColor: initialData?.config.toast?.borderColor || '#e0e0e0',
    },
    highlights: {
      backgroundColor: initialData?.config.highlights?.backgroundColor || '#1976d2',
      size: initialData?.config.highlights?.size || 35,
      animationDuration: initialData?.config.highlights?.animationDuration || 2,
    },
    tags: {
      backgroundColor: initialData?.config.tags?.backgroundColor || '#1976d2',
      textColor: initialData?.config.tags?.textColor || '#ffffff',
      borderRadius: initialData?.config.tags?.borderRadius || '16px',
    },
    onboarding: {
      backgroundColor: initialData?.config.onboarding?.backgroundColor || '#ffffff',
      textColor: initialData?.config.onboarding?.textColor || '#1a1a1a',
      borderRadius: initialData?.config.onboarding?.borderRadius || '12px',
    },
    checklist: {
      backgroundColor: initialData?.config.checklist?.backgroundColor || '#ffffff',
      textColor: initialData?.config.checklist?.textColor || '#1a1a1a',
      borderRadius: initialData?.config.checklist?.borderRadius || '8px',
      checkboxColor: initialData?.config.checklist?.checkboxColor || '#1976d2',
    },
    button: {
      backgroundColor: initialData?.config.button?.backgroundColor || '#007bff',
      textColor: initialData?.config.button?.textColor || '#ffffff',
      borderRadius: initialData?.config.button?.borderRadius || '8px',
    },
    secondaryButton: {
      backgroundColor: initialData?.config.secondaryButton?.backgroundColor || '#ffffff',
      textColor: initialData?.config.secondaryButton?.textColor || '#007bff',
      borderColor: initialData?.config.secondaryButton?.borderColor || '#007bff',
      borderRadius: initialData?.config.secondaryButton?.borderRadius || '8px',
    },
  });

  // Sync edit state with element prop changes only when component first mounts or after saving
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const updateConfig = (section: keyof typeof themeConfig, field: string, value: string | number) => {
    setThemeConfig(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleSubmit = useCallback(async () => {
    if (!name.trim()) return;

    try {
      const data = {
        name: name.trim(),
        config: themeConfig,
        ...(mode === 'edit' && { id: initialData!.id }),
      };

      await onSubmit(data as CreateThemeData | UpdateThemeData);

      if (mode === 'create') {
        setShowSuccess(true);
        // Reset form for create mode
        setName('');
        setThemeConfig({
          modal: { backgroundColor: '#ffffff', borderRadius: '12px', titleColor: '#1a1a1a' },
          tooltip: { backgroundColor: '#333333', textColor: '#ffffff', borderRadius: '8px' },
          toast: { backgroundColor: '#ffffff', textColor: '#1a1a1a', borderRadius: '8px', borderColor: '#e0e0e0' },
          highlights: { backgroundColor: '#1976d2', size: 35, animationDuration: 2 },
          tags: { backgroundColor: '#1976d2', textColor: '#ffffff', borderRadius: '16px' },
          onboarding: { backgroundColor: '#ffffff', textColor: '#1a1a1a', borderRadius: '12px' },
          checklist: { backgroundColor: '#ffffff', textColor: '#1a1a1a', borderRadius: '8px', checkboxColor: '#1976d2' },
          button: { backgroundColor: '#007bff', textColor: '#ffffff', borderRadius: '8px' },
          secondaryButton: { backgroundColor: '#ffffff', textColor: '#007bff', borderColor: '#007bff', borderRadius: '8px' },
        });
      } else {
        setShowSuccess(true);
      }
    } catch (error) {
      console.error('Failed to submit theme:', error);
    }
  }, [name, themeConfig, onSubmit, mode, initialData]);

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    } else {
      router.push('/themes');
    }
  }, [onCancel, router]);

  const isFormValid = useMemo(() => {
    return name.trim();
  }, [name]);

  const title = mode === 'create' ? 'Create Theme' : 'Update Theme';
  const subtitle = mode === 'create'
    ? 'Set up your custom theme configuration.'
    : 'Update your theme settings.';
  const submitButtonText = isSubmitting
    ? (mode === 'create' ? 'Creating...' : 'Saving...')
    : (mode === 'create' ? 'Create Theme' : 'Save Changes');

  const tabs = [
    { label: 'Modal', index: 0 },
    { label: 'Tooltip', index: 1 },
    { label: 'Toast', index: 2 },
    { label: 'Highlights', index: 3 },
    { label: 'Tags', index: 4 },
    { label: 'Onboarding', index: 5 },
    { label: 'Checklist', index: 6 },
    { label: 'Buttons', index: 7 },
  ];

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 4, pl: 6, pb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {subtitle}
        </Typography>

        <TextField
          fullWidth
          label="Theme Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter theme name"
          helperText="Give your theme a descriptive name"
        />
      </Box>

      <Box sx={{ p: 2, pl: 3, pb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minHeight: 48,
              textTransform: 'none',
              fontWeight: 500,
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.index} label={tab.label} {...a11yProps(tab.index)} />
          ))}
        </Tabs>
      </Box>
      <Box sx={{ flex: 1, overflow: 'auto', px: 6 }}>
        <Box>

          {/* Modal Tab */}
          <TabPanel value={activeTab} index={0}>
            <Stack spacing={4}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Modal Configuration
              </Typography>
              <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap" gap={2}>
                <ColorPicker
                  label="Background Color"
                  value={themeConfig.modal.backgroundColor}
                  onChange={(value) => updateConfig('modal', 'backgroundColor', value)}
                />
                <TextField
                  label="Border Radius"
                  value={themeConfig.modal.borderRadius}
                  onChange={(e) => updateConfig('modal', 'borderRadius', e.target.value)}
                  size="small"
                />
                <ColorPicker
                  label="Title Color"
                  value={themeConfig.modal.titleColor}
                  onChange={(value) => updateConfig('modal', 'titleColor', value)}
                />
              </Stack>
              <Paper
                elevation={2}
                sx={{
                  backgroundColor: themeConfig.modal.backgroundColor,
                  borderRadius: themeConfig.modal.borderRadius,
                  p: 3,
                  maxWidth: 300,
                  alignSelf: 'center',
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
              </Paper>
            </Stack>
          </TabPanel>

          {/* Tooltip Tab */}
          <TabPanel value={activeTab} index={1}>
            <Stack spacing={4}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Tooltip Configuration
              </Typography>
              <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap" gap={2}>
                <ColorPicker
                  label="Background Color"
                  value={themeConfig.tooltip.backgroundColor}
                  onChange={(value) => updateConfig('tooltip', 'backgroundColor', value)}
                />
                <ColorPicker
                  label="Text Color"
                  value={themeConfig.tooltip.textColor}
                  onChange={(value) => updateConfig('tooltip', 'textColor', value)}
                />
                <TextField
                  label="Border Radius"
                  value={themeConfig.tooltip.borderRadius}
                  onChange={(e) => updateConfig('tooltip', 'borderRadius', e.target.value)}
                  size="small"
                />
              </Stack>
              <Paper
                elevation={2}
                sx={{
                  backgroundColor: themeConfig.tooltip.backgroundColor,
                  color: themeConfig.tooltip.textColor,
                  borderRadius: themeConfig.tooltip.borderRadius,
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
                    borderTop: `8px solid ${themeConfig.tooltip.backgroundColor}`,
                  },
                }}
              >
                <Typography variant="body2">
                  Tooltip preview
                </Typography>
              </Paper>
            </Stack>
          </TabPanel>

          {/* Toast Tab */}
          <TabPanel value={activeTab} index={2}>
            <Stack spacing={4}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Toast Configuration
              </Typography>
              <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap" gap={2}>
                <ColorPicker
                  label="Background Color"
                  value={themeConfig.toast.backgroundColor}
                  onChange={(value) => updateConfig('toast', 'backgroundColor', value)}
                />
                <ColorPicker
                  label="Text Color"
                  value={themeConfig.toast.textColor}
                  onChange={(value) => updateConfig('toast', 'textColor', value)}
                />
                <TextField
                  label="Border Radius"
                  value={themeConfig.toast.borderRadius}
                  onChange={(e) => updateConfig('toast', 'borderRadius', e.target.value)}
                  size="small"
                />
                <ColorPicker
                  label="Border Color"
                  value={themeConfig.toast.borderColor}
                  onChange={(value) => updateConfig('toast', 'borderColor', value)}
                />
              </Stack>
              <Paper
                elevation={2}
                sx={{
                  backgroundColor: themeConfig.toast.backgroundColor,
                  color: themeConfig.toast.textColor,
                  borderRadius: themeConfig.toast.borderRadius,
                  border: `1px solid ${themeConfig.toast.borderColor}`,
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
          </TabPanel>

          {/* Highlights Tab */}
          <TabPanel value={activeTab} index={3}>
            <Stack spacing={4}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Highlights Configuration
              </Typography>
              <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap" gap={2}>
                <ColorPicker
                  label="Background Color"
                  value={themeConfig.highlights.backgroundColor}
                  onChange={(value) => updateConfig('highlights', 'backgroundColor', value)}
                />
                <TextField
                  label="Size (px)"
                  type="number"
                  value={themeConfig.highlights.size}
                  onChange={(e) => updateConfig('highlights', 'size', parseInt(e.target.value))}
                  size="small"
                  inputProps={{ min: 10, max: 100 }}
                />
                <TextField
                  label="Animation Duration (s)"
                  type="number"
                  value={themeConfig.highlights.animationDuration}
                  onChange={(e) => updateConfig('highlights', 'animationDuration', parseFloat(e.target.value))}
                  size="small"
                  inputProps={{ min: 0.5, max: 5, step: 0.1 }}
                />
              </Stack>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box
                  sx={{
                    width: themeConfig.highlights.size,
                    height: themeConfig.highlights.size,
                    backgroundColor: themeConfig.highlights.backgroundColor,
                    borderRadius: '50%',
                    animation: `pulse ${themeConfig.highlights.animationDuration}s infinite`,
                    '@keyframes pulse': {
                      '0%': { opacity: 1 },
                      '50%': { opacity: 0.5 },
                      '100%': { opacity: 1 },
                    },
                  }}
                />
              </Box>
            </Stack>
          </TabPanel>

          {/* Tags Tab */}
          <TabPanel value={activeTab} index={4}>
            <Stack spacing={4}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Tags Configuration
              </Typography>
              <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap" gap={2}>
                <ColorPicker
                  label="Background Color"
                  value={themeConfig.tags.backgroundColor}
                  onChange={(value) => updateConfig('tags', 'backgroundColor', value)}
                />
                <ColorPicker
                  label="Text Color"
                  value={themeConfig.tags.textColor}
                  onChange={(value) => updateConfig('tags', 'textColor', value)}
                />
                <TextField
                  label="Border Radius"
                  value={themeConfig.tags.borderRadius}
                  onChange={(e) => updateConfig('tags', 'borderRadius', e.target.value)}
                  size="small"
                />
              </Stack>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box
                  sx={{
                    backgroundColor: themeConfig.tags.backgroundColor,
                    color: themeConfig.tags.textColor,
                    borderRadius: themeConfig.tags.borderRadius,
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
          </TabPanel>

          {/* Onboarding Tab */}
          <TabPanel value={activeTab} index={5}>
            <Stack spacing={4}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Onboarding Configuration
              </Typography>
              <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap" gap={2}>
                <ColorPicker
                  label="Background Color"
                  value={themeConfig.onboarding.backgroundColor}
                  onChange={(value) => updateConfig('onboarding', 'backgroundColor', value)}
                />
                <ColorPicker
                  label="Text Color"
                  value={themeConfig.onboarding.textColor}
                  onChange={(value) => updateConfig('onboarding', 'textColor', value)}
                />
                <TextField
                  label="Border Radius"
                  value={themeConfig.onboarding.borderRadius}
                  onChange={(e) => updateConfig('onboarding', 'borderRadius', e.target.value)}
                  size="small"
                />
              </Stack>
              <Paper
                elevation={2}
                sx={{
                  backgroundColor: themeConfig.onboarding.backgroundColor,
                  color: themeConfig.onboarding.textColor,
                  borderRadius: themeConfig.onboarding.borderRadius,
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
          </TabPanel>

          {/* Checklist Tab */}
          <TabPanel value={activeTab} index={6}>
            <Stack spacing={4}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Checklist Configuration
              </Typography>
              <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap" gap={2}>
                <ColorPicker
                  label="Background Color"
                  value={themeConfig.checklist.backgroundColor}
                  onChange={(value) => updateConfig('checklist', 'backgroundColor', value)}
                />
                <ColorPicker
                  label="Text Color"
                  value={themeConfig.checklist.textColor}
                  onChange={(value) => updateConfig('checklist', 'textColor', value)}
                />
                <TextField
                  label="Border Radius"
                  value={themeConfig.checklist.borderRadius}
                  onChange={(e) => updateConfig('checklist', 'borderRadius', e.target.value)}
                  size="small"
                />
                <ColorPicker
                  label="Checkbox Color"
                  value={themeConfig.checklist.checkboxColor}
                  onChange={(value) => updateConfig('checklist', 'checkboxColor', value)}
                />
              </Stack>
              <Paper
                elevation={2}
                sx={{
                  backgroundColor: themeConfig.checklist.backgroundColor,
                  color: themeConfig.checklist.textColor,
                  borderRadius: themeConfig.checklist.borderRadius,
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
                        border: `2px solid ${themeConfig.checklist.checkboxColor}`,
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
                          backgroundColor: themeConfig.checklist.checkboxColor,
                          borderRadius: 0.5,
                        }}
                      />
                    </Box>
                    <Typography variant="body2">Completed task</Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </TabPanel>

          {/* Buttons Tab */}
          <TabPanel value={activeTab} index={7}>
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
                    value={themeConfig.button.backgroundColor}
                    onChange={(value) => updateConfig('button', 'backgroundColor', value)}
                  />
                  <ColorPicker
                    label="Text Color"
                    value={themeConfig.button.textColor}
                    onChange={(value) => updateConfig('button', 'textColor', value)}
                  />
                  <TextField
                    label="Border Radius"
                    value={themeConfig.button.borderRadius}
                    onChange={(e) => updateConfig('button', 'borderRadius', e.target.value)}
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
                    value={themeConfig.secondaryButton.backgroundColor}
                    onChange={(value) => updateConfig('secondaryButton', 'backgroundColor', value)}
                  />
                  <ColorPicker
                    label="Text Color"
                    value={themeConfig.secondaryButton.textColor}
                    onChange={(value) => updateConfig('secondaryButton', 'textColor', value)}
                  />
                  <ColorPicker
                    label="Border Color"
                    value={themeConfig.secondaryButton.borderColor}
                    onChange={(value) => updateConfig('secondaryButton', 'borderColor', value)}
                  />
                  <TextField
                    label="Border Radius"
                    value={themeConfig.secondaryButton.borderRadius}
                    onChange={(e) => updateConfig('secondaryButton', 'borderRadius', e.target.value)}
                    size="small"
                  />
                </Stack>
              </Stack>

              {/* Button Preview */}
              <Stack direction="row" spacing={4} justifyContent="center">
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
              </Stack>
            </Stack>
          </TabPanel>
        </Box>
      </Box>

      {/* Sticky Action Buttons */}
      <Box sx={{ p: 4, pl: 6, pt: 2, borderTop: 1, borderColor: 'divider', backgroundColor: 'background.paper' }}>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={handleCancel}
            sx={{ minWidth: 120 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{ minWidth: 120 }}
            onClick={handleSubmit}
            disabled={isSubmitting || !isFormValid}
          >
            {submitButtonText}
          </Button>
        </Stack>
      </Box>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
          {successMessage || (mode === 'create' ? 'Theme created successfully!' : 'Theme updated successfully!')}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => { }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          Failed to {mode === 'create' ? 'create' : 'update'} theme. Please try again.
        </Alert>
      </Snackbar>
    </Box>
  );
}
