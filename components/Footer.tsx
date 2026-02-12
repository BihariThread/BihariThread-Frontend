import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Twitter, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Image
                            src="/logo.png"
                            alt="BihariThread"
                            width={140}
                            height={40}
                            className="h-10 w-auto brightness-0 invert mb-4"
                        />
                        <p className="text-grey-400 font-body text-sm leading-relaxed max-w-xs">
                            Born in Bihar. Designed for the streets. Premium oversized streetwear rooted in culture.
                        </p>
                        <div className="flex items-center gap-4 mt-6">
                            <a href="#" className="text-grey-400 hover:text-terracotta transition-colors" aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-grey-400 hover:text-terracotta transition-colors" aria-label="Twitter">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="text-grey-400 hover:text-terracotta transition-colors" aria-label="Email">
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-heading text-xs font-bold uppercase tracking-widest text-white mb-5">
                            Shop
                        </h4>
                        <ul className="flex flex-col gap-3">
                            {[
                                { href: '/shop', label: 'All Products' },
                                { href: '/shop?category=oversized', label: 'Oversized Tees' },
                                { href: '/shop?category=limited', label: 'Limited Drops' },
                                { href: '/custom', label: 'Custom Print' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-grey-400 hover:text-white text-sm font-body transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-heading text-xs font-bold uppercase tracking-widest text-white mb-5">
                            Company
                        </h4>
                        <ul className="flex flex-col gap-3">
                            {[
                                { href: '/#brand-story', label: 'Our Story' },
                                { href: '#', label: 'Contact Us' },
                                { href: '#', label: 'Shipping Policy' },
                                { href: '#', label: 'Returns' },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-grey-400 hover:text-white text-sm font-body transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-heading text-xs font-bold uppercase tracking-widest text-white mb-5">
                            Get in Touch
                        </h4>
                        <p className="text-grey-400 text-sm font-body leading-relaxed">
                            support@biharithread.com
                        </p>
                        <p className="text-grey-400 text-sm font-body mt-2">
                            Patna, Bihar, India
                        </p>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-grey-500 text-xs font-body">
                        © {new Date().getFullYear()} BihariThread. All rights reserved.
                    </p>
                    <p className="text-grey-500 text-xs font-body">
                        Rooted in Bihar. Worn Everywhere.
                    </p>
                </div>
            </div>
        </footer>
    );
}
