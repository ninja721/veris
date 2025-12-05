'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Newspaper as NewspaperIcon } from 'lucide-react'

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

interface NewspaperProps {
  claims: Claim[]
}

export default function Newspaper({ claims }: NewspaperProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState<'left' | 'right'>('right')
  
  const claimsPerPage = 6
  const totalPages = Math.ceil(claims.length / claimsPerPage)
  
  const getCurrentPageClaims = () => {
    const start = currentPage * claimsPerPage
    return claims.slice(start, start + claimsPerPage)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setFlipDirection('right')
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage(prev => prev + 1)
        setIsFlipping(false)
      }, 600)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setFlipDirection('left')
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage(prev => prev - 1)
        setIsFlipping(false)
      }, 600)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return { text: '✓ VERIFIED', color: 'text-green-800' }
      case 'false':
        return { text: '✗ FALSE', color: 'text-red-800' }
      case 'disputed':
        return { text: '⚠ DISPUTED', color: 'text-orange-800' }
      default:
        return { text: '? UNVERIFIED', color: 'text-gray-800' }
    }
  }

  const pageClaims = getCurrentPageClaims()
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Newspaper Container */}
        <div className="relative">
          {/* Page */}
          <div 
            className={`
              bg-[#f5f1e8] shadow-2xl rounded-sm overflow-hidden
              transition-all duration-600 ease-in-out
              ${isFlipping ? (flipDirection === 'right' ? 'animate-flip-right' : 'animate-flip-left') : ''}
            `}
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3CfeColorMatrix type=\'saturate\' values=\'0\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.05\'/%3E%3C/svg%3E")',
            }}
          >
            {/* Masthead */}
            <div className="border-b-4 border-black py-6 px-8">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-serif text-gray-700">Est. 2024</div>
                <div className="text-xs font-serif text-gray-700">{today}</div>
              </div>
              <h1 className="text-7xl font-serif font-black text-center text-gray-900 tracking-tight" 
                  style={{ fontFamily: 'Georgia, serif', textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
                THE VERIS
              </h1>
              <div className="text-center mt-2">
                <p className="text-sm font-serif italic text-gray-700">"Truth Matters - All the Facts Fit to Verify"</p>
              </div>
              <div className="flex items-center justify-between mt-3 text-xs font-serif text-gray-600">
                <span>Page {currentPage + 1} of {totalPages}</span>
                <span className="flex items-center gap-1">
                  <NewspaperIcon size={14} />
                  AI-Verified News
                </span>
                <span>{claims.length} Claims Verified</span>
              </div>
            </div>

            {/* Content Grid */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pageClaims.map((claim, index) => {
                  const badge = getStatusBadge(claim.verification_status)
                  const isLead = index === 0
                  
                  return (
                    <article 
                      key={claim.id}
                      className={`
                        ${isLead ? 'md:col-span-2' : ''}
                        border-b-2 border-gray-400 pb-4
                      `}
                    >
                      {/* Category & Status */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-700 font-serif">
                          {claim.category}
                        </span>
                        <span className={`text-xs font-bold ${badge.color} font-mono`}>
                          {badge.text}
                        </span>
                      </div>

                      {/* Headline */}
                      <h2 className={`
                        font-serif font-bold text-gray-900 mb-2 leading-tight
                        ${isLead ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}
                      `}>
                        {claim.claim}
                      </h2>

                      {/* Byline */}
                      <div className="text-xs text-gray-600 mb-3 font-serif italic">
                        By {claim.source} • {new Date(claim.created_at).toLocaleDateString()} • Confidence: {claim.confidence}%
                      </div>

                      {/* Evidence */}
                      <p className={`
                        font-serif text-gray-800 leading-relaxed
                        ${isLead ? 'text-base' : 'text-sm'}
                      `}>
                        {claim.evidence.length > 300 
                          ? claim.evidence.substring(0, 300) + '...' 
                          : claim.evidence}
                      </p>

                      {/* Sources */}
                      {claim.sources && claim.sources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-300">
                          <p className="text-xs font-bold text-gray-700 mb-1 font-serif">SOURCES:</p>
                          <div className="flex flex-wrap gap-2">
                            {claim.sources.slice(0, 3).map((source, i) => (
                              <span 
                                key={i}
                                className="text-xs text-blue-800 underline font-serif"
                              >
                                {new URL(source).hostname}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="mt-8 pt-4 border-t-2 border-gray-400 text-center">
                <p className="text-xs font-serif text-gray-600 italic">
                  All claims verified using state-of-the-art AI fact-checking technology
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0 || isFlipping}
              className="flex items-center gap-2 px-6 py-3 bg-amber-900 text-amber-50 rounded-lg font-serif font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-800 transition-all shadow-lg"
            >
              <ChevronLeft size={20} />
              Previous Page
            </button>

            <div className="text-center">
              <p className="text-sm font-serif text-gray-700">
                Page {currentPage + 1} of {totalPages}
              </p>
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 1 || isFlipping}
              className="flex items-center gap-2 px-6 py-3 bg-amber-900 text-amber-50 rounded-lg font-serif font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-800 transition-all shadow-lg"
            >
              Next Page
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
