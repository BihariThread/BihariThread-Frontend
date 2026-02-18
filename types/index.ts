export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  fabric: string;
  category: 'oversized' | 'classic' | 'graphic' | 'limited' | 'funky' | 'minimal' | 'ipl' | 'trending';
  images: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
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
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
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
