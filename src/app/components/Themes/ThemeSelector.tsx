'use client';

import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import { useThemeQueries } from '@/hooks/useThemeQueries';
import { Theme } from '@/hooks/useThemeQueries';
import { useState, useEffect } from 'react';

interface ThemeSelectorProps {
  value: string | null;
  onChange: (themeId: string | null) => void;
  accountId: string;
  disabled?: boolean;
}

export function ThemeSelector({ value, onChange, accountId, disabled = false }: ThemeSelectorProps) {
  const { themes, isLoading } = useThemeQueries(accountId);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);

  // Find the selected theme based on value
  useEffect(() => {
    if (value) {
      const theme = themes.find(t => t.id === value);
      setSelectedTheme(theme || null);
    } else {
      setSelectedTheme(null);
    }
  }, [value, themes]);

  const handleThemeChange = (theme: Theme | null) => {
    setSelectedTheme(theme);
    onChange(theme?.id || null);
  };

  return (
    <Autocomplete
      options={themes}
      getOptionLabel={(option) => option.name}
      value={selectedTheme}
      onChange={(_, newValue) => handleThemeChange(newValue)}
      loading={isLoading}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Theme"
          placeholder="Select a theme"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {option.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Created {new Date(option.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      )}
      noOptionsText="No themes available"
      loadingText="Loading themes..."
    />
  );
}
