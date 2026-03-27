import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createServerSupabase();

  // Queries separadas por status — mais confiável do que iterar todas as linhas
  const [confirmedRes, pendingRes, failedRes] = await Promise.all([
    supabase
      .from('registrations')
      .select('amount_cents')
      .eq('status', 'confirmed'),
    supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true })
      .in('status', ['rejected', 'failed', 'cancelled']),
  ]);

  if (confirmedRes.error || pendingRes.error || failedRes.error) {
    console.error('[admin/stats]', confirmedRes.error ?? pendingRes.error ?? failedRes.error);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }

  const confirmedRows = confirmedRes.data ?? [];
  const revenueConfirmedCents = confirmedRows.reduce(
    (sum, r) => sum + (r.amount_cents ?? 0),
    0
  );

  // Pendentes: busca valor total também
  const pendingAmtRes = await supabase
    .from('registrations')
    .select('amount_cents')
    .eq('status', 'pending');

  const revenuePendingCents = (pendingAmtRes.data ?? []).reduce(
    (sum, r) => sum + (r.amount_cents ?? 0),
    0
  );

  return NextResponse.json({
    totalConfirmed:        confirmedRows.length,
    totalPending:          pendingRes.count ?? 0,
    totalFailed:           failedRes.count ?? 0,
    revenueConfirmedCents,
    revenuePendingCents,
  });
}
