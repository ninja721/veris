# Development Guide

This guide explains how to develop Chrome extensions using this boilerplate.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Development Workflow](#development-workflow)
- [Component Communication](#component-communication)
- [Common Patterns](#common-patterns)
- [Debugging](#debugging)
- [Best Practices](#best-practices)

## 🏗️ Architecture Overview

### Extension Components

```
┌─────────────────────────────────────────────────────────┐
│                    Chrome Browser                        │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐      ┌──────────────┐                │
│  │    Popup     │◄────►│   Service    │                │
│  │   (React)    │      │   Worker     │                │
│  └──────────────┘      └──────────────┘                │
│         │                      │                         │
│         │                      │                         │
│         └──────────┬───────────┘                        │
│                    │                                     │
│                    ▼                                     │
│         ┌──────────────────────┐                        │
│         │   Content Script     │                        │
│         │   (Injected in page) │                        │
│         └──────────────────────┘                        │
│                    │                                     │
│         ┌──────────▼──────────┐                        │
│         │      Web Page       │                        │
│         │        DOM          │                        │
│         └─────────────────────┘                        │
└─────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Purpose | Can Access | Lifespan |
|-----------|---------|------------|----------|
| **Popup** | User interface | Chrome APIs, messaging | While open |
| **Service Worker** | Background tasks, event handling | Chrome APIs, messaging | Event-driven |
| **Content Script** | Page manipulation | DOM, messaging | Per page load |

## 🔄 Development Workflow

### 1. Initial Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Load Extension in Chrome

1. Build the extension: `npm run build`
2. Open Chrome: `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `dist` folder

### 3. Development Cycle

```bash
# Make changes to your code
# ↓
# Vite automatically rebuilds
# ↓
# Reload extension in Chrome (click refresh icon)
# ↓
# For content script changes: also refresh the web page
```

### Hot Reload Tips

- **Popup changes**: Close and reopen the popup
- **Content script changes**: Refresh the web page
- **Service worker changes**: Click "Reload" in chrome://extensions/
- **Manifest changes**: Always requires full reload

## 💬 Component Communication

### Popup → Content Script

```typescript
// In popup/App.tsx
import { sendMessageToActiveTab } from '../shared/messaging'

const response = await sendMessageToActiveTab({
  type: 'DO_SOMETHING',
  payload: { data: 'hello' }
})
```

```typescript
// In content/content.ts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'DO_SOMETHING') {
    // Do something with the page
    sendResponse({ success: true })
  }
  return true
})
```

### Popup → Service Worker

```typescript
// In popup/App.tsx
import { sendMessageToBackground } from '../shared/messaging'

const response = await sendMessageToBackground({
  type: 'BACKGROUND_TASK',
  payload: { data: 'hello' }
})
```

```typescript
// In background/service-worker.ts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'BACKGROUND_TASK') {
    // Do background work
    sendResponse({ success: true })
  }
  return true
})
```

### Content Script → Service Worker

```typescript
// In content/content.ts
const response = await chrome.runtime.sendMessage({
  type: 'PAGE_EVENT',
  payload: { url: window.location.href }
})
```

### Service Worker → Content Script

```typescript
// In background/service-worker.ts
chrome.tabs.query({ active: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id!, {
    type: 'UPDATE_PAGE',
    payload: { data: 'hello' }
  })
})
```

## 🎯 Common Patterns

### 1. Modifying Page Content

```typescript
// content/content.ts
function changeBackgroundColor(color: string) {
  document.body.style.backgroundColor = color
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'CHANGE_COLOR') {
    changeBackgroundColor(message.payload.color)
  }
})
```

### 2. Extracting Page Data

```typescript
// content/content.ts
function getPageData() {
  return {
    title: document.title,
    url: window.location.href,
    links: Array.from(document.querySelectorAll('a')).map(a => a.href),
    images: Array.from(document.querySelectorAll('img')).map(img => img.src)
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_PAGE_DATA') {
    sendResponse({ success: true, data: getPageData() })
  }
  return true
})
```

### 3. Persistent Storage

```typescript
// Using storage helpers
import { getStorage, setStorage } from '../shared/storage'

// Save data
await setStorage({ theme: 'dark', count: 5 })

// Load data
const theme = await getStorage<string>('theme')
const data = await getStorage<{ theme: string, count: number }>(['theme', 'count'])
```

### 4. Injecting UI Elements

```typescript
// content/content.ts
function injectButton() {
  const button = document.createElement('button')
  button.textContent = 'Click me!'
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 999999;
    padding: 10px 20px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  `
  
  button.addEventListener('click', () => {
    alert('Button clicked!')
  })
  
  document.body.appendChild(button)
}

// Call when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectButton)
} else {
  injectButton()
}
```

### 5. Monitoring Page Changes (SPAs)

```typescript
// content/content.ts
let lastUrl = window.location.href

new MutationObserver(() => {
  const currentUrl = window.location.href
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl
    console.log('URL changed:', currentUrl)
    
    // Notify background
    chrome.runtime.sendMessage({
      type: 'URL_CHANGED',
      payload: { url: currentUrl }
    })
  }
}).observe(document, { subtree: true, childList: true })
```

### 6. Context Menus

```typescript
// background/service-worker.ts
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'myAction',
    title: 'Do Something',
    contexts: ['page', 'selection']
  })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'myAction' && tab?.id) {
    chrome.tabs.sendMessage(tab.id, {
      type: 'CONTEXT_ACTION',
      payload: { text: info.selectionText }
    })
  }
})
```

### 7. Keyboard Shortcuts

Add to `manifest.json`:

```json
{
  "commands": {
    "toggle-feature": {
      "suggested_key": {
        "default": "Ctrl+Shift+Y",
        "mac": "Command+Shift+Y"
      },
      "description": "Toggle feature"
    }
  }
}
```

Handle in service worker:

```typescript
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-feature') {
    // Do something
  }
})
```

## 🐛 Debugging

### Popup Debugging

1. Right-click the extension icon
2. Select "Inspect popup"
3. DevTools opens for the popup

### Content Script Debugging

1. Open DevTools on the web page (F12)
2. Content script logs appear in the page console
3. Look for your console.log messages

### Service Worker Debugging

1. Go to `chrome://extensions/`
2. Find your extension
3. Click "Inspect views: service worker"
4. Service worker console opens

### Common Issues

**Content script not loading:**
- Check `matches` pattern in manifest.json
- Reload the extension
- Refresh the web page
- Check for JavaScript errors

**Messages not received:**
- Ensure `return true` in message listeners for async responses
- Check sender/receiver is active
- Verify message type matches

**Storage not persisting:**
- Check you're using `chrome.storage` not `localStorage`
- Verify permissions in manifest.json
- Check for errors in console

## ✅ Best Practices

### 1. Message Handling

```typescript
// ✅ Good: Always return true for async responses
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessageAsync(message).then(sendResponse)
  return true // Keep channel open
})

// ❌ Bad: Async without return true
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessageAsync(message).then(sendResponse)
  // Missing return true!
})
```

### 2. Error Handling

```typescript
// ✅ Good: Handle errors gracefully
try {
  const response = await sendMessageToActiveTab({ type: 'ACTION' })
  if (response.success) {
    // Handle success
  }
} catch (error) {
  console.error('Failed to send message:', error)
  // Show user-friendly error
}
```

### 3. Content Script Isolation

```typescript
// ✅ Good: Use unique IDs and data attributes
const overlay = document.createElement('div')
overlay.id = 'my-extension-overlay-unique-id'
overlay.setAttribute('data-my-extension', 'true')

// ❌ Bad: Generic IDs that might conflict
const overlay = document.createElement('div')
overlay.id = 'overlay' // Might conflict with page
```

### 4. Performance

```typescript
// ✅ Good: Debounce frequent operations
let timeout: number
function debouncedUpdate() {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    // Do expensive operation
  }, 300)
}

// ❌ Bad: Running expensive operations on every event
document.addEventListener('scroll', () => {
  // Expensive operation runs constantly
})
```

### 5. Permissions

```json
// ✅ Good: Request only what you need
{
  "permissions": ["storage", "activeTab"],
  "host_permissions": ["https://example.com/*"]
}

// ❌ Bad: Requesting unnecessary permissions
{
  "permissions": ["storage", "activeTab", "tabs", "history", "bookmarks"],
  "host_permissions": ["<all_urls>"]
}
```

## 🚀 Next Steps

1. **Customize the popup UI** in `src/popup/App.tsx`
2. **Add page interactions** in `src/content/content.ts`
3. **Implement background tasks** in `src/background/service-worker.ts`
4. **Update manifest.json** with your extension details
5. **Add your icons** to the `icons/` folder
6. **Test thoroughly** on different websites
7. **Build and publish** to Chrome Web Store

## 📚 Additional Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Chrome Extension Samples](https://github.com/GoogleChrome/chrome-extensions-samples)
- [Web Store Publishing](https://developer.chrome.com/docs/webstore/publish/)
