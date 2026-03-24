'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import QRCode from 'react-qr-code';
import { TicketType } from '@/types/registration';
import { TICKET_TIERS, calculateTotalCents, getPriceInReais, formatReais, EXTRA_ADULT_PRICE_CENTS } from '@/lib/utils/pricing';
import { CheckoutResponse } from '@/types/registration';

const PagSeguroCheckout = dynamic(() => import('./PagSeguroCheckout'), { ssr: false });
import type { PagSeguroPayload } from './PagSeguroCheckout';

interface RegistrationFormProps {
  selectedTier: TicketType | null;
  onTierChange: (tier: TicketType) => void;
}

type Step = 1 | 2 | 3;

interface FormData {
  name: string;
  email: string;
  phone: string;
  participant_names: string[];
  children_count: number;
}

// ─── Step Indicator ─────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: Step }) {
  const steps = [
    { num: 1, label: 'Dados', labelFull: 'Dados Pessoais' },
    { num: 2, label: 'Participantes', labelFull: 'Participantes' },
    { num: 3, label: 'Pagamento', labelFull: 'Pagamento' },
  ];

  return (
    <div className="flex items-center justify-center mb-8 w-full px-2">
      {steps.map((s, i) => (
        <div key={s.num} className="flex items-center">
          <div className="flex flex-col items-center" style={{ minWidth: 48 }}>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold font-body transition-all duration-300 flex-shrink-0"
              style={
                current === s.num
                  ? { background: '#c9973a', color: 'white', boxShadow: '0 0 0 4px rgba(201,151,58,0.2)' }
                  : current > s.num
                  ? { background: '#c9973a', color: 'white' }
                  : { background: '#f3f4f6', color: '#9ca3af' }
              }
            >
              {current > s.num ? (
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                  <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : s.num}
            </div>
            <span
              className="text-[9px] font-body mt-1 text-center leading-tight"
              style={{
                color: current === s.num ? '#c9973a' : '#9ca3af',
                fontWeight: current === s.num ? 600 : 400,
                maxWidth: 56,
              }}
            >
              {s.labelFull}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className="h-[1px] mb-5 mx-1 flex-1 transition-all duration-500"
              style={{ background: current > s.num ? '#c9973a' : '#e5e7eb', minWidth: 16, maxWidth: 48 }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Counter Widget ──────────────────────────────────────────────────────────
function Counter({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-150 disabled:opacity-30"
        style={{ background: 'rgba(30,58,95,0.08)', color: '#1e3a5f' }}
      >
        −
      </button>
      <span className="font-display text-2xl font-light text-navy w-6 text-center">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-150 disabled:opacity-30"
        style={{ background: 'rgba(30,58,95,0.08)', color: '#1e3a5f' }}
      >
        +
      </button>
    </div>
  );
}

// ─── Tier Badge (steps 1 & 3) ────────────────────────────────────────────────
function TierBadge({ tier, totalCents }: { tier: TicketType; totalCents: number }) {
  const t = TICKET_TIERS[tier];
  return (
    <div
      className="flex items-center justify-between rounded-xl px-4 py-3 mb-6"
      style={{ background: 'rgba(201,151,58,0.06)', border: '1px solid rgba(201,151,58,0.2)' }}
    >
      <div>
        <p className="text-xs font-body mb-0.5" style={{ color: '#9ca3af' }}>Ingresso selecionado</p>
        <p className="font-display font-semibold text-navy text-lg leading-none">{t.label}</p>
        <p className="text-xs font-body mt-0.5" style={{ color: '#9ca3af' }}>{t.description}</p>
      </div>
      <div className="text-right">
        <span className="font-display text-2xl font-light" style={{ color: '#c9973a' }}>{formatReais(totalCents)}</span>
      </div>
    </div>
  );
}

// ─── PIX Result ───────────────────────────────────────────────────────────────
function PixResult({
  pixQrCode,
  pixQrCodeBase64,
  registrationId,
}: {
  pixQrCode: string;
  pixQrCodeBase64?: string;
  registrationId?: string;
}) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [seconds, setSeconds] = useState(30 * 60);
  const [checking, setChecking] = useState(false);
  const [checkMsg, setCheckMsg] = useState<string | null>(null);

  // Contagem regressiva
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  // Polling automático: a cada 8s consulta apenas o DB; a cada 40s sincroniza com o PagBank
  useEffect(() => {
    if (!registrationId) return;
    let tick = 0;
    const interval = setInterval(async () => {
      try {
        tick += 1;
        // A cada 5 ticks (40s) faz sync com PagBank; nos demais só lê o DB
        const sync = tick % 5 === 0;
        const res = await fetch(`/api/checkout/status?id=${registrationId}${sync ? '&sync=true' : ''}`);
        const data = await res.json();
        if (data.status === 'confirmed') {
          clearInterval(interval);
          router.push('/obrigado');
        }
      } catch {
        // silencioso
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [registrationId, router]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  const copy = async () => {
    await navigator.clipboard.writeText(pixQrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const checkNow = async () => {
    if (!registrationId) return;
    setChecking(true);
    setCheckMsg(null);
    try {
      // Sempre consulta o PagBank diretamente ao clicar
      const res = await fetch(`/api/checkout/status?id=${registrationId}&sync=true`);
      const data = await res.json();
      if (data.status === 'confirmed') {
        router.push('/obrigado');
      } else {
        setCheckMsg('Pagamento ainda não identificado. Se você já pagou, aguarde alguns segundos e tente novamente.');
        setTimeout(() => setCheckMsg(null), 6000);
      }
    } catch {
      setCheckMsg('Erro ao verificar. Verifique sua conexão e tente novamente.');
      setTimeout(() => setCheckMsg(null), 4000);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-center">
      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>
      <h3 className="font-display text-xl font-semibold text-navy mb-1">PIX gerado!</h3>
      <p className="text-sm font-body text-gray-600 mb-4">
        Escaneie o QR Code ou copie o código. Expira em:
      </p>
      <div
        className="inline-flex items-center gap-1 px-3 py-1 rounded-full mb-5 font-mono text-sm font-semibold"
        style={{ background: seconds < 120 ? '#fee2e2' : '#f0fdf4', color: seconds < 120 ? '#dc2626' : '#16a34a' }}
      >
        ⏱ {mm}:{ss}
      </div>
      <div className="flex justify-center mb-4 p-4 bg-white rounded-xl border border-gray-200 w-fit mx-auto">
        {pixQrCodeBase64 ? (
          /* Imagem oficial gerada pelo PagBank — buscada server-side com autenticação */
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`data:image/png;base64,${pixQrCodeBase64}`}
            alt="QR Code PIX"
            width={176}
            height={176}
          />
        ) : (
          /* Fallback local — mesmo payload, mesmo CRC32, mesmo destino */
          <QRCode value={pixQrCode} size={176} />
        )}
      </div>
      <button
        onClick={copy}
        className="w-full rounded-xl py-3 text-sm font-semibold font-body transition-all duration-200 flex items-center justify-center gap-2 mb-3"
        style={{ background: copied ? '#10b981' : '#1e3a5f', color: 'white' }}
      >
        {copied ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
            Copiado!
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
            Copiar código PIX
          </>
        )}
      </button>
      {registrationId && (
        <>
          <button
            onClick={checkNow}
            disabled={checking}
            className="w-full rounded-xl py-2.5 text-sm font-semibold font-body transition-all duration-200 flex items-center justify-center gap-2"
            style={{ background: 'rgba(16,185,129,0.1)', color: '#059669', border: '1px solid rgba(16,185,129,0.3)' }}
          >
            {checking ? (
              <>
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Verificando no PagBank...
              </>
            ) : '✓ Já paguei — verificar confirmação'}
          </button>
          {checkMsg && (
            <p className="text-xs font-body text-center mt-2 px-2 py-2 rounded-lg"
              style={{ background: '#fef9c3', color: '#854d0e', border: '1px solid #fde68a' }}>
              {checkMsg}
            </p>
          )}
        </>
      )}
      <p className="text-xs font-body text-gray-500 mt-4">
        A confirmação é automática. Você receberá um e-mail após o pagamento.
      </p>
    </div>
  );
}


// ─── Main Form ────────────────────────────────────────────────────────────────
export default function RegistrationForm({ selectedTier, onTierChange }: RegistrationFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentResult, setPaymentResult] = useState<CheckoutResponse | null>(null);

  // Rola para a mensagem de erro quando ela aparece
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [error]);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    participant_names: [''],
    children_count: 0,
  });

  const tier = selectedTier ?? 'individual';
  const baseMaxAdults = TICKET_TIERS[tier].maxParticipants;

  // Adultos extras só fazem sentido para o plano familia
  const extraAdults = tier === 'familia'
    ? Math.max(0, formData.participant_names.length - baseMaxAdults)
    : 0;

  const totalAdultSlots = baseMaxAdults + extraAdults;
  const totalCents = calculateTotalCents(tier, extraAdults);

  // Quando o ingresso muda: volta ao passo 1 e zera participantes/crianças
  const prevTierRef = useRef<TicketType | null>(null);
  useEffect(() => {
    if (prevTierRef.current !== null && prevTierRef.current !== tier) {
      setStep(1);
      setError(null);
      setPaymentResult(null);
      setFormData((prev) => ({
        ...prev,
        participant_names: Array.from({ length: TICKET_TIERS[tier].maxParticipants }, () => ''),
        children_count: 0,
      }));
    }
    prevTierRef.current = tier;
  }, [tier]);

  // Pré-preenche o primeiro campo com o nome do responsável ao entrar no passo 2
  const prevStepRef = useRef<Step>(1);
  useEffect(() => {
    if (step === 2 && prevStepRef.current === 1 && formData.name) {
      setFormData((prev) => {
        const names = [...prev.participant_names];
        if (!names[0]) names[0] = formData.name;
        return { ...prev, participant_names: names };
      });
    }
    prevStepRef.current = step;
  }, [step, formData.name]);

  const scrollToTop = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const validateStep1 = (): boolean => {
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setError('Por favor, informe seu nome completo.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Por favor, informe um e-mail válido.');
      return false;
    }
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 10) {
      setError('Por favor, informe um WhatsApp válido.');
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    const filled = formData.participant_names.filter((n) => n.trim().length >= 2);
    if (filled.length === 0) {
      setError('Informe pelo menos um nome de participante.');
      return false;
    }
    return true;
  };

  const goToStep = (s: Step) => {
    setError(null);
    setStep(s);
    setTimeout(scrollToTop, 50);
  };

  const handlePaymentSubmit = async (psPayload: PagSeguroPayload) => {
    setLoading(true);
    setError(null);
    try {
      const currentExtraAdults = tier === 'familia'
        ? Math.max(0, formData.participant_names.length - TICKET_TIERS.familia.maxParticipants)
        : 0;

      const payload = {
        ...psPayload,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        ticket_type: tier,
        participant_names: formData.participant_names.filter((n) => n.trim().length > 0),
        children_count: formData.children_count,
        transaction_amount: getPriceInReais(tier, currentExtraAdults),
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result: CheckoutResponse = await res.json();

      if (!res.ok) throw new Error(result.error ?? 'Erro ao processar pagamento.');

      if (result.redirectTo) {
        router.push(result.redirectTo);
        return;
      }

      setPaymentResult(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro inesperado. Tente novamente.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={formRef} className="max-w-lg mx-auto px-4">
      <div
        className="rounded-2xl p-6 md:p-8 bg-white"
        style={{
          border: '1px solid #e5e7eb',
          boxShadow: '0 8px 40px rgba(30,58,95,0.08)',
        }}
      >
        <StepIndicator current={step} />

        {(step === 1 || step === 3) && selectedTier && (
          <TierBadge tier={selectedTier} totalCents={totalCents} />
        )}

        {error && (
          <div ref={errorRef} className="mb-4 rounded-xl px-4 py-3 text-sm font-body flex items-start gap-2" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* ── Step 1: Dados Pessoais ── */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-xs font-semibold font-body mb-1.5 tracking-wide uppercase" style={{ color: '#6b7280' }}>
                Nome Completo *
              </label>
              <input
                className="input-field"
                type="text"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && validateStep1() && goToStep(2)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold font-body mb-1.5 tracking-wide uppercase" style={{ color: '#6b7280' }}>
                E-mail *
              </label>
              <input
                className="input-field"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold font-body mb-1.5 tracking-wide uppercase" style={{ color: '#6b7280' }}>
                WhatsApp *
              </label>
              <input
                className="input-field"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
                  let masked = digits;
                  if (digits.length > 0) masked = '(' + digits;
                  if (digits.length > 2) masked = '(' + digits.slice(0, 2) + ') ' + digits.slice(2);
                  if (digits.length > 7) masked = '(' + digits.slice(0, 2) + ') ' + digits.slice(2, 7) + '-' + digits.slice(7);
                  setFormData((p) => ({ ...p, phone: masked }));
                }}
                maxLength={15}
              />
            </div>

            {!selectedTier && (
              <div>
                <label className="block text-xs font-semibold font-body mb-1.5 tracking-wide uppercase" style={{ color: '#6b7280' }}>
                  Tipo de Ingresso *
                </label>
                <select
                  className="input-field"
                  value={tier}
                  onChange={(e) => onTierChange(e.target.value as TicketType)}
                >
                  <option value="individual">Individual — R$ 50</option>
                  <option value="casal">Casal — R$ 90</option>
                  <option value="familia">Família (até 4) — R$ 160</option>
                </select>
              </div>
            )}

            <button
              onClick={() => { if (validateStep1()) goToStep(2); }}
              className="w-full rounded-xl py-3.5 text-sm font-semibold font-body text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] mt-2"
              style={{ background: 'linear-gradient(135deg, #1e3a5f, #2d6a9f)' }}
            >
              Próximo →
            </button>
          </div>
        )}

        {/* ── Step 2: Participantes ── */}
        {step === 2 && (
          <div className="animate-fade-in">
            <div className="mb-5">
              <h3 className="font-display text-xl font-semibold text-navy mb-1">
                Quem vai participar?
              </h3>
              <p className="text-sm font-body" style={{ color: '#6b7280' }}>
                Informe os nomes dos adultos (13+). Crianças até 12 anos entram grátis.
              </p>
            </div>

            {/* Adult name fields */}
            <div className="space-y-3 mb-5">
              {Array.from({ length: totalAdultSlots }).map((_, i) => {
                const isExtra = i >= baseMaxAdults;
                return (
                  <div key={i}>
                    <label className="block text-xs font-semibold font-body mb-1.5 tracking-wide uppercase" style={{ color: '#6b7280' }}>
                      {isExtra
                        ? `Adulto extra ${i - baseMaxAdults + 1} — ${formatReais(EXTRA_ADULT_PRICE_CENTS)}`
                        : `Adulto ${i + 1}${i === 0 ? ' (você)' : totalAdultSlots > 1 ? ' (opcional)' : ''}`}
                    </label>
                    <input
                      className="input-field"
                      type="text"
                      placeholder={`Nome do participante ${i + 1}`}
                      value={formData.participant_names[i] ?? ''}
                      onChange={(e) => {
                        const names = [...formData.participant_names];
                        names[i] = e.target.value;
                        setFormData((p) => ({ ...p, participant_names: names }));
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Extra adult controls — only for familia */}
            {tier === 'familia' && (
              <div
                className="rounded-xl p-4 mb-5 flex items-center justify-between"
                style={{ background: 'rgba(201,151,58,0.06)', border: '1px solid rgba(201,151,58,0.2)' }}
              >
                <div>
                  <p className="text-xs font-semibold font-body text-gray-700 uppercase tracking-wide">
                    Adultos além de 4
                  </p>
                  <p className="text-xs font-body text-gray-500 mt-0.5">
                    +{formatReais(EXTRA_ADULT_PRICE_CENTS)} por pessoa
                  </p>
                </div>
                <Counter
                  value={extraAdults}
                  min={0}
                  max={10}
                  onChange={(v) => {
                    const target = baseMaxAdults + v;
                    setFormData((prev) => {
                      const names = [...prev.participant_names];
                      while (names.length < target) names.push('');
                      return { ...prev, participant_names: names.slice(0, target) };
                    });
                  }}
                />
              </div>
            )}

            {/* Children counter — all ticket types */}
            <div
              className="rounded-xl p-4 mb-6 flex items-center justify-between"
              style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}
            >
              <div>
                <p className="text-xs font-semibold font-body text-gray-700 uppercase tracking-wide">
                  Crianças (até 12 anos)
                </p>
                <p className="text-xs font-body text-gray-500 mt-0.5">
                  Entrada gratuita 🎉
                </p>
              </div>
              <Counter
                value={formData.children_count}
                min={0}
                max={20}
                onChange={(v) => setFormData((p) => ({ ...p, children_count: v }))}
              />
            </div>

            {/* Price summary */}
            <div
              className="rounded-xl px-4 py-3 mb-5 flex items-center justify-between"
              style={{ background: 'rgba(30,58,95,0.05)', border: '1px solid rgba(30,58,95,0.1)' }}
            >
              <div className="text-sm font-body" style={{ color: '#4b5563' }}>
                <span>{totalAdultSlots} adulto{totalAdultSlots !== 1 ? 's' : ''}</span>
                {formData.children_count > 0 && (
                  <span className="ml-2 text-emerald-600">
                    + {formData.children_count} criança{formData.children_count !== 1 ? 's' : ''} grátis
                  </span>
                )}
              </div>
              <span className="font-display text-xl font-semibold text-navy">
                {formatReais(totalCents)}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => goToStep(1)}
                className="flex-1 rounded-xl py-3 text-sm font-semibold font-body transition-all duration-200"
                style={{ background: '#f3f4f6', color: '#6b7280', border: '1px solid #e5e7eb' }}
              >
                ← Voltar
              </button>
              <button
                onClick={() => { if (validateStep2()) goToStep(3); }}
                className="flex-[2] rounded-xl py-3 text-sm font-semibold font-body text-white transition-all duration-200 hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #1e3a5f, #2d6a9f)' }}
              >
                Ir para Pagamento →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Pagamento ── */}
        {step === 3 && (
          <div className="animate-fade-in">
            {paymentResult?.pixQrCode ? (
              <PixResult
                pixQrCode={paymentResult.pixQrCode}
                pixQrCodeBase64={paymentResult.pixQrCodeBase64}
                registrationId={paymentResult.registrationId}
              />
            ) : (
              <div>
                <div className="mb-4">
                  <h3 className="font-display text-xl font-semibold text-navy mb-1">Pagamento</h3>
                  <p className="text-sm font-body" style={{ color: '#6b7280' }}>
                    Escolha sua forma de pagamento preferida.
                  </p>
                </div>

                {/* Value summary */}
                <div
                  className="rounded-xl px-4 py-3 mb-5 flex items-center justify-between"
                  style={{ background: 'linear-gradient(135deg, #1e3a5f, #2d6a9f)' }}
                >
                  <div>
                    <p className="text-white/60 text-xs font-body">Total a pagar</p>
                    <p className="text-white font-display text-2xl font-light">
                      {formatReais(totalCents)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-xs font-body">{TICKET_TIERS[tier].label}</p>
                    <p className="text-white/80 text-xs font-body">
                      {totalAdultSlots} adulto{totalAdultSlots !== 1 ? 's' : ''}
                      {formData.children_count > 0 && ` + ${formData.children_count} criança${formData.children_count !== 1 ? 's' : ''}`}
                    </p>
                  </div>
                </div>

                <PagSeguroCheckout
                  onSubmit={handlePaymentSubmit}
                  onReset={() => setError(null)}
                  loading={loading}
                  totalCents={totalCents}
                />

                <button
                  onClick={() => goToStep(2)}
                  className="mt-4 w-full rounded-xl py-2.5 text-sm font-body transition-all duration-200"
                  style={{ color: '#6b7280', background: '#f3f4f6', border: '1px solid #e5e7eb' }}
                >
                  ← Voltar
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
