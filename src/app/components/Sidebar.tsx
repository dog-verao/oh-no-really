import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  Divider,
  Avatar
} from "@mui/material";
import {
  Campaign as AnnouncementsIcon,
  Palette as ThemesIcon,
  Logout as LogoutIcon
} from "@mui/icons-material";
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  open: boolean;
  onClose?: () => void;
  activeItem?: 'announcements' | 'themes';
  onItemClick?: (item: 'announcements' | 'themes') => void;
}

export const Sidebar = ({

  activeItem = 'announcements',
  onItemClick
}: SidebarProps) => {
  const theme = useTheme();
  const { user, signOut } = useAuth();

  const drawerWidth = 300;

  const menuItems = [
    {
      id: 'announcements' as const,
      label: 'Announcements',
      icon: <AnnouncementsIcon />,
    },
    {
      id: 'themes' as const,
      label: 'Themes',
      icon: <ThemesIcon />,
    },
  ];

  const handleItemClick = (itemId: 'announcements' | 'themes') => {
    onItemClick?.(itemId);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            fontSize: '1.125rem'
          }}
        >
          Notifications.fyi
        </Typography>
      </Box>

      <List sx={{ flex: 1, pt: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} >
            <ListItemButton
              selected={activeItem === item.id}
              onClick={() => handleItemClick(item.id)}
              sx={{
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(0, 123, 255, 0.08)',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 123, 255, 0.12)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: activeItem === item.id ? theme.palette.primary.main : 'inherit',
                  minWidth: 36,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '0.875rem',
                    fontWeight: activeItem === item.id ? 500 : 400,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* User section */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: '0.875rem',
              backgroundColor: theme.palette.primary.main,
            }}
          >
            {user?.email?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ ml: 2, flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                fontSize: '0.875rem',
                color: theme.palette.text.primary,
              }}
            >
              {user?.user_metadata?.name || user?.email}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '0.75rem',
              }}
            >
              {user?.email}
            </Typography>
          </Box>
        </Box>

        <ListItem disablePadding>
          <ListItemButton
            onClick={signOut}
            sx={{
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 36,
                color: theme.palette.text.secondary,
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Sign out"
              sx={{
                '& .MuiListItemText-primary': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.grey[50],
          borderRight: `1px solid ${theme.palette.divider}`,
          borderRadius: 0,
          boxShadow: 'none',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};
