/**
 * Messaging Utilities
 * 
 * Helper functions for communication between different parts of the extension:
 * - Popup ↔ Content Script
 * - Popup ↔ Background
 * - Content Script ↔ Background
 */

export interface Message {
  type: string
  payload?: any
}

export interface MessageResponse {
  success?: boolean
  data?: any
  error?: string
  [key: string]: any
}

/**
 * Send message to the active tab's content script
 */
export async function sendMessageToActiveTab(message: Message): Promise<MessageResponse> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  
  if (!tab?.id) {
    throw new Error('No active tab found')
  }

  return chrome.tabs.sendMessage(tab.id, message)
}

/**
 * Send message to a specific tab's content script
 */
export async function sendMessageToTab(tabId: number, message: Message): Promise<MessageResponse> {
  return chrome.tabs.sendMessage(tabId, message)
}

/**
 * Send message to background service worker
 */
export async function sendMessageToBackground(message: Message): Promise<MessageResponse> {
  return chrome.runtime.sendMessage(message)
}

/**
 * Broadcast message to all tabs
 */
export async function broadcastMessage(message: Message): Promise<MessageResponse[]> {
  const tabs = await chrome.tabs.query({})
  const promises = tabs
    .filter(tab => tab.id !== undefined)
    .map(tab => chrome.tabs.sendMessage(tab.id!, message).catch(() => null))
  
  const results = await Promise.all(promises)
  return results.filter((r): r is MessageResponse => r !== null)
}

/**
 * Listen for messages (use in any component)
 * 
 * @example
 * onMessage((message, sender) => {
 *   if (message.type === 'HELLO') {
 *     return { success: true, data: 'Hello back!' }
 *   }
 * })
 */
export function onMessage(
  handler: (message: Message, sender: chrome.runtime.MessageSender) => MessageResponse | Promise<MessageResponse> | void
) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const result = handler(message, sender)
    
    if (result instanceof Promise) {
      result.then(sendResponse).catch(error => {
        sendResponse({ success: false, error: error.message })
      })
      return true // Keep channel open for async response
    } else if (result) {
      sendResponse(result)
    }
    
    return false
  })
}
