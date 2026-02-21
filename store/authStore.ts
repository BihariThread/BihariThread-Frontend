'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Address } from '@/types';

interface AuthStore {
    user: User | null;
    isLoggedIn: boolean;
    isAdminLoggedIn: boolean;
    showAuthModal: boolean;
    login: (user: User) => void;
    logout: () => void;
    adminLogin: (email: string, pass: string) => boolean;
    adminLogout: () => void;
    openAuthModal: () => void;
    closeAuthModal: () => void;
    updateUser: (data: Partial<User>) => void;
    addAddress: (address: Address) => void;
    removeAddress: (addressId: string) => void;
    setDefaultAddress: (addressId: string, type: 'billing' | 'shipping') => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            isLoggedIn: false,
            isAdminLoggedIn: false,
            showAuthModal: false,

            login: (user) => set({ user, isLoggedIn: true, showAuthModal: false }),

            logout: () => set({ user: null, isLoggedIn: false }),

            adminLogin: (email, pass) => {
                if (email === 'biharithread@gmail.com' && pass === 'bihariThread@admin') {
                    set({ isAdminLoggedIn: true });
                    return true;
                }
                return false;
            },

            adminLogout: () => set({ isAdminLoggedIn: false }),

            openAuthModal: () => set({ showAuthModal: true }),

            closeAuthModal: () => set({ showAuthModal: false }),

            updateUser: (data) => {
                const currentUser = get().user;
                if (currentUser) {
                    set({ user: { ...currentUser, ...data } });
                }
            },

            addAddress: (address) => {
                const currentUser = get().user;
                if (currentUser) {
                    set({
                        user: {
                            ...currentUser,
                            addresses: [...currentUser.addresses, address],
                        },
                    });
                }
            },

            removeAddress: (addressId) => {
                const currentUser = get().user;
                if (currentUser) {
                    set({
                        user: {
                            ...currentUser,
                            addresses: currentUser.addresses.filter((a) => a.id !== addressId),
                        },
                    });
                }
            },

            setDefaultAddress: (addressId, type) => {
                const currentUser = get().user;
                if (currentUser) {
                    set({
                        user: {
                            ...currentUser,
                            addresses: currentUser.addresses.map((a) =>
                                a.type === type
                                    ? { ...a, isDefault: a.id === addressId }
                                    : a
                            ),
                        },
                    });
                }
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
);
