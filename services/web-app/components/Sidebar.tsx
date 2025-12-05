'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Newspaper, PlusSquare, ShieldCheck } from 'lucide-react'

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden md:flex flex-col w-[244px] border-r border-neutral-200 fixed h-screen bg-white z-50">
            <div className="p-6">
                <Link href="/veris" className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">V</span>
                    </div>
                    <span className="text-xl font-bold text-neutral-900">Veris</span>
                </Link>

                <nav className="space-y-2">
                    <Link 
                        href="/veris" 
                        className={`sidebar-link ${pathname === '/veris' ? 'active' : ''}`}
                    >
                        <Newspaper size={24} />
                        <span>Veris</span>
                    </Link>
                    <Link 
                        href="/submit" 
                        className={`sidebar-link ${pathname === '/submit' ? 'active' : ''}`}
                    >
                        <PlusSquare size={24} />
                        <span>Verify Claim</span>
                    </Link>
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-neutral-100">
                <div className="flex items-center gap-2 text-neutral-600">
                    <ShieldCheck size={20} />
                    <span className="font-medium text-sm">AI-Verified News</span>
                </div>
            </div>
        </aside>
    )
}
