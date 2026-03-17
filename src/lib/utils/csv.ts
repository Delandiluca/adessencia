import { Registration } from '@/types/registration';

export function registrationsToCSV(registrations: Registration[]): string {
  const headers = [
    'ID',
    'Nome',
    'Email',
    'Telefone',
    'Tipo de Ingresso',
    'Valor (R$)',
    'Status',
    'Método de Pagamento',
    'Participantes',
    'Data de Inscrição',
    'Data de Confirmação',
  ];

  const rows = registrations.map((r) => [
    r.id,
    r.name,
    r.email,
    r.phone,
    r.ticket_type,
    (r.amount_cents / 100).toFixed(2),
    r.status,
    r.mp_payment_method ?? '',
    r.participant_names.join(' | '),
    formatDate(r.created_at),
    r.confirmed_at ? formatDate(r.confirmed_at) : '',
  ]);

  const escape = (value: string) => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const lines = [headers, ...rows].map((row) =>
    row.map((cell) => escape(String(cell))).join(',')
  );

  return lines.join('\n');
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}
