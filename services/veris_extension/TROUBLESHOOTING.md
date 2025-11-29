# 🔧 Troubleshooting Guide

Common issues and solutions when developing Chrome extensions.

## 🚨 Build & Installation Issues

### Extension won't load in Chrome

**Symptoms:** Error when loading unpacked extension

**Solutions:**
1. Make sure you ran `npm run build` first
2. Select the `dist` folder, NOT the project root
3. Check for build errors: `npm run build`
4. Verify `manifest.json` exists in `dist/`
5. Check Chrome console for specific errors

### Build fails with errors

**Symptoms:** `npm run build` shows errors

**Solutions:**
1. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```
2. Check for TypeScript errors: `npm run typecheck`
3. Verify all imports are correct
4. Check `vite.config.ts` for syntax errors

### Changes not appearing after rebuild

**Solutions:**
1. Click the reload icon in `chrome://extensions/`
2. Close and reopen the popup
3. Refresh the web page (for content scripts)
4. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
5. Try removing and re-adding the extension

---

## 💬 Message Passing Issues

### Messages not received

**Symptoms:** `sendMessage` doesn't trigger listener

**Solutions:**
1. Ensure listener returns `true` for async responses:
   ```typescript
   chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
     handleAsync(msg).then(sendResponse)
     return true // IMPORTANT!
   })
   ```

2. Check sender and receiver are both active
3. Verify message type matches exactly
4. Check console for errors in both sender and receiver

### "Could not establish connection" error

**Symptoms:** Error when sending message to content script

**Solutions:**
1. Ensure content script is injected (check `matches` in manifest)
2. Wait for page to load before sending message
3. Check if tab ID is valid
4. Verify content script has no errors (check page console)

### Service worker not responding

**Symptoms:** Background messages fail

**Solutions:**
1. Service workers auto-sleep - they wake on messages
2. Check service worker console: chrome://extensions/ → "service worker"
3. Verify service worker has no errors
4. Don't rely on global state - use chrome.storage

---

## 📄 Content Script Issues

### Content script not loading

**Symptoms:** Script doesn't run on pages

**Solutions:**
1. Check `matches` pattern in `manifest.json`:
   ```json
   "matches": ["<all_urls>"]  // or specific pattern
   ```
2. Verify `run_at` timing (try `document_idle`)
3. Reload extension AND refresh page
4. Check page console for errors
5. Ensure no CSP blocking (check console)

### Content script can't access page variables

**Symptoms:** `window.somePageVar` is undefined

**Explanation:** Content scripts run in isolated world

**Solutions:**
1. Use `window.postMessage` to communicate with page:
   ```typescript
   // Content script
   window.postMessage({ type: 'FROM_EXTENSION' }, '*')
   
   // Page script (inject via script tag)
   window.addEventListener('message', (event) => {
     if (event.data.type === 'FROM_EXTENSION') {
       // Access page variables here
     }
   })
   ```

2. Or inject actual script into page:
   ```typescript
   const script = document.createElement('script')
   script.src = chrome.runtime.getURL('injected.js')
   document.head.appendChild(script)
   ```

### Content script conflicts with page

**Symptoms:** Page breaks when extension is active

**Solutions:**
1. Use unique IDs and classes:
   ```typescript
   element.id = 'my-extension-unique-id'
   element.className = 'my-ext-class'
   ```

2. Namespace your CSS:
   ```css
   [data-my-extension] .button { }
   ```

3. Check for JavaScript conflicts
4. Use Shadow DOM for complete isolation

---

## 🎨 UI & Styling Issues

### Tailwind styles not working

**Solutions:**
1. Verify `globals.css` is imported in `main.tsx`
2. Check `tailwind.config.js` content paths
3. Rebuild: `npm run build`
4. Clear browser cache
5. Check for CSS conflicts with page styles

### Popup appears blank

**Solutions:**
1. Check popup console: Right-click icon → Inspect popup
2. Look for JavaScript errors
3. Verify `index.html` loads correctly
4. Check if React is rendering: look for `<div id="root">`
5. Ensure all imports are correct

### Popup size is wrong

**Solutions:**
1. Set explicit width/height in `App.tsx`:
   ```tsx
   <div className="w-[400px] min-h-[300px]">
   ```

2. Or in CSS:
   ```css
   body {
     width: 400px;
     min-height: 300px;
   }
   ```

---

## 💾 Storage Issues

### Data not persisting

**Solutions:**
1. Use `chrome.storage`, NOT `localStorage`:
   ```typescript
   // ✅ Correct
   await chrome.storage.local.set({ key: 'value' })
   
   // ❌ Wrong
   localStorage.setItem('key', 'value')
   ```

2. Check storage permissions in manifest
3. Verify async/await usage
4. Check for errors in console

### Storage quota exceeded

**Solutions:**
1. Check storage limits:
   - `local`: 10MB
   - `sync`: 100KB total, 8KB per item
2. Clean up old data
3. Use `local` for large data
4. Compress data if needed

---

## 🔐 Permission Issues

### Permission denied errors

**Solutions:**
1. Add required permission to `manifest.json`:
   ```json
   "permissions": ["storage", "activeTab", "scripting"]
   ```

2. Add host permissions for specific sites:
   ```json
   "host_permissions": ["https://example.com/*"]
   ```

3. Reload extension after changing permissions
4. Some APIs require user interaction (e.g., `activeTab`)

### Can't access certain websites

**Solutions:**
1. Check if site blocks extensions (CSP)
2. Add to `host_permissions` in manifest
3. Some Chrome pages are protected (chrome://, chrome-extension://)
4. Check for iframe restrictions

---

## ⚡ Performance Issues

### Extension is slow

**Solutions:**
1. Debounce frequent operations:
   ```typescript
   let timeout: number
   function debounce(fn: Function, delay: number) {
     clearTimeout(timeout)
     timeout = setTimeout(fn, delay)
   }
   ```

2. Use `requestIdleCallback` for non-urgent tasks
3. Minimize DOM queries
4. Lazy load components
5. Profile with Chrome DevTools

### High memory usage

**Solutions:**
1. Clean up event listeners
2. Remove unused DOM elements
3. Clear intervals/timeouts
4. Use WeakMap for caching
5. Profile memory in DevTools

---

## 🧪 Testing Issues

### Tests fail with Chrome API errors

**Solutions:**
1. Mock Chrome APIs in tests:
   ```typescript
   beforeEach(() => {
     (globalThis as any).chrome = {
       runtime: { sendMessage: vi.fn() },
       storage: { local: { get: vi.fn(), set: vi.fn() } }
     }
   })
   ```

2. Use `@types/chrome` for type definitions
3. Check vitest configuration

---

## 🌐 Browser Compatibility

### Works in Chrome but not Edge/Brave

**Solutions:**
1. Test in target browser
2. Check for browser-specific APIs
3. Use feature detection
4. Check manifest compatibility

---

## 📦 Distribution Issues

### ZIP file too large

**Solutions:**
1. Remove `node_modules` from ZIP
2. Only include `dist` folder
3. Optimize images
4. Remove source maps in production
5. Check `.gitignore` patterns

### Chrome Web Store rejection

**Common reasons:**
1. Missing privacy policy (if collecting data)
2. Unclear description
3. Too broad permissions
4. Misleading screenshots
5. Trademark issues

**Solutions:**
- Read Chrome Web Store policies
- Request only needed permissions
- Provide clear description
- Add privacy policy if needed

---

## 🔍 Debugging Tips

### Enable verbose logging

```typescript
// In development
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data)
}
```

### Check all consoles

1. **Popup console:** Right-click icon → Inspect popup
2. **Content script console:** F12 on web page
3. **Service worker console:** chrome://extensions/ → "service worker"
4. **Extension page:** chrome://extensions/ → Details → Errors

### Use Chrome DevTools

1. **Network tab:** Check API calls
2. **Performance tab:** Profile performance
3. **Memory tab:** Check for leaks
4. **Application tab:** Inspect storage

### Add error boundaries

```tsx
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error) {
    console.error('React error:', error)
  }
  render() {
    return this.props.children
  }
}
```

---

## 🆘 Still Stuck?

1. **Check documentation:**
   - DEVELOPMENT.md for patterns
   - EXAMPLES.md for code samples
   - API.md for function reference

2. **Search Chrome Extension docs:**
   - https://developer.chrome.com/docs/extensions/

3. **Check Stack Overflow:**
   - Tag: `google-chrome-extension`

4. **Review Chrome Extension samples:**
   - https://github.com/GoogleChrome/chrome-extensions-samples

5. **Check browser console:**
   - Often shows the exact error

---

## 📝 Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Manifest file is missing or unreadable" | No manifest in dist | Run `npm run build` |
| "Could not load icon" | Missing icon file | Add icons to `icons/` folder |
| "Invalid manifest version" | Wrong manifest version | Use version 3 |
| "Cannot access chrome:// URLs" | Protected page | Can't inject into chrome:// pages |
| "Extension context invalidated" | Extension reloaded | Reload page after extension reload |

---

**Remember:** Most issues are solved by:
1. Checking the console
2. Reloading the extension
3. Refreshing the page
4. Reading error messages carefully

**Good luck! 🚀**
