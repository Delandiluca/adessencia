import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

function isAuthenticated(request: NextRequest): boolean {
  const session = request.cookies.get('admin_session')?.value;
  return session === process.env.ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
    // 'failed' agrupa todos os estados problemáticos (rejected, failed, cancelled)
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
