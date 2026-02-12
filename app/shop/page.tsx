'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import LayoutWrapper from '@/components/LayoutWrapper';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/api';

function ShopContent() {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category') || 'all';

    const [category, setCategory] = useState(categoryParam);
    const [sortBy, setSortBy] = useState('default');
    const [showFilters, setShowFilters] = useState(false);

    const allProducts = getProducts();

    const filteredProducts = useMemo(() => {
        let result = [...allProducts];

        if (category !== 'all') {
            result = result.filter((p) => p.category === category);
        }

        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                result = result.filter((p) => p.new).concat(result.filter((p) => !p.new));
                break;
        }

        return result;
    }, [allProducts, category, sortBy]);

    const categories = [
        { value: 'all', label: 'All' },
        { value: 'oversized', label: 'Oversized' },
        { value: 'classic', label: 'Classic' },
        { value: 'graphic', label: 'Graphic' },
        { value: 'limited', label: 'Limited Edition' },
    ];

    return (
        <div className="pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto page-enter">
            {/* Header */}
            <div className="mb-10">
                <p className="text-terracotta font-heading text-xs font-bold uppercase tracking-[0.2em] mb-2">Collection</p>
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-wider text-black">
                    Shop All
                </h1>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b-2 border-grey-200">
                <div className="hidden sm:flex items-center gap-2 flex-wrap">
                    {categories.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => setCategory(cat.value)}
                            className={`px-4 py-2 rounded-full font-heading text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer ${category === cat.value
                                    ? 'bg-black text-white'
                                    : 'bg-white text-grey-500 hover:text-black hover:bg-grey-100'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="sm:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-xl font-heading text-xs font-bold uppercase tracking-widest text-grey-600 cursor-pointer"
                >
                    <SlidersHorizontal size={14} />
                    Filters
                    <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                <div className="relative">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none bg-white pl-4 pr-10 py-2.5 rounded-xl font-heading text-xs font-bold uppercase tracking-widest text-grey-600 border-2 border-grey-200 focus:border-terracotta focus:outline-none cursor-pointer transition-colors"
                    >
                        <option value="default">Sort By</option>
                        <option value="price-low">Price: Low → High</option>
                        <option value="price-high">Price: High → Low</option>
                        <option value="newest">Newest First</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-grey-400 pointer-events-none" />
                </div>
            </div>

            {/* Mobile Category Filters */}
            {showFilters && (
                <div className="sm:hidden flex flex-wrap gap-2 mb-6 animate-slide-down">
                    {categories.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => { setCategory(cat.value); setShowFilters(false); }}
                            className={`px-4 py-2 rounded-full font-heading text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer ${category === cat.value
                                    ? 'bg-black text-white'
                                    : 'bg-white text-grey-500 hover:text-black'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Results Count */}
            <p className="text-grey-500 font-body text-sm mb-6">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                {filteredProducts.map((product, idx) => (
                    <div
                        key={product.id}
                        className="animate-fade-in-up"
                        style={{ opacity: 0, animationDelay: `${idx * 0.05}s`, animationFillMode: 'forwards' }}
                    >
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                    <p className="font-heading text-lg font-bold uppercase tracking-wider text-grey-400">
                        No products found
                    </p>
                    <p className="font-body text-sm text-grey-400 mt-2">
                        Try a different category or filter.
                    </p>
                </div>
            )}
        </div>
    );
}

export default function ShopPage() {
    return (
        <LayoutWrapper>
            <Suspense fallback={
                <div className="pt-28 pb-16 px-4 max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-10 w-48 bg-grey-200 rounded-xl" />
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="aspect-square bg-grey-200 rounded-2xl" />
                            ))}
                        </div>
                    </div>
                </div>
            }>
                <ShopContent />
            </Suspense>
        </LayoutWrapper>
    );
}
