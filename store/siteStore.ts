import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, Order, User, Enquiry, Offer, SiteSettings, Category } from '@/types'
import { supabase } from '@/lib/supabase'

interface SiteState {
    products: Product[]
    orders: Order[]
    users: User[]
    enquiries: Enquiry[]
    offers: Offer[]
    categories: Category[]
    siteSettings: SiteSettings
    fetchSiteSettings: () => Promise<void>


    isLoading: boolean
    error: string | null

    // Init Action
    fetchInitialData: () => Promise<void>


    // Products
    fetchProducts: () => Promise<void>
    addProduct: (product: Product) => Promise<void>
    updateProduct: (product: Product) => Promise<void>
    deleteProduct: (id: string) => Promise<void>

    // Orders
    fetchOrders: () => Promise<void>
    setOrders: (orders: Order[]) => void
    updateOrderStatus: (id: string, status: Order['status']) => Promise<void>

    // Users
    fetchUsers: () => Promise<void>
    setUsers: (users: User[]) => void

    // Enquiries
    fetchEnquiries: () => Promise<void>
    setEnquiries: (enquiries: Enquiry[]) => void
    addEnquiry: (enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) => Promise<void>
    updateEnquiryStatus: (id: string, status: Enquiry['status']) => Promise<void>


    // Offers
    fetchOffers: () => Promise<void>
    setOffers: (offers: Offer[]) => void

    // Categories
    fetchCategories: () => Promise<void>
    setCategories: (categories: Category[]) => void
    addCategory: (category: Category) => Promise<void>
    updateCategory: (category: Category) => Promise<void>
    deleteCategory: (id: string) => Promise<void>


    // Settings
    updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>

    // Storage
    uploadImage: (file: File, bucket: string) => Promise<string>
}

const initialSettings: SiteSettings = {
    heroTitle: 'WEAR YOUR PRIDE, REFINE YOUR STYLE',
    heroSubtitle: 'Premium Quality Tees Celebrating Bihari Culture with a Modern Twist',
    heroButtonText: 'Explore Collection',
    shopBannerTitle: 'Shop Our Collection',
    shopBannerSubtitle: 'Discover premium items crafted for you.',
    contactEmail: 'support@biharithread.com',
    contactPhone: '+91 91234 56789',
    address: 'Patna, Bihar, India'
}

export const useSiteStore = create<SiteState>()(
    persist(
        (set, get) => ({
            products: [],
            orders: [],
            users: [],
            enquiries: [],
            offers: [],
            categories: [],
            siteSettings: initialSettings,
            isLoading: false,
            error: null,

            fetchInitialData: async () => {
                set({ isLoading: true, error: null })
                try {
                    const results = await Promise.allSettled([
                        get().fetchProducts(),
                        get().fetchCategories(),
                        get().fetchOffers(),
                        get().fetchOrders(),
                        get().fetchEnquiries(),
                        get().fetchUsers(),
                        get().fetchSiteSettings()
                    ])
                    const failed = results.filter(r => r.status === 'rejected')
                    if (failed.length > 0) {
                        console.warn('Some admin fetches failed:', failed)
                    }
                } catch (err: any) {
                    set({ error: err.message })
                } finally {
                    set({ isLoading: false })
                }
            },


            fetchProducts: async () => {
                const { data, error } = await supabase.from('products').select('*').order('createdAt', { ascending: false })
                if (error) throw error
                // Some fallback mapping if names deviate slightly
                set({ products: data as Product[] })
            },

            addProduct: async (product) => {
                const { data, error } = await supabase.from('products').insert([product]).select()
                if (error) {
                    console.error('Error adding product:', error)
                    throw error
                }
                if (data && data.length > 0) {
                    set((state) => ({ products: [data[0] as Product, ...state.products] }))
                }
            },


            updateProduct: async (product) => {
                const { data, error } = await supabase.from('products').update(product).eq('id', product.id).select()
                if (error) {
                    console.error('Error updating product:', error)
                    throw error
                }
                if (data && data.length > 0) {
                    set((state) => ({
                        products: state.products.map((p) => (p.id === product.id ? (data[0] as Product) : p))
                    }))
                }
            },


            deleteProduct: async (id) => {
                const { error } = await supabase.from('products').delete().eq('id', id)
                if (error) {
                    console.error('Error deleting product:', error)
                    throw error
                }
                set((state) => ({
                    products: state.products.filter((p) => p.id !== id)
                }))
            },

            fetchOrders: async () => {
                try {
                    const res = await fetch('/api/orders/admin');
                    if (!res.ok) throw new Error('Failed to fetch orders');
                    const data = await res.json();
                    set({ orders: data as Order[] });
                } catch (error) {
                    console.error('Error fetching admin orders:', error);
                }
            },

            setOrders: (orders) => set({ orders }),

            updateOrderStatus: async (id, status) => {
                try {
                    const res = await fetch('/api/orders/admin', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id, status })
                    });
                    if (!res.ok) throw new Error('Failed to update order status');

                    set((state) => ({
                        orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o))
                    }));
                } catch (error) {
                    console.error('Error updating order status:', error);
                    throw error;
                }
            },

            fetchUsers: async () => {
                const { data, error } = await supabase.from('users').select('*').order('createdAt', { ascending: false })
                if (error) throw error
                set({ users: data as User[] })
            },

            setUsers: (users) => set({ users }),

            fetchEnquiries: async () => {
                const { data, error } = await supabase.from('enquiries').select('*').order('createdAt', { ascending: false })
                if (error) throw error
                set({ enquiries: data as Enquiry[] })
            },

            setEnquiries: (enquiries) => set({ enquiries }),

            addEnquiry: async (enquiry) => {
                const newEnquiry = {
                    ...enquiry,
                    status: 'pending' as const,
                    createdAt: new Date().toISOString()
                }
                const { data, error } = await supabase.from('enquiries').insert([newEnquiry]).select()
                if (error) {
                    console.error('Error adding enquiry:', error)
                    throw error
                }
                if (data && data.length > 0) {
                    set((state) => ({ enquiries: [data[0] as Enquiry, ...state.enquiries] }))
                }
            },

            updateEnquiryStatus: async (id, status) => {
                const { error } = await supabase.from('enquiries').update({ status }).eq('id', id)
                if (error) throw error
                set((state) => ({
                    enquiries: state.enquiries.map((e) => (e.id === id ? { ...e, status } : e))
                }))
            },

            fetchOffers: async () => {
                const { data, error } = await supabase.from('offers').select('*').order('createdAt', { ascending: false })
                if (error) throw error
                set({ offers: data as Offer[] })
            },

            setOffers: (offers) => set({ offers }),

            fetchCategories: async () => {
                const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true })
                if (error) throw error
                set({ categories: (data || []) as Category[] })
            },


            setCategories: (categories) => set({ categories }),

            addCategory: async (category) => {
                const categoryWithVisibility = { ...category, showOnHome: category.showOnHome || false }
                const { error } = await supabase.from('categories').insert([categoryWithVisibility])
                if (error) throw error
                set((state) => ({ categories: [...state.categories, categoryWithVisibility] }))
            },

            updateCategory: async (category) => {
                const { error } = await supabase.from('categories').update(category).eq('id', category.id)
                if (error) throw error
                set((state) => ({
                    categories: state.categories.map((c) => (c.id === category.id ? category : c))
                }))
            },


            deleteCategory: async (id) => {
                const { error } = await supabase.from('categories').delete().eq('id', id)
                if (error) throw error
                set((state) => ({
                    categories: state.categories.filter((c) => c.id !== id)
                }))
            },

            fetchSiteSettings: async () => {
                try {
                    const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single()
                    if (error && error.code !== 'PGRST116' && error.code !== 'PGRST205') throw error
                    if (data) {
                        set({ siteSettings: data as SiteSettings })
                    }
                } catch (e: any) {
                    if (e.code !== 'PGRST116' && e.code !== 'PGRST205') {
                        console.error('Error fetching site settings:', e)
                    }
                }
            },

            updateSiteSettings: async (settings) => {
                const updatedSettings = { ...get().siteSettings, ...settings }
                const { error } = await supabase.from('settings').upsert({ id: 1, ...updatedSettings })
                if (error) throw error
                set({ siteSettings: updatedSettings })
            },

            uploadImage: async (file, bucket) => {
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
                const filePath = `${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from(bucket)
                    .upload(filePath, file)

                if (uploadError) {
                    console.error('Error uploading image:', uploadError)
                    throw uploadError
                }

                const { data } = supabase.storage
                    .from(bucket)
                    .getPublicUrl(filePath)

                return data.publicUrl
            },


        }),
        {
            name: 'bihari-thread-site-data',
            partialize: (state) => ({
                siteSettings: state.siteSettings, // we only persist settings now, let the rest load from Supabase
            }),
        }
    )
)
