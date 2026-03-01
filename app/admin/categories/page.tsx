'use client'

import { useState } from 'react'
import { useSiteStore } from '@/store/siteStore'
import { Trash2, Plus, Search, Tag } from 'lucide-react'

export default function AdminCategories() {
    const { categories, addCategory, updateCategory, deleteCategory } = useSiteStore()
    const [searchQuery, setSearchQuery] = useState('')
    const [newCategoryName, setNewCategoryName] = useState('')
    const [showOnHome, setShowOnHome] = useState(false)


    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newCategoryName.trim()) return

        const slug = newCategoryName.toLowerCase().replace(/\s+/g, '-')
        if (categories.find(c => c.slug === slug)) {
            alert('Category already exists!')
            return
        }

        addCategory({
            name: newCategoryName.trim(),
            slug,
            showOnHome
        } as any)

        setNewCategoryName('')
        setShowOnHome(false)
    }

    const handleToggleHome = (cat: any) => {
        updateCategory({
            ...cat,
            showOnHome: !cat.showOnHome
        })
    }


    const handleDelete = (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete "${name}"? This might affect products in this category.`)) {
            deleteCategory(id)
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-montserrat font-bold text-foreground">
                        Categories
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage product categories</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Category Form */}
                <div className="lg:col-span-1">
                    <div className="bg-card border border-border p-6 rounded-xl shadow-sm sticky top-24">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Plus size={20} className="text-primary" />
                            Add New Category
                        </h2>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category Name</label>
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="e.g. Oversized"
                                    required
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-2 py-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={showOnHome}
                                        onChange={(e) => setShowOnHome(e.target.checked)}
                                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                                    />
                                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Show on Home Page</span>
                                </label>
                            </div>
                            <button

                                type="submit"
                                className="w-full py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Create Category
                            </button>
                        </form>
                    </div>
                </div>

                {/* Categories List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-sm">
                            <thead className="border-b border-border bg-muted/50">
                                <tr>
                                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Category Name</th>
                                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Slug</th>
                                    <th className="text-center py-4 px-6 font-semibold text-muted-foreground">Home Page</th>
                                    <th className="text-right py-4 px-6 font-semibold text-muted-foreground">Actions</th>

                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategories.map((cat) => (
                                    <tr key={cat.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <Tag size={16} className="text-accent" />
                                                <span className="font-medium">{cat.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 font-mono text-xs text-muted-foreground">
                                            {cat.slug}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <button
                                                onClick={() => handleToggleHome(cat)}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${cat.showOnHome
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                                    }`}
                                            >
                                                {cat.showOnHome ? 'Visible' : 'Hidden'}
                                            </button>
                                        </td>

                                        <td className="py-4 px-6 text-right">
                                            <button
                                                onClick={() => handleDelete(cat.id, cat.name)}
                                                className="p-2 hover:bg-red-50 text-muted-foreground hover:text-red-600 rounded-md transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredCategories.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="py-8 text-center text-muted-foreground">
                                            No categories found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
