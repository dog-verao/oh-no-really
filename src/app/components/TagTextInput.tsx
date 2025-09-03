'use client';

import { TextField } from '@mui/material';

interface TagTextInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export default function TagTextInput({ value, onChange, error }: TagTextInputProps) {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      label="Tag Text"
      placeholder="Enter tag text..."
      size="small"
      fullWidth
      error={error}
      helperText={error ? 'Tag text is required' : `${value.length}/50 characters`}
      inputProps={{ maxLength: 50 }}
      sx={{ mb: 2 }}
    />
  );
}
