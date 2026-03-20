import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const registrationId = request.nextUrl.searchParams.get('id');
  if (!registrationId) {
    return NextResponse.json({ error: 'id obrigatório.' }, { status: 400 });
  }

  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from('registrations')
    .select('id, status, mp_status')
    .eq('id', registrationId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Registro não encontrado.' }, { status: 404 });
  }

  return NextResponse.json({ id: data.id, status: data.status, mp_status: data.mp_status });
}
