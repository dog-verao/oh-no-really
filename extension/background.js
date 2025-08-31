// Background script for Onboarding Builder extension
let currentTab = null;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startSelection') {
    startElementSelection();
    sendResponse({ success: true });
  } else if (request.action === 'stopSelection') {
    stopElementSelection();
    sendResponse({ success: true });
  } else if (request.action === 'getStatus') {
    sendResponse({ active: currentTab !== null });
  }
});

// Start element selection mode
async function startElementSelection() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    currentTab = tab.id;

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: enableOverlay
    });
  } catch (error) {
    console.error('Error starting selection:', error);
  }
}

// Stop element selection mode
async function stopElementSelection() {
  if (currentTab) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: currentTab },
        function: disableOverlay
      });
      currentTab = null;
    } catch (error) {
      console.error('Error stopping selection:', error);
    }
  }
}

// Functions to be injected into content script
function enableOverlay() {
  if (window.overlayActive) return;
  window.overlayActive = true;

  // Dispatch custom event to content script
  document.dispatchEvent(new CustomEvent('startElementSelection'));
}

function disableOverlay() {
  if (!window.overlayActive) return;
  window.overlayActive = false;

  // Dispatch custom event to content script
  document.dispatchEvent(new CustomEvent('stopElementSelection'));
}
