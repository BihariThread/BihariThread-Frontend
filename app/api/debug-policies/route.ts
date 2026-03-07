import { NextResponse } from "next/server";
import { supabaseServer as supabase } from "@/lib/supabaseServer";

export async function POST() {
    try {
        const { data: policies, error: polErr } = await supabase
            .from('pg_policies')
            .select('*')
            .in('tablename', ['orders', 'order_items']);

        return NextResponse.json({ policies, polErr });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
