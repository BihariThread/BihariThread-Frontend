import { NextResponse } from "next/server";
import { supabaseServer as supabase } from "@/lib/supabaseServer";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const userId = body.userId;

        // Try getting the order with Service role
        const { data: adminData } = await supabase.from('orders').select('*').limit(1);

        // create a temporary client that uses the ANON key, but we'll try to sign in
        // Wait, I can't sign in without password. 
        return NextResponse.json({
            adminOrders: adminData?.length,
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
