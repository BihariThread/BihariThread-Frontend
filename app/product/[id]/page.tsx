'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Minus, Plus, ShoppingBag, ArrowLeft, Truck, RefreshCw, Shield, Star, Share2, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LayoutWrapper from '@/components/LayoutWrapper';
import ProductCard from '@/components/ProductCard';
import Button from '@/components/Button';
import { getProductById, getProducts } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const product = getProductById(params.id as string);
    const addItem = useCartStore((s) => s.addItem);
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    const openAuthModal = useAuthStore((s) => s.openAuthModal);

    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    if (!product) {
        return (
            <LayoutWrapper>
                <div className="pt-32 pb-16 text-center min-h-screen flex flex-col items-center justify-center">
                    <h1 className="font-heading text-2xl font-bold uppercase tracking-wider">Product Not Found</h1>
                    <Button variant="outline" className="mt-6" onClick={() => router.push('/shop')}>
                        <ArrowLeft size={16} className="mr-2" /> Back to Shop
                    </Button>
                </div>
            </LayoutWrapper>
        );
    }

    const handleAddToCart = () => {
        if (!isLoggedIn) {
            openAuthModal();
            return;
        }
        if (!selectedSize) return;
        addItem(product, selectedSize, product.colors[0], quantity);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const relatedProducts = getProducts()
        .filter((p) => p.id !== product.id && p.category === product.category)
        .slice(0, 3);

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <LayoutWrapper>
            <div className="pt-32 pb-16 min-h-screen bg-offwhite">
                {/* Breadcrumb / Back */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-widest text-grey-500 hover:text-black transition-colors cursor-pointer group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back
                    </button>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                        {/* Left — Images */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col gap-4"
                        >
                            <div className="relative aspect-[4/5] bg-white rounded-2xl overflow-hidden shadow-lg border border-white/20">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeImage}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="relative w-full h-full"
                                    >
                                        <Image
                                            src={product.images[activeImage]}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                            priority
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                        />
                                    </motion.div>
                                </AnimatePresence>

                                <div className="absolute top-4 right-4 flex flex-col gap-3">
                                    <button className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-black hover:bg-terracotta hover:text-white transition-colors cursor-pointer shadow-md">
                                        <Heart size={20} />
                                    </button>
                                    <button className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors cursor-pointer shadow-md">
                                        <Share2 size={20} />
                                    </button>
                                </div>

                                {discount > 0 && (
                                    <div className="absolute top-4 left-4">
                                        <span className="px-4 py-1.5 bg-deep-maroon/90 backdrop-blur text-white text-xs font-heading font-bold uppercase tracking-widest rounded-full shadow-lg">
                                            -{discount}% OFF
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${activeImage === idx ? 'border-terracotta scale-95 shadow-md' : 'border-transparent hover:border-grey-300'}`}
                                    >
                                        <Image src={img} alt={`${product.name} ${idx}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right — Details */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex flex-col"
                        >
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-terracotta font-heading text-xs font-bold uppercase tracking-[0.2em]">
                                        {product.category}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-grey-400" />
                                    <div className="flex items-center gap-1">
                                        <Star size={12} className="fill-terracotta text-terracotta" />
                                        <span className="text-xs font-bold text-black pt-0.5">4.8 (120 Reviews)</span>
                                    </div>
                                </div>

                                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-wider text-black leading-tight">
                                    {product.name}
                                </h1>

                                {/* Price */}
                                <div className="flex items-center gap-4 mt-6 p-4 bg-white rounded-xl w-fit border border-grey-200">
                                    <span className="font-heading text-3xl sm:text-4xl font-black text-black">
                                        ₹{product.price.toLocaleString()}
                                    </span>
                                    {product.originalPrice && (
                                        <div className="flex flex-col">
                                            <span className="text-sm text-grey-400 line-through font-body">
                                                ₹{product.originalPrice.toLocaleString()}
                                            </span>
                                            {discount > 0 && (
                                                <span className="text-xs font-heading font-bold text-terracotta">
                                                    Save ₹{((product.originalPrice || 0) - product.price).toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <p className="mt-8 font-body text-grey-600 leading-relaxed text-lg">
                                    {product.description}
                                </p>

                                {/* Size Selector */}
                                <div className="mt-10">
                                    <div className="flex justify-between items-center mb-4">
                                        <p className="font-heading text-xs font-bold uppercase tracking-widest text-black">
                                            Select Size
                                        </p>
                                        <button className="text-xs font-bold text-grey-500 underline hover:text-terracotta">Size Guide</button>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`w-14 h-14 rounded-2xl font-heading text-sm font-bold uppercase transition-all duration-200 cursor-pointer flex items-center justify-center ${selectedSize === size
                                                    ? 'bg-black text-white shadow-xl scale-110 ring-2 ring-terracotta ring-offset-2'
                                                    : 'bg-white border border-grey-200 text-black hover:border-black hover:shadow-md'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                    {!selectedSize && <p className="mt-2 text-xs text-red-500 font-medium animate-pulse">* Please select a size</p>}
                                </div>

                                {/* Quantity & Add */}
                                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                                    <div className="inline-flex items-center bg-white border border-grey-200 rounded-2xl overflow-hidden shadow-sm h-14">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-5 h-full hover:bg-grey-100 transition-colors cursor-pointer flex items-center justify-center text-black"
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus size={18} />
                                        </button>
                                        <span className="px-4 font-heading font-bold text-lg min-w-[50px] text-center text-black">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="px-5 h-full hover:bg-grey-100 transition-colors cursor-pointer flex items-center justify-center text-black"
                                            aria-label="Increase quantity"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>

                                    <Button
                                        variant={addedToCart ? 'primary' : 'accent'}
                                        size="lg"
                                        className="flex-1 h-14 text-lg shadow-[0_0_20px_rgba(198,93,59,0.3)] hover:shadow-[0_0_30px_rgba(198,93,59,0.5)]"
                                        onClick={handleAddToCart}
                                        disabled={!selectedSize}
                                    >
                                        {addedToCart ? (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                                                Added to Cart <Shield size={20} />
                                            </motion.div>
                                        ) : (
                                            <>
                                                <ShoppingBag size={20} className="mr-2" /> Add to Cart
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Fabric Details */}
                                <div className="mt-10 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-grey-200">
                                    <p className="font-heading text-xs font-bold uppercase tracking-widest text-terracotta mb-3">
                                        Fabric & Care
                                    </p>
                                    <p className="font-body text-sm text-grey-600 leading-relaxed">{product.fabric}</p>
                                </div>

                                {/* Trust */}
                                <div className="mt-8 grid grid-cols-3 gap-4">
                                    {[
                                        { icon: Truck, text: 'Free Delivery', sub: 'On orders > ₹999' },
                                        { icon: RefreshCw, text: '7 Day', sub: 'Easy Returns' },
                                        { icon: Shield, text: 'Secure', sub: 'Payments' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex flex-col items-center justify-center text-center p-3 bg-white rounded-xl border border-grey-100 shadow-sm">
                                            <item.icon size={20} className="text-grey-400 mb-2" />
                                            <span className="font-heading text-xs font-bold uppercase text-black">{item.text}</span>
                                            <span className="font-body text-[10px] text-grey-400">{item.sub}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-32 border-t border-grey-200 pt-16">
                            <h2 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-wider text-black mb-10 text-center">
                                You May Also Like
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {relatedProducts.map((p) => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </LayoutWrapper>
    );
}
