# Veris Chrome Extension

Browser extension for instant fact-checking with a snipping tool.

## Features

- **Snipping Tool**: Drag to select any area on any webpage
- **Screenshot Capture**: Automatically captures selected area as image
- **Direct ADK Integration**: Sends directly to Veris AI agent
- **Instant Verification**: Results appear in web app feed in 2-3 minutes

## Installation

### Development

1. **Install dependencies**
```bash
pnpm install
```

2. **Setup environment**
```bash
cp env.example .env
# Edit .env with your ADK agent URL
```

3. **Build extension**
```bash
pnpm build
```

4. **Load in Chrome**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

### Development Mode

```bash
pnpm dev
```

This starts Vite dev server. Reload extension in Chrome after changes.

## Usage

1. Click Veris extension icon
2. Click "Capture Area" button
3. Drag to select area on page
4. Screenshot captured automatically
5. Click "Verify Claim" to submit
6. Check web app feed in 2-3 minutes

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Chrome Extension Manifest V3

## Architecture

```
src/
├── popup/              # Extension popup UI
│   ├── App.tsx        # Main popup component
│   └── main.tsx       # Entry point
├── content/           # Content script (runs on pages)
│   └── content.ts     # Snipping tool implementation
├── background/        # Service worker
│   └── service-worker.ts
└── styles/
    └── globals.css    # Tailwind styles
```

## Configuration

### Environment Variables

```env
VITE_ADK_AGENT_URL=https://veris-ai-773695696004.us-central1.run.app
VITE_APP_NAME=veris_agent
```

### Manifest Permissions

- `activeTab`: Access current tab for screenshots
- `scripting`: Execute content scripts
- `storage`: Store captured content
- Host permissions for ADK agent

## How It Works

1. **User clicks "Capture Area"**
   - Popup closes
   - Content script activates snipping mode

2. **User drags to select area**
   - Blue selection box shows selected area
   - ESC to cancel

3. **Screenshot captured**
   - Uses `chrome.tabs.captureVisibleTab`
   - Crops to selected area
   - Saves to `chrome.storage.local`

4. **Popup reopens**
   - Loads screenshot from storage
   - Shows preview

5. **User clicks "Verify Claim"**
   - Creates ADK session
   - Sends base64 image to agent
   - Shows success message

## Development

### Build Commands

```bash
pnpm dev          # Development mode with HMR
pnpm build        # Production build
pnpm preview      # Preview production build
```

### File Structure

- `manifest.json`: Extension configuration
- `index.html`: Popup HTML
- `vite.config.ts`: Vite configuration
- `tailwind.config.js`: Tailwind configuration

## Troubleshooting

**Extension not loading?**
- Check manifest.json is valid
- Ensure all permissions are granted
- Reload extension after changes

**Screenshot not capturing?**
- Refresh the page and try again
- Check console for errors
- Ensure host permissions are set

**Can't connect to ADK agent?**
- Check VITE_ADK_AGENT_URL in .env
- Verify agent is running
- Check network tab for errors

## Links

- [Main Project](../../README.md)
- [Web App](../web-app/README.md)
- [ADK Agent](../agent_service/README.md)
