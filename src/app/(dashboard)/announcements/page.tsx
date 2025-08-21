'use client';

import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Stack,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { Header } from '../../components/Header';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { useState } from 'react';
import { ConfirmationModal } from '../../components/ConfirmationModal';

export default function AnnouncementsPage() {
  const router = useRouter();
  const accountId = 'account_1';
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null);

  const {
    announcements,
    isLoading,
    error,
    deleteAnnouncement,
    isDeleting,
  } = useAnnouncements(accountId);

  const handleRowClick = (params: GridRowParams) => {
    router.push(`/announcements/${params.row.id}`);
  };

  const handleCreateNew = () => {
    router.push('/announcements/new');
  };

  const handleViewAnnouncement = (announcementId: string) => {
    router.push(`/announcements/${announcementId}`);
  };

  const handleEditAnnouncement = (announcementId: string) => {
    router.push(`/announcements/${announcementId}/edit`);
  };

  const handleDeleteClick = (announcementId: string) => {
    setAnnouncementToDelete(announcementId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (announcementToDelete) {
      deleteAnnouncement(announcementToDelete, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setAnnouncementToDelete(null);
        }
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setAnnouncementToDelete(null);
  };

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
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={1}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleViewAnnouncement(params.row.id);
              }}
              sx={{ color: 'primary.main' }}
            >
              <ViewIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleEditAnnouncement(params.row.id);
              }}
              sx={{ color: 'warning.main' }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(params.row.id);
              }}
              disabled={isDeleting}
              sx={{ color: 'error.main' }}
            >
              {isDeleting ? (
                <CircularProgress size={16} />
              ) : (
                <DeleteIcon />
              )}
            </IconButton>
          </Stack>
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
                sx={{
                  '& .MuiDataGrid-row': {
                    cursor: 'default',
                  },
                }}
              />
            </Paper>
          </>
        )}
      </Box>

      <ConfirmationModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Announcement"
        message="Are you sure you want to delete this announcement? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        severity="warning"
      />
    </Box>
  );
}
