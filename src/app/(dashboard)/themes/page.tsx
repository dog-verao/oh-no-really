'use client';

import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Stack,
  CircularProgress,
  Menu,
  MenuItem,
} from '@mui/material';

import Image from 'next/image';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { Header } from '../../components/Header';
import { useThemeQueries } from '@/hooks/useThemeQueries';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { useState } from 'react';
import { ConfirmationModal } from '../../components/ConfirmationModal';

export default function ThemesPage() {
  const router = useRouter();
  const accountId = 'account_1';
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [themeToDelete, setThemeToDelete] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);

  const {
    themes,
    isLoading,
    error,
    deleteTheme,
    isDeleting,
  } = useThemeQueries(accountId);

  const handleCreateNew = () => {
    router.push('/themes/new');
  };

  const handleViewTheme = (themeId: string) => {
    router.push(`/themes/${themeId}`);
  };

  const handleEditTheme = (themeId: string) => {
    router.push(`/themes/${themeId}/edit`);
  };

  const handleDeleteClick = (themeId: string) => {
    setThemeToDelete(themeId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (themeToDelete) {
      deleteTheme(themeToDelete, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setThemeToDelete(null);
        }
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setThemeToDelete(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, themeId: string) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedThemeId(themeId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedThemeId(null);
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 200,
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
      field: 'updatedAt',
      headerName: 'Updated',
      width: 150,
      renderCell: (params) => {
        return dayjs(params.value).format('MMM DD, YYYY');
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
          title="Themes"
          subtitle="Manage your custom themes."
        />
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Typography>Loading themes...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, pl: 6 }}>
        <Header
          title="Themes"
          subtitle="Manage your custom themes."
        />
        <Box sx={{ mt: 4 }}>
          <Typography color="error">
            Error loading themes: {error.message}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, pl: 6 }}>
      <Header
        title="Themes"
        subtitle="Manage your custom themes."
      />

      <Box sx={{ mt: 4 }}>
        {themes.length === 0 ? (
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
              No themes found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Create your first theme to get started.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Image src="/illustrations/Notion-Icons/Regular/svg/ni-plus.svg" alt="Add" width={20} height={20} />}
              onClick={handleCreateNew}
            >
              Create Theme
            </Button>
          </Paper>
        ) : (
          <>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<Image src="/illustrations/Notion-Icons/Regular/svg/ni-plus.svg" alt="Add" width={20} height={20} />}
                onClick={handleCreateNew}
              >
                Create Theme
              </Button>
            </Box>
            <Paper sx={{ height: 600, width: '100%' }}>
              <DataGrid
                rows={themes}
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
        title="Delete Theme"
        message="Are you sure you want to delete this theme? This action cannot be undone."
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
            if (selectedThemeId) {
              handleViewTheme(selectedThemeId);
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
            if (selectedThemeId) {
              handleEditTheme(selectedThemeId);
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
        <MenuItem
          onClick={() => {
            if (selectedThemeId) {
              handleDeleteClick(selectedThemeId);
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
