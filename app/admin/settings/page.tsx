'use client'

import { useState } from 'react'
import { useSiteStore } from '@/store/siteStore'
import { Save, Globe, Phone, Mail, MapPin, Tv } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminSettings() {
    const { siteSettings, updateSiteSettings } = useSiteStore()
    const [formData, setFormData] = useState(siteSettings)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updateSiteSettings(formData)
        toast.success('Settings updated successfully!')
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-montserrat font-bold text-foreground">
                        Site Settings
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage global website content and contact info</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Home Page / Hero Settings */}
                <div className="space-y-6">
                    <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Tv size={20} className="text-primary" />
                            Hero Section
                        </h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Hero Title (Use comma for line break)</label>
                                <input
                                    type="text"
                                    value={formData.heroTitle}
                                    onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Hero Subtitle</label>
                                <textarea
                                    value={formData.heroSubtitle}
                                    onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Button Text</label>
                                <input
                                    type="text"
                                    value={formData.heroButtonText}
                                    onChange={(e) => setFormData({ ...formData, heroButtonText: e.target.value })}
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Globe size={20} className="text-primary" />
                            Shop Page Banner
                        </h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Banner Title</label>
                                <input
                                    type="text"
                                    value={formData.shopBannerTitle}
                                    onChange={(e) => setFormData({ ...formData, shopBannerTitle: e.target.value })}
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Banner Subtitle</label>
                                <textarea
                                    value={formData.shopBannerSubtitle}
                                    onChange={(e) => setFormData({ ...formData, shopBannerSubtitle: e.target.value })}
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Info Settings */}
                <div className="space-y-6">
                    <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Mail size={20} className="text-primary" />
                            Contact Information
                        </h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Mail size={14} /> Email Address
                                </label>
                                <input
                                    type="email"
                                    value={formData.contactEmail}
                                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Phone size={14} /> Phone Number
                                </label>
                                <input
                                    type="text"
                                    value={formData.contactPhone}
                                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <MapPin size={14} /> Shop Address
                                </label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                        >
                            <Save size={20} />
                            Save All Changes
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
