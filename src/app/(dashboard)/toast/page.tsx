'use client';

import {
  Box,
  Button,
  Typography,
  IconButton,
  Stack,
  Menu,
  MenuItem,
  Chip,
  CircularProgress,
} from '@mui/material';

import Image from 'next/image';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { Header } from '../../components/Header';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useCurrentAccount } from '@/hooks/useCurrentAccount';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { useState } from 'react';
import { ConfirmationModal } from '../../components/ConfirmationModal';

export default function AnnouncementsPage() {
  const router = useRouter();
  const { account, isLoading: isLoadingAccount } = useCurrentAccount();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<string | null>(null);

  const {
    announcements,
    isLoading: isLoadingAnnouncements,
    error,
    deleteAnnouncement,
    isDeleting,
    publishAnnouncement,
  } = useAnnouncements(account?.id || '', 'toast');

  const isLoading = isLoadingAccount || isLoadingAnnouncements;

  const handleRowClick = (params: GridRowParams) => {
    router.push(`/toast/${params.row.id}`);
  };

  const handleCreateNew = () => {
    router.push('/toast/new');
  };

  const handleViewAnnouncement = (announcementId: string) => {
    router.push(`/toast/${announcementId}`);
  };

  const handleEditAnnouncement = (announcementId: string) => {
    router.push(`/toast/${announcementId}/edit`);
  };

  const handlePublishAnnouncement = (announcementId: string) => {
    publishAnnouncement(announcementId);
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, announcementId: string) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedAnnouncementId(announcementId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedAnnouncementId(null);
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
          <Stack direction="row" spacing={1}>
            {message.slice(0, 100)}...
          </Stack>
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
          <Chip
            variant="outlined"
            label={isDraft ? 'Draft' : 'Published'}
            color={isDraft ? 'warning' : 'success'}
            size="small"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          />
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => {
        return (
          <IconButton
            size="small"
            onClick={(e) => handleMenuOpen(e, params.row.id)}
            sx={{
              transform: 'rotate(90deg)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <Image
              src="/illustrations/Notion-Icons/Regular/svg/ni-ellipsis-fill.svg"
              alt="Actions"
              width={16}
              height={16}
            />
          </IconButton>
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
          <CircularProgress size={58} />
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Toast
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your toast announcements.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Image src="/illustrations/Notion-Icons/Regular/svg/ni-plus.svg" alt="Add" width={20} height={20} />}
          onClick={handleCreateNew}
        >
          Create Toast
        </Button>
      </Box>

      <Box>
        {announcements.length === 0 ? (
          <Box
            sx={{
              p: 6,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              backgroundColor: 'background.paper',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No toast announcements found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Create your first toast announcement to get started.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Image src="/illustrations/Notion-Icons/Regular/svg/ni-plus.svg" alt="Add" width={20} height={20} style={{ filter: 'brightness(0) invert(1)' }} />}
              onClick={handleCreateNew}
            >
              Create Toast
            </Button>
          </Box>
        ) : (
          <Box sx={{ height: 600, width: '100%', backgroundColor: 'background.paper', borderRadius: 2 }}>
            <DataGrid
              rows={announcements}
              columns={columns}
              onRowClick={handleRowClick}
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
                border: 'none',
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                },
                '& .MuiDataGrid-columnHeaders': {
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                },
              }}
            />
          </Box>
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

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem
          onClick={() => {
            if (selectedAnnouncementId) {
              handleViewAnnouncement(selectedAnnouncementId);
            }
            handleMenuClose();
          }}
        >
          <Image
            src="/illustrations/Notion-Icons/Regular/svg/ni-full-page.svg"
            alt="View"
            width={16}
            height={16}
            style={{ marginRight: 8 }}
          />
          View
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedAnnouncementId) {
              handleEditAnnouncement(selectedAnnouncementId);
            }
            handleMenuClose();
          }}
        >
          <Image
            src="/illustrations/Notion-Icons/Regular/svg/ni-pencil.svg"
            alt="Edit"
            width={16}
            height={16}
            style={{ marginRight: 8 }}
          />
          Edit
        </MenuItem>
        {selectedAnnouncementId && announcements.find(a => a.id === selectedAnnouncementId)?.draft && (
          <MenuItem
            onClick={() => {
              if (selectedAnnouncementId) {
                handlePublishAnnouncement(selectedAnnouncementId);
              }
              handleMenuClose();
            }}
            sx={{ color: 'success.main' }}
          >
            <Image
              src="/illustrations/Notion-Icons/Regular/svg/ni-rocket.svg"
              alt="Publish"
              width={16}
              height={16}
              style={{ marginRight: 8 }}
            />
            Publish
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            if (selectedAnnouncementId) {
              handleDeleteClick(selectedAnnouncementId);
            }
            handleMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Image
            src="/illustrations/Notion-Icons/Regular/svg/ni-delete-left.svg"
            alt="Delete"
            width={16}
            height={16}
            style={{ marginRight: 8 }}
          />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
}
