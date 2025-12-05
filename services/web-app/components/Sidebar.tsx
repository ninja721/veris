'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Newspaper, PlusSquare, ShieldCheck } from 'lucide-react'

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden md:flex flex-col w-[244px] border-r-2 border-ink-900 fixed h-screen bg-paper-100 z-50 shadow-xl">
            <div className="p-6 border-b border-ink-300">
                <Link href="/veris" className="flex items-center gap-3 mb-2 group">
                    <div className="w-10 h-10 bg-ink-900 rounded-sm flex items-center justify-center group-hover:bg-ink-700 transition-colors">
                        <span className="text-paper-100 font-heading font-bold text-2xl">V</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-heading font-black text-ink-900 tracking-tighter leading-none">VERIS</span>
                        <span className="text-[10px] font-mono text-ink-600 uppercase tracking-widest leading-none">Chronicle</span>
                    </div>
                </Link>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
                <h3 className="font-mono text-xs font-bold text-ink-500 uppercase tracking-widest mb-4 border-b border-ink-300 pb-1">
                    Index
                </h3>

                <nav className="space-y-4">
                    <Link
                        href="/veris"
                        className={`flex items-center gap-3 p-2 transition-all group ${pathname === '/veris'
                                ? 'bg-ink-900 text-paper-100 shadow-md transform -rotate-1'
                                : 'text-ink-800 hover:bg-paper-200 hover:pl-4'
                            }`}
                    >
                        <Newspaper size={20} />
                        <span className="font-serif font-bold">Front Page</span>
                    </Link>

                    <Link
                        href="/submit"
                        className={`flex items-center gap-3 p-2 transition-all group ${pathname === '/submit'
                                ? 'bg-ink-900 text-paper-100 shadow-md transform -rotate-1'
                                : 'text-ink-800 hover:bg-paper-200 hover:pl-4'
                            }`}
                    >
                        <PlusSquare size={20} />
                        <span className="font-serif font-bold">Submit Tip</span>
                    </Link>
                </nav>

                <div className="mt-12 p-4 bg-paper-200 border border-ink-300 relative">
                    <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-ink-900"></div>
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-ink-900"></div>
                    <h4 className="font-heading font-bold text-lg mb-2">Daily Quote</h4>
                    <p className="font-serif italic text-sm text-ink-700">
                        "In a time of deceit telling the truth is a revolutionary act."
                    </p>
                    <p className="text-xs font-mono text-ink-500 mt-2 text-right">- Orwell</p>
                </div>
            </div>

            <div className="p-4 border-t-2 border-ink-900 bg-paper-200">
                <div className="flex items-center gap-2 text-ink-800">
                    <ShieldCheck size={20} />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider">Verified Truth</span>
                </div>
            </div>
        </aside>
    )
}
