
import TooltipAnnouncement from './TooltipAnnouncement';
import ModalAnnouncement from './ModalAnnouncement';
import ToastAnnouncement from './ToastAnnouncement';

interface Button {
  type: 'primary' | 'secondary';
  label: string;
  behavior: 'close' | 'redirect';
  redirectUrl?: string;
}

interface ThemeConfig {
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
}

interface AnnouncementEmbedPreviewProps {
  title: string;
  message: string;
  buttons: Button[];
  themeConfig: ThemeConfig;
  placement?: 'modal' | 'toast' | 'tooltip';
}

export function AnnouncementEmbedPreview({ title, message, buttons, themeConfig, placement = 'modal' }: AnnouncementEmbedPreviewProps) {


  switch (placement) {
    case 'toast':
      return (
        <ToastAnnouncement
          title={title}
          message={message}
          buttons={buttons}
          themeConfig={themeConfig}
        />
      );
    case 'tooltip':
      return (
        <TooltipAnnouncement
          title={title}
          message={message}
          buttons={buttons}
          themeConfig={themeConfig}
        />
      );

    case 'modal':
    default:
      return (
        <ModalAnnouncement
          title={title}
          message={message}
          buttons={buttons}
          themeConfig={themeConfig}
        />
      );
  }
}
