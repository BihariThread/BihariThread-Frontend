'use client'

import { useState, useEffect, useRef } from 'react'

import { useSearchParams } from 'next/navigation'
import { useSiteStore } from '@/store/siteStore'

import { Trash2, Edit2, Plus, Search, X, Check, Upload, Filter, Tag } from 'lucide-react'

import * as Dialog from '@radix-ui/react-dialog'
import Image from 'next/image'
import { Product } from '@/types'
import { toast } from 'sonner'

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct, categories, uploadImage, addCategory } = useSiteStore()
  const searchParams = useSearchParams()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isGalleryUploading, setIsGalleryUploading] = useState(false)
  const [isAddingCategory, setIsAddingCategory] = useState(false)

  const [newCatName, setNewCatName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')


  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      handleAddNew()
    }
  }, [searchParams])

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: '',
    image: '',
    images: '',
    description: '',
    fabric: '100% Cotton',
    sizes: 'XS, S, M, L, XL, XXL',
    colors: 'Black, White, Navy',
    inStock: true,
    featured: false,
    new: false
  })

  // Filter products
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      originalPrice: (product.originalPrice || '').toString(),
      category: product.category,
      image: product.image,
      images: product.images.join(', '),
      description: product.description || '',
      fabric: product.fabric || '100% Cotton',
      sizes: product.sizes.join(', '),
      colors: product.colors.join(', '),
      inStock: product.inStock,
      featured: product.featured,
      new: product.new
    })
    setIsDialogOpen(true)
  }

  const handleAddNew = () => {
    setEditingId(null)
    setFormData({
      name: '',
      price: '',
      originalPrice: '',
      category: '',
      image: '',
      images: '',
      description: '',
      fabric: '100% Cotton',
      sizes: 'XS, S, M, L, XL, XXL',
      colors: 'Black, White, Navy',
      inStock: true,
      featured: false,
      new: true
    })
    setIsDialogOpen(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const publicUrl = await uploadImage(file, 'products')
      setFormData(prev => ({ ...prev, image: publicUrl }))
      toast.success('Image uploaded successfully')
    } catch (error: any) {
      console.error('Upload error:', error)
      if (error?.message?.includes('Bucket not found')) {
        toast.error('Storage bucket "products" not found. Please run the SQL setup script from your walkthrough.md.')
      } else {
        toast.error('Failed to upload image. Please check your Supabase Storage settings.')
      }
    } finally {
      setIsUploading(false)
      if (e.target) e.target.value = ''
    }
  }

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setIsGalleryUploading(true)
    const toastId = toast.loading(`Uploading ${files.length} images...`)
    try {
      const uploadPromises = files.map(file => uploadImage(file, 'products'))
      const publicUrls = await Promise.all(uploadPromises)

      const existingImages = formData.images
        ? formData.images.split(',').map(s => s.trim()).filter(Boolean)
        : []

      const newImages = [...existingImages, ...publicUrls].join(', ')
      setFormData(prev => ({ ...prev, images: newImages }))
      toast.success(`${files.length} images uploaded successfully`, { id: toastId })
    } catch (error: any) {
      console.error('Gallery upload error:', error)
      toast.error('Failed to upload some images. Please try again.', { id: toastId })
    } finally {
      setIsGalleryUploading(false)
      if (e.target) e.target.value = ''
    }
  }



  const handleQuickAddCategory = async () => {
    if (!newCatName.trim()) return
    const slug = newCatName.toLowerCase().trim().replace(/\s+/g, '-')
    try {
      await addCategory({
        name: newCatName.trim(),
        slug
      } as any)
      setFormData(prev => ({ ...prev, category: slug }))
      setNewCatName('')
      setIsAddingCategory(false)
      toast.success('Category added successfully')
    } catch (error) {
      toast.error('Failed to add category')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault()

    const productData: any = {
      name: formData.name,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice) || undefined,
      category: formData.category,
      image: formData.image || '/placeholder.png',
      images: formData.images.split(',').map((s: string) => s.trim()).filter(Boolean),
      description: formData.description,
      fabric: formData.fabric,
      sizes: formData.sizes.split(',').map((s: string) => s.trim()).filter(Boolean),
      colors: formData.colors.split(',').map((s: string) => s.trim()).filter(Boolean),
      inStock: formData.inStock,
      featured: formData.featured,
      new: formData.new
    }

    if (editingId) {
      productData.id = editingId
      updateProduct(productData)
    } else {
      addProduct(productData)
    }

    setIsDialogOpen(false)
    setEditingId(null)
  }



  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-montserrat font-bold text-foreground">
            Products
          </h1>
          <p className="text-muted-foreground mt-1">Manage your product inventory</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex gap-4 items-center bg-card border border-border p-4 rounded-xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button className="p-2 border border-border rounded-lg hover:bg-muted text-muted-foreground">
          <Filter size={20} />
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Product</th>
                <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Category</th>
                <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Price</th>
                <th className="text-center py-4 px-6 font-semibold text-muted-foreground">Status</th>
                <th className="text-right py-4 px-6 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors duration-200"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0 border border-border">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-foreground">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-foreground font-semibold">₹{product.price}</td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      In Stock
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 hover:bg-blue-50 text-muted-foreground hover:text-blue-600 rounded-md transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-red-50 text-muted-foreground hover:text-red-600 rounded-md transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No products found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in" />
          <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[90vh] w-[90vw] max-w-[600px] translate-x-[-50%] translate-y-[-50%] rounded-xl bg-background p-6 shadow-2xl focus:outline-none z-50 animate-content-show overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-xl font-montserrat font-bold text-foreground">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </Dialog.Close>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="e.g. Classic Oversized Tee"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Original Price (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Category</label>
                    <button
                      type="button"
                      onClick={() => setIsAddingCategory(!isAddingCategory)}
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      {isAddingCategory ? 'Cancel' : '+ Quick Add'}
                    </button>
                  </div>
                  {isAddingCategory ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="Category name"
                        className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleQuickAddCategory}
                        className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                      >
                        <Check size={16} />
                      </button>
                    </div>
                  ) : (
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Fabric</label>
                  <input
                    type="text"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="e.g. 100% Cotton"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sizes (comma separated)</label>
                <input
                  type="text"
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="XS, S, M, L, XL, XXL"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Colors (comma separated)</label>
                <input
                  type="text"
                  value={formData.colors}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="Black, White, Navy"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="Product description..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Main Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    required
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="/products/image.png"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-3 py-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50"
                  >
                    {isUploading ? (
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload size={18} />
                    )}
                  </button>

                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Additional Image URLs (comma separated)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="url1, url2, url3"
                  />
                  <input
                    type="file"
                    ref={galleryInputRef}
                    onChange={handleGalleryUpload}
                    className="hidden"
                    accept="image/*"
                    multiple
                  />
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    disabled={isGalleryUploading}
                    className="px-3 py-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50"
                    title="Upload Multiple Images"
                  >
                    {isGalleryUploading ? (
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <div className="flex items-center gap-1">
                        <Upload size={18} />
                        <Plus size={12} className="-ml-1" />
                      </div>
                    )}
                  </button>
                </div>
              </div>


              <div className="flex gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                  />
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">In Stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                  />
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.new}
                    onChange={(e) => setFormData({ ...formData, new: e.target.checked })}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                  />
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">New Release</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Dialog.Close asChild>
                  <button type="button" className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                    Cancel
                  </button>
                </Dialog.Close>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                  {editingId ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
