'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, User, Menu, X, Search } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const itemCount = useCartStore((s) => s.getItemCount());
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    const openAuthModal = useAuthStore((s) => s.openAuthModal);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [mobileOpen]);

    const navLinks = [
        { href: '/shop', label: 'Shop' },
        { href: '/custom', label: 'Custom Print' },
        { href: '/shop?category=limited', label: 'Limited Drops' },
    ];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-white/10 dark:bg-black/80 dark:border-white/5'
                    : 'bg-transparent py-4'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileOpen(true)}
                            className={`lg:hidden p-2 rounded-xl transition-colors cursor-pointer ${scrolled ? 'hover:bg-black/5 text-black' : 'hover:bg-white/10 text-white'}`}
                            aria-label="Open menu"
                        >
                            <Menu size={22} className="currentColor" />
                        </button>

                        {/* Logo */}
                        {/* Logo - Only visible when scrolled or on mobile */}
                        <Link href="/" className={`flex items-center gap-2 transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0 pointer-events-none lg:opacity-0'}`}>
                            <Image
                                src="/logo.png"
                                alt="BihariThread"
                                width={140}
                                height={40}
                                className={`h-8 sm:h-10 w-auto ${scrolled ? '' : 'brightness-0 invert'}`}
                                priority
                            />
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden lg:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`font-heading text-xs font-bold uppercase tracking-widest hover:text-terracotta transition-colors duration-200 ${scrolled ? 'text-black' : 'text-white text-glow'}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Right Icons */}
                        <div className="flex items-center gap-1 sm:gap-3">
                            <Link
                                href="/shop"
                                className={`hidden sm:flex p-2 rounded-xl transition-colors ${scrolled ? 'hover:bg-black/5 text-black' : 'hover:bg-white/10 text-white'}`}
                                aria-label="Search"
                            >
                                <Search size={20} className="currentColor" />
                            </Link>

                            {isLoggedIn ? (
                                <Link
                                    href="/profile"
                                    className={`p-2 rounded-xl transition-colors ${scrolled ? 'hover:bg-black/5 text-black' : 'hover:bg-white/10 text-white'}`}
                                    aria-label="Profile"
                                >
                                    <User size={20} className="currentColor" />
                                </Link>
                            ) : (
                                <button
                                    onClick={openAuthModal}
                                    className={`p-2 rounded-xl transition-colors cursor-pointer ${scrolled ? 'hover:bg-black/5 text-black' : 'hover:bg-white/10 text-white'}`}
                                    aria-label="Login"
                                >
                                    <User size={20} className="currentColor" />
                                </button>
                            )}

                            <Link
                                href="/cart"
                                className={`relative p-2 rounded-xl transition-colors ${scrolled ? 'hover:bg-black/5 text-black' : 'hover:bg-white/10 text-white'}`}
                                aria-label="Cart"
                            >
                                <ShoppingBag size={20} className="currentColor" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-terracotta text-white text-[10px] font-heading font-bold rounded-full flex items-center justify-center">
                                        {itemCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-[60] lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="absolute top-0 left-0 bottom-0 w-[280px] bg-offwhite animate-slide-down shadow-2xl">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-10">
                                <Image
                                    src="/logo.png"
                                    alt="BihariThread"
                                    width={120}
                                    height={36}
                                    className="h-8 w-auto"
                                />
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    className="p-2 hover:bg-black/5 rounded-xl cursor-pointer transition-colors"
                                    aria-label="Close menu"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex flex-col gap-6">
                                {navLinks.map((link, i) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`font-heading text-sm font-bold uppercase tracking-widest text-black hover:text-terracotta transition-colors animate-fade-in-up stagger-${i + 1}`}
                                        style={{ opacity: 0 }}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <hr className="border-grey-200 my-2" />
                                {!isLoggedIn && (
                                    <button
                                        onClick={() => {
                                            setMobileOpen(false);
                                            openAuthModal();
                                        }}
                                        className="font-heading text-sm font-bold uppercase tracking-widest text-terracotta hover:text-deep-maroon transition-colors text-left animate-fade-in-up stagger-4 cursor-pointer"
                                        style={{ opacity: 0 }}
                                    >
                                        Login / Sign Up
                                    </button>
                                )}
                                {isLoggedIn && (
                                    <Link
                                        href="/profile"
                                        onClick={() => setMobileOpen(false)}
                                        className="font-heading text-sm font-bold uppercase tracking-widest text-black hover:text-terracotta transition-colors animate-fade-in-up stagger-4"
                                        style={{ opacity: 0 }}
                                    >
                                        My Account
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
