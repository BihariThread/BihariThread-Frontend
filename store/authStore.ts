import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Address } from '@/types'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface AddressInput {
    fullName: string
    phone: string
    addressLine1: string
    city: string
    state: string
    pincode: string
    type: 'billing' | 'shipping'
}

interface AuthStore {
    user: User | null
    isLoggedIn: boolean
    isAdminLoggedIn: boolean
    showAuthModal: boolean
    orders: any[]

    // Auth actions
    loginWithEmail: (email: string, password: string) => Promise<void>
    registerWithEmail: (name: string, email: string, phone: string, password: string, addressData?: AddressInput) => Promise<void>
    verifyEmailOTP: (email: string, otp: string, name: string, phone: string, addressData?: AddressInput) => Promise<void>
    sendPasswordReset: (email: string) => Promise<void>
    updatePassword: (password: string) => Promise<void>
    logout: () => Promise<void>

    // Admin auth
    adminLogin: (email: string, pass: string) => boolean
    adminLogout: () => void

    // UI actions
    openAuthModal: () => void
    closeAuthModal: () => void

    // User data actions
    fetchCurrentUser: (userId: string) => Promise<void>
    updateUser: (data: Partial<User>) => Promise<void>
    completeProfile: (userData: { name: string, email: string, password?: string }, addressData: Omit<Address, 'id' | 'isDefault'>) => Promise<void>
    updateFullProfile: (userData: { name: string, email: string }, addressData: Omit<Address, 'id' | 'isDefault'>) => Promise<void>
    fetchOrders: () => Promise<void>

    // Address actions
    addAddress: (address: Omit<Address, 'id' | 'createdAt'>) => Promise<Address | undefined>
    removeAddress: (addressId: string) => Promise<void>
    setDefaultAddress: (addressId: string, type: 'billing' | 'shipping') => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            isLoggedIn: false,
            isAdminLoggedIn: false,
            showAuthModal: false,
            orders: [],

            loginWithEmail: async (email, password) => {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })

                if (error) throw error

                if (data.user) {
                    await get().fetchCurrentUser(data.user.id)
                    set({ isLoggedIn: true, showAuthModal: false })
                }
            },

            registerWithEmail: async (name, email, phone, password, addressData) => {
                // Format phone
                const cleanPhone = phone.replace(/\D/g, '')
                const formattedPhone = cleanPhone.startsWith('91')
                    ? `+${cleanPhone}`
                    : `+91${cleanPhone}`

                // 1. Sign up with Supabase Auth
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { name, phone: formattedPhone }
                    }
                })

                if (error) throw error
                // We do NOT log the user in or save profiles here yet!
                // Wait for verifyEmailOTP.
            },

            verifyEmailOTP: async (email, otp, name, phone, addressData) => {
                // Format phone again just in case
                const cleanPhone = phone.replace(/\D/g, '')
                const formattedPhone = cleanPhone.startsWith('91')
                    ? `+${cleanPhone}`
                    : `+91${cleanPhone}`

                // 1. Verify OTP with Supabase Auth
                const { data, error } = await supabase.auth.verifyOtp({
                    email,
                    token: otp,
                    type: 'signup'
                })

                if (error) throw error

                if (data.user) {
                    // 2. Create user profile in public.users
                    const { error: profileError } = await supabase
                        .from('users')
                        .upsert({
                            id: data.user.id,
                            name,
                            email,
                            phone: formattedPhone,
                            password_set: true,
                        }, { onConflict: 'id' })

                    if (profileError) {
                        console.error('Profile sync error:', profileError.message)
                    }

                    // 3. Add address if provided
                    if (addressData && addressData.addressLine1) {
                        const { error: addrError } = await supabase
                            .from('addresses')
                            .insert([{
                                ...addressData,
                                userId: data.user.id,
                                isDefault: true,
                                type: 'billing'
                            }])

                        if (addrError) {
                            console.error('Address creation error:', addrError.message)
                        }
                    }

                    // 4. Fetch the full profile
                    await get().fetchCurrentUser(data.user.id)
                    set({ isLoggedIn: true, showAuthModal: false })
                }
            },

            sendPasswordReset: async (email) => {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/?reset=true`,
                })

                if (error) throw error
            },

            updatePassword: async (password: string) => {
                const currentUser = get().user
                if (!currentUser) throw new Error('No user logged in')

                const { error: authError } = await supabase.auth.updateUser({
                    password: password
                })

                if (authError) throw authError

                // Update password_set flag in DB
                const { error: userError } = await supabase
                    .from('users')
                    .update({ password_set: true })
                    .eq('id', currentUser.id)

                if (userError) throw userError

                set({ user: { ...currentUser, password_set: true } })
            },

            logout: async () => {
                await supabase.auth.signOut()
                set({ user: null, isLoggedIn: false })
            },

            adminLogin: (email, pass) => {
                if (email === 'biharithread@gmail.com' && pass === 'bihariThread@admin') {
                    set({ isAdminLoggedIn: true })
                    return true
                }
                return false
            },

            adminLogout: () => set({ isAdminLoggedIn: false }),

            openAuthModal: () => set({ showAuthModal: true }),

            closeAuthModal: () => set({ showAuthModal: false }),

            fetchCurrentUser: async (userId) => {
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', userId)
                    .single()

                if (userError && userError.code !== 'PGRST116') {
                    console.error('Error fetching current user:', userError)
                    return
                }

                const { data: addressesData } = await supabase
                    .from('addresses')
                    .select('*')
                    .eq('userId', userId)

                set({
                    user: {
                        ...(userData || { id: userId }),
                        addresses: addressesData || [],
                    } as User
                })
            },

            updateUser: async (data) => {
                const currentUser = get().user
                if (!currentUser) return

                const { error } = await supabase
                    .from('users')
                    .update(data)
                    .eq('id', currentUser.id)

                if (error) throw error

                set({ user: { ...currentUser, ...data } })
            },

            completeProfile: async (userData, addressData) => {
                const currentUser = get().user
                if (!currentUser) return

                const { password, ...otherUserData } = userData

                // 1. Update Supabase Auth
                const authUpdate: any = {}
                if (password) authUpdate.password = password
                if (userData.email) authUpdate.email = userData.email
                authUpdate.data = { name: userData.name }

                const { error: authError } = await supabase.auth.updateUser(authUpdate)

                if (authError) {
                    console.error('Auth update error during completeProfile:', authError)
                }

                // 2. Update user profile
                const { data: updatedProfile, error: userError } = await supabase
                    .from('users')
                    .upsert({
                        ...otherUserData,
                        id: currentUser.id,
                        phone: currentUser.phone || addressData.phone,
                        password_set: !!password || currentUser.password_set
                    }, { onConflict: 'id' })
                    .select()
                    .single()

                if (userError) {
                    console.error('Profile update error:', userError.message)
                    throw new Error(`Failed to update profile: ${userError.message}`)
                }

                // 3. Add address
                const addressPayload = {
                    ...addressData,
                    userId: currentUser.id,
                    isDefault: true,
                    type: 'billing'
                }
                const { data: newAddress, error: addrError } = await supabase
                    .from('addresses')
                    .insert([addressPayload])
                    .select()
                    .single()

                if (addrError) {
                    console.error('Address creation error:', addrError.message)
                    throw addrError
                }

                set({
                    user: {
                        ...(updatedProfile || currentUser),
                        ...userData,
                        addresses: newAddress ? [newAddress as Address] : []
                    }
                })
            },

            updateFullProfile: async (userData, addressData) => {
                const currentUser = get().user
                if (!currentUser) return

                // 1. Update user details
                const { data: updatedProfile, error: userError } = await supabase
                    .from('users')
                    .update({
                        name: userData.name,
                        email: userData.email,
                        phone: currentUser.phone || addressData.phone,
                    })
                    .eq('id', currentUser.id)
                    .select()
                    .single()

                if (userError) throw userError

                // 2. Sync with Supabase Auth
                await supabase.auth.updateUser({
                    email: userData.email,
                    data: { name: userData.name }
                }).catch(err => console.error('Auth sync error:', err))

                // 3. Update address
                const defaultBilling = currentUser.addresses?.find(a => a.type === 'billing' && a.isDefault)

                const addrPayload = {
                    ...addressData,
                    userId: currentUser.id,
                    type: 'billing',
                    isDefault: true
                }

                let finalAddress: Address;

                if (defaultBilling) {
                    const { data: updatedAddr, error: addrError } = await supabase
                        .from('addresses')
                        .update(addrPayload)
                        .eq('id', defaultBilling.id)
                        .select()
                        .single()

                    if (addrError) throw addrError
                    finalAddress = updatedAddr as Address
                } else {
                    const { data: newAddr, error: addrError } = await supabase
                        .from('addresses')
                        .insert([addrPayload])
                        .select()
                        .single()

                    if (addrError) throw addrError
                    finalAddress = newAddr as Address
                }

                const otherAddresses = currentUser.addresses.filter(a => a.id !== defaultBilling?.id)
                set({
                    user: {
                        ...currentUser,
                        ...userData,
                        addresses: [finalAddress, ...otherAddresses]
                    }
                })
            },

            fetchOrders: async () => {
                const currentUser = get().user
                if (!currentUser) return

                try {
                    const res = await fetch(`/api/orders/user?userId=${currentUser.id}`);
                    if (!res.ok) {
                        const errorData = await res.json();
                        console.error('Error fetching orders:', errorData.error);
                        return;
                    }
                    const data = await res.json();
                    set({ orders: data || [] });
                } catch (error) {
                    console.error('Error fetching orders:', error);
                }
            },

            addAddress: async (addressData) => {
                const currentUser = get().user
                if (!currentUser) {
                    throw new Error('Please login to add an address')
                }

                const payload = { ...addressData, userId: currentUser.id }

                const { data, error } = await supabase
                    .from('addresses')
                    .insert([payload])
                    .select()
                    .single()

                if (error) {
                    console.error('Address insert error:', error.message)
                    throw error
                }

                if (data) {
                    set({
                        user: {
                            ...currentUser,
                            addresses: [...(currentUser.addresses || []), data as Address],
                        },
                    })
                    return data as Address
                }
            },

            removeAddress: async (addressId) => {
                const currentUser = get().user
                if (!currentUser) return

                const { error } = await supabase
                    .from('addresses')
                    .delete()
                    .eq('id', addressId)

                if (error) throw error

                set({
                    user: {
                        ...currentUser,
                        addresses: currentUser.addresses.filter((a) => a.id !== addressId),
                    },
                })
            },

            setDefaultAddress: async (addressId, type) => {
                const currentUser = get().user
                if (!currentUser) return

                const typeAddresses = currentUser.addresses.filter(a => a.type === type)
                for (const a of typeAddresses) {
                    await supabase.from('addresses').update({ isDefault: a.id === addressId }).eq('id', a.id)
                }

                const { data: addressesData } = await supabase
                    .from('addresses')
                    .select('*')
                    .eq('userId', currentUser.id)

                set({
                    user: {
                        ...currentUser,
                        addresses: addressesData as Address[] || [],
                    },
                })
            },
        }),
        {
            name: 'biharithread-auth',
            partialize: (state) => ({
                user: state.user,
                isLoggedIn: state.isLoggedIn,
                isAdminLoggedIn: state.isAdminLoggedIn,
            }),
        }
    )
)

// ── Supabase Auth State Listener ──
// Syncs the persisted Zustand store with the real Supabase auth session.
// This ensures a stale/legacy user ID in localStorage never overrides
// the actual authenticated user's UUID.
if (typeof window !== 'undefined') {
    supabase.auth.onAuthStateChange(async (event, session) => {
        const store = useAuthStore.getState()

        if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION')) {
            // Only re-fetch if the user ID in the store doesn't match the session
            if (!store.user || store.user.id !== session.user.id) {
                await store.fetchCurrentUser(session.user.id)
                useAuthStore.setState({ isLoggedIn: true })
            }
        } else if (event === 'SIGNED_OUT') {
            useAuthStore.setState({ user: null, isLoggedIn: false, orders: [] })
        }
    })
}
