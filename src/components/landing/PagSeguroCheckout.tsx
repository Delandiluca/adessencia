'use client';

import { useState, useEffect, useRef } from 'react';
import Script from 'next/script';

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

export type PaymentMethodType = 'PIX' | 'BOLETO' | 'CREDIT_CARD';

export interface PagSeguroPayload {
  payment_method: PaymentMethodType;
  cpf: string;
  // Credit card fields
  encrypted_card?: string;
  card_holder?: string;
  card_security_code?: string;
  installments?: number;
}

interface Props {
  onSubmit: (payload: PagSeguroPayload) => Promise<void>;
  loading: boolean;
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
    id: 'BOLETO',
    label: 'Boleto',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
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

export default function PagSeguroCheckout({ onSubmit, loading }: Props) {
  const [method, setMethod] = useState<PaymentMethodType>('PIX');
  const [cpf, setCpf] = useState('');
  const [sdkReady, setSdkReady] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);

  // Credit card state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardFlipped, setCardFlipped] = useState(false);

  const cpfDigits = cpf.replace(/\D/g, '');
  const cpfValid = cpfDigits.length === 11;

  const handleSubmit = async () => {
    setFieldError(null);

    if (!cpfValid) {
      setFieldError('Informe um CPF válido (11 dígitos).');
      return;
    }

    if (method === 'CREDIT_CARD') {
      if (!sdkReady || !window.PagSeguro) {
        setFieldError('SDK do PagSeguro ainda carregando. Aguarde um momento.');
        return;
      }
      if (!cardNumber || !cardHolder || !cardExpiry || !cardCvv) {
        setFieldError('Preencha todos os dados do cartão.');
        return;
      }

      const [expMonth, expYear] = cardExpiry.split('/');
      const fullYear = expYear?.length === 2 ? `20${expYear}` : expYear;

      const result = window.PagSeguro.encryptCard({
        publicKey: process.env.NEXT_PUBLIC_PAGSEGURO_PUBLIC_KEY ?? '',
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

      await onSubmit({
        payment_method: 'CREDIT_CARD',
        cpf,
        encrypted_card: result.encryptedCard,
        card_holder: cardHolder.toUpperCase(),
        card_security_code: cardCvv,
        installments: 1,
      });
    } else {
      await onSubmit({ payment_method: method, cpf });
    }
  };

  return (
    <>
      {/* PagSeguro.js SDK */}
      <Script
        src="https://assets.pagseguro.com.br/checkout-sdk/npm/release/123.1.6/browser/pagseguro.min.js"
        onLoad={() => setSdkReady(true)}
        onError={() => console.warn('PagSeguro.js falhou ao carregar.')}
      />

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
              onClick={() => { setMethod(tab.id); setFieldError(null); }}
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

        {/* ── Boleto info ── */}
        {method === 'BOLETO' && (
          <div
            className="rounded-2xl p-4 flex items-start gap-3"
            style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <div>
              <p className="font-body font-semibold text-sm" style={{ color: '#1e40af' }}>Boleto bancário</p>
              <p className="font-body text-xs mt-0.5 leading-relaxed" style={{ color: '#3b82f6' }}>
                Vencimento: <strong>3 de Abril de 2026</strong>. Compensação em até 3 dias úteis.
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
                  onFocus={() => setCardFlipped(true)}
                  onBlur={() => setCardFlipped(false)}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                />
              </div>
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
          style={{ background: 'linear-gradient(135deg, #c9973a, #e0b460)' }}
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
          ) : method === 'BOLETO' ? (
            'Gerar Boleto →'
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

      </div>
    </>
  );
}
