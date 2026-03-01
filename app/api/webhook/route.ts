import crypto from "crypto";
import { NextResponse } from "next/server";
import { supabaseServer as supabase } from "@/lib/supabaseServer";

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = req.headers.get("x-razorpay-signature");

        if (!signature) {
            return NextResponse.json({ error: "Missing signature" }, { status: 400 });
        }

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
            .update(body)
            .digest("hex");

        if (expectedSignature !== signature) {
            console.error("Invalid Webhook Signature");
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

        const event = JSON.parse(body);
        console.log("Razorpay Webhook Event:", event.event);

        if (event.event === "payment.captured" || event.event === "order.paid") {
            const paymentEntity = event.payload.payment.entity;
            const razorpayOrderId = paymentEntity.order_id;
            const razorpayPaymentId = paymentEntity.id;

            const { error } = await supabase
                .from("orders")
                .update({
                    status: "paid",
                    razorpay_payment_id: razorpayPaymentId,
                    // razorpay_signature is usually from frontend, but we can store webhook sig too if needed
                })
                .eq("razorpay_order_id", razorpayOrderId);

            if (error) {
                console.error("Webhook Supabase Update Error:", error);
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
        }

        if (event.event === "payment.failed") {
            const razorpayOrderId = event.payload.payment.entity.order_id;
            await supabase
                .from("orders")
                .update({ status: "failed" })
                .eq("razorpay_order_id", razorpayOrderId);
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Webhook API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
