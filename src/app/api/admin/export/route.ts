import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { registrationsToCSV } from '@/lib/utils/csv';
import { Registration } from '@/types/registration';

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
