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
import { useCurrentAccount } from '@/hooks/useCurrentAccount';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { useState } from 'react';
import { ConfirmationModal } from '../../components/ConfirmationModal';

export default function ThemesPage() {
  const router = useRouter();
  const { account, isLoading: isLoadingAccount } = useCurrentAccount();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [themeToDelete, setThemeToDelete] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);

  const {
    themes,
    isLoading: isLoadingThemes,
    error,
    deleteTheme,
    isDeleting,
  } = useThemeQueries(account?.id || '');

  const isLoading = isLoadingAccount || isLoadingThemes;

  const handleCreateNew = () => {
    router.push('/themes/new');
  };

  const handleViewTheme = (themeId: string) => {
    router.push(`/themes/${themeId}/edit`);
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
      <Box sx={{ p: 4, pl: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={58} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, pl: 6 }}>
        <Typography color="error">
          Error loading themes: {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, pl: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Themes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your custom themes.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Image src="/illustrations/Notion-Icons/Regular/svg/ni-plus.svg" alt="Add" width={20} height={20} />}
          onClick={handleCreateNew}
        >
          Create Theme
        </Button>
      </Box>

      <Box>
        {themes.length === 0 ? (
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
              No themes found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Create your first theme to get started.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Image src="/illustrations/Notion-Icons/Regular/svg/ni-plus.svg" alt="Add" width={20} height={20} style={{ filter: 'brightness(0) invert(1)' }} />}
              onClick={handleCreateNew}
            >
              Create Theme
            </Button>
          </Box>
        ) : (
          <Box sx={{ height: 600, width: '100%', backgroundColor: 'background.paper', borderRadius: 2 }}>
            <DataGrid
              rows={themes}
              columns={columns}
              onRowClick={(params) => handleViewTheme(params.row.id)}
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
