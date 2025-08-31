// Popup script for Onboarding Builder extension
let capturedElements = [];

// DOM elements
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const elementList = document.getElementById('elementList');

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  await updateStatus();
  loadCapturedElements();
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  startBtn.addEventListener('click', startSelection);
  stopBtn.addEventListener('click', stopSelection);
}

// Start element selection
async function startSelection() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'startSelection' });
    if (response.success) {
      updateUI(true);
    }
  } catch (error) {
    console.error('Error starting selection:', error);
    showError('Failed to start selection');
  }
}

// Stop element selection
async function stopSelection() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'stopSelection' });
    if (response.success) {
      updateUI(false);
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
    const response = await chrome.runtime.sendMessage({ action: 'getStatus' });
    updateUI(response.active);
  } catch (error) {
    console.error('Error getting status:', error);
  }
}

// Load captured elements from storage
function loadCapturedElements() {
  chrome.storage.local.get(['capturedElements'], (result) => {
    capturedElements = result.capturedElements || [];
    renderElementList();
  });
}

// Render the list of captured elements
function renderElementList() {
  if (capturedElements.length === 0) {
    elementList.innerHTML = '<div class="empty-state">No elements captured yet</div>';
    return;
  }

  elementList.innerHTML = capturedElements.map((element, index) => `
    <div class="element-item">
      <div style="font-weight: 500; margin-bottom: 4px;">${element.tagName}${element.id ? `#${element.id}` : ''}</div>
      <div style="color: #6c757d; font-size: 11px;">${element.selector}</div>
      <div style="margin-top: 4px;">
        <button onclick="removeElement(${index})" style="background: #dc3545; color: white; border: none; padding: 2px 6px; border-radius: 3px; font-size: 10px; cursor: pointer;">Remove</button>
        <button onclick="copySelector(${index})" style="background: #007bff; color: white; border: none; padding: 2px 6px; border-radius: 3px; font-size: 10px; cursor: pointer; margin-left: 4px;">Copy</button>
      </div>
    </div>
  `).join('');
}

// Remove element from list
function removeElement(index) {
  capturedElements.splice(index, 1);
  chrome.storage.local.set({ capturedElements });
  renderElementList();
}

// Copy selector to clipboard
function copySelector(index) {
  const element = capturedElements[index];
  navigator.clipboard.writeText(element.selector).then(() => {
    showSuccess('Selector copied to clipboard');
  }).catch(() => {
    showError('Failed to copy selector');
  });
}

// Add new captured element
function addCapturedElement(elementData) {
  capturedElements.push(elementData);
  chrome.storage.local.set({ capturedElements });
  renderElementList();
}

// Show success message
function showSuccess(message) {
  // Simple toast notification
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
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'elementCaptured') {
    addCapturedElement(request.element);
    showSuccess('Element captured!');
  }
});

// Make functions globally available for inline onclick handlers
window.removeElement = removeElement;
window.copySelector = copySelector;
