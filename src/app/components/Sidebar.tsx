import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme
} from "@mui/material";
import {
  Campaign as AnnouncementsIcon,
  Palette as ThemesIcon
} from "@mui/icons-material";

interface SidebarProps {
  open: boolean;
  onClose?: () => void;
  activeItem?: 'announcements' | 'themes';
  onItemClick?: (item: 'announcements' | 'themes') => void;
}

export const Sidebar = ({
  open,
  onClose,
  activeItem = 'announcements',
  onItemClick
}: SidebarProps) => {
  const theme = useTheme();

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
          Userflow
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
