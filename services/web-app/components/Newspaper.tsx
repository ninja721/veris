'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null)
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null)
  const [isHalloween, setIsHalloween] = useState(false)

  const claimsPerPage = 5
  const totalPages = Math.ceil(claims.length / claimsPerPage)

  const getCurrentPageClaims = () => {
    const start = currentPage * claimsPerPage
    return claims.slice(start, start + claimsPerPage)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      setFlipDirection('next')
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage(prev => prev + 1)
        setIsFlipping(false)
        setFlipDirection(null)
        setSelectedClaimId(null)
      }, 800)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setFlipDirection('prev')
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage(prev => prev - 1)
        setIsFlipping(false)
        setFlipDirection(null)
        setSelectedClaimId(null)
      }, 800)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <span className="badge-verified">Verified Truth</span>
      case 'false':
        return <span className="badge-false">Fabrication</span>
      case 'disputed':
        return <span className="badge-disputed">Contested</span>
      default:
        return <span className="badge-unverifiable">Unverified</span>
    }
  }

  const pageClaims = getCurrentPageClaims()
  const leadClaim = selectedClaimId
    ? pageClaims.find(c => c.id === selectedClaimId) || pageClaims[0]
    : pageClaims[0]
  const sidebarClaims = pageClaims.filter(c => c.id !== leadClaim?.id)

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className={`min-h-screen bg-paper-800 py-8 px-4 flex items-center justify-center overflow-hidden ${isHalloween ? 'halloween' : ''}`}>
      <div className="max-w-6xl w-full perspective-2000">
        <div className={`
          relative bg-paper-100 shadow-2xl transition-transform duration-800 transform-style-3d
          ${isFlipping && flipDirection === 'next' ? 'animate-flip-out' : ''}
          ${isFlipping && flipDirection === 'prev' ? 'animate-flip-in' : ''}
        `}>

          {/* Header / Masthead */}
          <header className="border-b-4 border-double border-ink-900 p-4 md:p-8 text-center relative">
            <div className="absolute top-2 left-2 md:top-4 md:left-4 text-[10px] md:text-xs font-mono text-ink-600 border border-ink-600 p-1">
              VOL. {new Date().getFullYear()}.{new Date().getMonth() + 1}
            </div>
            <div className="absolute top-2 right-2 md:top-4 md:right-4 text-[10px] md:text-xs font-mono text-ink-600 border border-ink-600 p-1">
              FREE
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter mb-2 glitch-wrapper">
              <span className="glitch-text" data-text="THE VERIS CHRONICLE">THE VERIS CHRONICLE</span>
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 border-t border-b border-ink-900 py-2 mt-4 text-xs md:text-sm">
              <span className="font-mono">{today}</span>
              <span className="text-ink-400 hidden sm:inline">•</span>
              <span className="font-mono uppercase tracking-widest">Verification Engine</span>
              <span className="text-ink-400 hidden sm:inline">•</span>
              <span className="font-mono">WORLDWIDE EDITION</span>
            </div>
          </header>

          {/* Main Content */}
          <div className="p-4 md:p-8 grid grid-cols-12 gap-4 md:gap-8 min-h-[600px] md:min-h-[800px]">
            {/* Left Column (Lead Story) */}
            <div className="col-span-12 lg:col-span-8 lg:border-r border-ink-300 lg:pr-8 flex flex-col">
              {leadClaim ? (
                <article className="mb-8 flex-1 animate-in fade-in duration-500" key={leadClaim.id}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs uppercase tracking-widest text-ink-500 border-b border-ink-500 pb-1">
                      {leadClaim.category}
                    </span>
                    {getStatusBadge(leadClaim.verification_status)}
                  </div>

                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 font-heading">
                    {leadClaim.claim}
                  </h2>

                  <div className="flex items-center gap-4 text-sm font-mono text-ink-600 mb-6 italic">
                    <span>By {leadClaim.source}</span>
                    <span>•</span>
                    <span>Confidence: {leadClaim.confidence}%</span>
                  </div>

                  {/* Media Display for Lead Story */}
                  {leadClaim.images && leadClaim.images.length > 0 && leadClaim.images[0] && (
                    <div className="mb-6 border-4 border-ink-900 shadow-lg bg-paper-200">
                      <img
                        src={leadClaim.images[0]}
                        alt="Evidence"
                        className="w-full h-auto"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                      <div className="bg-paper-200 px-3 py-2 border-t-2 border-ink-900">
                        <p className="text-xs font-mono text-ink-700 italic">Photographic Evidence</p>
                      </div>
                    </div>
                  )}

                  {leadClaim.videos && leadClaim.videos.length > 0 && (
                    <div className="mb-6 border-4 border-ink-900 shadow-lg">
                      <video
                        controls
                        className="w-full h-auto bg-black"
                        preload="metadata"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          console.error('Video load error:', leadClaim.videos?.[0])
                          e.currentTarget.style.display = 'none'
                        }}
                      >
                        <source src={leadClaim.videos[0]} type="video/mp4" />
                        <source src={leadClaim.videos[0]} type="video/webm" />
                        Your browser does not support the video tag.
                      </video>
                      <div className="bg-paper-200 px-3 py-2 border-t-2 border-ink-900">
                        <p className="text-xs font-mono text-ink-700 italic">Video Evidence</p>
                      </div>
                    </div>
                  )}

                  <div className="prose prose-lg font-serif text-ink-800 first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-[-10px]">
                    {leadClaim.evidence}
                  </div>

                  {leadClaim.sources && leadClaim.sources.length > 0 && (
                    <div className="mt-6 p-4 bg-paper-200 border border-paper-400 rounded-sm">
                      <h4 className="font-bold text-sm uppercase mb-2 font-mono">Sources Verified:</h4>
                      <ul className="list-disc pl-4 text-sm font-mono text-ink-700">
                        {leadClaim.sources.slice(0, 3).map((source, i) => (
                          <li key={i} className="truncate">
                            <a href={source} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-ink-900">
                              {new URL(source).hostname}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              ) : (
                <div className="flex items-center justify-center h-full text-ink-400 font-serif italic">
                  No stories to display on this page.
                </div>
              )}
            </div>

            {/* Right Column (Sidebar Stories) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
              {/* Status Widget */}
              <div className="border-b-2 border-ink-900 pb-4 mb-2 hidden lg:block">
                <h3 className="font-bold text-lg mb-2 font-heading uppercase text-center">Status</h3>
                <div className="grid grid-cols-2 gap-2 text-center font-mono text-xs">
                  <div className="bg-ink-900 text-paper-100 p-2">
                    <div className="text-tech-cyan font-bold">ONLINE</div>
                    <div>CRAWLER</div>
                  </div>
                  <div className="bg-paper-300 p-2 border border-ink-900">
                    <div className="font-bold">{claims.length}</div>
                    <div>STORIES</div>
                  </div>
                </div>
              </div>

              {sidebarClaims.map((claim) => (
                <article
                  key={claim.id}
                  className="border-b border-ink-300 pb-4 last:border-0 group cursor-pointer"
                  onClick={() => setSelectedClaimId(claim.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-ink-500 uppercase">{claim.category}</span>
                    {getStatusBadge(claim.verification_status)}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold leading-snug mb-2 font-heading group-hover:text-ink-600 transition-colors group-hover:underline decoration-ink-400 underline-offset-4">
                    {claim.claim}
                  </h3>
                  <p className="text-sm text-ink-700 line-clamp-3 font-serif">
                    {claim.evidence}
                  </p>
                </article>
              ))}

              {/* Fill empty space if fewer than 5 claims */}
              {pageClaims.length < 5 && Array.from({ length: 5 - pageClaims.length }).map((_, i) => (
                <div key={`placeholder-${i}`} className="border-b border-ink-300 pb-4 last:border-0 opacity-30">
                  <div className="h-4 bg-ink-200 w-1/3 mb-2"></div>
                  <div className="h-6 bg-ink-200 w-3/4 mb-2"></div>
                  <div className="h-4 bg-ink-200 w-full mb-1"></div>
                  <div className="h-4 bg-ink-200 w-5/6"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer / Pagination */}
          <footer className="bg-paper-200 border-t-2 border-ink-900 p-3 md:p-4 flex items-center justify-between flex-wrap gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0 || isFlipping}
              className="btn-secondary flex items-center gap-1 md:gap-2 text-sm md:text-base"
            >
              <ChevronLeft size={16} /> <span className="hidden sm:inline">Previous</span><span className="sm:hidden">Prev</span>
            </button>

            <div className="flex items-center gap-4">
              <div className="font-mono text-xs md:text-sm">
                PAGE {currentPage + 1} OF {totalPages}
              </div>
              <button
                onClick={() => setIsHalloween(!isHalloween)}
                className="px-3 py-1 bg-paper-300 border-2 border-ink-900 font-mono text-xs font-bold uppercase tracking-wider hover:bg-paper-400 transition-all"
              >
                {isHalloween ? '🎃' : '📰'}
              </button>
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 1 || isFlipping}
              className="btn-primary flex items-center gap-1 md:gap-2 text-sm md:text-base"
            >
              <span className="hidden sm:inline">Next</span><span className="sm:hidden">Next</span> <ChevronRight size={16} />
            </button>
          </footer>

        </div>
      </div>
    </div>
  )
}
