/**
 * Storage Utilities
 * 
 * Helper functions for Chrome storage API.
 * Data persists across browser sessions and is synced across devices (if using sync storage).
 */

/**
 * Get value(s) from storage
 */
export async function getStorage<T = any>(keys: string | string[]): Promise<T> {
  const result = await chrome.storage.local.get(keys)
  
  if (typeof keys === 'string') {
    return result[keys] as T
  }
  
  return result as T
}

/**
 * Set value(s) in storage
 */
export async function setStorage(items: Record<string, any>): Promise<void> {
  await chrome.storage.local.set(items)
}

/**
 * Remove value(s) from storage
 */
export async function removeStorage(keys: string | string[]): Promise<void> {
  await chrome.storage.local.remove(keys)
}

/**
 * Clear all storage
 */
export async function clearStorage(): Promise<void> {
  await chrome.storage.local.clear()
}

/**
 * Get all storage data
 */
export async function getAllStorage(): Promise<Record<string, any>> {
  return await chrome.storage.local.get(null)
}

/**
 * Listen for storage changes
 * 
 * @example
 * onStorageChange((changes) => {
 *   if (changes.theme) {
 *     console.log('Theme changed:', changes.theme.newValue)
 *   }
 * })
 */
export function onStorageChange(
  callback: (changes: { [key: string]: chrome.storage.StorageChange }) => void
) {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local') {
      callback(changes)
    }
  })
}

/**
 * Sync storage (synced across devices)
 */
export const syncStorage = {
  async get<T = any>(keys: string | string[]): Promise<T> {
    const result = await chrome.storage.sync.get(keys)
    if (typeof keys === 'string') {
      return result[keys] as T
    }
    return result as T
  },

  async set(items: Record<string, any>): Promise<void> {
    await chrome.storage.sync.set(items)
  },

  async remove(keys: string | string[]): Promise<void> {
    await chrome.storage.sync.remove(keys)
  },

  async clear(): Promise<void> {
    await chrome.storage.sync.clear()
  }
}
