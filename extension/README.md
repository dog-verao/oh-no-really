# Onboarding Builder Extension

A Chrome extension that allows you to select elements on any webpage to create onboarding flows for your application.

## Features

- **Element Selection**: Click on any element to capture its CSS selector
- **Smart Selector Generation**: Automatically generates unique and reliable CSS selectors
- **Visual Feedback**: See highlighted elements and capture confirmations
- **Element Management**: View, copy, and remove captured elements
- **Keyboard Shortcuts**: Press ESC to stop selection mode

## Installation

### Development Mode

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select the `extension` folder
4. The extension should now appear in your extensions list

### Production Installation

1. Package the extension (instructions below)
2. Drag and drop the `.crx` file into Chrome's extensions page
3. Or publish to the Chrome Web Store

## Usage

1. **Start Selection**: Click the extension icon and press "Start Element Selection"
2. **Select Elements**: Hover over elements to highlight them, then click to capture
3. **View Results**: Captured elements appear in the popup with their selectors
4. **Copy Selectors**: Click "Copy" to copy a selector to your clipboard
5. **Stop Selection**: Press "Stop Selection" or ESC key

## How It Works

### Selector Generation

The extension uses a smart algorithm to generate unique CSS selectors:

1. **ID-based**: If an element has an ID, uses `#id`
2. **Data attributes**: Uses `[data-attribute="value"]` selectors
3. **Class-based**: Uses unique class combinations
4. **Path-based**: Falls back to DOM path with nth-child selectors

### Communication Flow

1. **Popup** → **Background Script**: User clicks start/stop buttons
2. **Background Script** → **Content Script**: Injects functions to enable/disable overlay
3. **Content Script** → **Popup**: Sends captured element data
4. **Storage**: Elements are saved locally using Chrome's storage API

## File Structure

```
extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for communication
├── content.js            # Injected into web pages
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── overlay.css           # Additional styles
└── README.md            # This file
```

## Development

### Making Changes

1. Edit the source files in the `extension` folder
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes

### Debugging

- **Popup**: Right-click the extension icon and select "Inspect popup"
- **Content Script**: Use browser dev tools on the target page
- **Background Script**: Go to `chrome://extensions/`, find your extension, and click "service worker"

### Building for Production

1. Zip the extension folder
2. Use Chrome's "Pack extension" feature or a build tool
3. The resulting `.crx` file can be distributed

## API Reference

### Background Script Messages

- `{ action: 'startSelection' }` - Start element selection mode
- `{ action: 'stopSelection' }` - Stop element selection mode
- `{ action: 'getStatus' }` - Get current selection status

### Content Script Messages

- `{ action: 'elementCaptured', element: {...} }` - Send captured element data

### Element Data Structure

```javascript
{
  selector: "string",      // CSS selector
  tagName: "string",       // HTML tag name
  id: "string",           // Element ID (if any)
  classes: "string",      // Class names
  text: "string",         // Element text content (truncated)
  timestamp: number       // Capture timestamp
}
```

## Troubleshooting

### Common Issues

1. **Extension not working**: Check if it's enabled in `chrome://extensions/`
2. **Elements not highlighting**: Ensure the page allows content scripts
3. **Selectors not unique**: The extension will use path-based selectors as fallback
4. **Storage not working**: Check if storage permission is granted

### Permissions

- `scripting`: Inject scripts into web pages
- `activeTab`: Access the current tab
- `storage`: Save captured elements locally

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This extension is part of the Onboarding Builder project.
