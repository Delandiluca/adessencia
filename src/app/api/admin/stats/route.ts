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

  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from('registrations')
    .select('status, amount_cents');

  if (error) {
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }

  const stats = {
    totalConfirmed: 0,
    totalPending: 0,
    totalFailed: 0,
    revenueConfirmedCents: 0,
    revenuePendingCents: 0,
  };

  for (const row of data ?? []) {
    if (row.status === 'confirmed') {
      stats.totalConfirmed++;
      stats.revenueConfirmedCents += row.amount_cents;
    } else if (row.status === 'pending') {
      stats.totalPending++;
      stats.revenuePendingCents += row.amount_cents;
    } else {
      stats.totalFailed++;
    }
  }

  return NextResponse.json(stats);
}
