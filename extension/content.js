let active = false;
let highlightBox;
let selectedElements = [];

// Listen for custom events from background script
document.addEventListener('startElementSelection', enableOverlay);
document.addEventListener('stopElementSelection', disableOverlay);

// Check if the widget script is present on the page
function isWidgetScriptPresent() {
  // Check for the widget script by looking for its global variable or function
  // You can customize this based on how your widget script identifies itself
  return (
    typeof window.AnnouncementsWidget !== 'undefined' ||
    typeof window.announcementsWidget !== 'undefined' ||
    document.querySelector('script[src*="announcements-widget"]') !== null ||
    document.querySelector('script[src*="widget"]') !== null ||
    // Add more checks based on your widget's specific identifiers
    document.querySelector('[data-announcements-widget]') !== null
  );
}

function enableOverlay() {
  if (active) return;

  // Check if widget script is present
  if (!isWidgetScriptPresent()) {
    showWidgetMissingMessage();
    return;
  }

  active = true;

  // Create highlight box
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

  // Add event listeners directly to document
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('click', onClick, true);
  document.addEventListener('keydown', onKeyDown);

  // Show instructions
  showInstructions();
}

function onMouseMove(e) {
  if (!active || !highlightBox) return;

  // Get the element at the mouse position
  const el = document.elementFromPoint(e.clientX, e.clientY);

  // Skip if it's our extension elements or widget containers
  if (!el ||
    el === highlightBox ||
    el.id === 'onboarding-overlay' ||
    el.id === 'onboarding-instructions' ||
    el.id === 'announcements-widget-container' ||
    el.closest('#announcements-widget-container')) {
    return;
  }

  // Get the bounding rect of the element
  const rect = el.getBoundingClientRect();

  // Account for scroll position
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;

  // Position the highlight box
  highlightBox.style.top = (rect.top + scrollY) + 'px';
  highlightBox.style.left = (rect.left + scrollX) + 'px';
  highlightBox.style.width = rect.width + 'px';
  highlightBox.style.height = rect.height + 'px';

  // Add some debugging info
  console.log('Hovering over:', {
    element: el,
    tagName: el.tagName,
    id: el.id,
    className: el.className,
    rect: rect,
    mousePos: { x: e.clientX, y: e.clientY }
  });
}

function onClick(e) {
  if (!active) return;

  e.preventDefault();
  e.stopPropagation();

  // Get the element at the click position
  const el = document.elementFromPoint(e.clientX, e.clientY);

  // Skip if it's our extension elements or widget containers
  if (!el ||
    el === highlightBox ||
    el.id === 'onboarding-overlay' ||
    el.id === 'onboarding-instructions' ||
    el.id === 'announcements-widget-container' ||
    el.closest('#announcements-widget-container')) {
    console.log('Skipping element:', el);
    return;
  }

  // Add debugging info for the clicked element
  console.log('Clicked on:', {
    element: el,
    tagName: el.tagName,
    id: el.id,
    className: el.className,
    textContent: el.textContent?.substring(0, 50),
    rect: el.getBoundingClientRect(),
    clickPos: { x: e.clientX, y: e.clientY }
  });

  const elementData = captureElement(el);
  console.log('Captured element data:', elementData);

  if (elementData) {
    console.log('Saving element to storage...');

    // Save directly to storage instead of relying on message passing
    chrome.storage.local.set({ capturedElement: elementData }, () => {
      console.log('Element saved to storage');

      // Try to send message to popup (in case it's open)
      chrome.runtime.sendMessage({
        action: 'elementCaptured',
        element: elementData
      }, (response) => {
        console.log('Message sent response:', response);
      });
    });

    // Show visual feedback
    showCaptureFeedback(el);

    // Automatically stop selection after capturing one element
    setTimeout(() => {
      disableOverlay();
    }, 1000);
  } else {
    console.log('Failed to capture element data');
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

  const instructions = document.getElementById('onboarding-instructions');
  if (instructions) instructions.remove();

  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('click', onClick, true);
  document.removeEventListener('keydown', onKeyDown);
}

function captureElement(el) {
  console.log('captureElement called with:', el);

  if (!el) {
    console.log('No element provided to captureElement');
    return null;
  }

  // Generate a unique selector using the better algorithm
  const selector = generateUniqueSelector(el);

  const tagName = el.tagName.toLowerCase();
  const id = el.id || '';
  const classes = Array.from(el.classList).join('.');
  const text = el.textContent?.trim().substring(0, 50) || '';

  const elementData = {
    selector,
    tagName,
    id,
    classes,
    text,
    timestamp: Date.now()
  };

  console.log('Generated element data:', elementData);

  // Validate the selector to make sure it works
  try {
    const testElement = document.querySelector(selector);
    if (testElement === el) {
      console.log('✅ Selector validation passed - selector correctly identifies the element');
    } else if (testElement) {
      console.warn('⚠️ Selector validation warning - selector found a different element');
      console.log('Expected element:', el);
      console.log('Found element:', testElement);
    } else {
      console.error('❌ Selector validation failed - selector found no element');
    }
  } catch (error) {
    console.error('❌ Selector validation error:', error);
  }

  return elementData;
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

  // Try classes with better logic
  if (el.className && typeof el.className === 'string') {
    const classes = el.className.trim().split(/\s+/).filter(c => c);
    if (classes.length > 0) {
      // Escape special characters in class names
      const escapedClasses = classes.map(cls => {
        // Escape special characters that are not valid in CSS selectors
        return cls.replace(/[^a-zA-Z0-9_-]/g, '\\$&');
      });

      // Try with tag name + classes first
      const tagClassSelector = `${el.tagName.toLowerCase()}.${escapedClasses.join('.')}`;

      try {
        const elementsWithTag = document.querySelectorAll(tagClassSelector);

        // If only one element with this tag + classes combination, use it
        if (elementsWithTag.length === 1) {
          return tagClassSelector;
        }

        // If multiple elements, try to find our specific element and create a unique selector
        for (let i = 0; i < elementsWithTag.length; i++) {
          if (elementsWithTag[i] === el) {
            // This is our element, create a unique selector
            // First try with parent context
            const parent = el.parentNode;
            if (parent && parent !== document.body) {
              const parentSelector = generateUniqueSelector(parent);
              if (parentSelector) {
                const uniqueSelector = `${parentSelector} > ${tagClassSelector}`;
                // Verify this selector is unique
                const matches = document.querySelectorAll(uniqueSelector);
                if (matches.length === 1 && matches[0] === el) {
                  return uniqueSelector;
                }
              }
            }

            // If parent context doesn't work, use nth-of-type for better specificity
            const tagName = el.tagName.toLowerCase();
            const allSameTag = document.querySelectorAll(tagName);
            let nthOfType = 0;
            for (let j = 0; j < allSameTag.length; j++) {
              if (allSameTag[j] === el) {
                nthOfType = j + 1;
                break;
              }
            }
            return `${tagName}:nth-of-type(${nthOfType})`;
          }
        }
      } catch (error) {
        console.warn('Invalid selector generated, falling back to path selector:', tagClassSelector);
        // If the selector is invalid, fall back to path selector
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
        // Escape special characters in class names for path selector
        const escapedClasses = classes.map(cls => {
          return cls.replace(/[^a-zA-Z0-9_-]/g, '\\$&');
        });
        selector += '.' + escapedClasses.join('.');
      }
    }

    // Add nth-child if needed - but be more specific about when to use it
    const siblings = Array.from(current.parentNode?.children || []);
    const index = siblings.indexOf(current) + 1;

    // Only add nth-child if there are multiple siblings of the same type
    const sameTagSiblings = siblings.filter(sibling => sibling.tagName === current.tagName);
    if (sameTagSiblings.length > 1) {
      const sameTagIndex = sameTagSiblings.indexOf(current) + 1;
      selector += `:nth-of-type(${sameTagIndex})`;
    } else if (siblings.length > 1) {
      // If no same-tag siblings but multiple siblings, use nth-child
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
    pointer-events: none;
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

function showWidgetMissingMessage() {
  const message = document.createElement('div');
  message.id = 'widget-missing-message';
  message.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #dc3545;
    color: white;
    padding: 20px;
    border-radius: 8px;
    font-size: 16px;
    z-index: 1000002;
    max-width: 400px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  `;

  message.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 12px;">⚠️ Widget Script Not Found</div>
    <div style="font-size: 14px; line-height: 1.4; margin-bottom: 16px;">
      This page doesn't seem to have the announcements widget script injected.
      <br><br>
      Element selection is only available on pages where the widget is active.
    </div>
    <button onclick="this.parentElement.remove()" style="
      background: white;
      color: #dc3545;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    ">Got it</button>
  `;

  document.body.appendChild(message);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (message.parentElement) {
      message.remove();
    }
  }, 5000);

  // Send message to popup to update status
  chrome.runtime.sendMessage({
    action: 'widgetMissing',
    message: 'Widget script not found on this page'
  });
}
