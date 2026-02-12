'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Paintbrush, Star, Truck, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import LayoutWrapper from '@/components/LayoutWrapper';
import ProductCard from '@/components/ProductCard';
import Button from '@/components/Button';
import { getFeaturedProducts, getNewArrivals, products } from '@/lib/api';

export default function HomePage() {
  const featured = getFeaturedProducts();
  const newArrivals = getNewArrivals();

  return (
    <LayoutWrapper>
      {/* ═══════ HERO SECTION ═══════ */}
      <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden perspective-1000">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, #C65D3B 2px, transparent 2px), radial-gradient(circle at 75% 75%, #C65D3B 2px, transparent 2px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Ambient Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-terracotta/20 blur-[120px] rounded-full animate-pulse pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-deep-maroon/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Logo (Hidden here if Navbar one is used, but kept for design if preferred. 
              User mentioned double logo, so we can hide this or keep it if Navbar one is hidden at top.
              Our Navbar logic hides navbar logo at top, so KEEP this one.) 
          */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <Image
              src="/logo.png"
              alt="BihariThread"
              width={320}
              height={90}
              className="mx-auto h-20 sm:h-24 md:h-32 w-auto brightness-0 invert drop-shadow-2xl"
              priority
            />
          </motion.div>

          {/* Tagline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-wider text-white"
          >
            Rooted in <span className="text-terracotta text-glow">Bihar</span>.
            <br />
            Worn <span className="accent-underline">Everywhere</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-8 text-grey-300 font-body text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Premium streetwear crafted with soul. Every thread tells our story.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/shop">
              <Button variant="accent" size="lg" className="shadow-[0_0_20px_rgba(198,93,59,0.5)] hover:shadow-[0_0_30px_rgba(198,93,59,0.8)] transition-shadow">
                Shop Now <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link href="/custom">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white hover:text-black backdrop-blur-sm">
                Custom Print
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2 backdrop-blur-sm">
            <div className="w-1 h-2 bg-terracotta rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ═══════ FEATURED COLLECTION ═══════ */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 bg-offwhite">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-terracotta font-heading text-sm font-bold uppercase tracking-[0.2em] mb-4"
          >
            Curated Selection
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-wider text-black"
          >
            Featured Collection
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {featured.slice(0, 6).map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link href="/shop">
            <Button variant="outline" size="lg" className="border-black text-black hover:bg-black hover:text-white">
              View All Products <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ═══════ BRAND STORY (Liquid Glass Effect) ═══════ */}
      <section className="relative py-32 bg-black text-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'linear-gradient(45deg, #1a1a1a 25%, transparent 25%, transparent 75%, #1a1a1a 75%), linear-gradient(45deg, #1a1a1a 25%, transparent 25%, transparent 75%, #1a1a1a 75%)',
            backgroundPosition: '0 0, 10px 10px',
            backgroundSize: '20px 20px'
          }} />
        </div>

        {/* Abstract Liquid Shapes */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-terracotta/30 blur-[150px] rounded-full mix-blend-screen opacity-60 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-deep-maroon/30 blur-[150px] rounded-full mix-blend-screen opacity-60" />

        <div className="relative max-w-5xl mx-auto px-6 text-center z-10">
          <div className="glass-panel-dark p-10 sm:p-16 rounded-3xl border border-white/10">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-terracotta font-heading text-sm font-bold uppercase tracking-[0.2em] mb-6"
            >
              Our Story
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="font-heading text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-wider mb-8"
            >
              Born in <span className="text-terracotta text-glow">Bihar</span>.
              <br />
              Designed for the Streets.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-body text-grey-300 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto"
            >
              BihariThread isn&apos;t just a brand — it&apos;s a movement. We take the raw, unfiltered pride
              of Bihar and weave it into premium streetwear that speaks. Every piece is crafted with
              heavyweight cotton, minimal design, and the soul of a culture that refuses to be
              overlooked.
            </motion.p>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-12 border-t border-white/10 pt-12">
              {[
                { val: '240+', label: 'GSM Cotton' },
                { val: '100%', label: 'Premium Quality' },
                { val: 'Bihar', label: 'Rooted' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                >
                  <p className="font-heading text-4xl sm:text-5xl font-black text-terracotta drop-shadow-lg">{stat.val}</p>
                  <p className="font-body text-sm uppercase tracking-widest mt-2 text-grey-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ EDITORIAL — LARGE SPLIT ═══════ */}
      <section className="py-0">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[700px]">
          {/* Left — Large Product Image */}
          <div className="relative h-[500px] md:h-auto img-zoom overflow-hidden">
            <Image
              src={products[0].images[0]}
              alt={products[0].name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-12 left-12 max-w-md">
              <span className="px-4 py-1.5 bg-terracotta text-white text-xs font-heading font-bold uppercase tracking-widest rounded-full shadow-lg">
                Bestseller
              </span>
              <h3 className="mt-4 font-heading text-4xl sm:text-5xl font-black uppercase text-white shadow-black drop-shadow-md">
                {products[0].name}
              </h3>
              <p className="text-white/90 font-body text-xl mt-2 font-medium">₹{products[0].price.toLocaleString()}</p>
            </div>
          </div>

          {/* Right — Stacked Products */}
          <div className="grid grid-cols-2 gap-px bg-grey-200">
            {products.slice(1, 5).map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="group relative aspect-square bg-white overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />

                {/* Hover Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <p className="font-heading text-sm font-bold uppercase text-white tracking-wider mb-2">{product.name}</p>
                  <div className="h-0.5 w-12 bg-terracotta mb-2" />
                  <p className="text-white font-body text-sm">₹{product.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ NEW ARRIVALS ═══════ */}
      {newArrivals.length > 0 && (
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-offwhite">
          <div className="flex flex-col sm:flex-row items-end justify-between mb-12 gap-6">
            <div>
              <p className="text-terracotta font-heading text-sm font-bold uppercase tracking-[0.2em] mb-2">Just Dropped</p>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-wider text-black">
                New Arrivals
              </h2>
            </div>
            <Link href="/shop" className="group font-heading text-sm font-bold uppercase tracking-widest text-grey-600 hover:text-black transition-colors flex items-center gap-2">
              See All <span className="group-hover:translate-x-1 transition-transform"><ArrowRight size={16} /></span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {newArrivals.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <ProductCard product={product} layout="tall" />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ═══════ TRUST SIGNALS ═══════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹999' },
            { icon: Shield, title: 'Premium Quality', desc: '240 GSM, bio-washed' },
            { icon: Star, title: 'Easy Returns', desc: '7-day return policy' },
            { icon: Paintbrush, title: 'Custom Prints', desc: 'Your design, our craft' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-8 rounded-2xl bg-white border border-grey-200 hover:border-terracotta/30 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-offwhite rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-terracotta/10 transition-colors">
                <item.icon size={28} className="text-black group-hover:text-terracotta transition-colors" />
              </div>
              <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-black mb-2">{item.title}</h3>
              <p className="text-grey-500 text-sm font-body">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════ CUSTOM PRINT CTA ═══════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 mb-0">
        <div className="max-w-6xl mx-auto rounded-[3rem] p-8 sm:p-20 text-center relative overflow-hidden shadow-2xl">
          {/* Background Image/Gradient */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 opacity-40 bg-[url('/custom-bg-pattern.png')] bg-repeat opacity-10" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-terracotta/40 blur-[150px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-deep-maroon/40 blur-[150px] rounded-full" />
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20"
            >
              <Paintbrush size={32} className="text-white" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-heading text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-wider text-white mb-6"
            >
              Want Your Own <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta to-orange-500">Design Printed?</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="font-body text-grey-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10"
            >
              Upload your artwork, choose your size and quantity, and we&apos;ll bring your vision to life on premium cotton.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link href="/custom">
                <Button variant="accent" size="lg" className="h-16 px-10 text-lg shadow-[0_0_30px_rgba(198,93,59,0.4)] hover:shadow-[0_0_50px_rgba(198,93,59,0.6)]">
                  Start Custom Order <ArrowRight size={20} className="ml-3" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </LayoutWrapper>
  );
}
