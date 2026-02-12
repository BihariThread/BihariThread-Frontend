import { Product } from '@/types';

export const products: Product[] = [
    {
        id: 'bt-001',
        name: 'The Midnight Essential',
        price: 1299,
        originalPrice: 1799,
        description: 'Our signature oversized tee in deep black. Cut from premium 240 GSM cotton, this is the foundation of every wardrobe. Rooted in comfort, designed for the streets.',
        fabric: '100% Premium Cotton • 240 GSM • Pre-shrunk • Bio-washed',
        category: 'oversized',
        images: ['/products/black-essentials.png'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black'],
        inStock: true,
        featured: true,
        new: false,
    },
    {
        id: 'bt-002',
        name: 'Terracotta Roots',
        price: 1499,
        originalPrice: 1999,
        description: 'Inspired by the earthy terracotta of Bihar\'s art and pottery. This bold piece carries the warmth of our homeland in every fiber.',
        fabric: '100% Premium Cotton • 220 GSM • Reactive dyed • Bio-washed',
        category: 'classic',
        images: ['/products/terracotta-classic.png'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Terracotta'],
        inStock: true,
        featured: true,
        new: true,
    },
    {
        id: 'bt-003',
        name: 'The Heritage Maroon',
        price: 1399,
        originalPrice: 1899,
        description: 'Deep maroon — the color of Madhubani art and Bihari weddings. A statement piece that speaks heritage without saying a word.',
        fabric: '100% Premium Cotton • 240 GSM • Garment dyed • Bio-washed',
        category: 'classic',
        images: ['/products/maroon-heritage.png'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Deep Maroon'],
        inStock: true,
        featured: true,
        new: false,
    },
    {
        id: 'bt-004',
        name: 'Off-White Canvas',
        price: 1299,
        originalPrice: 1699,
        description: 'Clean, minimal, and timeless. The off-white canvas is your blank slate — pair it with anything, own every look.',
        fabric: '100% Premium Cotton • 220 GSM • Natural dyed • Bio-washed',
        category: 'oversized',
        images: ['/products/offwhite-premium.png'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Off White'],
        inStock: true,
        featured: true,
        new: false,
    },
    {
        id: 'bt-005',
        name: 'Olive Roots Edition',
        price: 1499,
        originalPrice: 1999,
        description: 'Earthy olive green inspired by the lush fields of Bihar. Built for those who carry their roots wherever they go.',
        fabric: '100% Premium Cotton • 240 GSM • Reactive dyed • Bio-washed',
        category: 'limited',
        images: ['/products/olive-roots.png'],
        sizes: ['M', 'L', 'XL', 'XXL'],
        colors: ['Olive'],
        inStock: true,
        featured: true,
        new: true,
    },
    {
        id: 'bt-006',
        name: 'Navy Culture Drop',
        price: 1399,
        originalPrice: 1799,
        description: 'Deep navy blue — understated, powerful, and versatile. From campus to culture, this one does it all.',
        fabric: '100% Premium Cotton • 220 GSM • Indigo dyed • Bio-washed',
        category: 'classic',
        images: ['/products/navy-culture.png'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Navy Blue'],
        inStock: true,
        featured: true,
        new: false,
    },
    {
        id: 'bt-007',
        name: 'Charcoal Street',
        price: 1299,
        originalPrice: 1599,
        description: 'The perfect in-between shade. Not quite black, not quite grey — Charcoal Street lives in the details.',
        fabric: '100% Premium Cotton • 240 GSM • Pigment dyed • Bio-washed',
        category: 'oversized',
        images: ['/products/black-essentials.png'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Charcoal'],
        inStock: true,
        featured: false,
        new: false,
    },
    {
        id: 'bt-008',
        name: 'Sand Dune Limited',
        price: 1599,
        originalPrice: 2099,
        description: 'Limited edition sand tone. Inspired by the banks of the Ganges in Bihar. Only 200 pieces crafted.',
        fabric: '100% Premium Cotton • 260 GSM • Sand washed • Heavy weight',
        category: 'limited',
        images: ['/products/offwhite-premium.png'],
        sizes: ['M', 'L', 'XL'],
        colors: ['Sand'],
        inStock: true,
        featured: false,
        new: true,
    },
];

export function getProducts(): Product[] {
    return products;
}

export function getProductById(id: string): Product | undefined {
    return products.find((p) => p.id === id);
}

export function getFeaturedProducts(): Product[] {
    return products.filter((p) => p.featured);
}

export function getNewArrivals(): Product[] {
    return products.filter((p) => p.new);
}

export function getProductsByCategory(category: string): Product[] {
    if (category === 'all') return products;
    return products.filter((p) => p.category === category);
}

export function searchProducts(query: string): Product[] {
    const q = query.toLowerCase();
    return products.filter(
        (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
    );
}
