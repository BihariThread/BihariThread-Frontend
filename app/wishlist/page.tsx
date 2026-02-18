'use client';

import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

export default function WishlistPage() {
    const { items, removeItem } = useWishlistStore();
    const { addItem: addToCart } = useCartStore();

    const handleAddToCart = (product: any) => {
        addToCart({ ...product, originalPrice: 0, fabric: '', images: [], sizes: [], colors: [], inStock: true, featured: false, new: false } as any, product.sizes?.[0] || 'M', 'Default');
        toast.success('Added to cart');
        removeItem(product.id);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <h1 className="text-3xl font-montserrat font-bold text-foreground mb-8">My Wishlist</h1>

                {items.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-muted-foreground mb-6">Your wishlist is empty.</p>
                        <Link href="/shop">
                            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                                Browse Shop
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item) => (
                            <div key={item.id} className="bg-card border border-border rounded-lg overflow-hidden flex flex-col group p-4 gap-4">
                                <div className="relative aspect-square bg-muted rounded-md overflow-hidden">
                                    <Image
                                        src={item.images?.[0] || '/placeholder.png'}
                                        alt={item.name}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-montserrat font-semibold text-lg line-clamp-1">{item.name}</h3>
                                    <p className="text-sm text-muted-foreground">{item.category}</p>
                                    <div className="mt-2 text-lg font-bold text-primary">₹{item.price}</div>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-accent text-accent-foreground py-2 rounded-md hover:opacity-90 transition-opacity text-sm font-medium"
                                    >
                                        <ShoppingCart size={16} />
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={() => {
                                            removeItem(item.id);
                                            toast.info('Removed from wishlist');
                                        }}
                                        className="p-2 border border-border text-muted-foreground hover:text-red-500 hover:border-red-500 rounded-md transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
