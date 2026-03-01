'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { useSiteStore } from '@/store/siteStore'
import { ChevronDown, Sliders } from 'lucide-react'

export default function Shop() {
  const { products, categories: storeCategories } = useSiteStore()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('featured')
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])


  const categories = ['All', ...storeCategories.map(c => c.name)]

  const filteredProducts = products.filter((product) => {
    const isAll = selectedCategory === 'all'
    const categoryMatch = isAll ||
      product.category.toLowerCase() === selectedCategory.toLowerCase() ||
      storeCategories.find(c => c.slug === product.category)?.name.toLowerCase() === selectedCategory.toLowerCase()

    const sizeMatch = selectedSizes.length === 0 ||
      product.sizes.some(size => selectedSizes.includes(size))

    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1]
    return categoryMatch && priceMatch && sizeMatch
  })


  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    if (sortBy === 'newest') return b.id.localeCompare(a.id)
    return 0 // featured
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <div className="bg-muted py-8 md:py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-foreground mb-2">
            Shop Our Collection
          </h1>
          <p className="text-foreground/70">
            Discover {filteredProducts.length} premium items
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block lg:col-span-1`}>
            <div className="space-y-6 sticky top-24">
              {/* Categories Filter */}
              <div>
                <h3 className="font-montserrat font-bold text-lg text-foreground mb-4">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat.toLowerCase()}
                        checked={selectedCategory === cat.toLowerCase()}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4 rounded border border-primary text-primary focus:ring-primary/20"
                      />
                      <span className="text-foreground/80 group-hover:text-foreground transition-colors duration-200">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="border-t border-border pt-6">
                <h3 className="font-montserrat font-bold text-lg text-foreground mb-4">
                  Price Range
                </h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        placeholder="Min"
                        className="w-full pl-7 pr-3 py-2 border border-border rounded-lg text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        placeholder="Max"
                        className="w-full pl-7 pr-3 py-2 border border-border rounded-lg text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>


              {/* Size Filter */}
              <div className="border-t border-border pt-6">
                <h3 className="font-montserrat font-bold text-lg text-foreground mb-4">
                  Sizes
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSizes(prev =>
                          prev.includes(size)
                            ? prev.filter(s => s !== size)
                            : [...prev, size]
                        )
                      }}
                      className={`py-2 px-3 border rounded-lg transition-all duration-200 text-sm font-medium ${selectedSizes.includes(size)
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                        : 'border-border text-foreground hover:border-primary hover:text-primary'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors duration-200"
                >
                  <Sliders size={18} />
                  Filters
                </button>
                <span className="text-sm text-foreground/70">
                  Showing {sortedProducts.length} results
                </span>
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-accent appearance-none pr-8"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown size={18} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/50" />
              </div>
            </div>

            {/* Product Grid */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-foreground/70 text-lg">No products found matching your filters.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setPriceRange([0, 5000])
                    setSelectedSizes([])
                  }}

                  className="mt-4 px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity duration-200"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
