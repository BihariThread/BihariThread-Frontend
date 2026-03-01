-- Create extension for UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. categories
CREATE TABLE categories (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE
);

-- 2. products
CREATE TABLE products (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" TEXT NOT NULL,
  "price" NUMERIC NOT NULL,
  "originalPrice" NUMERIC,
  "description" TEXT NOT NULL,
  "image" TEXT NOT NULL,
  "fabric" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "images" TEXT[] NOT NULL DEFAULT '{}',
  "sizes" TEXT[] NOT NULL DEFAULT '{}',
  "colors" TEXT[] NOT NULL DEFAULT '{}',
  "inStock" BOOLEAN NOT NULL DEFAULT true,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "new" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 3. users 
-- id: internal uuid matching auth.users id
-- phone: users phone number (unique)
CREATE TABLE public.users (
  "id" UUID PRIMARY KEY,
  "name" TEXT,
  "email" TEXT UNIQUE,
  "phone" TEXT UNIQUE,
  "password_set" BOOLEAN DEFAULT false,
  "last_login" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);


-- 4. addresses
CREATE TABLE addresses (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID REFERENCES public.users("id") ON DELETE CASCADE,
  "fullName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "addressLine1" TEXT NOT NULL,
  "addressLine2" TEXT,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "pincode" TEXT NOT NULL,
  "type" TEXT NOT NULL CHECK ("type" IN ('billing', 'shipping')),
  "isDefault" BOOLEAN DEFAULT false
);

-- 5. orders
CREATE TABLE orders (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID REFERENCES public.users("id") ON DELETE SET NULL,
  "total" NUMERIC NOT NULL,
  "status" TEXT NOT NULL CHECK ("status" IN ('pending', 'paid', 'confirmed', 'shipped', 'delivered', 'failed')),
  "shippingAddress" JSONB NOT NULL,
  "billingAddress" JSONB NOT NULL,
  "razorpay_order_id" TEXT UNIQUE,
  "razorpay_payment_id" TEXT,
  "razorpay_signature" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 6. order_items
CREATE TABLE order_items (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "orderId" UUID REFERENCES orders("id") ON DELETE CASCADE,
  "productId" UUID REFERENCES products("id") ON DELETE SET NULL,
  "product" JSONB, -- storing a snapshot of product details
  "quantity" INTEGER NOT NULL,
  "size" TEXT NOT NULL,
  "color" TEXT NOT NULL
);

-- 7. enquiries
CREATE TABLE enquiries (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "businessName" TEXT NOT NULL,
  "contactPerson" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "status" TEXT NOT NULL CHECK ("status" IN ('pending', 'quoted', 'contacted', 'closed')),
  "message" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 8. offers
CREATE TABLE offers (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "title" TEXT NOT NULL,
  "price" NUMERIC NOT NULL,
  "originalPrice" NUMERIC NOT NULL,
  "image" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);
-- 9. settings
CREATE TABLE settings (
  "id" INTEGER PRIMARY KEY DEFAULT 1,
  "heroTitle" TEXT NOT NULL,
  "heroSubtitle" TEXT NOT NULL,
  "heroButtonText" TEXT NOT NULL,
  "shopBannerTitle" TEXT NOT NULL,
  "shopBannerSubtitle" TEXT NOT NULL,
  "contactEmail" TEXT NOT NULL,
  "contactPhone" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert initial settings
INSERT INTO settings (id, "heroTitle", "heroSubtitle", "heroButtonText", "shopBannerTitle", "shopBannerSubtitle", "contactEmail", "contactPhone", "address")
VALUES (1, 'WEAR YOUR PRIDE, REFINE YOUR STYLE', 'Premium Quality Tees Celebrating Bihari Culture with a Modern Twist', 'Explore Collection', 'Shop Our Collection', 'Discover premium items crafted for you.', 'support@biharithread.com', '+91 91234 56789', 'Patna, Bihar, India')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS (Row Level Security) - Highly recommended but optional depending on security needs.
-- Here we're setting up permissive policies for ease of development. You should tighten these for production!
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products, categories, offers
CREATE POLICY "Public read access for products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read access for categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access for offers" ON offers FOR SELECT USING (true);

-- For simple development, allow all access (Admin bypass will typically use the service key, but just in case)
-- Remove these in production
CREATE POLICY "Allow all operations for products" ON products FOR ALL USING (true);
CREATE POLICY "Allow all operations for categories" ON categories FOR ALL USING (true);
CREATE POLICY "Allow all operations for orders" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all operations for order_items" ON order_items FOR ALL USING (true);
CREATE POLICY "Allow all operations for enquiries" ON enquiries FOR ALL USING (true);
CREATE POLICY "Allow all operations for offers" ON offers FOR ALL USING (true);
CREATE POLICY "Allow all operations for public users" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow all operations for addresses" ON addresses FOR ALL USING (true);
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Allow all operations for settings" ON settings FOR ALL USING (true);

