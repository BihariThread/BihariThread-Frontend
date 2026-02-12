'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

interface ProductCardProps {
    product: Product;
    layout?: 'default' | 'wide' | 'tall';
}

export default function ProductCard({ product, layout = 'default' }: ProductCardProps) {
    const addItem = useCartStore((s) => s.addItem);
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    const openAuthModal = useAuthStore((s) => s.openAuthModal);

    const ref = useRef<HTMLDivElement>(null);

    // 3D Tilt Effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useMotionTemplate`calc(${mouseYSpring} * -0.5deg)`;
    const rotateY = useMotionTemplate`calc(${mouseXSpring} * 0.5deg)`;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct * 20); // range -10 to 10
        y.set(yPct * 20); // range -10 to 10
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isLoggedIn) {
            openAuthModal();
            return;
        }
        addItem(product, product.sizes[1] || product.sizes[0], product.colors[0]);
    };

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group block perspective-1000"
        >
            <Link href={`/product/${product.id}`}>
                <div
                    className={`relative bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-300 group-hover:shadow-2xl ${layout === 'tall' ? 'aspect-[3/4]' : layout === 'wide' ? 'aspect-[4/3]' : 'aspect-square'
                        }`}
                    style={{ transform: "translateZ(0)" }}
                >
                    {/* Product Image */}
                    <div className="relative w-full h-full img-zoom">
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {/* Overlay Gradient on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                        {product.new && (
                            <span className="px-3 py-1 bg-terracotta/90 backdrop-blur-sm text-white text-[10px] font-heading font-bold uppercase tracking-widest rounded-full shadow-lg">
                                New
                            </span>
                        )}
                        {discount > 0 && (
                            <span className="px-3 py-1 bg-deep-maroon/90 backdrop-blur-sm text-white text-[10px] font-heading font-bold uppercase tracking-widest rounded-full shadow-lg">
                                -{discount}%
                            </span>
                        )}
                    </div>

                    {/* Quick Add */}
                    <button
                        onClick={handleAddToCart}
                        className="absolute bottom-4 right-4 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-terracotta hover:text-white shadow-xl z-20 cursor-pointer"
                        aria-label="Add to cart"
                    >
                        <ShoppingBag size={20} />
                    </button>
                </div>

                {/* Product Info */}
                <div className="mt-4 px-1" style={{ transform: "translateZ(20px)" }}>
                    <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-black truncate group-hover:text-terracotta transition-colors">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="font-heading font-bold text-base text-black">
                            ₹{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                            <span className="text-sm text-grey-400 line-through font-body">
                                ₹{product.originalPrice.toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
