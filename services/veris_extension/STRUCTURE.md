# Project Structure

Visual guide to the boilerplate's file organization.

## 📁 Root Directory

```
chrome-extension-boilerplate/
├── 📄 README.md              # Main documentation
├── 📄 QUICKSTART.md          # 5-minute setup guide
├── 📄 DEVELOPMENT.md         # Detailed development guide
├── 📄 EXAMPLES.md            # Practical code examples
├── 📄 API.md                 # API reference
├── 📄 CONTRIBUTING.md        # Contribution guidelines
├── 📄 CHANGELOG.md           # Version history
├── 📄 LICENSE                # MIT License
│
├── 📄 package.json           # Dependencies and scripts
├── 📄 tsconfig.json          # TypeScript configuration
├── 📄 vite.config.ts         # Vite build configuration
├── 📄 vitest.config.ts       # Test configuration
├── 📄 tailwind.config.js     # Tailwind CSS configuration
├── 📄 postcss.config.js      # PostCSS configuration
├── 📄 manifest.json          # Chrome extension manifest
├── 📄 index.html             # Popup HTML template
│
├── 📁 src/                   # Source code
├── 📁 scripts/               # Build scripts
├── 📁 icons/                 # Extension icons
├── 📁 dist/                  # Build output (generated)
└── 📁 node_modules/          # Dependencies (generated)
```


## 📂 Source Directory (`src/`)

```
src/
├── 📁 popup/                 # Extension popup UI
│   ├── App.tsx              # Main popup component (React)
│   └── main.tsx             # Popup entry point
│
├── 📁 content/               # Content scripts (run on web pages)
│   └── content.ts           # Main content script
│
├── 📁 background/            # Service worker (background tasks)
│   └── service-worker.ts    # Main service worker
│
├── 📁 shared/                # Shared utilities
│   ├── messaging.ts         # Message passing helpers
│   └── storage.ts           # Chrome storage helpers
│
├── 📁 types/                 # TypeScript type definitions
│   └── index.ts             # Shared types
│
└── 📁 styles/                # Global styles
    └── globals.css          # Tailwind CSS imports
```

## 🎯 Key Files Explained

### Popup (`src/popup/`)
- **What**: The UI that appears when users click the extension icon
- **Tech**: React + TypeScript + Tailwind CSS
- **Entry**: `main.tsx` → `App.tsx`
- **Build Output**: `dist/index.html` + `dist/assets/popup-*.js`

### Content Script (`src/content/`)
- **What**: JavaScript that runs in the context of web pages
- **Can Do**: Access/modify DOM, extract data, inject UI
- **Cannot Do**: Access Chrome APIs directly (must message background)
- **Build Output**: `dist/src/content-script.js`

### Service Worker (`src/background/`)
- **What**: Background script handling events and tasks
- **Runs**: In the background, event-driven (may sleep when idle)
- **Use For**: API calls, storage management, tab coordination
- **Build Output**: `dist/src/service-worker.js`

### Shared Utilities (`src/shared/`)
- **messaging.ts**: Helper functions for communication
- **storage.ts**: Simplified Chrome storage API

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `manifest.json` | Extension metadata, permissions, entry points |
| `vite.config.ts` | Build configuration (entry points, output) |
| `tsconfig.json` | TypeScript compiler options |
| `tailwind.config.js` | Tailwind CSS theme and plugins |
| `package.json` | Dependencies and npm scripts |

## 📦 Build Output (`dist/`)

After running `npm run build`:

```
dist/
├── index.html               # Popup HTML
├── manifest.json            # Extension manifest (copied)
│
├── assets/                  # Bundled assets
│   ├── popup-*.css         # Popup styles
│   └── popup-*.js          # Popup JavaScript
│
├── icons/                   # Extension icons (copied)
│   ├── 16.png
│   ├── 48.png
│   └── 128.png
│
└── src/                     # Extension scripts
    ├── content-script.js   # Content script bundle
    └── service-worker.js   # Service worker bundle
```

## 🚀 Development Flow

```
1. Edit source files in src/
   ↓
2. Vite watches and rebuilds automatically
   ↓
3. Reload extension in chrome://extensions/
   ↓
4. Test changes in browser
```

## 📝 Adding New Features

### Add a new popup component:
- Create file in `src/popup/components/`
- Import in `App.tsx`

### Add a new content script feature:
- Edit `src/content/content.ts`
- Add message handler

### Add a new background task:
- Edit `src/background/service-worker.ts`
- Add event listener

### Add shared utility:
- Create file in `src/shared/`
- Export functions
- Import where needed

## 🎨 Styling

- **Framework**: Tailwind CSS
- **Config**: `tailwind.config.js`
- **Global styles**: `src/styles/globals.css`
- **Usage**: Add classes directly in JSX

## 🧪 Testing

- **Framework**: Vitest
- **Config**: `vitest.config.ts`
- **Test files**: `*.test.ts` or `*.test.tsx`
- **Run**: `npm test`

## 📚 Documentation Files

| File | Content |
|------|---------|
| `README.md` | Overview, features, getting started |
| `QUICKSTART.md` | Fast 5-minute setup |
| `DEVELOPMENT.md` | Detailed development patterns |
| `EXAMPLES.md` | 8+ practical code examples |
| `API.md` | Complete API reference |
| `STRUCTURE.md` | This file - project structure |
| `CONTRIBUTING.md` | How to contribute |
| `CHANGELOG.md` | Version history |

## 🔍 Finding Things

**Want to...**
- Change popup UI? → `src/popup/App.tsx`
- Modify web pages? → `src/content/content.ts`
- Add background task? → `src/background/service-worker.ts`
- Add helper function? → `src/shared/`
- Change permissions? → `manifest.json`
- Update styles? → `tailwind.config.js` or `src/styles/`
- See examples? → `EXAMPLES.md`
- Learn patterns? → `DEVELOPMENT.md`
- Check API? → `API.md`
