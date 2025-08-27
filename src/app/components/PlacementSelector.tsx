'use client';

import {
  Box,
  Typography,
  Stack,
  Paper,
} from '@mui/material';
import Image from 'next/image';

export type PlacementType = 'modal' | 'toast' | 'tooltip';

interface PlacementOption {
  id: PlacementType;
  label: string;
  icon: string;
  description: string;
}

const placementOptions: PlacementOption[] = [
  {
    id: 'modal',
    label: 'Modal',
    icon: '/illustrations/Notion-Icons/Regular/svg/ni-browser.svg',
    description: 'Centered overlay that blocks interaction',
  },
  {
    id: 'toast',
    label: 'Toast',
    icon: '/illustrations/Notion-Icons/Regular/svg/ni-bell.svg',
    description: 'Non-intrusive notification in corner',
  },
  {
    id: 'tooltip',
    label: 'Tooltip',
    icon: '/illustrations/Notion-Icons/Regular/svg/messages-arrow-up-left.svg',
    description: 'Side panel that slides in when clicked',
  },

];

interface PlacementSelectorProps {
  value: PlacementType;
  onChange: (placement: PlacementType) => void;
  disabled?: boolean;
}

export function PlacementSelector({ value, onChange, disabled = false }: PlacementSelectorProps) {
  return (
    <Stack spacing={2}>
      <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
        Placement
      </Typography>
      <Stack direction="row" spacing={2}>
        {placementOptions.map((option) => (
          <Paper
            key={option.id}
            variant="outlined"
            sx={{
              p: 2,
              cursor: disabled ? 'default' : 'pointer',
              border: value === option.id ? '2px solid' : '1px solid',
              borderColor: value === option.id ? 'primary.main' : 'divider',
              backgroundColor: value === option.id ? 'primary.50' : 'background.paper',
              transition: 'all 0.2s ease',
              '&:hover': disabled ? {} : {
                borderColor: 'primary.main',
                backgroundColor: 'primary.50',
              },
              minWidth: 120,
              textAlign: 'center',
            }}
            onClick={() => !disabled && onChange(option.id)}
          >
            <Stack spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1,
                  backgroundColor: value === option.id ? 'primary.main' : 'grey.100',
                  color: value === option.id ? 'white' : 'text.primary',
                }}
              >
                <Image
                  src={option.icon}
                  alt={option.label}
                  width={24}
                  height={24}
                  style={{
                    filter: value === option.id ? 'brightness(0) invert(1)' : 'none',
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: value === option.id ? 600 : 400,
                  color: value === option.id ? 'primary.main' : 'text.primary',
                }}
              >
                {option.label}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}
              >
                {option.description}
              </Typography>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
}
