import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
// Autenticação centralizada no middleware — /api/admin/* já está protegido

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const limit = 50;
  const offset = (page - 1) * limit;

  const supabase = createServerSupabase();
  let query = supabase
    .from('registrations')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status && status !== 'all') {
    if (status === 'failed') {
      query = query.in('status', ['rejected', 'failed', 'cancelled']);
    } else {
      query = query.eq('status', status);
    }
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }

  return NextResponse.json({ data, total: count ?? 0, page, limit });
}
