/**
 * Veris Content Script - Snipping Tool
 * Allows users to drag and select any area for fact-checking
 */

console.log('🚀 Veris content script loaded')

let isSnipping = false
let startX = 0
let startY = 0
let selectionBox: HTMLDivElement | null = null
let overlay: HTMLDivElement | null = null

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('📨 Content script received:', message.type)

  switch (message.type) {
    case 'START_SNIPPING':
      startSnipping()
      sendResponse({ success: true })
      break

    default:
      sendResponse({ success: false, error: 'Unknown message type' })
  }

  return true
})

/**
 * Start snipping mode
 */
function startSnipping() {
  console.log('✂️ Veris: Starting snipping mode')
  isSnipping = true
  
  // Create overlay
  overlay = document.createElement('div')
  overlay.id = 'veris-snip-overlay'
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 999997;
    cursor: crosshair;
  `
  document.body.appendChild(overlay)
  
  // Create selection box
  selectionBox = document.createElement('div')
  selectionBox.id = 'veris-selection-box'
  selectionBox.style.cssText = `
    position: fixed;
    border: 2px solid #2563eb;
    background: rgba(37, 99, 235, 0.1);
    z-index: 999998;
    display: none;
    pointer-events: none;
  `
  document.body.appendChild(selectionBox)
  
  // Show indicator
  showSnippingIndicator()
  
  // Add event listeners
  document.addEventListener('mousedown', handleMouseDown)
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  document.addEventListener('keydown', handleEscKey)
}

/**
 * Stop snipping mode
 */
function stopSnipping() {
  console.log('🛑 Veris: Stopping snipping mode')
  isSnipping = false
  
  // Remove elements
  if (overlay) overlay.remove()
  if (selectionBox) selectionBox.remove()
  hideSnippingIndicator()
  
  // Remove event listeners
  document.removeEventListener('mousedown', handleMouseDown)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('keydown', handleEscKey)
}

/**
 * Handle mouse down - start selection
 */
function handleMouseDown(e: MouseEvent) {
  if (!isSnipping) return
  
  startX = e.clientX
  startY = e.clientY
  
  if (selectionBox) {
    selectionBox.style.left = `${startX}px`
    selectionBox.style.top = `${startY}px`
    selectionBox.style.width = '0px'
    selectionBox.style.height = '0px'
    selectionBox.style.display = 'block'
  }
  
  console.log('🖱️ Veris: Selection started', { startX, startY })
}

/**
 * Handle mouse move - update selection box
 */
function handleMouseMove(e: MouseEvent) {
  if (!isSnipping || !selectionBox || selectionBox.style.display === 'none') return
  
  const currentX = e.clientX
  const currentY = e.clientY
  
  const width = Math.abs(currentX - startX)
  const height = Math.abs(currentY - startY)
  const left = Math.min(startX, currentX)
  const top = Math.min(startY, currentY)
  
  selectionBox.style.left = `${left}px`
  selectionBox.style.top = `${top}px`
  selectionBox.style.width = `${width}px`
  selectionBox.style.height = `${height}px`
}

/**
 * Handle mouse up - capture selection
 */
async function handleMouseUp(e: MouseEvent) {
  if (!isSnipping || !selectionBox || selectionBox.style.display === 'none') return
  
  const endX = e.clientX
  const endY = e.clientY
  
  const width = Math.abs(endX - startX)
  const height = Math.abs(endY - startY)
  
  // Minimum selection size
  if (width < 10 || height < 10) {
    console.log('❌ Veris: Selection too small')
    stopSnipping()
    return
  }
  
  const left = Math.min(startX, endX)
  const top = Math.min(startY, endY)
  
  console.log('📸 Veris: Capturing area', { left, top, width, height })
  
  // Capture the selected area
  await captureArea(left, top, width, height)
  
  stopSnipping()
}

/**
 * Handle ESC key - cancel snipping
 */
function handleEscKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && isSnipping) {
    console.log('❌ Veris: Snipping cancelled')
    stopSnipping()
    chrome.runtime.sendMessage({ type: 'SNIP_CANCELLED' })
  }
}

/**
 * Capture the selected area as screenshot
 */
async function captureArea(x: number, y: number, width: number, height: number) {
  try {
    console.log('📸 Veris: Capturing screenshot')
    
    // Capture full tab screenshot
    const dataUrl = await new Promise<string>((resolve) => {
      chrome.runtime.sendMessage({ type: 'CAPTURE_TAB' }, (response) => {
        resolve(response.dataUrl)
      })
    })
    
    console.log('✅ Veris: Tab captured, cropping area')
    
    // Crop to selected area
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')!
    
    const img = new Image()
    await new Promise((resolve) => {
      img.onload = resolve
      img.src = dataUrl
    })
    
    // Account for device pixel ratio
    const dpr = window.devicePixelRatio || 1
    ctx.drawImage(
      img,
      x * dpr,
      y * dpr,
      width * dpr,
      height * dpr,
      0,
      0,
      width,
      height
    )
    
    const base64 = canvas.toDataURL('image/png').split(',')[1]
    
    console.log('✅ Veris: Screenshot cropped', { length: base64.length, width, height })
    
    // Save to storage so popup can access it
    chrome.storage.local.set({
      capturedContent: {
        type: 'image',
        data: base64
      }
    }, () => {
      console.log('💾 Veris: Saved to storage')
      showNotification('Screenshot captured! Opening Veris...', 'success')
      
      // Open popup
      chrome.runtime.sendMessage({ type: 'OPEN_POPUP' })
    })
  } catch (error) {
    console.error('❌ Veris: Capture failed', error)
    showNotification('Capture failed. Try again.', 'error')
  }
}

/**
 * Show snipping indicator
 */
function showSnippingIndicator() {
  const indicator = document.createElement('div')
  indicator.id = 'veris-snipping-indicator'
  indicator.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
      </svg>
      <span>Drag to select an area</span>
      <button id="veris-cancel-snip" style="
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        padding: 4px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
      ">Cancel (Esc)</button>
    </div>
  `
  indicator.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 14px;
    font-weight: 500;
  `
  
  document.body.appendChild(indicator)
  
  const cancelBtn = document.getElementById('veris-cancel-snip')
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      stopSnipping()
      chrome.runtime.sendMessage({ type: 'SNIP_CANCELLED' })
    })
  }
}

/**
 * Hide snipping indicator
 */
function hideSnippingIndicator() {
  const indicator = document.getElementById('veris-snipping-indicator')
  if (indicator) indicator.remove()
}

/**
 * Show notification
 */
function showNotification(message: string, type: 'success' | 'error') {
  const notification = document.createElement('div')
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 14px;
  `
  notification.textContent = message
  
  document.body.appendChild(notification)
  
  setTimeout(() => notification.remove(), 3000)
}


