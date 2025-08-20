'use client';

import {
  Box,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { Header } from '../../components/Header';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

export default function AnnouncementsPage() {
  const router = useRouter();
  const accountId = 'account_1';

  const {
    announcements,
    isLoading,
    error,
  } = useAnnouncements(accountId);

  const handleRowClick = (params: GridRowParams) => {
    console.log('Row clicked:', params.row);
    console.log('Navigating to:', `/announcements/${params.row.id}`);
    router.push(`/announcements/${params.row.id}`);
  };

  const handleCreateNew = () => {
    router.push('/announcements/new');
  };

  console.log('Announcements data:', announcements);

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'message',
      headerName: 'Message',
      flex: 1,
      minWidth: 300,
      renderCell: (params) => {
        const message = params.value as string;
        return (
          <Typography
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
            }}
          >
            {message}
          </Typography>
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 150,
      renderCell: (params) => {
        return dayjs(params.value).format('MMM DD, YYYY');
      },
    },
    {
      field: 'publishedAt',
      headerName: 'Published',
      width: 150,
      renderCell: (params) => {
        if (!params.value) return 'Not published';
        return dayjs(params.value).format('MMM DD, YYYY');
      },
    },
    {
      field: 'draft',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => {
        const isDraft = params.value as boolean;
        return (
          <Typography
            sx={{
              color: isDraft ? 'warning.main' : 'success.main',
              fontWeight: 500,
            }}
          >
            {isDraft ? 'Draft' : 'Published'}
          </Typography>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <Box sx={{ p: 4, pl: 6 }}>
        <Header
          title="Announcements"
          subtitle="Manage your user announcements."
        />
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Typography>Loading announcements...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, pl: 6 }}>
        <Header
          title="Announcements"
          subtitle="Manage your user announcements."
        />
        <Box sx={{ mt: 4 }}>
          <Typography color="error">
            Error loading announcements: {error.message}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, pl: 6 }}>
      <Header
        title="Announcements"
        subtitle="Manage your user announcements."
      />

      <Box sx={{ mt: 4 }}>
        {announcements.length === 0 ? (
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No announcements found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Create your first announcement to get started.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateNew}
            >
              Create Announcement
            </Button>
          </Paper>
        ) : (
          <>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateNew}
              >
                Create Announcement
              </Button>
            </Box>
            <Paper sx={{ height: 600, width: '100%' }}>
              <DataGrid
                rows={announcements}
                columns={columns}
                getRowId={(row) => row.id}
                pageSizeOptions={[10, 25, 50]}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                onRowClick={handleRowClick}
                sx={{
                  '& .MuiDataGrid-row': {
                    cursor: 'pointer',
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              />
            </Paper>
          </>
        )}
      </Box>
    </Box>
  );
}
