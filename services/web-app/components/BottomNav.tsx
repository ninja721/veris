'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Newspaper, PlusSquare } from 'lucide-react'

export default function BottomNav() {
    const pathname = usePathname()

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50 px-4 py-3">
            <div className="flex justify-around items-center max-w-md mx-auto">
                <Link 
                    href="/veris" 
                    className={`flex flex-col items-center gap-1 p-2 ${
                        pathname === '/veris' ? 'text-neutral-900' : 'text-neutral-500'
                    }`}
                >
                    <Newspaper size={24} />
                    <span className="text-xs font-medium">Veris</span>
                </Link>
                <Link 
                    href="/submit" 
                    className={`flex flex-col items-center gap-1 p-2 ${
                        pathname === '/submit' ? 'text-neutral-900' : 'text-neutral-500'
                    }`}
                >
                    <PlusSquare size={24} />
                    <span className="text-xs font-medium">Verify</span>
                </Link>
            </div>
        </nav>
    )
}
