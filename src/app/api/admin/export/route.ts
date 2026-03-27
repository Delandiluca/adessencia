import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { registrationsToCSV } from '@/lib/utils/csv';
import { Registration } from '@/types/registration';
// Autenticação centralizada no middleware — /api/admin/* já está protegido

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }

  const csv = registrationsToCSV((data ?? []) as Registration[]);

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="inscricoes-adessencia-2026.csv"',
    },
  });
}
