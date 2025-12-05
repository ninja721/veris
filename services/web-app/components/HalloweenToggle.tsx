'use client'

import { useHalloween } from './HalloweenContext'
import { Ghost } from 'lucide-react'

export default function HalloweenToggle() {
    const { isHalloween, toggleHalloween } = useHalloween()

    return (
        <button
            onClick={toggleHalloween}
            className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full border-2 transition-all duration-300 ${isHalloween
                    ? 'bg-orange-600 border-orange-800 text-white shadow-[0_0_10px_rgba(234,88,12,0.5)]'
                    : 'bg-paper-200 border-ink-400 text-ink-600 hover:bg-paper-300'
                }`}
            title={isHalloween ? "Back to Normal" : "Spookify!"}
        >
            <Ghost size={16} className={`${isHalloween ? 'animate-bounce' : ''}`} />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
                {isHalloween ? 'BOO!' : 'Halloween'}
            </span>
        </button>
    )
}
