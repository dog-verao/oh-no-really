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
  Avatar,
  IconButton,
} from "@mui/material";
import {
  Star,
  LocalOffer,
} from "@mui/icons-material";

import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';


interface SidebarProps {
  open: boolean;
  onClose?: () => void;
  activeItem?: 'modal' | 'tooltip' | 'toast' | 'themes' | 'settings' | 'onboarding' | 'highlights' | 'tags';
  onItemClick?: (item: 'modal' | 'tooltip' | 'toast' | 'themes' | 'settings' | 'onboarding' | 'highlights' | 'tags') => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar = ({
  activeItem = 'modal',
  onItemClick,
  collapsed = false,
  onToggleCollapse
}: SidebarProps) => {
  const theme = useTheme();
  const { user, signOut } = useAuth();

  const drawerWidth = collapsed ? 80 : 300;

  const menuItems = [
    {
      id: 'modal' as const,
      label: 'Modal',
      icon: <Image src="/illustrations/Notion-Icons/Regular/svg/ni-browser.svg" alt="Modal" width={20} height={20} />,
    },
    {
      id: 'tooltip' as const,
      label: 'Tooltip',
      icon: <Image src="/illustrations/Notion-Icons/Regular/svg/tooltip.svg" alt="Tooltip" width={20} height={20} />,
    },
    {
      id: 'toast' as const,
      label: 'Toast',
      icon: <Image src="/illustrations/Notion-Icons/Regular/svg/ni-bell.svg" alt="Toast" width={20} height={20} />,
    },
    {
      id: 'onboarding' as const,
      label: 'Onboarding',
      icon: <Image src="/illustrations/Notion-Icons/Regular/svg/ni-code-slash.svg" alt="onboarding" width={20} height={20} />,
    },
    {
      id: 'highlights' as const,
      label: 'Highlights',
      icon: <Star sx={{ width: 20, height: 20 }} />,
    },
    {
      id: 'tags' as const,
      label: 'Tags',
      icon: <LocalOffer sx={{ width: 20, height: 20 }} />,
    },
    {
      id: 'themes' as const,
      label: 'Themes',
      icon: <Image src="/illustrations/Notion-Icons/Regular/svg/ni-layout-column.svg" alt="Themes" width={20} height={20} />,
    },
    {
      id: 'settings' as const,
      label: 'Configuration',
      icon: <Image src="/illustrations/Notion-Icons/Regular/svg/gear.svg" alt="Configuration" width={20} height={20} />,
    },
  ];

  const handleItemClick = (itemId: 'modal' | 'tooltip' | 'toast' | 'themes' | 'settings' | 'onboarding' | 'highlights' | 'tags') => {
    onItemClick?.(itemId);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}`, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between' }}>
        {!collapsed && (
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
        )}
        <IconButton
          onClick={onToggleCollapse}
          size="small"
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <Image
            src={collapsed ? "/illustrations/Notion-Icons/Regular/svg/bracket-arrow-right.svg" : "/illustrations/Notion-Icons/Regular/svg/bracket-arrow-left.svg"}
            alt={collapsed ? "Expand" : "Collapse"}
            width={20}
            height={20}
          />
        </IconButton>
      </Box>

      <List sx={{ flex: 1, pt: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} >
            <ListItemButton
              selected={activeItem === item.id}
              onClick={() => handleItemClick(item.id)}
              sx={{
                borderRadius: 1,
                justifyContent: collapsed ? 'center' : 'flex-start',
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
                  minWidth: collapsed ? 0 : 36,
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: '0.875rem',
                      fontWeight: activeItem === item.id ? 500 : 400,
                    },
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        {!collapsed && (
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
        )}

        <ListItem disablePadding>
          <ListItemButton
            onClick={signOut}
            sx={{
              borderRadius: 1,
              justifyContent: collapsed ? 'center' : 'flex-start',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed ? 0 : 36,
                color: theme.palette.text.secondary,
              }}
            >
              <Image src="/illustrations/Notion-Icons/Regular/svg/ni-power-off.svg" alt="Sign out" width={20} height={20} />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary="Sign out"
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '0.875rem',
                  },
                }}
              />
            )}
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
