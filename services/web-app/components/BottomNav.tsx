'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Newspaper, PlusSquare, Mail } from 'lucide-react'
import HalloweenToggle from './HalloweenToggle'

export default function BottomNav() {
    const pathname = usePathname()

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-paper-100 border-t-2 border-ink-900 z-50 px-4 py-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="flex justify-around items-center max-w-md mx-auto">
                <Link
                    href="/veris"
                    className={`flex flex-col items-center gap-1 p-2 transition-all ${pathname === '/veris'
                        ? 'text-ink-900 scale-110'
                        : 'text-ink-500 hover:text-ink-700'
                        }`}
                >
                    <Newspaper size={24} />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Front</span>
                </Link>

                <div className="w-px h-8 bg-ink-300"></div>

                <Link
                    href="/submit"
                    className={`flex flex-col items-center gap-1 p-2 transition-all ${pathname === '/submit'
                        ? 'text-ink-900 scale-110'
                        : 'text-ink-500 hover:text-ink-700'
                        }`}
                >
                    <PlusSquare size={24} />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Submit</span>
                </Link>

                <div className="w-px h-8 bg-ink-300"></div>

                <Link
                    href="/premium"
                    className={`flex flex-col items-center gap-1 p-2 transition-all ${pathname === '/premium'
                        ? 'text-ink-900 scale-110'
                        : 'text-ink-500 hover:text-ink-700'
                        }`}
                >
                    <Mail size={24} />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Premium</span>
                </Link>

                <div className="w-px h-8 bg-ink-300"></div>

                <div className="p-2">
                    <HalloweenToggle />
                </div>
            </div>
        </nav>
    )
}
