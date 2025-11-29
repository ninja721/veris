# Extension Examples

Practical examples to help you build common Chrome extension features.

## 📋 Table of Contents

1. [Page Highlighter](#1-page-highlighter)
2. [Text Replacer](#2-text-replacer)
3. [Screenshot Tool](#3-screenshot-tool)
4. [Tab Manager](#4-tab-manager)
5. [Form Autofill](#5-form-autofill)
6. [Dark Mode Toggle](#6-dark-mode-toggle)
7. [Link Collector](#7-link-collector)
8. [Word Counter](#8-word-counter)

---

## 1. Page Highlighter

Highlight all instances of a word on the page.

### Popup (src/popup/App.tsx)

```tsx
const [searchTerm, setSearchTerm] = useState('')

const handleHighlight = async () => {
  await sendMessageToActiveTab({
    type: 'HIGHLIGHT_TEXT',
    payload: { term: searchTerm }
  })
}

return (
  <div className="p-4">
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Enter text to highlight"
      className="border p-2 rounded w-full"
    />
    <button onClick={handleHighlight} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
      Highlight
    </button>
  </div>
)
```

### Content Script (src/content/content.ts)

```typescript
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'HIGHLIGHT_TEXT') {
    highlightText(message.payload.term)
    sendResponse({ success: true })
  }
  return true
})

function highlightText(term: string) {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null
  )

  const nodesToReplace: { node: Text; text: string }[] = []

  while (walker.nextNode()) {
    const node = walker.currentNode as Text
    if (node.textContent?.toLowerCase().includes(term.toLowerCase())) {
      nodesToReplace.push({ node, text: node.textContent })
    }
  }

  nodesToReplace.forEach(({ node, text }) => {
    const regex = new RegExp(`(${term})`, 'gi')
    const highlighted = text.replace(
      regex,
      '<mark style="background: yellow; padding: 2px;">$1</mark>'
    )
    const span = document.createElement('span')
    span.innerHTML = highlighted
    node.parentNode?.replaceChild(span, node)
  })
}
```

---

## 2. Text Replacer

Replace all instances of one word with another.

### Popup

```tsx
const [findText, setFindText] = useState('')
const [replaceText, setReplaceText] = useState('')

const handleReplace = async () => {
  await sendMessageToActiveTab({
    type: 'REPLACE_TEXT',
    payload: { find: findText, replace: replaceText }
  })
}
```

### Content Script

```typescript
function replaceText(find: string, replace: string) {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null
  )

  const nodesToReplace: Text[] = []
  while (walker.nextNode()) {
    const node = walker.currentNode as Text
    if (node.textContent?.includes(find)) {
      nodesToReplace.push(node)
    }
  }

  nodesToReplace.forEach(node => {
    node.textContent = node.textContent!.replaceAll(find, replace)
  })
}
```

---

## 3. Screenshot Tool

Capture visible tab as image.

### Popup

```tsx
const handleScreenshot = async () => {
  const response = await sendMessageToBackground({ type: 'TAKE_SCREENSHOT' })
  if (response.dataUrl) {
    // Download or display the image
    const link = document.createElement('a')
    link.href = response.dataUrl
    link.download = 'screenshot.png'
    link.click()
  }
}
```

### Service Worker

```typescript
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TAKE_SCREENSHOT') {
    chrome.tabs.captureVisibleTab(
      { format: 'png' },
      (dataUrl) => {
        sendResponse({ success: true, dataUrl })
      }
    )
    return true
  }
})
```

### Required Permission (manifest.json)

```json
{
  "permissions": ["activeTab"]
}
```

---

## 4. Tab Manager

List and manage open tabs.

### Popup

```tsx
const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([])

useEffect(() => {
  chrome.tabs.query({}, (allTabs) => {
    setTabs(allTabs)
  })
}, [])

const closeTab = (tabId: number) => {
  chrome.tabs.remove(tabId, () => {
    setTabs(tabs.filter(t => t.id !== tabId))
  })
}

return (
  <div className="p-4 w-96">
    <h2 className="font-bold mb-2">Open Tabs ({tabs.length})</h2>
    {tabs.map(tab => (
      <div key={tab.id} className="flex items-center justify-between p-2 border-b">
        <span className="text-sm truncate flex-1">{tab.title}</span>
        <button
          onClick={() => closeTab(tab.id!)}
          className="ml-2 text-red-500 hover:text-red-700"
        >
          ✕
        </button>
      </div>
    ))}
  </div>
)
```

### Required Permission

```json
{
  "permissions": ["tabs"]
}
```

---

## 5. Form Autofill

Auto-fill forms with saved data.

### Popup

```tsx
const [formData, setFormData] = useState({ name: '', email: '' })

const saveData = async () => {
  await setStorage({ formData })
}

const fillForm = async () => {
  await sendMessageToActiveTab({
    type: 'FILL_FORM',
    payload: formData
  })
}
```

### Content Script

```typescript
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'FILL_FORM') {
    const { name, email } = message.payload
    
    // Find and fill name field
    const nameInput = document.querySelector<HTMLInputElement>(
      'input[name="name"], input[id="name"], input[type="text"]'
    )
    if (nameInput) nameInput.value = name
    
    // Find and fill email field
    const emailInput = document.querySelector<HTMLInputElement>(
      'input[name="email"], input[id="email"], input[type="email"]'
    )
    if (emailInput) emailInput.value = email
  }
})
```

---

## 6. Dark Mode Toggle

Toggle dark mode on any website.

### Popup

```tsx
const [isDark, setIsDark] = useState(false)

const toggleDarkMode = async () => {
  const newMode = !isDark
  setIsDark(newMode)
  await sendMessageToActiveTab({
    type: 'TOGGLE_DARK_MODE',
    payload: { enabled: newMode }
  })
}
```

### Content Script

```typescript
let darkModeStyle: HTMLStyleElement | null = null

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'TOGGLE_DARK_MODE') {
    if (message.payload.enabled) {
      enableDarkMode()
    } else {
      disableDarkMode()
    }
  }
})

function enableDarkMode() {
  if (darkModeStyle) return
  
  darkModeStyle = document.createElement('style')
  darkModeStyle.textContent = `
    html {
      filter: invert(1) hue-rotate(180deg);
    }
    img, video, [style*="background-image"] {
      filter: invert(1) hue-rotate(180deg);
    }
  `
  document.head.appendChild(darkModeStyle)
}

function disableDarkMode() {
  if (darkModeStyle) {
    darkModeStyle.remove()
    darkModeStyle = null
  }
}
```

---

## 7. Link Collector

Extract all links from a page.

### Popup

```tsx
const [links, setLinks] = useState<string[]>([])

const collectLinks = async () => {
  const response = await sendMessageToActiveTab({ type: 'GET_LINKS' })
  setLinks(response.links)
}

return (
  <div className="p-4 w-96">
    <button onClick={collectLinks} className="bg-blue-500 text-white px-4 py-2 rounded">
      Collect Links
    </button>
    <div className="mt-4 max-h-96 overflow-y-auto">
      {links.map((link, i) => (
        <a
          key={i}
          href={link}
          target="_blank"
          className="block text-sm text-blue-600 hover:underline p-1"
        >
          {link}
        </a>
      ))}
    </div>
  </div>
)
```

### Content Script

```typescript
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_LINKS') {
    const links = Array.from(document.querySelectorAll('a'))
      .map(a => a.href)
      .filter(href => href.startsWith('http'))
    
    sendResponse({ success: true, links })
  }
  return true
})
```

---

## 8. Word Counter

Count words on the current page.

### Popup

```tsx
const [stats, setStats] = useState({ words: 0, chars: 0, paragraphs: 0 })

const countWords = async () => {
  const response = await sendMessageToActiveTab({ type: 'COUNT_WORDS' })
  setStats(response.stats)
}

return (
  <div className="p-4">
    <button onClick={countWords} className="bg-blue-500 text-white px-4 py-2 rounded">
      Count Words
    </button>
    <div className="mt-4 space-y-2">
      <div>Words: <strong>{stats.words}</strong></div>
      <div>Characters: <strong>{stats.chars}</strong></div>
      <div>Paragraphs: <strong>{stats.paragraphs}</strong></div>
    </div>
  </div>
)
```

### Content Script

```typescript
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'COUNT_WORDS') {
    const text = document.body.innerText
    const words = text.trim().split(/\s+/).length
    const chars = text.length
    const paragraphs = document.querySelectorAll('p').length
    
    sendResponse({
      success: true,
      stats: { words, chars, paragraphs }
    })
  }
  return true
})
```

---

## 🎯 Tips for Building Extensions

1. **Start Simple**: Begin with one feature and expand
2. **Test Frequently**: Reload extension and test on different sites
3. **Handle Errors**: Always wrap async operations in try-catch
4. **Check Permissions**: Add required permissions to manifest.json
5. **User Feedback**: Show loading states and success/error messages
6. **Performance**: Debounce frequent operations
7. **Compatibility**: Test on different websites and frameworks

## 🚀 Next Steps

Mix and match these examples to create your own unique extension!
