'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ShoppingCart, User, Heart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useAuthStore } from '@/store/authStore'
import AuthModal from './AuthModal'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const cartItemCount = useCartStore((state) => state.getItemCount())
  const wishlistItems = useWishlistStore((state) => state.items)
  const { openAuthModal, user, isLoggedIn, logout } = useAuthStore()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Custom Print', href: '/custom-print' },
  ]

  return (
    <>
      <AuthModal />
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border'
          : 'bg-background'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className="text-2xl font-montserrat font-bold text-primary">
                BIHAR<span className="text-accent">THREAD</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-foreground hover:text-accent transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/wishlist">
                <button className="p-2 hover:bg-muted rounded-lg transition-colors duration-200 relative">
                  <Heart size={20} className="text-foreground" />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
                </button>
              </Link>

              <Link href="/cart">
                <button className="p-2 hover:bg-muted rounded-lg transition-colors duration-200 relative">
                  <ShoppingCart size={20} className="text-foreground" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </Link>

              {isLoggedIn ? (
                <div className="relative group">
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors duration-200">
                    <User size={20} className="text-foreground" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg py-1 px-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>

                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-muted rounded-sm">
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={openAuthModal} className="p-2 hover:bg-muted rounded-lg transition-colors duration-200">
                  <User size={20} className="text-foreground" />
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors duration-200"
            >
              {isOpen ? (
                <X size={24} className="text-foreground" />
              ) : (
                <Menu size={24} className="text-foreground" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <nav className="md:hidden pb-4 border-t border-border animate-fade-up">
              <div className="flex flex-col gap-2 py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="flex items-center justify-around py-4 border-t border-border">
                <Link href="/wishlist" onClick={() => setIsOpen(false)}>
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors duration-200 relative">
                    <Heart size={20} className="text-foreground" />
                    {wishlistItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {wishlistItems.length}
                      </span>
                    )}
                  </button>
                </Link>
                <Link href="/cart" onClick={() => setIsOpen(false)}>
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors duration-200 relative">
                    <ShoppingCart size={20} className="text-foreground" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </button>
                </Link>
                <button
                  onClick={() => {
                    if (!isLoggedIn) openAuthModal();
                    setIsOpen(false);
                  }}
                  className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
                >
                  <User size={20} className="text-foreground" />
                </button>
              </div>
            </nav>
          )}
        </div>
      </header>
    </>
  )
}
