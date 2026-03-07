export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  fabric: string;
  category: string;

  images: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
  stockQuantity: number;
  featured: boolean;
  new: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  type: 'billing' | 'shipping';
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  password_set?: boolean;
  createdAt: string;
}


export interface Order {
  id: string;
  userId?: string;
  customerName?: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'not accepted' | 'paid' | 'confirmed' | 'shipped' | 'delivered' | 'failed';
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  createdAt: string;
  shippingAddress: Address;
  billingAddress: Address;
}

export interface CustomOrder {
  id: string;
  designUrl?: string;
  size: string;
  quantity: number;
  notes: string;
  status: 'pending' | 'quoted' | 'approved' | 'in-production' | 'completed';
  createdAt: string;
  quotedPrice?: number;
}
export interface Offer {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  image: string;
  description: string;
}

export interface Enquiry {
  id: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
  quantity: number;
  status: 'pending' | 'quoted' | 'contacted' | 'closed';
  createdAt: string;
  message: string;
  selectedDesigns?: string[];
  designUrl?: string;
}


export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  shopBannerTitle: string;
  shopBannerSubtitle: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  showOnHome: boolean;
}

