'use client';

import { useState } from 'react';

declare global {
  interface Window {
    PagSeguro?: {
      encryptCard: (params: {
        publicKey: string;
        holder: string;
        number: string;
        expMonth: string;
        expYear: string;
        securityCode: string;
      }) => { encryptedCard?: string; hasErrors: boolean; errors?: Record<string, unknown> };
    };
  }
}

export type PaymentMethodType = 'PIX' | 'CREDIT_CARD';

export interface PagSeguroPayload {
  payment_method: PaymentMethodType;
  cpf: string;
  // Credit card fields
  encrypted_card?: string;
  card_holder?: string;
  // card_security_code removido: CVV está embutido no encrypted_card (PCI DSS)
  installments?: number;
}

// Parcelamento sem juros disponível a partir deste valor (centavos)
const INSTALLMENT_MIN_CENTS = 12000; // R$ 120,00
const MAX_INSTALLMENTS = 4;

interface Props {
  onSubmit: (payload: PagSeguroPayload) => Promise<void>;
  onReset?: () => void;
  loading: boolean;
  totalCents: number;
}

function formatCpf(raw: string) {
  const d = raw.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function formatCardNumber(raw: string) {
  return raw.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(raw: string) {
  const d = raw.replace(/\D/g, '').slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}

const METHOD_TABS: { id: PaymentMethodType; label: string; icon: React.ReactNode }[] = [
  {
    id: 'PIX',
    label: 'PIX',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.513 18.998L8 14.506l4.487 4.492 4.482-4.49 2.563 2.564" />
        <path d="M3.513 5.002L8 9.494l4.487-4.492 4.482 4.49 2.563-2.564" />
      </svg>
    ),
  },
  {
    id: 'CREDIT_CARD',
    label: 'Cartão',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
];

/** Aguarda o SDK do PagSeguro estar disponível (até maxMs) */
function waitForPagSeguro(maxMs = 8000): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.PagSeguro) return resolve(true);
    const start = Date.now();
    const interval = setInterval(() => {
      if (window.PagSeguro) {
        clearInterval(interval);
        resolve(true);
      } else if (Date.now() - start > maxMs) {
        clearInterval(interval);
        resolve(false);
      }
    }, 200);
  });
}

export default function PagSeguroCheckout({ onSubmit, onReset, loading, totalCents }: Props) {
  const [method, setMethod] = useState<PaymentMethodType>('PIX');
  const [cpf, setCpf] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);

  // Credit card state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedInstallments, setSelectedInstallments] = useState(1);

  const allowInstallments = method === 'CREDIT_CARD' && totalCents >= INSTALLMENT_MIN_CENTS;
  const installmentOptions = allowInstallments
    ? Array.from({ length: MAX_INSTALLMENTS }, (_, i) => i + 1).map((n) => ({
        n,
        amountCents: Math.ceil(totalCents / n),
      }))
    : [];

  const cpfDigits = cpf.replace(/\D/g, '');
  const cpfValid = cpfDigits.length === 11;

  const handleSubmit = async () => {
    setFieldError(null);

    if (!cpfValid) {
      setFieldError('Informe um CPF válido (11 dígitos).');
      return;
    }

    if (method === 'CREDIT_CARD') {
      // Aguarda silenciosamente o SDK (já carregado em background desde o layout)
      const available = await waitForPagSeguro(8000);
      if (!available || !window.PagSeguro) {
        setFieldError('Erro de conexão. Verifique sua internet e tente novamente.');
        return;
      }
      if (!cardNumber || !cardHolder || !cardExpiry || !cardCvv) {
        setFieldError('Preencha todos os dados do cartão.');
        return;
      }

      const [expMonth, expYear] = cardExpiry.split('/');
      const fullYear = expYear?.length === 2 ? `20${expYear}` : expYear;

      // Busca a chave pública de produção dinamicamente da API do PagBank
      let publicKey = '';
      try {
        const pkRes = await fetch('/api/pagseguro-public-key');
        const pkData = await pkRes.json() as { public_key?: string };
        publicKey = pkData.public_key ?? '';
      } catch {
        setFieldError('Erro ao conectar com o sistema de pagamento. Tente novamente.');
        return;
      }
      if (!publicKey) {
        setFieldError('Erro ao obter chave de segurança. Tente novamente.');
        return;
      }

      const result = window.PagSeguro.encryptCard({
        publicKey,
        holder: cardHolder.toUpperCase(),
        number: cardNumber.replace(/\s/g, ''),
        expMonth: expMonth ?? '',
        expYear: fullYear ?? '',
        securityCode: cardCvv,
      });

      if (result.hasErrors || !result.encryptedCard) {
        setFieldError('Dados do cartão inválidos. Verifique e tente novamente.');
        return;
      }

      // card_security_code NÃO é enviado ao servidor — o CVV já está embutido
      // no encrypted_card gerado pelo SDK PagSeguro (PCI DSS compliance)
      await onSubmit({
        payment_method: 'CREDIT_CARD',
        cpf,
        encrypted_card: result.encryptedCard,
        card_holder: cardHolder.toUpperCase(),
        installments: allowInstallments ? selectedInstallments : 1,
      });
    } else {
      await onSubmit({ payment_method: method, cpf });
    }
  };

  return (
    <div className="space-y-5">

        {/* ── Tabs de método ── */}
        <div
          className="flex gap-1 p-1 rounded-2xl"
          style={{ background: '#f3f4f6' }}
        >
          {METHOD_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => { setMethod(tab.id); setFieldError(null); onReset?.(); }}
              className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-semibold font-body transition-all duration-200"
              style={
                method === tab.id
                  ? { background: 'white', color: '#1e3a5f', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }
                  : { background: 'transparent', color: '#9ca3af' }
              }
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── CPF (todos os métodos) ── */}
        <div>
          <label className="block text-xs font-semibold font-body mb-1.5 tracking-wide uppercase" style={{ color: '#6b7280' }}>
            CPF do Titular *
          </label>
          <input
            className="input-field"
            type="text"
            inputMode="numeric"
            placeholder="000.000.000-00"
            value={cpf}
            onChange={(e) => setCpf(formatCpf(e.target.value))}
          />
        </div>

        {/* ── PIX info ── */}
        {method === 'PIX' && (
          <div
            className="rounded-2xl p-4 flex items-start gap-3"
            style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <p className="font-body font-semibold text-sm" style={{ color: '#065f46' }}>Pagamento instantâneo</p>
              <p className="font-body text-xs mt-0.5 leading-relaxed" style={{ color: '#059669' }}>
                QR Code gerado na hora. Pague pelo app do banco e a confirmação é automática em segundos.
              </p>
            </div>
          </div>
        )}

        {/* ── Cartão de crédito ── */}
        {method === 'CREDIT_CARD' && (
          <div className="space-y-3">
            {/* Card preview */}
            <div
              className="relative w-full h-40 rounded-2xl p-5 overflow-hidden select-none"
              style={{
                background: 'linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 60%, #1e3a5f 100%)',
                boxShadow: '0 8px 32px rgba(30,58,95,0.3)',
              }}
            >
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full -translate-y-1/2 translate-x-1/4 opacity-10"
                style={{ background: 'radial-gradient(circle, white, transparent)' }} />
              <p className="font-mono text-white/50 text-xs tracking-widest mb-auto">ADESSÊNCIA</p>
              <p className="font-mono text-white text-lg tracking-[0.2em] mt-4">
                {cardNumber || '•••• •••• •••• ••••'}
              </p>
              <div className="flex justify-between items-end mt-2">
                <div>
                  <p className="font-body text-white/50 text-[10px] uppercase tracking-wider">Titular</p>
                  <p className="font-body text-white text-xs font-semibold uppercase truncate max-w-[160px]">
                    {cardHolder || 'SEU NOME'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-body text-white/50 text-[10px] uppercase tracking-wider">Validade</p>
                  <p className="font-body text-white text-xs font-semibold">
                    {cardExpiry || '••/••'}
                  </p>
                </div>
              </div>
            </div>

            {/* Card fields */}
            <div>
              <label className="block text-xs font-semibold font-body mb-1.5 tracking-wide uppercase" style={{ color: '#6b7280' }}>Número do Cartão</label>
              <input
                className="input-field font-mono tracking-widest"
                type="text"
                inputMode="numeric"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold font-body mb-1.5 tracking-wide uppercase" style={{ color: '#6b7280' }}>Nome no Cartão</label>
              <input
                className="input-field uppercase"
                type="text"
                placeholder="NOME COMO IMPRESSO"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold font-body mb-1.5 tracking-wide uppercase" style={{ color: '#6b7280' }}>Validade</label>
                <input
                  className="input-field font-mono"
                  type="text"
                  inputMode="numeric"
                  placeholder="MM/AA"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold font-body mb-1.5 tracking-wide uppercase" style={{ color: '#6b7280' }}>CVV</label>
                <input
                  className="input-field font-mono"
                  type="text"
                  inputMode="numeric"
                  placeholder="•••"
                  maxLength={4}
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Parcelamento (cartão, acima de R$120) ── */}
        {allowInstallments && (
          <div>
            <label className="block text-xs font-semibold font-body mb-2 tracking-wide uppercase" style={{ color: '#6b7280' }}>
              Parcelamento (sem juros)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {installmentOptions.map(({ n, amountCents }) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setSelectedInstallments(n)}
                  className="rounded-xl px-3 py-2.5 text-sm font-body transition-all duration-150 text-left"
                  style={
                    selectedInstallments === n
                      ? { background: '#1e3a5f', color: 'white', border: '2px solid #1e3a5f' }
                      : { background: 'white', color: '#4b5563', border: '2px solid #e5e7eb' }
                  }
                >
                  <span className="font-semibold">{n}x </span>
                  <span>R$ {(amountCents / 100).toFixed(2).replace('.', ',')}</span>
                  {n === 1 && <span className="block text-[10px] opacity-70">à vista</span>}
                  {n > 1 && <span className="block text-[10px] opacity-70">sem juros</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Erro de campo ── */}
        {fieldError && (
          <p className="text-xs font-body rounded-lg px-3 py-2 flex items-center gap-2"
            style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {fieldError}
          </p>
        )}

        {/* ── Botão de ação ── */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-xl py-4 text-sm font-semibold font-body text-white transition-all duration-200 hover:opacity-90 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #C8860A, #D4991A)' }}
        >
          {loading ? (
            <>
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Processando...
            </>
          ) : method === 'PIX' ? (
            'Gerar QR Code PIX →'
          ) : allowInstallments && selectedInstallments > 1 ? (
            `Pagar ${selectedInstallments}x de R$ ${(Math.ceil(totalCents / selectedInstallments) / 100).toFixed(2).replace('.', ',')} →`
          ) : (
            'Pagar com Cartão →'
          )}
        </button>

        {/* Trust badge */}
        <div className="flex items-center justify-center gap-2 text-xs font-body" style={{ color: '#9ca3af' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Pagamento 100% seguro via PagSeguro
        </div>

        {/* Aviso tesouraria */}
        <div
          className="rounded-xl px-4 py-3 flex items-start gap-2.5"
          style={{ background: 'rgba(201,151,58,0.06)', border: '1px solid rgba(201,151,58,0.18)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8860A" strokeWidth="2" className="flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-xs font-body leading-relaxed" style={{ color: '#92681a' }}>
            Precisa de outra forma de pagamento?{' '}
            <strong>Entre em contato com a tesouraria da AD Essência</strong> antes do evento.
          </p>
        </div>

      </div>
  );
}
