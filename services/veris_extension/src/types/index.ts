/**
 * Type Definitions
 * 
 * Shared TypeScript types used across the extension
 */

export interface ExtensionMessage {
  type: string
  payload?: any
}

export interface ExtensionResponse {
  success: boolean
  data?: any
  error?: string
}

export interface TabInfo {
  id: number
  url: string
  title: string
  active: boolean
}

export interface StorageData {
  [key: string]: any
}

// Add your custom types here
