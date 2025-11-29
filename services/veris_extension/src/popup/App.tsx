import { useState, useEffect } from 'react'

interface ADKMessagePart {
  text?: string
  inline_data?: {
    mime_type: string
    data: string
  }
}

// ADK Agent Configuration
const ADK_AGENT_URL = import.meta.env.VITE_ADK_AGENT_URL || 'https://veris-ai-773695696004.us-central1.run.app'
const APP_NAME = import.meta.env.VITE_APP_NAME || 'veris_agent'
const USER_ID = 'extension_user'

export default function App() {
  const [capturedContent, setCapturedContent] = useState<{ type: 'text' | 'image', data: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSnippingActive, setIsSnippingActive] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  // Load captured content from storage on mount
  useEffect(() => {
    chrome.storage.local.get(['capturedContent'], (result) => {
      if (result.capturedContent) {
        console.log('📦 Veris: Loaded captured content from storage', result.capturedContent)
        setCapturedContent(result.capturedContent)
        showNotification('success', 'Screenshot captured!')
        // Clear storage after loading
        chrome.storage.local.remove(['capturedContent'])
      }
    })
  }, [])

  // Listen for snip capture from content script
  chrome.runtime.onMessage.addListener(async (message) => {
    console.log('📨 Veris Popup: Received message', message)
    
    if (message.type === 'SNIP_CAPTURED') {
      const { type, data } = message.payload
      console.log('✅ Veris Popup: Snip captured', { type, dataLength: data?.length })
      
      setCapturedContent({ type, data })
      setIsSnippingActive(false)
      showNotification('success', `${type === 'text' ? 'Text' : 'Screenshot'} captured!`)
    } else if (message.type === 'SNIP_CANCELLED') {
      console.log('❌ Veris Popup: Snipping cancelled')
      setIsSnippingActive(false)
    }
  })

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000) // 5 seconds for longer messages
  }

  const handleActivateSnipping = async () => {
    if (typeof chrome === 'undefined' || !chrome.tabs) {
      showNotification('error', 'Load as Chrome extension to use this feature')
      return
    }
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (tab.id) {
        await chrome.tabs.sendMessage(tab.id, {
          type: 'START_SNIPPING'
        })
        setIsSnippingActive(true)
        showNotification('success', 'Drag to select an area!')
        
        // Close popup so user can interact with page
        window.close()
      }
    } catch (error) {
      showNotification('error', 'Failed to start snipping. Please refresh the page.')
    }
  }

  const createADKSession = async (): Promise<string> => {
    const url = `${ADK_AGENT_URL}/apps/${APP_NAME}/users/${USER_ID}/sessions`
    console.log('🔄 Veris: Creating ADK session', url)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    })
    
    if (!response.ok) {
      console.error('❌ Veris: Session creation failed', response.status)
      throw new Error(`Failed to create session: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('✅ Veris: Session created', data.id)
    return data.id
  }

  const submitToADKAgent = async (parts: ADKMessagePart[]): Promise<boolean> => {
    try {
      const sessionId = await createADKSession()

      const payload = {
        app_name: APP_NAME,
        user_id: USER_ID,
        session_id: sessionId,
        newMessage: {
          role: 'user',
          parts,
        },
      }
      
      console.log('📤 Veris: Sending to ADK agent', {
        url: `${ADK_AGENT_URL}/run_sse`,
        payload: {
          ...payload,
          newMessage: {
            ...payload.newMessage,
            parts: parts.map(p => ({
              hasText: !!p.text,
              hasInlineData: !!p.inline_data,
              textPreview: p.text?.substring(0, 50),
              mimeType: p.inline_data?.mime_type,
              dataLength: p.inline_data?.data?.length
            }))
          }
        }
      })

      const response = await fetch(`${ADK_AGENT_URL}/run_sse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify(payload),
      })

      console.log('✅ Veris: ADK response', {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText
      })

      return response.ok || response.status === 202
    } catch (error) {
      console.error('❌ Veris: ADK submission error', error)
      return false
    }
  }

  const handleVerifyClaim = async () => {
    if (!capturedContent) {
      showNotification('error', 'Please capture content first')
      return
    }

    console.log('🚀 Veris: Starting verification', capturedContent)
    setIsLoading(true)
    
    try {
      const parts: ADKMessagePart[] = []

      if (capturedContent.type === 'text') {
        parts.push({
          text: `User submitted text for fact-checking:\n\n${capturedContent.data}`
        })
        console.log('📝 Veris: Text part created', parts[0].text?.substring(0, 100))
      } else {
        // Image data is already base64
        console.log('📸 Veris: Using captured screenshot', {
          length: capturedContent.data.length
        })

        parts.push({
          inline_data: {
            mime_type: 'image/png',
            data: capturedContent.data,
          }
        })
      }

      console.log('📤 Veris: Submitting to ADK agent', {
        partsCount: parts.length,
        url: ADK_AGENT_URL
      })

      const success = await submitToADKAgent(parts)
      
      console.log('✅ Veris: Submission result', { success })
      
      if (success) {
        showNotification('success', 'Your submission has been sent for AI verification. Check the feed in 2-3 minutes to see the results!')
        setCapturedContent(null)
        
        // Log success details
        console.log('🎉 Veris: Successfully submitted to ADK agent', {
          type: capturedContent.type,
          dataSize: capturedContent.data.length,
          timestamp: new Date().toISOString()
        })
      } else {
        showNotification('error', 'Failed to submit to AI agent. Please try again.')
        console.error('❌ Veris: Submission failed')
      }
    } catch (error) {
      console.error('❌ Veris: Verification error', error)
      showNotification('error', 'Failed to submit. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const isExtensionContext = typeof chrome !== 'undefined' && chrome.runtime?.id

  return (
    <div className="w-[420px] min-h-[600px] bg-white relative overflow-hidden">
      <div className="p-6 space-y-5">
        {/* Notification Toast */}
        {notification && (
          <div className={`absolute top-4 left-4 right-4 p-3 rounded-lg shadow-lg animate-slide-down z-50 ${
            notification.type === 'success' 
              ? 'bg-success-500 text-white' 
              : 'bg-danger-500 text-white'
          }`}>
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        )}

        {/* Dev Mode Badge */}
        {!isExtensionContext && (
          <div className="bg-warning-500 rounded-lg p-3 mb-4">
            <p className="text-xs font-semibold text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              Dev Mode: Load as extension to test features
            </p>
          </div>
        )}

        {/* Header */}
        <div className="border-b border-neutral-200 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-neutral-900">
                Veris
              </h1>
              <p className="text-xs text-neutral-500">
                AI-Powered Fact Checking
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {capturedContent && (
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-neutral-900">
                Captured Screenshot
              </h2>
              <button
                onClick={() => setCapturedContent(null)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label="Clear"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <img
              src={`data:image/png;base64,${capturedContent.data}`}
              alt="Captured screenshot"
              className="w-full rounded-lg border border-neutral-200"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {!capturedContent && (
            <button
              onClick={handleActivateSnipping}
              disabled={isLoading || isSnippingActive}
              className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              aria-label="Start snipping tool"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Capture Area
            </button>
          )}
          
          {capturedContent && (
            <button
              onClick={handleVerifyClaim}
              disabled={isLoading}
              className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              aria-label="Submit for verification"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Verify Claim
                </>
              )}
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-neutral-100 mt-4">
          <p className="text-xs text-neutral-500">
            {isSnippingActive 
              ? 'Drag to select an area on the page'
              : 'Capture any area to verify claims'
            }
          </p>
        </div>
      </div>
    </div>
  )
}
