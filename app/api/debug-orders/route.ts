import { NextResponse } from "next/server";
import { supabaseServer as supabase } from "@/lib/supabaseServer";

export async function GET() {
    try {
        const { data, error } = await supabase.from('orders').select('*').limit(1);
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({
            columns: data && data.length > 0 ? Object.keys(data[0]) : [],
            data
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
