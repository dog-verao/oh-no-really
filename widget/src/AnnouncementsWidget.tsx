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

// Inspector functionality
let isInspectMode = false;
let highlightBox: HTMLElement | null = null;
let selectedElement: HTMLElement | null = null;
let tooltip: HTMLElement | null = null;

// Framework class patterns to blacklist
const FRAMEWORK_PATTERNS = [
  /^[0-9]+$/,                    // numeric IDs
  /^[a-f0-9]{6,}$/,             // hash-like IDs
  /^ng-/,                        // Angular
  /^ember-/,                     // Ember
  /^react/,                      // React
  /^jsx/,                        // JSX
  /^v-/,                         // Vue
  /^svelte/,                     // Svelte
  /^tw-/,                        // Tailwind
  /^chakra/,                     // Chakra UI
  /^mui/,                        // Material-UI
  /^ant-/,                       // Ant Design
  /^el-/,                        // Element UI
  /^bp-/,                        // Blueprint
  /^rc-/,                        // React Components
  /^rs-/,                        // React Suite
  /^r-/,                         // Radix
  /^headless/,                   // Headless UI
  /^framer/,                     // Framer Motion
  /^styled/,                     // styled-components
  /^emotion/,                    // Emotion
  /^stitches/,                   // Stitches
  /^vanilla/,                    // Vanilla Extract
  /^linaria/,                    // Linaria
  /^astroturf/,                  // Astroturf
  /^styled-jsx/,                 // styled-jsx
  /^styled-components/,          // styled-components
  /^@/,                          // scoped packages
  /^[a-f0-9]{8,}/,              // long hex strings
  /^[A-Za-z0-9]{20,}/,          // long random strings
  /^css-/,                       // CSS-in-JS
  /^[a-z0-9]{8,}-[a-z0-9]{4,}-[a-z0-9]{4,}-[a-z0-9]{4,}-[a-z0-9]{12,}/, // UUID-like
];

function isStableIdentifier(identifier: string): boolean {
  if (!identifier || typeof identifier !== 'string') return false;
  return !FRAMEWORK_PATTERNS.some(pattern => pattern.test(identifier));
}

function generateStableSelector(el: HTMLElement): string {
  try {
    // Strategy 1: Try ID first (if stable)
    if (el.id && isStableIdentifier(el.id)) {
      const idSelector = '#' + el.id;
      const matches = document.querySelectorAll(idSelector);
      if (matches.length === 1 && matches[0] === el) {
        return idSelector;
      }
    }

    // Strategy 2: Try data attributes
    const dataAttrs: string[] = [];
    for (let attr of el.attributes) {
      if (attr.name.startsWith('data-') && !attr.name.includes('test')) {
        dataAttrs.push('[' + attr.name + '="' + attr.value + '"]');
      }
    }
    if (dataAttrs.length > 0) {
      const dataSelector = el.tagName.toLowerCase() + dataAttrs.join('');
      const matches = document.querySelectorAll(dataSelector);
      if (matches.length === 1 && matches[0] === el) {
        return dataSelector;
      }
    }

    // Strategy 3: Try stable classes
    if (el.className && typeof el.className === 'string') {
      const classes = el.className.trim().split(/\s+/).filter(c => {
        return c && isStableIdentifier(c);
      });

      if (classes.length > 0) {
        const escapedClasses = classes.map(cls => cls.replace(/[^a-zA-Z0-9_-]/g, '\\$&'));
        const classSelector = el.tagName.toLowerCase() + '.' + escapedClasses.join('.');

        const matches = document.querySelectorAll(classSelector);
        if (matches.length === 1 && matches[0] === el) {
          return classSelector;
        }
      }
    }

    // Strategy 4: Generate hierarchical selector
    return generateHierarchicalSelector(el);
  } catch (error) {
    console.error('Error generating stable selector:', error);
    return generateFallbackSelector(el);
  }
}

function generateHierarchicalSelector(el: HTMLElement): string {
  const path: string[] = [];
  let current: HTMLElement | null = el;
  let depth = 0;
  const maxDepth = 6;

  while (current && current !== document.body && depth < maxDepth) {
    let selector = current.tagName.toLowerCase();

    // Add stable ID if available
    if (current.id && isStableIdentifier(current.id)) {
      selector += '#' + current.id;
      path.unshift(selector);
      break;
    }

    // Add stable data attributes
    const dataAttrs: string[] = [];
    for (let attr of current.attributes) {
      if (attr.name.startsWith('data-') && !attr.name.includes('test')) {
        dataAttrs.push('[' + attr.name + '="' + attr.value + '"]');
      }
    }
    if (dataAttrs.length > 0) {
      selector += dataAttrs.join('');
    }

    // Add stable classes
    if (current.className && typeof current.className === 'string') {
      const classes = current.className.trim().split(/\s+/).filter(c => {
        return c && isStableIdentifier(c);
      });
      if (classes.length > 0) {
        const escapedClasses = classes.map(cls => cls.replace(/[^a-zA-Z0-9_-]/g, '\\$&'));
        selector += '.' + escapedClasses.join('.');
      }
    }

    // Add nth-child for positioning
    const siblings = Array.from(current?.parentNode?.children || []);
    const index = siblings.indexOf(current!) + 1;
    if (siblings.length > 1) {
      // Use nth-of-type if there are multiple siblings of the same type
      const sameTagSiblings = siblings.filter(sibling => sibling.tagName === current!.tagName);
      if (sameTagSiblings.length > 1) {
        const sameTagIndex = sameTagSiblings.indexOf(current!) + 1;
        selector += ':nth-of-type(' + sameTagIndex + ')';
      } else {
        selector += ':nth-child(' + index + ')';
      }
    }

    path.unshift(selector);
    current = current.parentElement;
    depth++;
  }

  return path.join(' > ');
}

function generateFallbackSelector(el: HTMLElement): string {
  const path: string[] = [];
  let current: HTMLElement | null = el;
  let depth = 0;
  const maxDepth = 8;

  while (current && current !== document.body && depth < maxDepth) {
    let selector = current.tagName.toLowerCase();

    // Add ID if available (even if not stable, as fallback)
    if (current.id) {
      selector += '#' + current.id;
      path.unshift(selector);
      break;
    }

    // Add nth-child for positioning
    const siblings = Array.from(current.parentNode?.children || []);
    const index = siblings.indexOf(current) + 1;
    if (siblings.length > 1) {
      selector += ':nth-child(' + index + ')';
    }

    path.unshift(selector);
    current = current.parentElement;
    depth++;
  }

  return path.join(' > ');
}

function createHighlightBox(): void {
  if (highlightBox) return;

  highlightBox = document.createElement('div');
  highlightBox.style.cssText = `
    position: absolute;
    border: 2px solid #007bff;
    background-color: rgba(0, 123, 255, 0.1);
    pointer-events: none;
    z-index: 2147483647;
    transition: all 0.1s ease;
    box-shadow: 0 0 0 1px rgba(0, 123, 255, 0.3);
  `;
  document.body.appendChild(highlightBox);
}

function createTooltip(): void {
  if (tooltip) return;

  tooltip = document.createElement('div');
  tooltip.style.cssText = `
    position: fixed;
    background: #28a745;
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    z-index: 2147483648;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    gap: 8px;
    align-items: center;
  `;
  document.body.appendChild(tooltip);
}

function onMouseMove(e: MouseEvent): void {
  if (!isInspectMode || !highlightBox) return;

  const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
  if (!el || el === highlightBox || el === tooltip) return;

  const rect = el.getBoundingClientRect();
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;

  highlightBox.style.top = (rect.top + scrollY) + 'px';
  highlightBox.style.left = (rect.left + scrollX) + 'px';
  highlightBox.style.width = rect.width + 'px';
  highlightBox.style.height = rect.height + 'px';
}

function onClick(e: MouseEvent): void {
  if (!isInspectMode) return;

  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
  if (!el || el === highlightBox || el === tooltip) return;

  selectedElement = el;
  const selector = generateStableSelector(el);
  const tagName = el.tagName.toLowerCase();
  const text = el.textContent?.trim().substring(0, 50) || '';

  // Show brief success message
  createTooltip();
  const rect = el.getBoundingClientRect();
  tooltip!.style.top = (rect.top - 50) + 'px';
  tooltip!.style.left = rect.left + 'px';

  tooltip!.innerHTML = `
    <span>✅ Element captured!</span>
  `;

  // Send element data immediately
  window.parent.postMessage({
    type: 'ELEMENT_SELECTED',
    data: { selector, tagName, text }
  }, '*');

  // Hide tooltip after 2 seconds
  setTimeout(() => {
    hideTooltip();
  }, 2000);
}

function hideTooltip(): void {
  if (tooltip) {
    tooltip.remove();
    tooltip = null;
  }
  selectedElement = null;
}

function startInspectMode(): void {
  console.log('Starting inspect mode');
  isInspectMode = true;
  createHighlightBox();
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('click', onClick, true);
  document.body.style.cursor = 'crosshair';
  window.parent.postMessage({ type: 'HIGHLIGHT_STARTED' }, '*');
}

function stopInspectMode(): void {
  console.log('Stopping inspect mode');
  isInspectMode = false;
  hideTooltip();
  if (highlightBox) {
    highlightBox.remove();
    highlightBox = null;
  }
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('click', onClick, true);
  document.body.style.cursor = '';
  window.parent.postMessage({ type: 'HIGHLIGHT_STOPPED' }, '*');
}

// Listen for messages from parent (inspector page)
window.addEventListener('message', (event) => {
  console.log('Widget received message:', event.data);
  if (event.data.type === 'START_INSPECT') {
    startInspectMode();
  } else if (event.data.type === 'STOP_INSPECT') {
    stopInspectMode();
  }
});

function AnnouncementsWidget({ accountId, baseUrl = '' }: AnnouncementsWidgetProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [closedAnnouncements, setClosedAnnouncements] = useState<Set<string>>(new Set());
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

  const handleClose = (announcementId: string) => {
    setClosedAnnouncements(prev => new Set([...prev, announcementId]));
  };

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

  // Filter out closed announcements
  const visibleAnnouncements = announcements.filter(announcement =>
    !closedAnnouncements.has(announcement.id)
  );

  if (visibleAnnouncements.length === 0) {
    return null; // Don't show anything if all announcements are closed
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
      {visibleAnnouncements.map((announcement) => {
        const commonProps = {
          key: announcement.id,
          title: announcement.title,
          message: announcement.message,
          buttons: announcement.buttons || [],
          themeConfig: announcement.themeConfig,
          onClose: () => handleClose(announcement.id),
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
  container.style.top = '30px';
  container.style.left = '50%';
  container.style.transform = 'translateX(-50%)';
  // container.style.width = '100%';
  // container.style.height = '100%';

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