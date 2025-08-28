import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ModalAnnouncement from './components/ModalAnnouncement';
import ToastAnnouncement from './components/ToastAnnouncement';
import TooltipAnnouncement from './components/TooltipAnnouncement';

interface Announcement {
  id: string;
  title: string;
  message: string;
  placement: 'modal' | 'toast' | 'tooltip';
  buttons?: Array<{
    label: string;
    type: 'primary' | 'secondary';
    behavior: 'close' | 'redirect';
    redirectUrl?: string;
  }>;
  themeConfig: {
    modal: {
      backgroundColor: string;
      borderRadius: string;
      titleColor: string;
    };
    button: {
      backgroundColor: string;
      textColor: string;
      borderRadius: string;
    };
    secondaryButton: {
      backgroundColor: string;
      textColor: string;
      borderColor: string;
      borderRadius: string;
    };
  };
}

interface AnnouncementsWidgetProps {
  accountId: string;
  baseUrl?: string;
}

function AnnouncementsWidget({ accountId, baseUrl = '' }: AnnouncementsWidgetProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/embed/announcements?account_id=${accountId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch announcements');
        }

        const data = await response.json();
        setAnnouncements(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch announcements');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [accountId, baseUrl]);

  if (loading) {
    return null; // Don't show anything while loading
  }

  if (error) {
    console.error('AnnouncementsWidget error:', error);
    return null; // Don't show anything on error
  }

  if (announcements.length === 0) {
    return null; // Don't show anything if no announcements
  }

  // Create a minimal theme for the widget
  const theme = createTheme({
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            margin: 0,
            padding: 0,
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {announcements.map((announcement) => {
        const commonProps = {
          key: announcement.id,
          title: announcement.title,
          message: announcement.message,
          buttons: announcement.buttons || [],
          themeConfig: announcement.themeConfig,
        };

        switch (announcement.placement) {
          case 'toast':
            return <ToastAnnouncement {...commonProps} />;
          case 'tooltip':
            return <TooltipAnnouncement {...commonProps} />;
          case 'modal':
          default:
            return <ModalAnnouncement {...commonProps} />;
        }
      })}
    </ThemeProvider>
  );
}

// Function to initialize the widget
function initializeAnnouncementsWidget(accountId: string, baseUrl?: string) {
  // Create a container for the widget
  const container = document.createElement('div');
  container.id = 'announcements-widget-container';
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.zIndex = '999999';

  document.body.appendChild(container);

  // Create React root and render the widget
  const root = createRoot(container);
  root.render(<AnnouncementsWidget accountId={accountId} baseUrl={baseUrl} />);

  // Return cleanup function
  return () => {
    root.unmount();
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  };
}

// Auto-initialize when script is loaded
function autoInitialize() {
  // Find the script tag that loaded this widget
  const scripts = document.getElementsByTagName('script');
  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];
    const accountId = script.getAttribute('data-account');
    const baseUrl = script.getAttribute('data-base-url');

    if (accountId) {
      initializeAnnouncementsWidget(accountId, baseUrl || '');
      break;
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoInitialize);
} else {
  autoInitialize();
}

// Export for manual initialization
export { initializeAnnouncementsWidget, AnnouncementsWidget };
export default AnnouncementsWidget;