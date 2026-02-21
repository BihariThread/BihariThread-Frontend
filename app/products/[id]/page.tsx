'use client';

import { use, useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingCart, Heart, Share2, Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useSiteStore } from '@/store/siteStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { Product } from '@/types';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { products } = useSiteStore();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [activeImage, setActiveImage] = useState(0);

  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { isLoggedIn, openAuthModal } = useAuthStore();

  // Find product from store
  const productData = products.find((p) => p.id === id);

  // Safety check - if product not found
  if (!productData) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center">
        <Header />
        <div className="text-center py-20 flex-grow">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p>We couldn't find the product you're looking for.</p>
        </div>
        <Footer />
      </div>
    )
  }

  // Adapt mock product to full Product type structure for stores
  const product = {
    ...productData,
    originalPrice: productData.originalPrice || Math.round(productData.price * 1.5),
    fabric: productData.fabric || '100% Cotton',
    images: productData.images || [productData.image],
    colors: productData.colors || ['Black'],
    inStock: true,
    featured: productData.featured || false,
    new: productData.new || false
  };

  const isFavorited = isInWishlist(product.id);

  // Filter recommended products (same category, exclude current)
  const recommendedProducts = products
    .filter((p: Product) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast.error('Please login to add to cart');
      openAuthModal();
      return;
    }

    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addToCart(product, selectedSize, product.colors[0]); // Default color for now
    toast.success('Added to cart');
  };

  const handleWishlistToggle = () => {
    if (!isLoggedIn) {
      toast.error('Please login to use wishlist');
      openAuthModal();
      return;
    }

    if (isFavorited) {
      removeFromWishlist(product.id);
      toast.info('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-muted rounded-lg overflow-hidden border border-border">
                <Image
                  src={product.images[activeImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${activeImage === index ? 'border-accent ring-2 ring-accent/20' : 'border-transparent hover:border-border'
                      }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-accent uppercase tracking-wider">
                    {product.category}
                  </span>
                  {product.inStock ? (
                    <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                      <Check size={12} /> In Stock
                    </span>
                  ) : (
                    <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded-full">
                      Out of Stock
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-montserrat font-bold text-foreground mb-4">
                  {product.name}
                </h1>
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-3xl font-bold text-primary">₹{product.price}</span>
                  <span className="text-xl text-muted-foreground line-through">₹{product.originalPrice}</span>
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-foreground">Select Size</span>
                    <button className="text-xs text-accent hover:underline">Size Chart</button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center font-medium transition-all ${selectedSize === size
                          ? 'bg-accent text-accent-foreground shadow-md scale-105'
                          : 'bg-background border border-border text-foreground hover:border-accent hover:bg-accent/5'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-border">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary text-primary-foreground py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                  <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
                  Add to Cart
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`p-4 border rounded-lg transition-all ${isFavorited
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'border-border text-muted-foreground hover:border-accent hover:text-accent'
                    }`}
                >
                  <Heart size={24} fill={isFavorited ? 'currentColor' : 'none'} className={isFavorited ? 'animate-pulse' : ''} />
                </button>
                <button className="p-4 border border-border rounded-lg text-muted-foreground hover:border-accent hover:text-accent transition-all">
                  <Share2 size={24} />
                </button>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-2 gap-4 pt-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Premium Quality</h4>
                    <p className="text-xs text-muted-foreground">100% Bio-washed Cotton</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Fast Delivery</h4>
                    <p className="text-xs text-muted-foreground">Ships within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Products */}
          <div className="pt-16 border-t border-border">
            <h2 className="text-2xl font-montserrat font-bold text-foreground mb-8">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((p: Product) => (
                <ProductCard
                  key={p.id}
                  {...p}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
