# API Reference

Complete reference for the helper functions and utilities in this boilerplate.

## 📋 Table of Contents

- [Messaging API](#messaging-api)
- [Storage API](#storage-api)
- [Chrome APIs](#chrome-apis)

---

## Messaging API

Located in `src/shared/messaging.ts`

### sendMessageToActiveTab()

Send a message to the content script in the currently active tab.

```typescript
sendMessageToActiveTab(message: Message): Promise<MessageResponse>
```

**Parameters:**
- `message`: Object with `type` (string) and optional `payload` (any)

**Returns:** Promise resolving to response from content script

**Example:**
```typescript
const response = await sendMessageToActiveTab({
  type: 'HIGHLIGHT_PAGE',
  payload: { color: 'yellow' }
})
```

**Throws:** Error if no active tab found

---

### sendMessageToTab()

Send a message to a specific tab's content script.

```typescript
sendMessageToTab(tabId: number, message: Message): Promise<MessageResponse>
```

**Parameters:**
- `tabId`: Chrome tab ID
- `message`: Message object

**Returns:** Promise resolving to response

**Example:**
```typescript
const response = await sendMessageToTab(123, {
  type: 'GET_PAGE_INFO'
})
```

---

### sendMessageToBackground()

Send a message to the service worker.

```typescript
sendMessageToBackground(message: Message): Promise<MessageResponse>
```

**Parameters:**
- `message`: Message object

**Returns:** Promise resolving to response from service worker

**Example:**
```typescript
const response = await sendMessageToBackground({
  type: 'SAVE_DATA',
  payload: { key: 'value' }
})
```

---

### broadcastMessage()

Send a message to all open tabs.

```typescript
broadcastMessage(message: Message): Promise<MessageResponse[]>
```

**Parameters:**
- `message`: Message object

**Returns:** Promise resolving to array of responses (null for tabs that didn't respond)

**Example:**
```typescript
const responses = await broadcastMessage({
  type: 'REFRESH_DATA'
})
console.log(`${responses.length} tabs responded`)
```

---

### onMessage()

Listen for messages from any source.

```typescript
onMessage(
  handler: (message: Message, sender: MessageSender) => MessageResponse | Promise<MessageResponse> | void
): void
```

**Parameters:**
- `handler`: Function to handle incoming messages

**Returns:** void

**Example:**
```typescript
onMessage((message, sender) => {
  if (message.type === 'PING') {
    return { success: true, data: 'PONG' }
  }
})

// Async handler
onMessage(async (message, sender) => {
  if (message.type === 'FETCH_DATA') {
    const data = await fetchData()
    return { success: true, data }
  }
})
```

**Note:** For async handlers, the function automatically handles the response channel.

---

## Storage API

Located in `src/shared/storage.ts`

### getStorage()

Retrieve value(s) from Chrome local storage.

```typescript
getStorage<T = any>(keys: string | string[]): Promise<T>
```

**Parameters:**
- `keys`: Single key (string) or array of keys

**Returns:** Promise resolving to the value(s)

**Example:**
```typescript
// Single value
const theme = await getStorage<string>('theme')

// Multiple values
const data = await getStorage<{ theme: string, count: number }>(['theme', 'count'])
console.log(data.theme, data.count)
```

---

### setStorage()

Save value(s) to Chrome local storage.

```typescript
setStorage(items: Record<string, any>): Promise<void>
```

**Parameters:**
- `items`: Object with key-value pairs to save

**Returns:** Promise resolving when saved

**Example:**
```typescript
await setStorage({
  theme: 'dark',
  count: 5,
  user: { name: 'John', email: 'john@example.com' }
})
```

---

### removeStorage()

Remove value(s) from storage.

```typescript
removeStorage(keys: string | string[]): Promise<void>
```

**Parameters:**
- `keys`: Single key or array of keys to remove

**Returns:** Promise resolving when removed

**Example:**
```typescript
await removeStorage('theme')
await removeStorage(['theme', 'count'])
```

---

### clearStorage()

Clear all data from storage.

```typescript
clearStorage(): Promise<void>
```

**Returns:** Promise resolving when cleared

**Example:**
```typescript
await clearStorage()
```

**Warning:** This removes ALL extension data. Use with caution.

---

### getAllStorage()

Get all data from storage.

```typescript
getAllStorage(): Promise<Record<string, any>>
```

**Returns:** Promise resolving to object with all stored data

**Example:**
```typescript
const allData = await getAllStorage()
console.log('All stored data:', allData)
```

---

### onStorageChange()

Listen for storage changes.

```typescript
onStorageChange(
  callback: (changes: { [key: string]: StorageChange }) => void
): void
```

**Parameters:**
- `callback`: Function called when storage changes

**Returns:** void

**Example:**
```typescript
onStorageChange((changes) => {
  if (changes.theme) {
    console.log('Theme changed from', changes.theme.oldValue, 'to', changes.theme.newValue)
  }
})
```

---

### syncStorage

Sync storage API (synced across devices).

```typescript
syncStorage.get<T>(keys: string | string[]): Promise<T>
syncStorage.set(items: Record<string, any>): Promise<void>
syncStorage.remove(keys: string | string[]): Promise<void>
syncStorage.clear(): Promise<void>
```

**Example:**
```typescript
// Save to sync storage (synced across user's devices)
await syncStorage.set({ theme: 'dark' })

// Get from sync storage
const theme = await syncStorage.get<string>('theme')
```

**Note:** Sync storage has quota limits (100KB total, 8KB per item). Use for user preferences only.

---

## Chrome APIs

Common Chrome extension APIs you'll use.

### chrome.tabs

Interact with browser tabs.

```typescript
// Get current tab
const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

// Get all tabs
const tabs = await chrome.tabs.query({})

// Create new tab
await chrome.tabs.create({ url: 'https://example.com' })

// Close tab
await chrome.tabs.remove(tabId)

// Update tab
await chrome.tabs.update(tabId, { url: 'https://example.com' })

// Reload tab
await chrome.tabs.reload(tabId)

// Listen for tab events
chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log('Tab activated:', activeInfo.tabId)
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    console.log('Tab loaded:', tab.url)
  }
})
```

---

### chrome.runtime

Extension runtime and messaging.

```typescript
// Send message
const response = await chrome.runtime.sendMessage({ type: 'HELLO' })

// Listen for messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message)
  sendResponse({ received: true })
  return true // Keep channel open for async
})

// Get extension URL
const url = chrome.runtime.getURL('icons/icon.png')

// Get manifest
const manifest = chrome.runtime.getManifest()
console.log('Version:', manifest.version)

// Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Extension installed!')
  }
})
```

---

### chrome.storage

Persistent storage (see Storage API above for helpers).

```typescript
// Local storage (not synced)
await chrome.storage.local.set({ key: 'value' })
const result = await chrome.storage.local.get(['key'])

// Sync storage (synced across devices)
await chrome.storage.sync.set({ theme: 'dark' })
const data = await chrome.storage.sync.get(['theme'])

// Listen for changes
chrome.storage.onChanged.addListener((changes, area) => {
  console.log('Storage changed:', changes)
})
```

---

### chrome.scripting

Inject scripts and CSS into pages.

```typescript
// Execute script in tab
await chrome.scripting.executeScript({
  target: { tabId: tab.id },
  func: () => {
    document.body.style.backgroundColor = 'red'
  }
})

// Inject CSS
await chrome.scripting.insertCSS({
  target: { tabId: tab.id },
  css: 'body { background: red; }'
})

// Remove CSS
await chrome.scripting.removeCSS({
  target: { tabId: tab.id },
  css: 'body { background: red; }'
})
```

**Required permission:** `"scripting"`

---

### chrome.action

Control extension icon and popup.

```typescript
// Set badge text
chrome.action.setBadgeText({ text: '5' })

// Set badge color
chrome.action.setBadgeBackgroundColor({ color: '#FF0000' })

// Set icon
chrome.action.setIcon({
  path: {
    16: 'icons/icon16.png',
    48: 'icons/icon48.png'
  }
})

// Set title (tooltip)
chrome.action.setTitle({ title: 'New title' })

// Listen for icon click
chrome.action.onClicked.addListener((tab) => {
  console.log('Icon clicked in tab:', tab.id)
})
```

---

### chrome.contextMenus

Add right-click menu items.

```typescript
// Create menu item
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'myMenu',
    title: 'My Action',
    contexts: ['page', 'selection', 'image', 'link']
  })
})

// Handle clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'myMenu') {
    console.log('Menu clicked:', info.selectionText)
  }
})
```

**Required permission:** `"contextMenus"`

---

### chrome.alarms

Schedule periodic tasks.

```typescript
// Create alarm
chrome.alarms.create('myAlarm', {
  delayInMinutes: 1,
  periodInMinutes: 5
})

// Listen for alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'myAlarm') {
    console.log('Alarm triggered!')
  }
})

// Clear alarm
chrome.alarms.clear('myAlarm')
```

**Required permission:** `"alarms"`

---

### chrome.notifications

Show desktop notifications.

```typescript
chrome.notifications.create({
  type: 'basic',
  iconUrl: 'icons/icon48.png',
  title: 'Hello!',
  message: 'This is a notification'
})
```

**Required permission:** `"notifications"`

---

## Type Definitions

### Message

```typescript
interface Message {
  type: string
  payload?: any
}
```

### MessageResponse

```typescript
interface MessageResponse {
  success?: boolean
  data?: any
  error?: string
  [key: string]: any
}
```

### StorageChange

```typescript
interface StorageChange {
  oldValue?: any
  newValue?: any
}
```

---

## Best Practices

1. **Always handle errors** in async operations
2. **Return `true`** in message listeners for async responses
3. **Use TypeScript generics** for type-safe storage operations
4. **Debounce frequent operations** to avoid performance issues
5. **Check permissions** before using Chrome APIs
6. **Clean up listeners** when components unmount

---

## Additional Resources

- [Chrome Extension API Reference](https://developer.chrome.com/docs/extensions/reference/)
- [Manifest V3 Documentation](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Chrome Extension Samples](https://github.com/GoogleChrome/chrome-extensions-samples)
