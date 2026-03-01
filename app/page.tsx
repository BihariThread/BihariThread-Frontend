'use client'

import Header from '@/components/Header'
import ProductCard from '@/components/ProductCard'
import Footer from '@/components/Footer'
import { useSiteStore } from '@/store/siteStore'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import FadeIn from '@/components/FadeIn'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Home() {
  const { products, offers, siteSettings, categories } = useSiteStore()
  const [activeOffer, setActiveOffer] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Filter categories to show on home (for dynamic sections)
  const homeCategories = categories.filter(c => c.showOnHome)

  // Featured Products
  const featuredProducts = products.filter((p) => p.featured)

  // Trending Products (e.g., newest or specifically categorized)
  const trendingProducts = products.filter((p) => p.category === 'trending' || p.new).slice(0, 4)

  // Filtered logic for specific category selection
  const isAll = selectedCategory === 'All'
  const displayProducts = isAll
    ? products
    : products.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase() ||
      categories.find(c => c.slug === p.category)?.name === selectedCategory)

  const displayOffers = isAll
    ? offers
    : offers.filter(o => {
      // Find products in this offer to see if they match category
      return o.title.toLowerCase().includes(selectedCategory.toLowerCase())
    })

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      {/* Category Slider / Filter Bar */}
      <div className="sticky top-[72px] z-30 bg-background/80 backdrop-blur-md border-b border-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
            {['All', ...categories.map(c => c.name)].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-6 py-2 rounded-full font-medium transition-all ${selectedCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isAll && (
        <>
          {/* Hero Section */}
          <section className="relative py-20 md:py-20 bg-primary overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent blur-3xl"></div>
              <div className="absolute top-1/2 -left-24 w-72 h-72 rounded-full bg-blue-500 blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8 text-primary-foreground">
                  <FadeIn direction="right">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-montserrat font-bold leading-tight tracking-tight">
                      {siteSettings.heroTitle.split(',')[0]} <br />
                      <span className="text-accent inline-block relative">
                        {siteSettings.heroTitle.split(',')[1] || 'Bihar.'}
                        <svg className="absolute w-full h-3 -bottom-1 left-0 text-accent" viewBox="0 0 100 10" preserveAspectRatio="none">
                          <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                        </svg>
                      </span>
                    </h1>
                  </FadeIn>

                  <FadeIn direction="right" delay={0.2}>
                    <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-lg leading-relaxed">
                      {siteSettings.heroSubtitle}
                    </p>
                  </FadeIn>

                  <FadeIn direction="right" delay={0.4} className="flex flex-col sm:flex-row gap-4">
                    <Link href="/shop" className="px-8 py-4 bg-accent text-accent-foreground font-bold text-lg rounded-full hover:bg-accent/90 transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg hover:shadow-accent/25 hover:-translate-y-1">
                      Shop Collection
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                    <button className="px-8 py-4 border-2 border-white/20 text-white font-bold text-lg rounded-full hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
                      Our Story
                    </button>
                  </FadeIn>
                </div>

                <FadeIn direction="left" delay={0.2} className="relative h-[500px] w-full hidden md:block">
                  <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent rounded-2xl transform rotate-3 scale-95 opacity-50 blur-sm"></div>
                  <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                    {featuredProducts[0] ? (
                      <Image
                        src={featuredProducts[0].image}
                        alt="Hero Image"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground italic">No featured products</div>
                    )}

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.8 }}
                      className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-white max-w-xs"
                    >
                      <p className="font-semibold text-sm">New Arrival</p>
                      <p className="text-xs opacity-80">{featuredProducts[0]?.name || 'Stay Tuned'}</p>
                    </motion.div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </section>

          {/* Featured Products */}
          <section className="py-12 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-12">
                <FadeIn>
                  <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-foreground">
                    Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Drops</span>
                  </h2>
                </FadeIn>
                <FadeIn delay={0.1}>
                  <Link href="/shop" className="hidden md:flex items-center gap-2 text-primary font-semibold group hover:opacity-70 transition-opacity">
                    View All
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </FadeIn>
              </div>
              <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 md:overflow-visible">
                {featuredProducts.slice(0, 4).map((product, idx) => (
                  <div key={product.id} className="min-w-[200px] w-[200px] md:w-full snap-start">
                    <ProductCard {...product} priority={idx < 2} />
                  </div>
                ))}
                {featuredProducts.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground italic">
                    Mark products as "Featured" in Admin to show them here.
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Offer Carousel */}
          {offers.length > 0 && (
            <section className="pb-24 bg-muted/30">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn className="text-center mb-16">
                  <h2 className="text-4xl font-montserrat font-bold text-foreground mb-4">
                    Don't Miss Out
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                    Exclusive deals on our best-selling collections. Limited time offers.
                  </p>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {offers.map((offer, index) => (
                    <FadeIn key={offer.id} delay={index * 0.1}>
                      <div className="group relative bg-background rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-border">
                        <div className="relative h-64 overflow-hidden">
                          <Image
                            src={offer.image}
                            alt={offer.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-4 right-4 bg-white text-black px-4 py-1.5 rounded-full font-bold text-sm shadow-md">
                            {Math.round(((offer.originalPrice - offer.price) / offer.originalPrice) * 100)}% OFF
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="font-montserrat font-bold text-xl text-foreground mb-2 group-hover:text-accent transition-colors text-ellipsis overflow-hidden whitespace-nowrap">
                            {offer.title}
                          </h3>
                          <p className="text-muted-foreground mb-6 line-clamp-2">{offer.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-2xl font-bold text-primary">₹{offer.price}</span>
                              <span className="text-sm text-muted-foreground line-through">₹{offer.originalPrice}</span>
                            </div>
                            <button className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center transform group-hover:scale-110 transition-all shadow-md">
                              <ArrowRight size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Dynamic Category Sections */}
          {homeCategories.map((cat, idx) => {
            const catProducts = products.filter(p => p.category === cat.slug || p.category.toLowerCase() === cat.name.toLowerCase()).slice(0, 4)
            if (catProducts.length === 0) return null
            return (
              <section key={cat.id} className={`py-12 ${idx % 2 === 0 ? 'bg-background' : 'bg-muted/10'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-end justify-between mb-12">
                    <FadeIn>
                      <span className="text-accent font-semibold tracking-wider text-sm uppercase">Collection</span>
                      <h2 className="text-4xl font-montserrat font-bold text-foreground mt-2">
                        {cat.name}
                      </h2>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                      <Link href={`/shop?category=${cat.slug}`} className="flex items-center gap-2 text-primary font-semibold group hover:opacity-70 transition-opacity">
                        View All
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
                      </Link>
                    </FadeIn>
                  </div>
                  <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 md:overflow-visible">
                    {catProducts.map((product) => (
                      <div key={product.id} className="min-w-[200px] w-[200px] md:w-full snap-start">
                        <ProductCard {...product} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )
          })}

          {/* Trending Section */}
          <section className="py-12 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <FadeIn className="mb-12 text-center">
                <span className="text-accent font-semibold tracking-wider text-sm uppercase">Hot Right Now</span>
                <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-foreground mt-2">
                  Trending
                </h2>
              </FadeIn>
              <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 md:overflow-visible">
                {trendingProducts.length > 0 ? (
                  trendingProducts.map((product) => (
                    <div key={product.id} className="min-w-[200px] w-[200px] md:w-full snap-start">
                      <ProductCard {...product} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-muted-foreground italic">
                    New products will appear here.
                  </div>
                )}
              </div>
              <div className="mt-12 text-center">
                <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-border hover:bg-primary hover:text-white transition-all duration-300 font-medium">
                  View All Products
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      {!isAll && (
        <section className="pb-24 bg-background min-h-[60vh]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <FadeIn>
                <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-foreground">
                  {selectedCategory}
                </h2>
                <p className="text-muted-foreground mt-2">Discover our {selectedCategory} collection</p>
              </FadeIn>
            </div>

            {displayOffers.length > 0 && (
              <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                {displayOffers.map(offer => (
                  <div key={offer.id} className="relative h-48 rounded-2xl overflow-hidden group">
                    <Image src={offer.image} alt={offer.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-center p-8">
                      <h3 className="text-white text-2xl font-bold">{offer.title}</h3>
                      <p className="text-white/80 mt-2">{offer.description}</p>
                      <div className="mt-4 text-accent font-bold text-xl">₹{offer.price} <span className="text-white/60 line-through text-sm">₹{offer.originalPrice}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
              {displayProducts.length === 0 && (
                <div className="col-span-full text-center py-20 text-muted-foreground">
                  No products found in this category yet.
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Brand Statement */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-4 border-white"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full border-2 border-white"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-16">
              Why Choose BihariThread?
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Premium Quality', desc: '100% Cotton, Bio-washed & Pre-shrunk fabric for lasting comfort.', icon: '✨' },
              { title: 'Cultural Pride', desc: 'Designs that celebrate the rich heritage and art of Bihar.', icon: '🎨' },
              { title: 'Fast Shipping', desc: 'Express delivery across India within 3-5 business days.', icon: '🚚' },
            ].map((item, idx) => (
              <FadeIn key={item.title} delay={idx * 0.2} className="space-y-4">
                <div className="text-6xl mb-6">{item.icon}</div>
                <h3 className="text-2xl font-montserrat font-bold">{item.title}</h3>
                <p className="text-primary-foreground/70 text-lg leading-relaxed">{item.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-muted/30 rounded-3xl p-8 md:p-16 text-center border border-border relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

            <FadeIn className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-foreground mb-4">
                Join the Community
              </h2>
              <p className="text-muted-foreground mb-8 text-lg max-w-lg mx-auto">
                Subscribe to get exclusive deals, early access to new drops, and stories from Bihar.
              </p>
              <div className="flex gap-4 flex-col sm:flex-row max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-full text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background shadow-sm"
                />
                <button className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:opacity-90 transition-opacity duration-200 shadow-lg">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-6">
                We respect your privacy. No spam, ever.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
