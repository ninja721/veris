# Quick Start Guide

Get your Chrome extension up and running in 5 minutes!

## 🚀 Installation

```bash
# 1. Install dependencies
npm install

# 2. Build the extension
npm run build
```

## 📦 Load Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the `dist` folder from this project
5. Done! Your extension is now installed

## 🎯 Test It Out

1. Click the extension icon in your toolbar
2. The popup will open showing the demo interface
3. Try clicking the buttons to interact with the current page

## 🛠️ Development Mode

For active development with auto-reload:

```bash
# Start development server
npm run dev
```

Then:
1. Load the `dist` folder in Chrome (as above)
2. Make changes to your code
3. Vite will automatically rebuild
4. Click the refresh icon on your extension in `chrome://extensions/`
5. Refresh any web pages to see content script changes

## 📝 Your First Customization

### 1. Change the Extension Name

Edit `manifest.json`:

```json
{
  "name": "My Awesome Extension",
  "description": "Does something cool"
}
```

### 2. Customize the Popup

Edit `src/popup/App.tsx`:

```tsx
export default function App() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Hello World!</h1>
      <p>My first extension</p>
    </div>
  )
}
```

### 3. Add Page Interaction

Edit `src/content/content.ts`:

```typescript
// This runs on every web page
console.log('My extension is active on:', window.location.href)

// Change page background when extension loads
document.body.style.backgroundColor = '#f0f0f0'
```

### 4. Rebuild and Test

```bash
npm run build
```

Then reload the extension in Chrome and refresh your web page!

## 📚 Next Steps

- Read [README.md](./README.md) for full documentation
- Check [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed development guide
- See [EXAMPLES.md](./EXAMPLES.md) for practical code examples

## 🆘 Troubleshooting

**Extension not loading?**
- Make sure you selected the `dist` folder, not the project root
- Check for build errors: `npm run build`

**Changes not appearing?**
- Reload the extension in `chrome://extensions/`
- Refresh the web page (for content script changes)
- Close and reopen the popup (for popup changes)

**Console errors?**
- Right-click extension icon → Inspect popup (for popup errors)
- Open DevTools on web page (F12) for content script errors
- Click "Inspect views: service worker" in chrome://extensions/ for background errors

## 🎉 You're Ready!

Start building your extension by modifying the files in `src/`. Happy coding!
