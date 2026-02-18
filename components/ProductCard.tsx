'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Heart, Eye } from 'lucide-react'
import { useState } from 'react'
import { Product } from '@/types'
import { useAuthStore } from '@/store/authStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface ProductCardProps extends Partial<Product> {
  id: string
  name: string
  price: number
  image: string
  category: Product['category']
  priority?: boolean
}

const ProductCard = ({
  id,
  name,
  price,
  image,
  category,
  priority = false,
  ...props
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const { isLoggedIn, openAuthModal } = useAuthStore()
  const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore()
  const { addItem: addToCart } = useCartStore()

  const isFavorited = isInWishlist(id)

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isLoggedIn) {
      toast.error('Please login to use wishlist')
      openAuthModal()
      return
    }

    const productData: Product = {
      id,
      name,
      price,
      image,
      category,
      description: '',
      fabric: '',
      images: [image],
      sizes: [],
      colors: [],
      inStock: true,
      featured: false,
      new: false,
      ...props
    }

    if (isFavorited) {
      removeFromWishlist(id)
      toast.info('Removed from wishlist')
    } else {
      addToWishlist(productData)
      toast.success('Added to wishlist')
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isLoggedIn) {
      toast.error('Please login to add to cart')
      openAuthModal()
      return
    }

    const productData: Product = {
      id,
      name,
      price,
      image,
      category,
      description: '',
      fabric: '',
      images: [image],
      sizes: [],
      colors: [],
      inStock: true,
      featured: false,
      new: false,
      ...props
    }

    addToCart(productData, 'M', 'Default') // Default values for quick add
    toast.success('Added to cart')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
          <Image
            src={image}
            alt={name}
            fill
            className={`object-cover transition-transform duration-700 ease-in-out ${isHovered ? 'scale-110' : 'scale-100'
              }`}
            priority={priority}
          />

          {/* Overlay Actions */}
          <div
            className={`absolute inset-0 bg-black/20 transition-opacity duration-300 flex items-center justify-center gap-4 ${isHovered ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <button
              onClick={handleAddToCart}
              className="bg-background text-foreground p-3 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-200 transform hover:scale-110 shadow-lg"
              title="Add to Cart"
            >
              <ShoppingCart size={20} />
            </button>
            <button className="bg-background text-foreground p-3 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-200 transform hover:scale-110 shadow-lg" title="Quick View">
              <Eye size={20} />
            </button>
          </div>

          {/* Wishlist Button (Always visible on mobile, hover on desktop) */}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 transform hover:scale-110 shadow-md z-10 ${isFavorited
              ? 'bg-red-500 text-white'
              : 'bg-background/80 backdrop-blur-sm text-foreground hover:bg-red-500 hover:text-white'
              }`}
          >
            <Heart size={18} fill={isFavorited ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="mt-4 space-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                {category}
              </p>
              <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {name}
              </h3>
            </div>
            <p className="text-lg font-bold text-primary">₹{price}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard
