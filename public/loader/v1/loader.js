/**
 * Notifications.fyi Embed Loader
 * Version: 1.0.0
 * 
 * This script loads and displays notifications on customer websites.
 * It fetches configuration from the embed API and dynamically loads the widget.
 */

(function () {
  'use strict';

  // Configuration
  const CONFIG = {
    API_BASE: 'http://localhost:3000', // Fixed API base for local development
    WIDGET_URL: 'http://localhost:3000/widget/v1/widget.js?v=1.0.1', // Fixed widget URL for local development
    VERSION: '1.0.2',
    Z_INDEX: 2147483000, // High z-index to avoid conflicts
  };

  // State management
  let state = {
    accountId: null,
    config: null,
    widgetLoaded: false,
    widgetContainer: null,
  };

  // Utility functions
  function log(message, level = 'info') {
    if (level === 'error') {
      console.error(`[Notifications.fyi] ${message}`);
    }
  }

  function getCurrentPath() {
    return window.location.pathname + window.location.search;
  }

  function getCurrentUrl() {
    return window.location.href;
  }

  // Fetch embed configuration
  async function fetchConfig() {
    try {
      const params = new URLSearchParams({
        account_id: state.accountId,
        url: getCurrentUrl(),
        path: getCurrentPath(),
      });

      const response = await fetch(`${CONFIG.API_BASE}/api/embed/config?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        // Don't cache the config to ensure fresh data
        cache: 'no-cache',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const config = await response.json();

      return config;
    } catch (error) {
      log(`Failed to fetch config: ${error.message}`, 'error');
      return null;
    }
  }

  // Load the widget script
  function loadWidget() {
    return new Promise((resolve, reject) => {
      if (state.widgetLoaded) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = CONFIG.WIDGET_URL;
      script.async = true;
      script.onload = () => {
        state.widgetLoaded = true;

        resolve();
      };
      script.onerror = () => {
        log('Failed to load widget script', 'error');
        reject(new Error('Widget script failed to load'));
      };

      document.head.appendChild(script);
    });
  }

  // Create widget container
  function createWidgetContainer() {
    if (state.widgetContainer) {
      return state.widgetContainer;
    }

    const container = document.createElement('div');
    container.id = 'notifications-fyi-widget';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: ${CONFIG.Z_INDEX};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    document.body.appendChild(container);
    state.widgetContainer = container;

    return container;
  }

  // Initialize the widget
  async function initializeWidget() {
    try {


      // Prevent multiple initializations
      if (state.widgetContainer && window.NotificationsFyiWidget) {
        // Update existing widget
        window.NotificationsFyiWidget.update(state.config);
        return;
      }


      await loadWidget();

      // Wait for widget to be available
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max wait


      while (!window.NotificationsFyiWidget && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (!window.NotificationsFyiWidget) {
        throw new Error('Widget not available after loading');
      }


      const container = createWidgetContainer();

      window.NotificationsFyiWidget.initialize(state.config, container);

    } catch (error) {
      log(`Failed to initialize widget: ${error.message}`, 'error');
    }
  }

  // Main initialization function
  async function initialize() {
    try {
      // Find the script tag that loaded this script
      const scripts = document.querySelectorAll('script[src*="loader.js"]');
      const currentScript = Array.from(scripts).find(script =>
        script.src.includes('loader.js') && script.dataset.account
      );

      if (!currentScript) {
        log('No script tag with data-account found', 'error');
        return;
      }

      state.accountId = currentScript.dataset.account;
      if (!state.accountId) {
        log('No account ID provided', 'error');
        return;
      }



      // Fetch configuration
      state.config = await fetchConfig();
      if (!state.config) {

        return;
      }

      // Check if there are announcements to show
      if (!state.config.announcements || state.config.announcements.length === 0) {

        return;
      }

      // Initialize widget if there are announcements
      await initializeWidget();

    } catch (error) {
      log(`Initialization failed: ${error.message}`, 'error');
    }
  }

  // Expose global API for SPA integration
  window.notificationsFyi = {
    // Re-check for announcements (useful for SPAs)
    check: async function () {

      state.config = await fetchConfig();
      if (state.config && state.config.announcements && state.config.announcements.length > 0) {
        await initializeWidget();
      }
    },

    // Get current configuration
    getConfig: function () {
      return state.config;
    },

    // Version info
    version: CONFIG.VERSION,
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // Also initialize immediately if script is loaded after DOM is ready
  if (document.readyState !== 'loading') {
    initialize();
  }

})();
