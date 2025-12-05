import { NextResponse } from 'next/server'

interface ADKMessagePart {
  text?: string
  inline_data?: {
    mime_type: string
    data: string
  }
}

class ADKSubmissionClient {
  private agentUrl: string
  private userId: string = 'web_user'

  constructor() {
    this.agentUrl = process.env.NEXT_PUBLIC_ADK_AGENT_URL || ''
  }

  async createSession(): Promise<string> {
    const response = await fetch(
      `${this.agentUrl}/apps/veris_agent/users/${this.userId}/sessions`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      }
    )
    
    if (!response.ok) {
      throw new Error(`Failed to create session: ${response.status}`)
    }
    
    const data = await response.json()
    return data.id
  }

  async submitToAgent(parts: ADKMessagePart[]): Promise<boolean> {
    try {
      const sessionId = await this.createSession()

      const response = await fetch(`${this.agentUrl}/run_sse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          app_name: 'veris_agent',
          user_id: this.userId,
          session_id: sessionId,
          newMessage: {
            role: 'user',
            parts,
          },
        }),
      })

      return response.ok || response.status === 202
    } catch {
      return false
    }
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const text = formData.get('text') as string
    const file = formData.get('file') as File | null

    if (!text && !file) {
      return NextResponse.json({
        success: false,
        message: 'Please provide text or upload a file'
      }, { status: 400 })
    }

    if (text && text.trim().length < 10) {
      return NextResponse.json({
        success: false,
        message: 'Please provide at least 10 characters'
      }, { status: 400 })
    }

    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']
      if (!validTypes.includes(file.type)) {
        return NextResponse.json({
          success: false,
          message: 'Invalid file type'
        }, { status: 400 })
      }

      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({
          success: false,
          message: 'File too large. Max 10MB'
        }, { status: 400 })
      }
    }

    const adkClient = new ADKSubmissionClient()
    const parts: ADKMessagePart[] = []

    if (file) {
      const arrayBuffer = await file.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString('base64')

      parts.push({
        inline_data: {
          mime_type: file.type,
          data: base64,
        }
      })

      if (text && text.trim()) {
        parts.push({ text: `Context: ${text.trim()}` })
      }
    } else {
      parts.push({ text: text.trim() })
    }

    const success = await adkClient.submitToAgent(parts)

    if (success) {
      return NextResponse.json({
        success: true,
        status: 'submitted',
        message: 'Submitted for verification. Check Veris in 2-3 minutes!'
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to submit. Please try again.'
      }, { status: 500 })
    }
  } catch {
    return NextResponse.json({
      success: false,
      message: 'Failed to submit. Please try again.'
    }, { status: 500 })
  }
}
