// Popup script for Onboarding Builder extension
let capturedElement = null; // Single element instead of array
let widgetPresent = false;

// DOM elements
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const elementList = document.getElementById('elementList');

// Safe message sending with error handling
function safeSendMessage(message) {
  try {
    if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
      return chrome.runtime.sendMessage(message);
    }
  } catch (error) {
    console.warn('Extension context invalidated, message not sent:', error);
  }
  return Promise.resolve();
}

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  await updateStatus();
  loadCapturedElement();
  setupEventListeners();
  checkWidgetStatus();
});

// Check if widget is present on current page
async function checkWidgetStatus() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        return (
          typeof window.AnnouncementsWidget !== 'undefined' ||
          typeof window.announcementsWidget !== 'undefined' ||
          document.querySelector('script[src*="announcements-widget"]') !== null ||
          document.querySelector('script[src*="widget"]') !== null ||
          document.querySelector('[data-announcements-widget]') !== null
        );
      }
    });

    widgetPresent = results[0]?.result || false;
    updateWidgetStatus();
  } catch (error) {
    console.error('Error checking widget status:', error);
    widgetPresent = false;
    updateWidgetStatus();
  }
}

// Update UI based on widget status
function updateWidgetStatus() {
  if (!widgetPresent) {
    statusDot.style.background = '#ffc107'; // Yellow for warning
    statusText.textContent = 'Widget not found on this page';
    startBtn.disabled = true;
    startBtn.title = 'Widget script must be present to start selection';
  } else {
    statusDot.style.background = '#dc3545'; // Red for ready
    statusText.textContent = 'Ready to select';
    startBtn.disabled = false;
    startBtn.title = '';
  }
}

// Setup event listeners
function setupEventListeners() {
  startBtn.addEventListener('click', startSelection);
  stopBtn.addEventListener('click', stopSelection);

  // Add refresh button listener
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      loadCapturedElement();
      showSuccess('Refreshed!');
    });
  }
}

// Start element selection
async function startSelection() {
  if (!widgetPresent) {
    showError('Widget script not found on this page');
    return;
  }

  try {
    const response = await safeSendMessage({ action: 'startSelection' });
    if (response.success) {
      updateUI(true);
      showSuccess('Element selection started! Click on an element to capture it.');
    }
  } catch (error) {
    console.error('Error starting selection:', error);
    showError('Failed to start selection');
  }
}

// Stop element selection
async function stopSelection() {
  try {
    const response = await safeSendMessage({ action: 'stopSelection' });
    if (response.success) {
      updateUI(false);
      showSuccess('Element selection stopped!');
    }
  } catch (error) {
    console.error('Error stopping selection:', error);
    showError('Failed to stop selection');
  }
}

// Update UI based on selection status
function updateUI(isActive) {
  if (isActive) {
    statusDot.classList.add('active');
    statusText.textContent = 'Selection active';
    startBtn.disabled = true;
    stopBtn.disabled = false;
  } else {
    statusDot.classList.remove('active');
    statusText.textContent = 'Ready to select';
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }
}

// Update status from background script
async function updateStatus() {
  try {
    const response = await safeSendMessage({ action: 'getStatus' });
    updateUI(response.active);
  } catch (error) {
    console.error('Error getting status:', error);
  }
}

// Load captured element from storage
function loadCapturedElement() {
  console.log('Loading captured element from storage...');
  chrome.storage.local.get(['capturedElement'], (result) => {
    console.log('Storage result:', result);
    capturedElement = result.capturedElement || null;
    console.log('Set capturedElement to:', capturedElement);
    renderElementDisplay();
  });
}

// Render the captured element
function renderElementDisplay() {
  console.log('Rendering element display, capturedElement:', capturedElement);
  if (!capturedElement) {
    elementList.innerHTML = '<div class="empty-state">No element captured yet</div>';
    return;
  }

  elementList.innerHTML = `
    <div class="element-item">
      <div style="font-weight: 500; margin-bottom: 4px; color: #333;">
        ${capturedElement.tagName}${capturedElement.id ? `#${capturedElement.id}` : ''}
        ${capturedElement.text ? ` - "${capturedElement.text}"` : ''}
      </div>
      <div style="color: #6c757d; font-size: 11px; font-family: monospace; word-break: break-all; margin-bottom: 6px;">
        ${capturedElement.selector}
      </div>
      <div style="display: flex; gap: 4px;">
        <button id="clearBtn" style="background: #dc3545; color: white; border: none; padding: 3px 8px; border-radius: 3px; font-size: 10px; cursor: pointer;">Clear</button>
        <button id="copyBtn" style="background: #007bff; color: white; border: none; padding: 3px 8px; border-radius: 3px; font-size: 10px; cursor: pointer;">Copy</button>
        <button id="testBtn" style="background: #28a745; color: white; border: none; padding: 3px 8px; border-radius: 3px; font-size: 10px; cursor: pointer;">Test</button>
      </div>
    </div>
  `;

  // Add event listeners to the buttons
  const clearBtn = document.getElementById('clearBtn');
  const copyBtn = document.getElementById('copyBtn');
  const testBtn = document.getElementById('testBtn');

  if (clearBtn) clearBtn.addEventListener('click', clearElement);
  if (copyBtn) copyBtn.addEventListener('click', copySelector);
  if (testBtn) testBtn.addEventListener('click', testSelector);
}

// Clear captured element
function clearElement() {
  capturedElement = null;
  chrome.storage.local.remove(['capturedElement']);
  renderElementDisplay();
  showSuccess('Element cleared');
}

// Copy selector to clipboard
function copySelector() {
  if (!capturedElement) return;

  navigator.clipboard.writeText(capturedElement.selector).then(() => {
    showSuccess('Selector copied to clipboard');
  }).catch(() => {
    showError('Failed to copy selector');
  });
}

// Test selector on current page
function testSelector() {
  if (!capturedElement) return;

  try {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: (selector, expectedText) => {
          const el = document.querySelector(selector);
          if (el) {
            // Highlight the element temporarily
            const originalBackground = el.style.backgroundColor;
            const originalBorder = el.style.border;

            el.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
            el.style.border = '2px solid #ffc107';

            setTimeout(() => {
              el.style.backgroundColor = originalBackground;
              el.style.border = originalBorder;
            }, 2000);

            // Return info about what was found
            return {
              found: true,
              tagName: el.tagName,
              text: el.textContent?.trim().substring(0, 50) || '',
              matchesExpected: expectedText ? el.textContent?.includes(expectedText) : true
            };
          }
          return { found: false };
        },
        args: [capturedElement.selector, capturedElement.text]
      }, (results) => {
        if (results && results[0] && results[0].result) {
          const result = results[0].result;
          if (result.found) {
            if (result.matchesExpected) {
              showSuccess(`Element found and highlighted! (${result.tagName}: "${result.text}")`);
            } else {
              showError(`Wrong element found! Expected: "${capturedElement.text}", Found: "${result.text}"`);
            }
          } else {
            showError('Element not found on current page');
          }
        } else {
          showError('Element not found on current page');
        }
      });
    });
  } catch (error) {
    console.error('Error testing selector:', error);
    showError('Failed to test selector');
  }
}

// Add new captured element
function addCapturedElement(elementData) {
  capturedElement = elementData;
  chrome.storage.local.set({ capturedElement });
  renderElementDisplay();
  showSuccess('Element captured!');
}

// Show success message
function showSuccess(message) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: #28a745;
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}

// Show error message
function showError(message) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: #dc3545;
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Popup received message:', request);

  if (request.action === 'elementCaptured') {
    console.log('Adding captured element:', request.element);
    addCapturedElement(request.element);
  } else if (request.action === 'widgetMissing') {
    widgetPresent = false;
    updateWidgetStatus();
    showError('Widget script not found on this page');
  }
});
