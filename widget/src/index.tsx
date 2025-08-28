import AnnouncementsWidget, { initializeAnnouncementsWidget } from './AnnouncementsWidget';

declare global {
  interface Window {
    AnnouncementsWidget: {
      init: typeof initializeAnnouncementsWidget;
    };
  }
}

// Expose init method on window
window.AnnouncementsWidget = {
  init: initializeAnnouncementsWidget
};
