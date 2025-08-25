/**
 * Notifications.fyi Widget
 * Version: 1.0.3
 * 
 * This script renders notifications in a Shadow DOM to avoid CSS conflicts.
 * It handles different placements, themes, and frequency controls.
 */

(function () {
  'use strict';

  // Widget state
  let widgetState = {
    config: null,
    container: null,
    shadowRoot: null,
    announcements: [],
    themes: {},
    dismissedAnnouncements: new Set(),
  };

  // CSS for the widget
  const WIDGET_CSS = `
    .notifications-fyi {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      color: #333;
      box-sizing: border-box;
    }

    .notifications-fyi * {
      box-sizing: border-box;
    }

    .notifications-fyi-banner {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #fff;
      border-bottom: 1px solid #e1e5e9;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      z-index: 2147483000;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .notifications-fyi-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2147483000;
      padding: 20px;
      pointer-events: auto;
    }

    .notifications-fyi-modal-content {
      background: var(--notifications-fyi-modal-backgroundColor, #fff);
      border-radius: var(--notifications-fyi-modal-borderRadius, 12px);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 500px;
      min-width: 350px;
      width: 100%;
      max-height: 80vh;
      overflow-y: auto;
      padding: 32px;
      position: relative;
      pointer-events: auto;
    }

    .notifications-fyi-modal-content img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 0 auto;
    }

    .notifications-fyi-announcement {
      margin-bottom: 16px;
    }

    .notifications-fyi-announcement:last-child {
      margin-bottom: 0;
    }

    .notifications-fyi-title {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 8px;
      color: var(--notifications-fyi-modal-titleColor, #1a1a1a);
      text-align: center;
    }

    .notifications-fyi-message {
      margin-bottom: 16px;
      color: #666;
      text-align: left;
      line-height: 1.6;
    }

    .notifications-fyi-message p {
      margin: 0;
      margin-bottom: 8px;
    }

    .notifications-fyi-message p:last-child {
      margin-bottom: 0;
    }

    .notifications-fyi-buttons {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .notifications-fyi-button {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .notifications-fyi-button-primary {
      background: var(--notifications-fyi-button-backgroundColor, #007bff);
      color: var(--notifications-fyi-button-textColor, #fff);
      border-radius: var(--notifications-fyi-button-borderRadius, 6px);
    }

    .notifications-fyi-button-primary:hover {
      background: var(--notifications-fyi-button-backgroundColor, #007bff);
      opacity: 0.9;
    }

    .notifications-fyi-button-secondary {
      background: var(--notifications-fyi-secondary-button-backgroundColor, #f8f9fa);
      color: var(--notifications-fyi-secondary-button-textColor, #333);
      border: 1px solid var(--notifications-fyi-secondary-button-borderColor, #dee2e6);
      border-radius: var(--notifications-fyi-secondary-button-borderRadius, 6px);
    }

    .notifications-fyi-button-secondary:hover {
      background: var(--notifications-fyi-secondary-button-backgroundColor, #f8f9fa);
      opacity: 0.9;
    }

    .notifications-fyi-close {
      background: none;
      border: none;
      color: #999;
      cursor: pointer;
      padding: 4px;
      font-size: 18px;
      line-height: 1;
      border-radius: 4px;
      transition: color 0.2s ease;
    }

    .notifications-fyi-close:hover {
      color: #666;
      background: #f8f9fa;
    }

    .notifications-fyi-close-banner {
      margin-left: auto;
    }

    .notifications-fyi-close-modal {
      position: absolute;
      top: 16px;
      right: 16px;
    }

    .notifications-fyi-hidden {
      display: none !important;
    }

    @media (max-width: 768px) {
      .notifications-fyi-banner {
        padding: 12px 16px;
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .notifications-fyi-modal {
        padding: 16px;
      }

      .notifications-fyi-modal-content {
        padding: 20px;
      }

      .notifications-fyi-buttons {
        flex-direction: column;
      }

      .notifications-fyi-button {
        width: 100%;
        justify-content: center;
      }
    }
  `;

  // Utility functions
  function log(message) {
    // Only log errors in production
    if (message.includes('error') || message.includes('Error')) {
      console.error(`[Notifications.fyi Widget] ${message}`);
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function parseButtons(buttons) {
    if (!buttons || !Array.isArray(buttons)) {
      return [];
    }

    return buttons.map(button => ({
      text: button.label || button.text || 'Button',
      url: button.redirectUrl || button.url || '#',
      primary: button.type === 'primary' || button.primary || false,
      action: button.behavior === 'close' ? 'dismiss' : (button.behavior === 'redirect' ? 'link' : 'dismiss'),
    }));
  }

  function applyTheme(themeConfig) {
    if (!themeConfig) return '';

    const cssVars = [];

    // Apply modal styles
    if (themeConfig.modal) {
      Object.entries(themeConfig.modal).forEach(([key, value]) => {
        cssVars.push(`--notifications-fyi-modal-${key}: ${value};`);
      });
    }

    // Apply button styles
    if (themeConfig.button) {
      Object.entries(themeConfig.button).forEach(([key, value]) => {
        cssVars.push(`--notifications-fyi-button-${key}: ${value};`);
      });
    }

    // Apply secondary button styles
    if (themeConfig.secondaryButton) {
      Object.entries(themeConfig.secondaryButton).forEach(([key, value]) => {
        cssVars.push(`--notifications-fyi-secondary-button-${key}: ${value};`);
      });
    }

    // Legacy support for old theme format
    if (themeConfig.colors) {
      Object.entries(themeConfig.colors).forEach(([key, value]) => {
        cssVars.push(`--notifications-fyi-${key}: ${value};`);
      });
    }

    if (themeConfig.typography) {
      Object.entries(themeConfig.typography).forEach(([key, value]) => {
        cssVars.push(`--notifications-fyi-font-${key}: ${value};`);
      });
    }

    if (themeConfig.spacing) {
      Object.entries(themeConfig.spacing).forEach(([key, value]) => {
        cssVars.push(`--notifications-fyi-spacing-${key}: ${value};`);
      });
    }

    return cssVars.length > 0 ? `.notifications-fyi-modal-content { ${cssVars.join(' ')} }` : '';
  }

  // Frequency control
  function shouldShowAnnouncement(announcement) {
    const key = `notifications-fyi-${announcement.id}`;

    if (announcement.frequency === 'once_per_session') {
      return !sessionStorage.getItem(key);
    }

    if (announcement.frequency === 'once_per_user') {
      return !localStorage.getItem(key);
    }

    return true; // 'always' or default
  }

  function markAnnouncementSeen(announcement) {
    const key = `notifications-fyi-${announcement.id}`;

    if (announcement.frequency === 'once_per_session') {
      sessionStorage.setItem(key, 'true');
    } else if (announcement.frequency === 'once_per_user') {
      localStorage.setItem(key, 'true');
    }
  }

  // Render functions
  function renderButton(button, announcementId) {
    const className = button.primary
      ? 'notifications-fyi-button notifications-fyi-button-primary'
      : 'notifications-fyi-button notifications-fyi-button-secondary';

    if (button.action === 'dismiss') {
      return `<button class="${className}" onclick="window.NotificationsFyiWidget.close()">${escapeHtml(button.text)}</button>`;
    }

    if (button.action === 'link' && button.url) {
      return `<a href="${escapeHtml(button.url)}" class="${className}" target="_blank" rel="noopener">${escapeHtml(button.text)}</a>`;
    }

    // Default: close modal
    return `<button class="${className}" onclick="window.NotificationsFyiWidget.close()">${escapeHtml(button.text)}</button>`;
  }

  function renderAnnouncement(announcement) {
    if (!shouldShowAnnouncement(announcement)) {
      return '';
    }

    const buttons = parseButtons(announcement.buttons);
    // Sort buttons: secondary first, primary last (rightmost)
    const sortedButtons = buttons.sort((a, b) => {
      if (a.primary && !b.primary) return 1; // primary goes last
      if (!a.primary && b.primary) return -1; // secondary goes first
      return 0;
    });

    const buttonsHtml = sortedButtons.length > 0
      ? `<div class="notifications-fyi-buttons">${sortedButtons.map(btn => renderButton(btn, announcement.id)).join('')}</div>`
      : '';

    return `
      <div class="notifications-fyi-announcement" data-announcement-id="${announcement.id}">
        <div class="notifications-fyi-title">${escapeHtml(announcement.title)}</div>
        <div class="notifications-fyi-message">${announcement.message}</div>
        ${buttonsHtml}
      </div>
    `;
  }

  function renderBanner(announcements) {
    const announcementsHtml = announcements.map(renderAnnouncement).join('');

    if (!announcementsHtml) return '';

    return `
      <div class="notifications-fyi-banner">
        <div class="notifications-fyi-content">
          ${announcementsHtml}
        </div>
        <button class="notifications-fyi-close notifications-fyi-close-banner" onclick="window.NotificationsFyiWidget.close()">
          ×
        </button>
      </div>
    `;
  }

  function renderModal(announcements) {
    const announcementsHtml = announcements.map(renderAnnouncement).join('');

    if (!announcementsHtml) return '';

    return `
      <div class="notifications-fyi-modal">
        <div class="notifications-fyi-modal-content">
          <button class="notifications-fyi-close notifications-fyi-close-modal" onclick="window.NotificationsFyiWidget.close()">
            ×
          </button>
          ${announcementsHtml}
        </div>
      </div>
    `;
  }

  // Main render function
  function render() {
    if (!widgetState.shadowRoot || !widgetState.config) {
      return;
    }

    const { announcements, themes } = widgetState.config;

    if (!announcements || announcements.length === 0) {
      return;
    }

    // Group announcements by placement
    const bannerAnnouncements = announcements.filter(a => a.placement === 'banner');
    const modalAnnouncements = announcements.filter(a => a.placement === 'modal');

    // Apply theme CSS for each announcement's theme
    let themeCss = '';
    announcements.forEach(announcement => {
      if (announcement.themeId) {
        const theme = themes.find(t => t.id === announcement.themeId);
        if (theme) {
          themeCss += applyTheme(theme.config);
        }
      }
    });

    // If no specific themes, use the first available theme
    if (!themeCss && themes.length > 0) {
      themeCss = applyTheme(themes[0].config);
    }

    // Render content
    let content = '';

    if (bannerAnnouncements.length > 0) {
      content += renderBanner(bannerAnnouncements);
    }

    if (modalAnnouncements.length > 0) {
      content += renderModal(modalAnnouncements);
    }

    // Update shadow DOM
    widgetState.shadowRoot.innerHTML = `
      <style>
        ${WIDGET_CSS}
        ${themeCss}
      </style>
      <div class="notifications-fyi">
        ${content}
      </div>
    `;


  }

  // Public API
  window.NotificationsFyiWidget = {
    initialize: function (config, container) {


      widgetState.config = config;
      widgetState.container = container;
      widgetState.announcements = config.announcements || [];
      widgetState.themes = config.themes || [];

      // Check if container already has a shadow root
      if (container.shadowRoot) {
        // Reuse existing shadow root
        widgetState.shadowRoot = container.shadowRoot;
        // Clear existing content
        widgetState.shadowRoot.innerHTML = '';
      } else {
        // Create new shadow root
        widgetState.shadowRoot = container.attachShadow({ mode: 'closed' });
      }

      // Render announcements
      render();


    },

    dismiss: function (announcementId) {
      const announcement = widgetState.announcements.find(a => a.id === announcementId);
      if (announcement) {
        markAnnouncementSeen(announcement);
        widgetState.dismissedAnnouncements.add(announcementId);
        render(); // Re-render to hide dismissed announcements
      }
    },

    close: function () {
      // Mark all visible announcements as seen
      widgetState.announcements.forEach(announcement => {
        if (shouldShowAnnouncement(announcement)) {
          markAnnouncementSeen(announcement);
        }
      });

      // Hide the widget
      if (widgetState.container) {
        widgetState.container.style.display = 'none';
      }
    },

    show: function () {
      if (widgetState.container) {
        widgetState.container.style.display = 'block';
      }
    },

    update: function (newConfig) {
      widgetState.config = newConfig;
      widgetState.announcements = newConfig.announcements || [];
      widgetState.themes = newConfig.themes || [];
      render();
    },

    destroy: function () {
      if (widgetState.container && widgetState.container.parentNode) {
        widgetState.container.parentNode.removeChild(widgetState.container);
      }
      widgetState = {
        config: null,
        container: null,
        shadowRoot: null,
        announcements: [],
        themes: {},
        dismissedAnnouncements: new Set(),
      };
    }
  };



})();
