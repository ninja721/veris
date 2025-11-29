# Extension Bro

> A modern Chrome extension boilerplate with premium UI design, React, TypeScript, Vite, and Tailwind CSS.

Build professional Chrome extensions with a beautiful, production-ready foundation.

## ✨ Highlights

- 🎨 **Premium UI Design** - Luxury gradients inspired by Apple, Google, Uber
- 🎯 **Professional Icons** - Auto-generated high-quality icons
- 🌈 **Modern Color Palette** - Purple, pink, and luxury themes
- 🔔 **Toast Notifications** - Beautiful feedback system
- ⚡ **Loading States** - Smooth spinners and animations
- 📚 **Clean Documentation** - Essential guides only
- 🎨 **Design System** - Reusable design tokens

## 🚀 Features

- ⚡ **Vite** - Lightning-fast HMR and build
- ⚛️ **React 18** - Modern React with hooks
- 🎨 **Tailwind CSS** - Utility-first styling with luxury design tokens
- 📘 **TypeScript** - Full type safety
- 🔧 **Manifest V3** - Latest Chrome extension standard
- 🎯 **Content Scripts** - Inject code into web pages
- 🔄 **Service Worker** - Background processing
- 💬 **Message Passing** - Communication between components
- 🧪 **Vitest** - Fast unit testing
- 🎨 **Premium Design System** - Professional UI components and patterns

## 📁 Project Structure

```
chrome-extension-boilerplate/
├── src/
│   ├── popup/              # Extension popup UI (React app)
│   │   ├── App.tsx         # Main popup component
│   │   └── main.tsx        # Popup entry point
│   │
│   ├── content/            # Content scripts (injected into web pages)
│   │   └── content.ts      # Main content script
│   │
│   ├── background/         # Service worker (background tasks)
│   │   └── service-worker.ts
│   │
│   ├── shared/             # Shared utilities and types
│   │   ├── messaging.ts    # Message passing helpers
│   │   └── storage.ts      # Chrome storage helpers
│   │
│   └── types/              # TypeScript type definitions
│       └── index.ts
│
├── public/                 # Static assets
│   └── icons/              # Extension icons
│
├── index.html              # Popup HTML template
├── manifest.json           # Extension manifest
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
└── package.json
```

## 🎯 Component Overview

### 1. **Popup** (`src/popup/`)
The UI that appears when users click the extension icon in the toolbar.
- Built with React
- Styled with Tailwind CSS
- Can communicate with content scripts and service worker

### 2. **Content Script** (`src/content/`)
JavaScript that runs in the context of web pages.
- Can access and modify the DOM
- Isolated from page scripts
- Communicates via message passing

### 3. **Service Worker** (`src/background/`)
Background script that handles events and long-running tasks.
- Manages extension lifecycle
- Handles browser events
- Coordinates between popup and content scripts

## 🛠️ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Build the extension
npm run build

# 3. Load in Chrome
# - Open chrome://extensions/
# - Enable "Developer mode"
# - Click "Load unpacked"
# - Select the "dist" folder

# 4. Start developing
npm run dev  # For UI development
npm run build  # For testing features
```

### Available Commands

```bash
npm run dev        # Start dev server (UI development)
npm run build      # Build extension (feature testing)
npm run typecheck  # Check TypeScript types
npm test           # Run tests
npm run zip        # Create distribution ZIP
```

## 🎨 Customization

### Change Extension Name & Branding

Edit `manifest.json`:
```json
{
  "name": "Your Extension Name",
  "description": "Your extension description"
}
```

### Customize Colors

Edit `tailwind.config.js`:
```js
colors: {
  primary: {
    500: '#YOUR_COLOR',
  }
}
```

### Regenerate Icons

Modify colors in `scripts/generate-icons.js`, then run:
```bash
npm run generate-icons
```

## 📝 How to Use This Boilerplate

### Adding Popup UI Features

Edit `src/popup/App.tsx`:

```tsx
export default function App() {
  const handleClick = async () => {
    // Send message to content script
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id!, { type: 'DO_SOMETHING' });
  };

  return (
    <div className="p-4">
      <button onClick={handleClick}>Click Me</button>
    </div>
  );
}
```

### Modifying Web Pages (Content Script)

Edit `src/content/content.ts`:

```typescript
// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'DO_SOMETHING') {
    // Modify the page
    document.body.style.backgroundColor = 'lightblue';
    sendResponse({ success: true });
  }
  return true;
});
```

### Background Tasks (Service Worker)

Edit `src/background/service-worker.ts`:

```typescript
// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed!');
});

// Handle messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'BACKGROUND_TASK') {
    // Do background work
    sendResponse({ result: 'done' });
  }
  return true;
});
```

## 🔧 Configuration

### Permissions

Edit `manifest.json` to add required permissions:

```json
{
  "permissions": [
    "storage",      // Chrome storage API
    "activeTab",    // Access active tab
    "scripting"     // Inject scripts
  ],
  "host_permissions": [
    "<all_urls>"    // Access all websites (adjust as needed)
  ]
}
```

### Content Script Matching

Control which pages your content script runs on:

```json
{
  "content_scripts": [
    {
      "matches": ["https://*.example.com/*"],  // Only example.com
      "js": ["src/content-script.js"]
    }
  ]
}
```

## 📚 Key Concepts

### Message Passing

Communication between different parts of the extension:

```typescript
// From popup to content script
const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
const response = await chrome.tabs.sendMessage(tab.id!, { type: 'HELLO' });

// From content script to service worker
const response = await chrome.runtime.sendMessage({ type: 'HELLO' });

// Listening for messages (any component)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received:', message);
  sendResponse({ received: true });
  return true; // Keep channel open for async response
});
```

### Storage

Persist data across sessions:

```typescript
// Save data
await chrome.storage.local.set({ key: 'value' });

// Retrieve data
const result = await chrome.storage.local.get(['key']);
console.log(result.key); // 'value'

// Listen for changes
chrome.storage.onChanged.addListener((changes, area) => {
  console.log('Storage changed:', changes);
});
```

## 🎨 Styling

This boilerplate uses Tailwind CSS. Customize in `tailwind.config.js`:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        // Add your colors
      },
    },
  },
};
```

## 🧪 Testing

Write tests in `src/**/*.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';

describe('My Feature', () => {
  it('should work', () => {
    expect(true).toBe(true);
  });
});
```

## 📦 Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist` folder ready for:
- Chrome Web Store submission
- Distribution as unpacked extension

### Creating a ZIP for Chrome Web Store

```bash
npm run zip
```

## 🔍 Troubleshooting

### Content script not loading
- Check `matches` pattern in `manifest.json`
- Reload the extension in `chrome://extensions/`
- Refresh the web page

### Popup not updating
- Hard refresh the popup (right-click → Reload)
- Check console for errors (right-click popup → Inspect)

### Service worker issues
- Check service worker console in `chrome://extensions/` → "Inspect views: service worker"
- Service workers auto-sleep; use `chrome.runtime.onMessage` to wake them

## 📖 Documentation

### Essential Guides
- 🚀 **[START_HERE.md](./START_HERE.md)** - New? Start here!
- 📘 **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 5 minutes
- ✨ **[FEATURES.md](./FEATURES.md)** - See what's included
- 🔧 **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Development patterns and best practices
- 💡 **[EXAMPLES.md](./EXAMPLES.md)** - 8+ practical code examples
- 📚 **[API.md](./API.md)** - Complete API reference
- 🎨 **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Design tokens and usage
- 🔧 **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Fix common issues
- 📁 **[STRUCTURE.md](./STRUCTURE.md)** - Project organization
- 🤝 **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guide

## 📖 External Resources

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details. Use freely for your projects!
