'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Registration, AdminStats, PaymentStatus } from '@/types/registration';
import { TICKET_TIERS } from '@/lib/utils/pricing';

const STATUS_META: Record<PaymentStatus, { label: string; color: string; bg: string }> = {
  confirmed: { label: 'Confirmado', color: '#16a34a', bg: '#dcfce7' },
  pending:   { label: 'Pendente',   color: '#d97706', bg: '#fef3c7' },
  failed:    { label: 'Falhou',     color: '#dc2626', bg: '#fee2e2' },
  cancelled: { label: 'Cancelado',  color: '#6b7280', bg: '#f3f4f6' },
};

const METHOD_META: Record<string, { label: string; icon: React.ReactNode }> = {
  pix: {
    label: 'PIX',
    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3.513 18.998L8 14.506l4.487 4.492 4.482-4.49 2.563 2.564"/><path d="M3.513 5.002L8 9.494l4.487-4.492 4.482 4.49 2.563-2.564"/></svg>,
  },
  credit_card: {
    label: 'Cartão',
    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  },
  boleto: {
    label: 'Boleto',
    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  },
};

function fmtCurrency(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(' ');
  const initials = (parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '');
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold font-body flex-shrink-0"
      style={{ background: 'rgba(30,58,95,0.08)', color: '#1e3a5f', border: '1px solid rgba(30,58,95,0.1)' }}
    >
      {initials.toUpperCase()}
    </div>
  );
}

const FILTERS = [
  { key: 'all',       label: 'Todos' },
  { key: 'confirmed', label: 'Confirmados' },
  { key: 'pending',   label: 'Pendentes'   },
  { key: 'failed',    label: 'Com problema'},
];

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true); else setRefreshing(true);
    try {
      const [sRes, rRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch(`/api/admin/registrations?status=${statusFilter}&page=${page}`),
      ]);
      if (sRes.status === 401 || rRes.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const [sData, rData] = await Promise.all([sRes.json(), rRes.json()]);
      setStats(sData);
      setRegistrations(rData.data ?? []);
      setTotal(rData.total ?? 0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter, page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const totalPages = Math.ceil(total / 50);

  return (
    <main className="min-h-screen" style={{ background: '#f0ede8' }}>

      {/* Gold top line */}
      <div className="h-[3px]" style={{ background: 'linear-gradient(90deg, transparent, #c9973a 30%, #e0b460 50%, #c9973a 70%, transparent)' }} />

      {/* ── Header ── */}
      <header
        className="sticky top-0 z-20 px-6 h-16 flex items-center justify-between"
        style={{
          background: 'rgba(255,255,255,0.95)',
          borderBottom: '1px solid rgba(30,58,95,0.08)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 1px 12px rgba(30,58,95,0.06)',
        }}
      >
        {/* Left */}
        <div className="flex items-center gap-3">
          <Image src="/IMG_9077.png" alt="Logo" width={30} height={30} style={{ objectFit: 'contain' }} />
          <div>
            <span className="font-body font-semibold text-sm tracking-[0.12em] uppercase" style={{ color: '#1e3a5f' }}>
              Essência da Adoração
            </span>
            <span className="hidden sm:inline ml-2 text-[10px] font-body font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(201,151,58,0.1)', color: '#c9973a', border: '1px solid rgba(201,151,58,0.2)' }}>
              Painel Admin
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            title="Atualizar"
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 hover:bg-gray-100 disabled:opacity-40"
            style={{ color: '#6b7280' }}
          >
            <svg className={refreshing ? 'animate-spin' : ''} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
          </button>

          <button
            onClick={() => window.open('/api/admin/export', '_blank')}
            className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-semibold font-body transition-all duration-150 hover:opacity-80"
            style={{ background: 'rgba(201,151,58,0.1)', color: '#c9973a', border: '1px solid rgba(201,151,58,0.25)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-semibold font-body transition-all duration-150 hover:opacity-80"
            style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        {/* ── Stats cards ── */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                label: 'Confirmados',
                value: stats.totalConfirmed,
                sub: fmtCurrency(stats.revenueConfirmedCents),
                subLabel: 'arrecadado',
                color: '#16a34a',
                accentBg: '#f0fdf4',
                iconBg: '#dcfce7',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                ),
              },
              {
                label: 'Pendentes',
                value: stats.totalPending,
                sub: fmtCurrency(stats.revenuePendingCents),
                subLabel: 'aguardando',
                color: '#d97706',
                accentBg: '#fffbeb',
                iconBg: '#fef3c7',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                ),
              },
              {
                label: 'Com Problema',
                value: stats.totalFailed,
                sub: 'cancelados / falhos',
                subLabel: '',
                color: '#dc2626',
                accentBg: '#fff5f5',
                iconBg: '#fee2e2',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                ),
              },
              {
                label: 'Total Arrecadado',
                value: fmtCurrency(stats.revenueConfirmedCents),
                sub: `${stats.totalConfirmed} pagamento${stats.totalConfirmed !== 1 ? 's' : ''} confirmado${stats.totalConfirmed !== 1 ? 's' : ''}`,
                subLabel: '',
                color: '#c9973a',
                accentBg: '#fffbf2',
                iconBg: 'rgba(201,151,58,0.12)',
                bigValue: true,
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                ),
              },
            ].map((card, i) => (
              <div
                key={i}
                className="rounded-2xl p-5 bg-white"
                style={{ boxShadow: '0 2px 12px rgba(30,58,95,0.06)', border: '1px solid rgba(30,58,95,0.06)' }}
              >
                {/* Top accent line */}
                <div className="h-0.5 -mx-5 -mt-5 mb-5 rounded-t-2xl"
                  style={{ background: `linear-gradient(to right, ${card.color}40, ${card.color}, ${card.color}40)` }} />

                <div className="flex items-start justify-between mb-3">
                  <p className="font-body text-xs font-medium" style={{ color: '#9ca3af' }}>{card.label}</p>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: card.iconBg, color: card.color }}>
                    {card.icon}
                  </div>
                </div>

                <p
                  className="font-display font-semibold leading-none mb-1.5"
                  style={{ fontSize: card.bigValue ? '1.35rem' : '2rem', color: card.color }}
                >
                  {card.value}
                </p>
                <p className="font-body text-xs" style={{ color: '#9ca3af' }}>{card.sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Filters ── */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => { setStatusFilter(f.key); setPage(1); }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold font-body transition-all duration-150"
                style={statusFilter === f.key
                  ? { background: '#1e3a5f', color: 'white', boxShadow: '0 2px 8px rgba(30,58,95,0.2)' }
                  : { background: 'white', color: '#6b7280', border: '1px solid #e5e7eb' }
                }
              >
                {f.label}
                {stats && (
                  <span
                    className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                    style={statusFilter === f.key
                      ? { background: 'rgba(255,255,255,0.2)', color: 'white' }
                      : { background: '#f3f4f6', color: '#9ca3af' }
                    }
                  >
                    {f.key === 'all' ? stats.totalConfirmed + stats.totalPending + stats.totalFailed
                      : f.key === 'confirmed' ? stats.totalConfirmed
                      : f.key === 'pending'   ? stats.totalPending
                      : stats.totalFailed}
                  </span>
                )}
              </button>
            ))}
          </div>
          <span className="font-body text-xs" style={{ color: '#9ca3af' }}>
            {total} inscrição{total !== 1 ? 'ões' : ''}
          </span>
        </div>

        {/* ── Table card ── */}
        <div
          className="rounded-2xl bg-white overflow-hidden"
          style={{ boxShadow: '0 4px 24px rgba(30,58,95,0.07)', border: '1px solid rgba(30,58,95,0.07)' }}
        >
          {loading ? (
            <div className="py-24 flex flex-col items-center gap-3">
              <svg className="animate-spin" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9973a" strokeWidth="2.5">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              <p className="font-body text-sm" style={{ color: '#9ca3af' }}>Carregando inscrições...</p>
            </div>
          ) : registrations.length === 0 ? (
            <div className="py-24 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: '#f3f4f6' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <p className="font-body text-sm" style={{ color: '#9ca3af' }}>Nenhuma inscrição encontrada.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: '#faf9f7', borderBottom: '1px solid #f0ede8' }}>
                    {['Inscrito', 'Contato', 'Ingresso', 'Valor', 'Método', 'Status', 'Data'].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left font-body font-semibold text-[10px] tracking-[0.15em] uppercase whitespace-nowrap"
                        style={{ color: '#9ca3af' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((r) => {
                    const sm = STATUS_META[r.status];
                    const mm = r.mp_payment_method ? METHOD_META[r.mp_payment_method] : null;
                    return (
                      <tr
                        key={r.id}
                        className="transition-colors duration-100 hover:bg-[#faf9f7]"
                        style={{ borderBottom: '1px solid #f3f4f6' }}
                      >
                        {/* Inscrito */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <Initials name={r.name} />
                            <div>
                              <p className="font-body font-medium text-sm leading-snug" style={{ color: '#1e3a5f' }}>{r.name}</p>
                              {r.participant_names.length > 1 && (
                                <p className="font-body text-[10px] mt-0.5" style={{ color: '#9ca3af' }}>
                                  +{r.participant_names.length - 1} participante{r.participant_names.length > 2 ? 's' : ''}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Contato */}
                        <td className="px-4 py-3">
                          <p className="font-body text-xs" style={{ color: '#4b5563' }}>{r.email}</p>
                          <p className="font-body text-[10px] mt-0.5" style={{ color: '#9ca3af' }}>{r.phone}</p>
                        </td>

                        {/* Ingresso */}
                        <td className="px-4 py-3">
                          <span className="font-body text-xs px-2.5 py-1 rounded-lg font-medium"
                            style={{ background: 'rgba(30,58,95,0.06)', color: '#1e3a5f' }}>
                            {TICKET_TIERS[r.ticket_type]?.label ?? r.ticket_type}
                          </span>
                        </td>

                        {/* Valor */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="font-display font-semibold text-sm" style={{ color: '#c9973a' }}>
                            {fmtCurrency(r.amount_cents)}
                          </span>
                        </td>

                        {/* Método */}
                        <td className="px-4 py-3">
                          {mm ? (
                            <span className="inline-flex items-center gap-1.5 font-body text-xs px-2.5 py-1 rounded-lg font-medium"
                              style={{ background: '#f3f4f6', color: '#6b7280' }}>
                              {mm.icon}
                              {mm.label}
                            </span>
                          ) : (
                            <span style={{ color: '#d1d5db' }}>—</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-body"
                            style={{ background: sm.bg, color: sm.color }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: sm.color }} />
                            {sm.label}
                          </span>
                        </td>

                        {/* Data */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="font-body text-xs" style={{ color: '#9ca3af' }}>
                            {fmtDate(r.created_at)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: '1px solid #f0ede8' }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-body transition-all duration-150 hover:bg-gray-50 disabled:opacity-40"
                style={{ color: '#4b5563', border: '1px solid #e5e7eb' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Anterior
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = totalPages <= 5 ? i + 1
                    : page <= 3 ? i + 1
                    : page >= totalPages - 2 ? totalPages - 4 + i
                    : page - 2 + i;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className="w-7 h-7 rounded-lg text-xs font-semibold font-body transition-all duration-150"
                      style={p === page
                        ? { background: '#1e3a5f', color: 'white' }
                        : { color: '#6b7280', border: '1px solid #e5e7eb' }
                      }
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-body transition-all duration-150 hover:bg-gray-50 disabled:opacity-40"
                style={{ color: '#4b5563', border: '1px solid #e5e7eb' }}
              >
                Próxima
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          )}
        </div>

        <p className="text-center font-body text-[11px] pb-2" style={{ color: '#9ca3af' }}>
          ADESSÊNCIA · Domingo Essencial · 5 de Abril de 2026
        </p>
      </div>
    </main>
  );
}
