'use client'

import { useEffect, useState } from 'react'
import Newspaper from '@/components/Newspaper'

interface Claim {
  id: string
  claim: string
  verification_status: string
  confidence: number
  evidence: string
  sources: string[]
  category: string
  source: string
  created_at: string
  images?: string[]
  videos?: string[]
}

export default function VerisPage() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchClaims()
  }, [])

  async function fetchClaims() {
    try {
      const res = await fetch('/api/claims?page=1&limit=100')
      const data = await res.json()
      
      if (data.success) {
        setClaims(data.claims || [])
      } else {
        setError('Failed to load claims')
      }
    } catch {
      setError('Failed to load claims')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-900 mb-4 mx-auto"></div>
          <p className="text-xl font-serif text-gray-700">Loading The Veris...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md text-center">
          <p className="text-red-600 font-serif text-lg mb-4">{error}</p>
          <button 
            onClick={fetchClaims}
            className="px-6 py-3 bg-amber-900 text-white rounded-lg font-serif hover:bg-amber-800"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (claims.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md text-center">
          <p className="text-gray-700 font-serif text-lg mb-4">No verified claims yet. Check back soon!</p>
          <button 
            onClick={fetchClaims}
            className="px-6 py-3 bg-amber-900 text-white rounded-lg font-serif hover:bg-amber-800"
          >
            Refresh
          </button>
        </div>
      </div>
    )
  }

  return <Newspaper claims={claims} />
}
