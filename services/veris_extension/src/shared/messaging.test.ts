import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * Example test file
 * 
 * Run tests with: npm test
 */

describe('Messaging Utilities', () => {
  beforeEach(() => {
    // Mock Chrome APIs
    ;(globalThis as any).chrome = {
      tabs: {
        query: vi.fn(),
        sendMessage: vi.fn(),
      },
      runtime: {
        sendMessage: vi.fn(),
        onMessage: {
          addListener: vi.fn(),
        },
      },
    }
  })

  it('should exist', () => {
    expect(true).toBe(true)
  })

  // Add your tests here
  // Example:
  // it('should send message to active tab', async () => {
  //   const mockTab = { id: 1, url: 'https://example.com' }
  //   vi.mocked(chrome.tabs.query).mockResolvedValue([mockTab])
  //   vi.mocked(chrome.tabs.sendMessage).mockResolvedValue({ success: true })
  //   
  //   const response = await sendMessageToActiveTab({ type: 'TEST' })
  //   expect(response.success).toBe(true)
  // })
})
