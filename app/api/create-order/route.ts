import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { supabaseServer as supabase } from "@/lib/supabaseServer";

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY!,
    key_secret: process.env.RAZORPAY_SECRET!,
});

export async function POST(req: Request) {
    try {
        const { userId, total, items, shippingAddress, billingAddress } = await req.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        // 1. Create order in Supabase
        const { data: dbOrder, error: orderError } = await supabase
            .from('orders')
            .insert([{
                userId,
                total,
                status: 'pending',
                shippingAddress,
                billingAddress
            }])
            .select()
            .single();

        if (orderError) {
            console.error("Supabase Order Error:", orderError);
            return NextResponse.json({ error: orderError.message }, { status: 500 });
        }

        // 2. Insert order items
        const orderItems = items.map((item: any) => ({
            orderId: dbOrder.id,
            productId: item.product.id,
            product: item.product,
            quantity: item.quantity,
            size: item.size,
            color: item.color
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) {
            console.error("Supabase Items Error:", itemsError);
            // Consider rolling back order here if strict atomicity is required
            return NextResponse.json({ error: itemsError.message }, { status: 500 });
        }

        // 3. Generate Razorpay order
        const rpOrder = await razorpay.orders.create({
            amount: Math.round(total * 100), // convert to paise
            currency: "INR",
            receipt: dbOrder.id,
        });

        // 4. Update Supabase order with Razorpay Order ID
        await supabase
            .from('orders')
            .update({ razorpay_order_id: rpOrder.id })
            .eq('id', dbOrder.id);

        // 5. Deduct stock for each item
        for (const item of items) {
            const { data: productData } = await supabase
                .from('products')
                .select('stockQuantity')
                .eq('id', item.product.id)
                .single();

            if (productData) {
                const newQuantity = Math.max(0, (productData.stockQuantity || 0) - item.quantity);
                await supabase
                    .from('products')
                    .update({ stockQuantity: newQuantity })
                    .eq('id', item.product.id);
            }
        }

        return NextResponse.json({
            id: rpOrder.id,
            amount: rpOrder.amount,
            currency: rpOrder.currency,
            orderId: dbOrder.id // local DB id
        });

    } catch (error: any) {
        console.error("Create Order API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
