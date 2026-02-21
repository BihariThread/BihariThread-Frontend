'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { Lock, Mail, AlertCircle } from 'lucide-react'
import Image from 'next/image'

export default function AdminLoginPage() {
    const router = useRouter()
    const { adminLogin, isAdminLoggedIn } = useAuthStore()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isAdminLoggedIn) {
            router.push('/admin/dashboard')
        }
    }, [isAdminLoggedIn, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        // Simulate small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500))

        const success = adminLogin(email, password)

        if (success) {
            router.push('/admin/dashboard')
        } else {
            setError('Invalid email or password. Access Denied.')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0E1111] flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                {/* Logo Section */}
                <div className="text-center mb-8 animate-fade-in">
                    <div className="relative h-20 w-64 mx-auto mb-4">
                        <Image
                            src="/logo.png"
                            alt="BIHARI THREAD"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <h1 className="text-2xl font-montserrat font-bold text-white tracking-widest uppercase">
                        Admin Portal
                    </h1>
                    <p className="text-gray-400 mt-2">Enter your credentials to access management</p>
                </div>

                {/* Login Form */}
                <div className="bg-[#1A1F1F] border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-xl animate-scale-in">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 text-sm animate-shake">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all placeholder:text-gray-600"
                                        placeholder="admin@biharithread.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all placeholder:text-gray-600"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-accent text-accent-foreground font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider mt-4"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Lock size={18} />
                                    Secure Login
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-gray-500 mt-8 text-sm">
                    &copy; {new Date().getFullYear()} Bihari Thread. All rights reserved.
                </p>
            </div>
        </div>
    )
}
