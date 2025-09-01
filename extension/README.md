# Onboarding Builder Extension

A Chrome extension for selecting and capturing DOM elements to create onboarding flows. This extension allows you to highlight and capture elements on any webpage, generating unique CSS selectors for each element.

## Features

- **Element Highlighting**: Hover over any element to see it highlighted with a blue border
- **Element Selection**: Click on elements to capture their selectors
- **Unique Selector Generation**: Automatically generates unique CSS selectors for captured elements
- **Element Testing**: Test captured selectors to verify they work on the current page
- **Export Functionality**: Export captured elements as JSON
- **Cross-page Compatibility**: Works on any webpage, even without your widget script

## Recent Fixes

### Fixed Issues:
1. **Click Selection**: Fixed the click handling to properly capture elements when clicked
2. **Overlay Interaction**: Improved the overlay system to prevent interference with element selection
3. **Element Detection**: Enhanced element detection to exclude UI elements from the extension itself
4. **Duplicate Prevention**: Added checks to prevent capturing the same element multiple times
5. **Better Feedback**: Improved visual feedback and user notifications
6. **Selector Specificity**: Fixed selector generation to create unique, specific selectors for similar elements

### Key Improvements:
- **Transparent Overlay**: Changed overlay to transparent with `pointer-events: auto` for better click handling
- **Crosshair Cursor**: Added crosshair cursor to indicate selection mode
- **Element Validation**: Added duplicate detection and better element validation
- **Test Functionality**: Added ability to test captured selectors on the current page
- **Export/Import**: Added JSON export functionality for captured elements
- **Smart Selector Generation**: Improved selector algorithm to handle similar elements (like cards in a grid)
- **Selector Validation**: Added automatic validation to ensure selectors work correctly
- **Better nth-child Logic**: Uses nth-of-type for better specificity when dealing with similar elements

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `extension` folder
4. The extension icon should appear in your toolbar

## Usage

1. **Start Selection**: Click the extension icon and press "Start Element Selection"
2. **Highlight Elements**: Hover over elements on the page to see them highlighted
3. **Capture Elements**: Click on elements to capture their selectors
4. **Test Selectors**: Use the "Test" button to verify selectors work on the current page
5. **Export Data**: Use "Export JSON" to save captured elements
6. **Stop Selection**: Press "Stop Selection" or ESC key to end selection mode

## Testing

Use the included test files to test the extension functionality:

- **`test.html`**: General test page with various elements and attributes
- **`test-cards.html`**: Specific test for card grid layouts and similar elements

The `test-cards.html` file is particularly useful for testing the improved selector generation with multiple similar elements (like product cards in a grid).

## File Structure

```
extension/
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── content.js            # Content script for element interaction
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── overlay.css           # Styles for overlay elements
├── test.html             # Test page for extension
└── README.md             # This file
```

## Selector Generation Strategy

The extension uses a multi-tier approach to generate unique selectors:

1. **ID Selectors**: If an element has an ID, use `#id`
2. **Data Attributes**: Use `data-*` attributes if available
3. **Class Selectors**: Use unique class combinations with parent context
4. **nth-of-type Selectors**: Use nth-of-type for better specificity with similar elements
5. **Path Selectors**: Generate full DOM path with nth-child/nth-of-type selectors

### Improved Algorithm:
- **Parent Context**: When multiple elements have the same classes, the selector includes parent context
- **nth-of-type**: Uses nth-of-type instead of nth-child for better specificity
- **Validation**: Automatically validates selectors to ensure they work correctly
- **Fallback**: Falls back to path-based selectors when simpler methods aren't unique enough

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: `scripting`, `activeTab`, `storage`
- **Content Script**: Runs on all URLs (`<all_urls>`)
- **Background Script**: Service worker for cross-tab communication
- **Storage**: Uses Chrome's local storage for persistence

## Troubleshooting

### Common Issues:

1. **Elements not highlighting**: Make sure the extension is active and you're hovering over actual page elements
2. **Click not working**: Try refreshing the page and restarting the extension
3. **Selectors not unique**: The extension will generate path-based selectors for complex elements
4. **Test button not working**: Make sure you're on the same page where the element was captured

### Debug Mode:
- Open Chrome DevTools
- Check the Console tab for any error messages
- Verify the extension is loaded in `chrome://extensions/`

## Development

To modify the extension:

1. Edit the relevant files in the `extension/` folder
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes

## Browser Compatibility

- Chrome 88+ (Manifest V3)
- Edge 88+ (Chromium-based)
- Other Chromium-based browsers

## License

This extension is part of the Onboarding Builder project.
