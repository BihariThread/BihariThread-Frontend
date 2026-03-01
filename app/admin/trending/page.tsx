'use client'

import { useState, useEffect } from 'react'
import { useSiteStore } from '@/store/siteStore'

export default function TrendingManager() {
  const { products } = useSiteStore()
  const [selectedCategory, setSelectedCategory] = useState('trending')
  const [trendingProducts, setTrendingProducts] = useState(
    products.filter((p) => p.category === 'trending')
  )
  const [bannerText, setBannerText] = useState('Trending This Week')

  useEffect(() => {
    setTrendingProducts(products.filter((p) => p.featured || p.category.toLowerCase() === 'trending'))
  }, [products])

  const categories = ['Trending', 'IPL', 'CSK', 'Funky', 'Classic', 'Minimal']

  const handleToggleTrending = (product: any) => {
    if (trendingProducts.find((p) => p.id === product.id)) {
      setTrendingProducts((prev) => prev.filter((p) => p.id !== product.id))
    } else {
      setTrendingProducts((prev) => [...prev, product])
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-montserrat font-bold text-foreground">
          Trending Manager
        </h1>
        <p className="text-foreground/70 mt-2">Manage featured and trending products</p>
      </div>

      {/* Banner Settings */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-montserrat font-bold text-foreground">
          Banner Settings
        </h2>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Banner Text
          </label>
          <input
            type="text"
            value={bannerText}
            onChange={(e) => setBannerText(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <button className="px-6 py-2 bg-accent text-accent-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity duration-200">
          Save Changes
        </button>
      </div>

      {/* Category Selection */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-montserrat font-bold text-foreground">
          Select Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat.toLowerCase())}
              className={`py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${selectedCategory === cat.toLowerCase()
                ? 'bg-accent text-accent-foreground'
                : 'border border-border text-foreground hover:border-accent'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Selection */}
      <div className="space-y-4">
        <h2 className="text-xl font-montserrat font-bold text-foreground">
          Featured Products ({trendingProducts.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => {
            const isTrending = trendingProducts.find((p) => p.id === product.id)
            return (
              <div
                key={product.id}
                onClick={() => handleToggleTrending(product)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${isTrending
                  ? 'border-accent bg-accent/10'
                  : 'border-border hover:border-accent/50'
                  }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-foreground/60 uppercase tracking-wider mb-1">
                      {product.category}
                    </p>
                    <h3 className="text-sm font-semibold text-foreground line-clamp-2">
                      {product.name}
                    </h3>
                  </div>
                  {isTrending && (
                    <div className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      ✓
                    </div>
                  )}
                </div>
                <p className="text-lg font-bold text-primary">₹{product.price}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Display Order */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-montserrat font-bold text-foreground">
          Trending Products Order
        </h2>
        <div className="space-y-2">
          {trendingProducts.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-4 bg-muted rounded-lg"
            >
              <span className="font-medium text-foreground">
                {index + 1}. {product.name}
              </span>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 text-sm border border-border rounded hover:bg-muted transition-colors duration-200"
                  disabled={index === 0}
                >
                  ↑
                </button>
                <button
                  className="px-3 py-1 text-sm border border-border rounded hover:bg-muted transition-colors duration-200"
                  disabled={index === trendingProducts.length - 1}
                >
                  ↓
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button className="w-full px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity duration-200">
        Save All Changes
      </button>
    </div>
  )
}
