'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, X, ArrowRight, ShoppingBag } from 'lucide-react';
import LayoutWrapper from '@/components/LayoutWrapper';
import Button from '@/components/Button';
import { useCartStore } from '@/store/cartStore';

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotal } = useCartStore();

    const subtotal = getTotal();
    const shipping = subtotal > 999 ? 0 : 99;
    const total = subtotal + shipping;

    if (items.length === 0) {
        return (
            <LayoutWrapper>
                <div className="pt-28 pb-16 min-h-screen flex flex-col items-center justify-center px-4 page-enter">
                    <div className="w-20 h-20 bg-grey-100 rounded-full flex items-center justify-center mb-6">
                        <ShoppingBag size={32} className="text-grey-400" />
                    </div>
                    <h1 className="font-heading text-2xl font-black uppercase tracking-wider text-black text-center">
                        Your Cart is Empty
                    </h1>
                    <p className="font-body text-grey-500 mt-3 text-center">
                        Looks like you haven&apos;t added anything yet.
                    </p>
                    <Link href="/shop" className="mt-8">
                        <Button variant="accent" size="lg">
                            Start Shopping <ArrowRight size={16} className="ml-2" />
                        </Button>
                    </Link>
                </div>
            </LayoutWrapper>
        );
    }

    return (
        <LayoutWrapper>
            <div className="pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto page-enter">
                <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-wider text-black mb-10">
                    Your Cart
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div
                                key={`${item.product.id}-${item.size}`}
                                className="flex gap-4 sm:gap-6 bg-white rounded-2xl p-4 sm:p-6 transition-all duration-200 hover:shadow-md"
                            >
                                {/* Image */}
                                <Link href={`/product/${item.product.id}`} className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0">
                                    <Image
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </Link>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <Link href={`/product/${item.product.id}`}>
                                                <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-black truncate hover:text-terracotta transition-colors">
                                                    {item.product.name}
                                                </h3>
                                            </Link>
                                            <p className="text-grey-500 text-xs font-body mt-1">
                                                Size: {item.size} • {item.color}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.product.id, item.size)}
                                            className="p-1.5 hover:bg-grey-100 rounded-lg transition-colors cursor-pointer shrink-0"
                                            aria-label="Remove item"
                                        >
                                            <X size={16} className="text-grey-400" />
                                        </button>
                                    </div>

                                    <div className="flex items-end justify-between mt-4">
                                        {/* Quantity */}
                                        <div className="flex items-center bg-offwhite border border-grey-200 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                                                className="p-2 hover:bg-grey-200 transition-colors cursor-pointer"
                                                aria-label="Decrease"
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span className="px-3 font-heading text-xs font-bold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                                                className="p-2 hover:bg-grey-200 transition-colors cursor-pointer"
                                                aria-label="Increase"
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>

                                        {/* Price */}
                                        <p className="font-heading text-sm sm:text-base font-bold text-black">
                                            ₹{(item.product.price * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 sm:p-8 sticky top-24">
                            <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-black mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-4 font-body text-sm">
                                <div className="flex justify-between">
                                    <span className="text-grey-500">Subtotal</span>
                                    <span className="font-heading font-bold">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-grey-500">Shipping</span>
                                    <span className={`font-heading font-bold ${shipping === 0 ? 'text-green-600' : ''}`}>
                                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                                    </span>
                                </div>
                                {shipping > 0 && (
                                    <p className="text-xs text-grey-400">
                                        Free shipping on orders above ₹999
                                    </p>
                                )}
                                <hr className="border-grey-200" />
                                <div className="flex justify-between">
                                    <span className="font-heading font-bold uppercase tracking-wider text-black">Total</span>
                                    <span className="font-heading text-lg font-black text-black">₹{total.toLocaleString()}</span>
                                </div>
                            </div>

                            <Link href="/checkout" className="block mt-8">
                                <Button variant="accent" size="lg" fullWidth>
                                    Checkout <ArrowRight size={16} className="ml-2" />
                                </Button>
                            </Link>

                            <Link href="/shop" className="block mt-4">
                                <Button variant="ghost" size="md" fullWidth>
                                    Continue Shopping
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutWrapper>
    );
}
