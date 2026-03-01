'use client'

import React, { useEffect } from 'react'
import { useSiteStore } from '@/store/siteStore'
import { useAuthStore } from '@/store/authStore'

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const fetchInitialData = useSiteStore(state => state.fetchInitialData)
    const fetchCurrentUser = useAuthStore(state => state.fetchCurrentUser)
    const user = useAuthStore(state => state.user)

    useEffect(() => {
        // Fetch all initial product and site data on load
        fetchInitialData()
    }, [fetchInitialData])

    useEffect(() => {
        // Initialize fresh user data if logged in
        if (user?.id) {
            fetchCurrentUser(user.id).catch(console.error)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <>{children}</>
}
