'use client';

import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Theme, CreateThemeData, UpdateThemeData } from '@/hooks/useThemeQueries';
import {
  ModalThemeTab,
  TooltipThemeTab,
  ToastThemeTab,
  HighlightsThemeTab,
  TagsThemeTab,
  OnboardingThemeTab,
  ChecklistThemeTab,
  ButtonsThemeTab,
} from './index';

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const updateConfig = (section: keyof typeof themeConfig, field: string, value: string | number) => {
    setThemeConfig(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const updateButtonConfig = (section: 'button' | 'secondaryButton', field: string, value: string) => {
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
      {/* Header Section */}
      <Box sx={{ p: 4, pl: 6, pb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {subtitle}
        </Typography>

        {/* Theme Name */}
        <TextField
          fullWidth
          label="Theme Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter theme name"
          helperText="Give your theme a descriptive name"
          sx={{ maxWidth: 600 }}
        />
      </Box>

      {/* Scrollable Content */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 6 }}>
        {/* Tabs Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
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

          {/* Modal Tab */}
          <TabPanel value={activeTab} index={0}>
            <ModalThemeTab
              config={themeConfig.modal}
              onUpdate={(field, value) => updateConfig('modal', field, value)}
            />
          </TabPanel>

          {/* Tooltip Tab */}
          <TabPanel value={activeTab} index={1}>
            <TooltipThemeTab
              config={themeConfig.tooltip}
              onUpdate={(field, value) => updateConfig('tooltip', field, value)}
            />
          </TabPanel>

          {/* Toast Tab */}
          <TabPanel value={activeTab} index={2}>
            <ToastThemeTab
              config={themeConfig.toast}
              onUpdate={(field, value) => updateConfig('toast', field, value)}
            />
          </TabPanel>

          {/* Highlights Tab */}
          <TabPanel value={activeTab} index={3}>
            <HighlightsThemeTab
              config={themeConfig.highlights}
              onUpdate={(field, value) => updateConfig('highlights', field, value)}
            />
          </TabPanel>

          {/* Tags Tab */}
          <TabPanel value={activeTab} index={4}>
            <TagsThemeTab
              config={themeConfig.tags}
              onUpdate={(field, value) => updateConfig('tags', field, value)}
            />
          </TabPanel>

          {/* Onboarding Tab */}
          <TabPanel value={activeTab} index={5}>
            <OnboardingThemeTab
              config={themeConfig.onboarding}
              onUpdate={(field, value) => updateConfig('onboarding', field, value)}
            />
          </TabPanel>

          {/* Checklist Tab */}
          <TabPanel value={activeTab} index={6}>
            <ChecklistThemeTab
              config={themeConfig.checklist}
              onUpdate={(field, value) => updateConfig('checklist', field, value)}
            />
          </TabPanel>

          {/* Buttons Tab */}
          <TabPanel value={activeTab} index={7}>
            <ButtonsThemeTab
              config={themeConfig}
              onUpdate={updateButtonConfig}
            />
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
