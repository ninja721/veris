'use client'

import { useState } from 'react'
import { Mail, Check, Sparkles, Newspaper } from 'lucide-react'

export default function PremiumPage() {
  const [showBetaModal, setShowBetaModal] = useState(false)

  const plans = [
    {
      name: 'Daily Digest',
      price: '$9.99',
      period: '/month',
      description: 'Verified news delivered to your inbox every morning',
      features: [
        'Daily curated newsletter',
        'Top 10 verified news stories',
        'Exclusive analysis & insights',
        'Ad-free experience',
        'Early access to features'
      ],
      icon: Mail
    },
    {
      name: 'Weekly Roundup',
      price: '$4.99',
      period: '/month',
      description: 'Weekly summary of the most important verified news',
      features: [
        'Weekly newsletter',
        'Top 25 verified news stories',
        'Trend analysis & commentary',
        'Ad-free experience'
      ],
      icon: Mail
    },
    {
      name: 'Print Edition',
      price: '$29.99',
      period: '/month',
      description: 'Physical newspaper delivered to your doorstep',
      features: [
        'Monthly printed newspaper',
        'Premium paper quality',
        'Collector\'s edition design',
        'All digital benefits included',
        'Free shipping worldwide'
      ],
      icon: Newspaper,
      featured: true
    }
  ]

  return (
    <div className="min-h-screen bg-paper-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Beta Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-ink-900 text-paper-100 font-mono text-sm font-bold uppercase tracking-wider border-2 border-ink-900 shadow-md">
            <Sparkles size={16} />
            BETA VERSION
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8 md:mb-12 border-b-4 border-ink-900 pb-6 md:pb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black text-ink-900 mb-4 tracking-tighter px-4">
            PREMIUM EDITIONS
          </h1>
          <p className="text-base md:text-xl text-ink-700 font-serif max-w-2xl mx-auto italic px-4">
            Get verified news delivered directly to you. Truth matters, and we make sure you never miss it.
          </p>
        </div>

        {/* Plans */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto mb-8 md:mb-12">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            return (
              <div
                key={index}
                className={`bg-paper-200 border-2 md:border-4 border-ink-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 ${
                  plan.featured ? 'sm:col-span-2 lg:col-span-1 lg:scale-105 bg-amber-50' : ''
                }`}
              >
                <div className="p-4 md:p-8">
                  {plan.featured && (
                    <div className="bg-ink-900 text-paper-100 text-center py-1 px-3 -mx-4 md:-mx-8 -mt-4 md:-mt-8 mb-4 md:mb-6 font-mono text-xs font-bold uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="border-b-2 border-ink-900 pb-3 md:pb-4 mb-3 md:mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={20} className="text-ink-900 md:w-6 md:h-6" />
                      <h3 className="text-xl md:text-2xl font-heading font-black text-ink-900 uppercase tracking-tight">
                        {plan.name}
                      </h3>
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-4xl md:text-5xl font-heading font-black text-ink-900">
                        {plan.price}
                      </span>
                      <span className="text-ink-600 font-mono ml-2 text-xs md:text-sm">{plan.period}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm md:text-base text-ink-700 font-serif mb-4 md:mb-6 italic">{plan.description}</p>

                  <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 md:gap-3">
                        <Check size={16} className="text-ink-900 flex-shrink-0 mt-0.5 font-bold md:w-5 md:h-5" />
                        <span className="text-sm md:text-base text-ink-800 font-serif">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setShowBetaModal(true)}
                    className="w-full py-2 md:py-3 text-sm md:text-base bg-ink-900 text-paper-100 font-mono font-bold uppercase tracking-wider hover:bg-ink-700 transition-all border-2 border-ink-900 shadow-md hover:shadow-lg"
                  >
                    Subscribe Now
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Free Access Notice */}
        <div className="bg-amber-50 border-2 md:border-4 border-ink-900 p-4 md:p-8 max-w-3xl mx-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-start gap-3 md:gap-4">
            <Mail size={24} className="text-ink-900 flex-shrink-0 md:w-8 md:h-8" />
            <div>
              <h3 className="text-lg md:text-xl font-heading font-black text-ink-900 mb-2 uppercase">
                Currently in Beta
              </h3>
              <p className="text-sm md:text-base text-ink-700 font-serif leading-relaxed">
                We're still perfecting our newsletter and print services. During beta, enjoy unlimited access to 
                The Veris digital newspaper completely free on our website. Premium subscriptions will 
                be available soon!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Beta Modal */}
      {showBetaModal && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={() => setShowBetaModal(false)}
        >
          <div 
            className="bg-paper-100 border-2 md:border-4 border-ink-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-md w-full p-6 md:p-8 mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-100 border-2 border-ink-900 flex items-center justify-center mx-auto mb-4">
                <Sparkles size={24} className="text-ink-900 md:w-8 md:h-8" />
              </div>
              <h2 className="text-xl md:text-2xl font-heading font-black text-ink-900 mb-3 uppercase">
                We're in Beta!
              </h2>
              <p className="text-sm md:text-base text-ink-700 font-serif mb-6 leading-relaxed">
                Premium subscriptions aren't available yet. During our beta phase, enjoy free unlimited 
                access to The Veris digital newspaper on our website. We'll notify you when premium 
                editions launch!
              </p>
              <button
                onClick={() => setShowBetaModal(false)}
                className="w-full py-2 md:py-3 text-sm md:text-base bg-ink-900 text-paper-100 font-mono font-bold uppercase tracking-wider hover:bg-ink-700 transition-all border-2 border-ink-900"
              >
                Got it, thanks!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
