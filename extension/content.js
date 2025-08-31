let active = false;
let highlightBox;
let selectedElements = [];

// Listen for custom events from background script
document.addEventListener('startElementSelection', enableOverlay);
document.addEventListener('stopElementSelection', disableOverlay);

function enableOverlay() {
  if (active) return;
  active = true;

  // Create highlight box
  highlightBox = document.createElement('div');
  highlightBox.style.cssText = `
    position: absolute;
    border: 2px solid #007bff;
    background-color: rgba(0, 123, 255, 0.1);
    pointer-events: none;
    z-index: 999999;
    transition: all 0.1s ease;
    box-shadow: 0 0 0 1px rgba(0, 123, 255, 0.3);
  `;
  document.body.appendChild(highlightBox);

  // Add overlay to prevent clicks on page elements
  const overlay = document.createElement('div');
  overlay.id = 'onboarding-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
    z-index: 999998;
    pointer-events: none;
  `;
  document.body.appendChild(overlay);

  // Add event listeners
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('click', onClick, true);
  document.addEventListener('keydown', onKeyDown);

  // Show instructions
  showInstructions();
}

function onMouseMove(e) {
  if (!active || !highlightBox) return;

  const el = document.elementFromPoint(e.clientX, e.clientY);
  if (!el || el === highlightBox || el.id === 'onboarding-overlay') return;

  const rect = el.getBoundingClientRect();
  highlightBox.style.top = rect.top + 'px';
  highlightBox.style.left = rect.left + 'px';
  highlightBox.style.width = rect.width + 'px';
  highlightBox.style.height = rect.height + 'px';
}

function onClick(e) {
  if (!active) return;

  e.preventDefault();
  e.stopPropagation();

  const el = document.elementFromPoint(e.clientX, e.clientY);
  if (!el || el === highlightBox || el.id === 'onboarding-overlay') return;

  const elementData = captureElement(el);
  if (elementData) {
    selectedElements.push(elementData);

    // Send to popup
    chrome.runtime.sendMessage({
      action: 'elementCaptured',
      element: elementData
    });

    // Show visual feedback
    showCaptureFeedback(el);
  }
}

function onKeyDown(e) {
  if (e.key === 'Escape' && active) {
    disableOverlay();
  }
}

function disableOverlay() {
  if (!active) return;
  active = false;

  if (highlightBox) {
    highlightBox.remove();
    highlightBox = null;
  }

  const overlay = document.getElementById('onboarding-overlay');
  if (overlay) overlay.remove();

  const instructions = document.getElementById('onboarding-instructions');
  if (instructions) instructions.remove();

  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('click', onClick, true);
  document.removeEventListener('keydown', onKeyDown);
}

function captureElement(el) {
  const selector = generateUniqueSelector(el);
  const tagName = el.tagName.toLowerCase();
  const id = el.id || '';
  const classes = Array.from(el.classList).join('.');
  const text = el.textContent?.trim().substring(0, 50) || '';

  return {
    selector,
    tagName,
    id,
    classes,
    text,
    timestamp: Date.now()
  };
}

function generateUniqueSelector(el) {
  // Try ID first
  if (el.id) {
    return `#${el.id}`;
  }

  // Try data attributes
  const dataSelectors = [];
  for (let attr of el.attributes) {
    if (attr.name.startsWith('data-')) {
      dataSelectors.push(`[${attr.name}="${attr.value}"]`);
    }
  }
  if (dataSelectors.length > 0) {
    return `${el.tagName.toLowerCase()}${dataSelectors.join('')}`;
  }

  // Try classes
  if (el.className && typeof el.className === 'string') {
    const classes = el.className.trim().split(/\s+/).filter(c => c);
    if (classes.length > 0) {
      const classSelector = '.' + classes.join('.');
      const elements = document.querySelectorAll(classSelector);
      if (elements.length === 1) {
        return `${el.tagName.toLowerCase()}${classSelector}`;
      }
    }
  }

  // Generate path-based selector
  return generatePathSelector(el);
}

function generatePathSelector(el) {
  const path = [];
  let current = el;

  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase();

    if (current.id) {
      selector += `#${current.id}`;
      path.unshift(selector);
      break;
    }

    if (current.className && typeof current.className === 'string') {
      const classes = current.className.trim().split(/\s+/).filter(c => c);
      if (classes.length > 0) {
        selector += '.' + classes.join('.');
      }
    }

    // Add nth-child if needed
    const siblings = Array.from(current.parentNode?.children || []);
    const index = siblings.indexOf(current) + 1;
    if (siblings.length > 1) {
      selector += `:nth-child(${index})`;
    }

    path.unshift(selector);
    current = current.parentNode;
  }

  return path.join(' > ');
}

function showCaptureFeedback(el) {
  const feedback = document.createElement('div');
  feedback.style.cssText = `
    position: absolute;
    background: #28a745;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 1000000;
    pointer-events: none;
    animation: fadeOut 2s forwards;
  `;

  const rect = el.getBoundingClientRect();
  feedback.style.top = (rect.top - 30) + 'px';
  feedback.style.left = rect.left + 'px';
  feedback.textContent = '✓ Captured!';

  // Add CSS animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeOut {
      0% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-10px); }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(feedback);

  setTimeout(() => {
    feedback.remove();
    style.remove();
  }, 2000);
}

function showInstructions() {
  const instructions = document.createElement('div');
  instructions.id = 'onboarding-instructions';
  instructions.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #007bff;
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 1000001;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  `;

  instructions.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 8px;">Element Selection Active</div>
    <div style="font-size: 12px; line-height: 1.4;">
      • Hover over elements to highlight them<br>
      • Click to capture an element<br>
      • Press ESC to stop selection
    </div>
  `;

  document.body.appendChild(instructions);
}
