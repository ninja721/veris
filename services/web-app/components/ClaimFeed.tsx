'use client'

import { useEffect, useState } from 'react'
import ClaimCard from './ClaimCard'

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
  content_type?: string
}

export default function ClaimFeed() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    console.log('ClaimFeed mounted, fetching claims...')
    fetchClaims(1)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || !hasMore) return

      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // Load more when user is 500px from bottom
      if (scrollTop + windowHeight >= documentHeight - 500) {
        loadMore()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadingMore, hasMore, page])

  async function fetchClaims(pageNum: number) {
    console.log('Fetching claims page:', pageNum)
    try {
      const res = await fetch(`/api/claims?page=${pageNum}&limit=10`)
      console.log('Response status:', res.status)
      
      const data = await res.json()
      console.log('Response data:', data)
      console.log('Claims count:', data.claims?.length || 0)
      
      if (pageNum === 1) {
        setClaims(data.claims || [])
      } else {
        setClaims(prev => [...prev, ...(data.claims || [])])
      }
      
      setHasMore(data.hasMore)
      setPage(pageNum)
    } catch (error) {
      console.error('Failed to fetch claims:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setLoading(false)
      setLoadingMore(false)
      console.log('Loading complete')
    }
  }

  async function loadMore() {
    if (loadingMore || !hasMore) return
    
    setLoadingMore(true)
    await fetchClaims(page + 1)
  }

  console.log('Render state:', { loading, claimsCount: claims.length, error })

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-neutral-600">Loading claims...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-12 text-center">
          <p className="text-red-600">Error: {error}</p>
          <button 
            onClick={fetchClaims}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (claims.length === 0) {
    return (
      <div className="p-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center">
          <p className="text-neutral-600">No claims yet. Check back soon!</p>
          <button 
            onClick={fetchClaims}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4 bg-white">
      <p className="text-sm text-neutral-500 px-2">Showing {claims.length} claims</p>
      {claims.map((claim) => (
        <ClaimCard key={claim.id} claim={claim} />
      ))}
      
      {loadingMore && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {!hasMore && claims.length > 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-neutral-500">You've reached the end</p>
        </div>
      )}
    </div>
  )
}
