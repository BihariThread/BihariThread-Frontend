'use client'

import { useState } from 'react'

interface CategoryStripProps {
  onCategoryChange?: (category: string) => void
  activeCategory?: string
}

export default function CategoryStrip({ onCategoryChange, activeCategory = 'all' }: CategoryStripProps) {
  const [active, setActive] = useState(activeCategory)

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'trending', label: 'Trending' },
    { id: 'ipl', label: 'IPL' },
    { id: 'csk', label: 'CSK' },
    { id: 'funky', label: 'Funky' },
    { id: 'classic', label: 'Classic' },
    { id: 'minimal', label: 'Minimal Print' },
  ]

  const handleCategoryChange = (categoryId: string) => {
    setActive(categoryId)
    onCategoryChange?.(categoryId)
  }

  return (
    <div className="w-full bg-background border-b border-border sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-4 overflow-x-auto pb-0 snap-x snap-mandatory scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-300 relative snap-start ${
                active === category.id
                  ? 'text-accent'
                  : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              {category.label}
              {active === category.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
