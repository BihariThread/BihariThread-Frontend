import { NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabaseServer';

export async function GET() {
    try {
        const { error } = await supabase.from('orders').update({ status: 'not accepted' }).eq('id', '00000000-0000-0000-0000-000000000000');
        return NextResponse.json({ error });
    } catch (e: any) {
        return NextResponse.json({ error: e.message });
    }
}
