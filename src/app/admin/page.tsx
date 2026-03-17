'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Registration, AdminStats, PaymentStatus } from '@/types/registration';
import { TICKET_TIERS } from '@/lib/utils/pricing';

const STATUS_LABELS: Record<PaymentStatus, { label: string; color: string; bg: string }> = {
  confirmed: { label: 'Confirmado', color: '#16a34a', bg: '#dcfce7' },
  pending:   { label: 'Pendente',   color: '#d97706', bg: '#fef3c7' },
  failed:    { label: 'Falhou',     color: '#dc2626', bg: '#fee2e2' },
  cancelled: { label: 'Cancelado',  color: '#6b7280', bg: '#f3f4f6' },
};

const METHOD_LABELS: Record<string, string> = {
  pix: 'PIX',
  credit_card: 'Cartão',
  boleto: 'Boleto',
};

function formatCurrency(cents: number) {
  return `R$ ${(cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, regsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch(`/api/admin/registrations?status=${statusFilter}&page=${page}`),
      ]);

      // Middleware já garante autenticação — se chegar 401 aqui,
      // a sessão expirou no meio da sessão: recarrega a página
      if (statsRes.status === 401 || regsRes.status === 401) {
        window.location.href = '/admin/login';
        return;
      }

      const [statsData, regsData] = await Promise.all([statsRes.json(), regsRes.json()]);
      setStats(statsData);
      setRegistrations(regsData.data ?? []);
      setTotal(regsData.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const handleExport = () => {
    window.open('/api/admin/export', '_blank');
  };

  return (
    <main className="min-h-screen" style={{ background: '#f0ede8' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #1e3a5f, #0f1f35)', boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}
      >
        <div>
          <p className="font-display text-white text-xl font-light tracking-widest">ADESSÊNCIA</p>
          <p className="font-body text-white/40 text-xs">Painel de Inscrições — Retiro 2026</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold font-body transition-all duration-200 hover:opacity-80"
            style={{ background: 'rgba(201,151,58,0.2)', color: '#e0b460', border: '1px solid rgba(201,151,58,0.3)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Exportar CSV
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg text-xs font-semibold font-body text-white/50 hover:text-white/80 transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: 'Confirmados',
                value: stats.totalConfirmed,
                sub: formatCurrency(stats.revenueConfirmedCents),
                color: '#16a34a',
                bg: '#dcfce7',
              },
              {
                label: 'Pendentes',
                value: stats.totalPending,
                sub: formatCurrency(stats.revenuePendingCents),
                color: '#d97706',
                bg: '#fef3c7',
              },
              {
                label: 'Com problemas',
                value: stats.totalFailed,
                sub: 'cancelados/falhos',
                color: '#dc2626',
                bg: '#fee2e2',
              },
              {
                label: 'Total arrecadado',
                value: formatCurrency(stats.revenueConfirmedCents),
                sub: 'pagamentos confirmados',
                color: '#1e3a5f',
                bg: '#e0f2fe',
                bigText: true,
              },
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-2xl p-5 bg-white"
                style={{ boxShadow: '0 2px 8px rgba(30,58,95,0.08)' }}
              >
                <p className="font-body text-xs text-gray-500 mb-1">{s.label}</p>
                <p
                  className={`font-display font-semibold leading-tight ${s.bigText ? 'text-xl' : 'text-3xl'}`}
                  style={{ color: s.color }}
                >
                  {s.value}
                </p>
                <p className="font-body text-xs text-gray-400 mt-1">{s.sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          {['all', 'confirmed', 'pending', 'failed'].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className="px-4 py-1.5 rounded-full text-xs font-semibold font-body transition-all duration-200"
              style={statusFilter === s
                ? { background: '#1e3a5f', color: 'white' }
                : { background: 'white', color: '#6b7280', border: '1px solid #e5e7eb' }
              }
            >
              {s === 'all' ? 'Todos' : STATUS_LABELS[s as PaymentStatus]?.label ?? s}
            </button>
          ))}
          <span className="ml-auto font-body text-xs text-gray-400">{total} inscrições</span>
        </div>

        {/* Table */}
        <div className="rounded-2xl bg-white overflow-hidden" style={{ boxShadow: '0 4px 16px rgba(30,58,95,0.08)' }}>
          {loading ? (
            <div className="py-20 text-center font-body text-gray-400 text-sm">Carregando...</div>
          ) : registrations.length === 0 ? (
            <div className="py-20 text-center font-body text-gray-400 text-sm">
              Nenhuma inscrição encontrada.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: '#f8f7f5' }}>
                    {['Nome', 'Contato', 'Ingresso', 'Valor', 'Método', 'Status', 'Data'].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left font-body font-semibold text-xs text-gray-500 tracking-wide uppercase whitespace-nowrap"
                        style={{ borderBottom: '1px solid #e5e7eb' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((r, i) => {
                    const statusInfo = STATUS_LABELS[r.status];
                    return (
                      <tr
                        key={r.id}
                        style={{
                          borderBottom: '1px solid #f3f4f6',
                          background: i % 2 === 0 ? 'white' : '#faf9f7',
                        }}
                      >
                        <td className="px-4 py-3">
                          <p className="font-body font-medium text-navy text-sm">{r.name}</p>
                          <p className="font-body text-xs text-gray-400 mt-0.5">
                            {r.participant_names.length > 1
                              ? `+${r.participant_names.length - 1} participante${r.participant_names.length > 2 ? 's' : ''}`
                              : ''}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-body text-xs text-gray-600">{r.email}</p>
                          <p className="font-body text-xs text-gray-400">{r.phone}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-body text-xs text-gray-700">
                            {TICKET_TIERS[r.ticket_type]?.label ?? r.ticket_type}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-body font-semibold text-navy text-sm whitespace-nowrap">
                          {formatCurrency(r.amount_cents)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-body text-xs text-gray-500">
                            {r.mp_payment_method ? (METHOD_LABELS[r.mp_payment_method] ?? r.mp_payment_method) : '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold font-body"
                            style={{ background: statusInfo.bg, color: statusInfo.color }}
                          >
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-body text-xs text-gray-400 whitespace-nowrap">
                          {formatDate(r.created_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {total > 50 && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-xs font-body font-semibold disabled:opacity-40 transition-all"
                style={{ background: '#f0ede8', color: '#4b5563' }}
              >
                ← Anterior
              </button>
              <span className="font-body text-xs text-gray-400">
                Página {page} de {Math.ceil(total / 50)}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(total / 50)}
                className="px-3 py-1.5 rounded-lg text-xs font-body font-semibold disabled:opacity-40 transition-all"
                style={{ background: '#f0ede8', color: '#4b5563' }}
              >
                Próxima →
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
