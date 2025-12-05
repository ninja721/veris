'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type HalloweenContextType = {
    isHalloween: boolean
    toggleHalloween: () => void
}

const HalloweenContext = createContext<HalloweenContextType | undefined>(undefined)

export function HalloweenProvider({ children }: { children: React.ReactNode }) {
    const [isHalloween, setIsHalloween] = useState(false)

    useEffect(() => {
        // Check local storage on mount
        const saved = localStorage.getItem('veris-halloween-theme')
        if (saved) {
            setIsHalloween(saved === 'true')
        }
    }, [])

    useEffect(() => {
        // Update body class and local storage
        if (isHalloween) {
            document.documentElement.classList.add('halloween')
            localStorage.setItem('veris-halloween-theme', 'true')
        } else {
            document.documentElement.classList.remove('halloween')
            localStorage.setItem('veris-halloween-theme', 'false')
        }
    }, [isHalloween])

    const toggleHalloween = () => {
        setIsHalloween(prev => !prev)
    }

    return (
        <HalloweenContext.Provider value={{ isHalloween, toggleHalloween }}>
            {children}
        </HalloweenContext.Provider>
    )
}

export function useHalloween() {
    const context = useContext(HalloweenContext)
    if (context === undefined) {
        throw new Error('useHalloween must be used within a HalloweenProvider')
    }
    return context
}
