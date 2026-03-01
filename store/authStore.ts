import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Address } from '@/types'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'



interface AuthStore {
    user: User | null
    isLoggedIn: boolean
    isAdminLoggedIn: boolean
    showAuthModal: boolean
    orders: any[]

    // Auth actions
    sendOTP: (phone: string) => Promise<void>
    verifyOTP: (phone: string, token: string) => Promise<{ isNewUser: boolean }>
    loginWithPassword: (phone: string, pass: string) => Promise<void>
    checkUser: (phone: string) => Promise<{ exists: boolean, hasName: boolean, hasPassword: boolean }>
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
    updatePassword: (password: string) => Promise<void>

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

            sendOTP: async (phone) => {
                // Ensure phone is in E.164 format (+[country code][number])
                const cleanPhone = phone.replace(/\D/g, '')
                const formattedPhone = cleanPhone.startsWith('91')
                    ? `+${cleanPhone}`
                    : `+91${cleanPhone}`

                console.log('Attempting to send OTP to:', formattedPhone)

                const { error } = await supabase.auth.signInWithOtp({
                    phone: formattedPhone,
                })
                if (error) {
                    console.error('Supabase OTP Error:', error)
                    throw error
                }
            },

            verifyOTP: async (phone, token) => {
                const cleanPhone = phone.replace(/\D/g, '')
                const formattedPhone = cleanPhone.startsWith('91')
                    ? `+${cleanPhone}`
                    : `+91${cleanPhone}`

                const { data, error } = await supabase.auth.verifyOtp({
                    phone: formattedPhone,
                    token,
                    type: 'sms',
                })

                if (error) throw error

                if (data.user) {
                    // Check if profile exists
                    const { data: existingProfile } = await supabase
                        .from('users')
                        .select('name')
                        .eq('id', data.user.id)
                        .single()

                    const isNewUser = !existingProfile || !existingProfile.name

                    // Initial sync with public.users table (preserving existing if exists)
                    const userData = {
                        id: data.user.id,
                        phone: data.user.phone || formattedPhone,
                        email: data.user.email || null,
                    }

                    console.log('Supabase: Syncing user on OTP verify:', userData)

                    const { data: profile, error: upsertError } = await supabase
                        .from('users')
                        .upsert(userData, { onConflict: 'id' })
                        .select()
                        .single()

                    if (upsertError) {
                        console.error('CRITICAL: Profile sync error:', upsertError.message, upsertError.details)
                        toast.error('Failed to sync user profile.')
                    }

                    set({
                        user: (profile || userData) as User,
                        isLoggedIn: true,
                        showAuthModal: isNewUser // Keep modal open if new user
                    })

                    return { isNewUser }
                }
                return { isNewUser: false }
            },

            checkUser: async (phone) => {
                const cleanPhone = phone.replace(/\D/g, '')
                const formattedPhone = cleanPhone.startsWith('91')
                    ? `+${cleanPhone}`
                    : `+91${cleanPhone}`

                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('phone', formattedPhone)
                    .single()

                if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
                    console.error('Error checking user existence:', error)
                }

                return {
                    exists: !!data,
                    hasName: !!data?.name,
                    hasPassword: !!data?.password_set
                }
            },

            loginWithPassword: async (phone, password) => {
                const cleanPhone = phone.replace(/\D/g, '')
                const formattedPhone = cleanPhone.startsWith('91')
                    ? `+${cleanPhone}`
                    : `+91${cleanPhone}`

                const { data, error } = await supabase.auth.signInWithPassword({
                    phone: formattedPhone,
                    password,
                })

                if (error) throw error

                if (data.user) {
                    await get().fetchCurrentUser(data.user.id)
                    set({ isLoggedIn: true, showAuthModal: false })
                }
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

                // If phone is missing in DB but we know it from session, sync it
                if (userData && !userData.phone) {
                    const { data: { session } } = await supabase.auth.getSession()
                    const sessionPhone = session?.user?.phone
                    if (sessionPhone) {
                        console.log('Syncing missing phone to DB:', sessionPhone)
                        await supabase.from('users').update({ phone: sessionPhone }).eq('id', userId)
                        userData.phone = sessionPhone
                    }
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

                // 1. Update Supabase Auth (Password, Email, and Name metadata)
                const authUpdate: any = {}
                if (password) authUpdate.password = password
                if (userData.email) authUpdate.email = userData.email
                authUpdate.data = { name: userData.name }

                const { error: authError } = await supabase.auth.updateUser(authUpdate)

                if (authError) {
                    console.error('Auth update error during completeProfile:', authError)
                    // We don't necessarily throw here if it's just a non-critical metadata update, 
                    // but since email/password are involved, we should handle it.
                }

                // 2. Update user profile (ensuring phone is persisted)
                const phoneToSync = currentUser.phone || addressData.phone
                const { data: updatedProfile, error: userError } = await supabase
                    .from('users')
                    .upsert({
                        ...otherUserData,
                        id: currentUser.id,
                        phone: phoneToSync,
                        password_set: !!password || currentUser.password_set
                    }, { onConflict: 'id' })
                    .select()
                    .single()

                if (userError) {
                    console.error('Profile update error during completeProfile:', userError.message, userError.details)
                    throw new Error(`Failed to update profile: ${userError.message}`)
                }

                // 2. Add address (as default billing)
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
                    console.error('Address creation error during completeProfile:', addrError.message, addrError.details)
                    throw addrError
                }

                // 3. Update local state
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
                const phoneToSync = currentUser.phone || addressData.phone
                const { data: updatedProfile, error: userError } = await supabase
                    .from('users')
                    .update({
                        name: userData.name,
                        email: userData.email,
                        phone: phoneToSync,
                    })
                    .eq('id', currentUser.id)
                    .select()
                    .single()

                if (userError) throw userError

                // 2. Sync with Supabase Auth (internal table)
                await supabase.auth.updateUser({
                    email: userData.email,
                    data: { name: userData.name }
                }).catch(err => console.error('Auth sync error:', err))

                // 3. Update address (upsert based on existing default billing address or create new)
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

                // 3. Update local state
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
                if (!currentUser) {
                    console.log('fetchOrders: No current user in state')
                    return
                }

                console.log('Fetching orders for user ID:', currentUser.id)

                // Try a simpler join first to avoid potential relation syntax errors
                const { data, error } = await supabase
                    .from('orders')
                    .select(`
                        *,
                        items:order_items(*)
                    `)
                    .eq('userId', currentUser.id)
                    .order('createdAt', { ascending: false })

                if (error) {
                    console.error('Error fetching orders:', {
                        message: error.message,
                        details: error.details,
                        hint: error.hint,
                        code: error.code
                    })
                    return
                }

                console.log('Orders response data:', data)
                set({ orders: data || [] })
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

            addAddress: async (addressData) => {
                const currentUser = get().user
                if (!currentUser) {
                    console.error('addAddress: No user logged in')
                    throw new Error('Please login to add an address')
                }

                const payload = { ...addressData, userId: currentUser.id }
                console.log('Supabase: Ensuring user exists before address insert. UserID:', currentUser.id)

                // Pre-verify user exists to prevent FK violation
                const { data: userCheck, error: userCheckError } = await supabase
                    .from('users')
                    .upsert({
                        id: currentUser.id,
                        phone: currentUser.phone,
                        last_login: new Date().toISOString()
                    }, { onConflict: 'id' })
                    .select()
                    .single()

                if (userCheckError) {
                    console.error('Supabase: Failed to ensure user exists before address insert:', userCheckError)
                    throw new Error('Failed to verify user profile. Please try logging out and in again.')
                }

                console.log('Supabase: Inserting address:', payload)

                const { data, error } = await supabase
                    .from('addresses')
                    .insert([payload])
                    .select()
                    .single()

                if (error) {
                    console.error('Supabase: Address insert error:', error.message, error.details)
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

                // First toggle all addresses of same type to not default
                const typeAddresses = currentUser.addresses.filter(a => a.type === type)
                for (const a of typeAddresses) {
                    await supabase.from('addresses').update({ isDefault: a.id === addressId }).eq('id', a.id)
                }

                // Then fetch fresh addresses
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
