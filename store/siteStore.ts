import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, Order, User, Enquiry, Offer, SiteSettings, Category } from '@/types'
import { mockProducts, mockOrders, mockUsers, mockEnquiries, mockOffers } from '@/lib/mock-data'

interface SiteState {
    products: Product[]
    orders: Order[]
    users: User[]
    enquiries: Enquiry[]
    offers: Offer[]
    categories: Category[]
    siteSettings: SiteSettings

    // Actions
    setProducts: (products: Product[]) => void
    addProduct: (product: Product) => void
    updateProduct: (product: Product) => void
    deleteProduct: (id: string) => void

    setOrders: (orders: Order[]) => void
    updateOrderStatus: (id: string, status: Order['status']) => void

    setUsers: (users: User[]) => void

    setEnquiries: (enquiries: Enquiry[]) => void
    updateEnquiryStatus: (id: string, status: Enquiry['status']) => void

    setOffers: (offers: Offer[]) => void

    setCategories: (categories: Category[]) => void
    addCategory: (category: Category) => void
    deleteCategory: (id: string) => void

    updateSiteSettings: (settings: Partial<SiteSettings>) => void
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

const initialCategories: Category[] = [
    { id: '1', name: 'Trending', slug: 'trending' },
    { id: '2', name: 'IPL', slug: 'ipl' },
    { id: '3', name: 'Funky', slug: 'funky' },
    { id: '4', name: 'Classic', slug: 'classic' },
    { id: '5', name: 'Minimal', slug: 'minimal' },
    { id: '6', name: 'Oversized', slug: 'oversized' },
]

export const useSiteStore = create<SiteState>()(
    persist(
        (set) => ({
            products: mockProducts as Product[],
            orders: (mockOrders as any[]).map(o => ({ ...o, createdAt: o.createdAt.toString() })),
            users: (mockUsers as any[]).map(u => ({ ...u, createdAt: u.createdAt.toString() })),
            enquiries: (mockEnquiries as any[]).map(e => ({ ...e, createdAt: e.createdAt.toString() })),
            offers: mockOffers,
            categories: initialCategories,
            siteSettings: initialSettings,

            setProducts: (products) => set({ products }),
            addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
            updateProduct: (product) => set((state) => ({
                products: state.products.map((p) => (p.id === product.id ? product : p))
            })),
            deleteProduct: (id) => set((state) => ({
                products: state.products.filter((p) => p.id !== id)
            })),

            setOrders: (orders) => set({ orders }),
            updateOrderStatus: (id, status) => set((state) => ({
                orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o))
            })),

            setUsers: (users) => set({ users }),

            setEnquiries: (enquiries) => set({ enquiries }),
            updateEnquiryStatus: (id, status) => set((state) => ({
                enquiries: state.enquiries.map((e) => (e.id === id ? { ...e, status } : e))
            })),

            setOffers: (offers) => set({ offers }),

            setCategories: (categories) => set({ categories }),
            addCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),
            deleteCategory: (id) => set((state) => ({
                categories: state.categories.filter((c) => c.id !== id)
            })),

            updateSiteSettings: (settings) => set((state) => ({
                siteSettings: { ...state.siteSettings, ...settings }
            })),
        }),
        {
            name: 'bihari-thread-site-data',
        }
    )
)
