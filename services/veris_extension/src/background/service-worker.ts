/**
 * Service Worker (Background Script)
 * 
 * This script runs in the background and handles:
 * - Extension lifecycle events
 * - Long-running tasks
 * - Coordination between popup and content scripts
 * - Network requests
 * - Storage management
 * 
 * Note: Service workers are event-driven and may be terminated when idle.
 * Don't rely on global state - use chrome.storage instead.
 */

console.log('🔧 Service worker initialized')

/**
 * Installation event - runs when extension is first installed or updated
 */
chrome.runtime.onInstalled.addListener((details) => {
  console.log('✅ Extension installed:', details.reason)

  if (details.reason === 'install') {
    // First time installation
    chrome.storage.local.set({
      installDate: Date.now(),
      version: chrome.runtime.getManifest().version
    })
    
    // Optionally open a welcome page
    // chrome.tabs.create({ url: 'https://your-website.com/welcome' })
  } else if (details.reason === 'update') {
    // Extension was updated
    console.log('🔄 Extension updated to version:', chrome.runtime.getManifest().version)
  }
})

/**
 * Message handler - receives messages from popup and content scripts
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('📨 Background received message:', message, 'from:', sender)

  switch (message.type) {
    case 'PING':
      sendResponse({ 
        type: 'PONG', 
        timestamp: Date.now(),
        from: 'background'
      })
      break

    case 'CAPTURE_TAB':
      chrome.tabs.captureVisibleTab(null as any, { format: 'png' }, (dataUrl) => {
        sendResponse({ dataUrl })
      })
      return true

    case 'OPEN_POPUP':
      chrome.action.openPopup()
      sendResponse({ success: true })
      break

    case 'GET_STORAGE':
      handleGetStorage(message.payload?.keys)
        .then(data => sendResponse({ success: true, data }))
        .catch(error => sendResponse({ success: false, error: error.message }))
      return true

    case 'SET_STORAGE':
      handleSetStorage(message.payload?.data)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }))
      return true

    case 'URL_CHANGED':
      console.log('🔄 URL changed in tab:', sender.tab?.id, 'to:', message.payload?.url)
      sendResponse({ success: true })
      break

    default:
      sendResponse({ success: false, error: 'Unknown message type' })
  }

  return true
})

/**
 * Tab events - monitor tab changes
 */
chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log('👁️ Tab activated:', activeInfo.tabId)
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('✅ Tab loaded:', tab.url)
  }
})

/**
 * Storage helpers
 */
async function handleGetStorage(keys?: string[]) {
  if (keys) {
    return await chrome.storage.local.get(keys)
  }
  return await chrome.storage.local.get(null) // Get all
}

async function handleSetStorage(data: Record<string, any>) {
  await chrome.storage.local.set(data)
  return true
}

/**
 * Example: Periodic task (runs every 5 minutes)
 * Uncomment and add "alarms" permission to manifest.json to use
 */
// chrome.alarms.create('periodicTask', { periodInMinutes: 5 })
// chrome.alarms.onAlarm.addListener((alarm) => {
//   if (alarm.name === 'periodicTask') {
//     console.log('⏰ Periodic task triggered')
//   }
// })

/**
 * Example: Context menu (right-click menu)
 * Uncomment and add "contextMenus" permission to manifest.json to use
 */
// chrome.runtime.onInstalled.addListener(() => {
//   chrome.contextMenus.create({
//     id: 'exampleMenu',
//     title: 'Example Action',
//     contexts: ['page', 'selection']
//   })
// })
// 
// chrome.contextMenus.onClicked.addListener((info, tab) => {
//   if (info.menuItemId === 'exampleMenu') {
//     console.log('Context menu clicked:', info)
//     if (tab?.id) {
//       chrome.tabs.sendMessage(tab.id, {
//         type: 'CONTEXT_MENU_CLICKED',
//         payload: { selectionText: info.selectionText }
//       })
//     }
//   }
// })

/**
 * Example: Badge management
 */
// function updateBadge(text: string, color: string = '#FF0000') {
//   chrome.action.setBadgeText({ text })
//   chrome.action.setBadgeBackgroundColor({ color })
// }
// updateBadge('5', '#00FF00')
