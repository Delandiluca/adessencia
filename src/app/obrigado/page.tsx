'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ObrigadoPage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ background: 'linear-gradient(160deg, #0a1628 0%, #1e3a5f 100%)' }}
    >
      {/* Gold top border */}
      <div
        className="fixed top-0 left-0 right-0 h-[3px]"
        style={{ background: 'linear-gradient(90deg, transparent, #c9973a 30%, #e0b460 50%, #c9973a 70%, transparent)' }}
      />

      <div
        className="max-w-md w-full text-center transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)' }}
      >
        {/* Animated checkmark */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'rgba(201,151,58,0.15)',
              animation: 'pulseGold 2s ease-in-out infinite',
            }}
          />
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #c9973a, #e0b460)' }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        <h1
          className="font-display text-white mb-2"
          style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', fontWeight: 300, letterSpacing: '0.05em' }}
        >
          Inscrição Confirmada!
        </h1>

        <div className="flex items-center justify-center gap-4 my-4">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold" />
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <rect x="8.5" y="0" width="3" height="20" fill="#c9973a" opacity="0.8" />
            <rect x="0" y="8.5" width="20" height="3" fill="#c9973a" opacity="0.8" />
          </svg>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold" />
        </div>

        <p className="font-body text-white/70 text-base mb-8 leading-relaxed">
          Seu pagamento foi confirmado. Você receberá um e-mail com todos os detalhes da sua inscrição.
        </p>

        {/* Event details card */}
        <div
          className="rounded-2xl p-6 mb-8 text-left"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <h2 className="font-display text-gold text-xl font-semibold mb-4">
            Detalhes do Evento
          </h2>

          <div className="space-y-3">
            {[
              { icon: '📅', label: 'Data', value: '5 de Abril de 2026, Sábado' },
              { icon: '☕', label: 'Início', value: '7h30 — Café da Manhã' },
              { icon: '🌙', label: 'Encerramento', value: '~19h30 após o Jantar' },
              { icon: '🍽️', label: 'Refeições', value: 'Todas incluídas' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-lg w-7 flex-shrink-0">{item.icon}</span>
                <div>
                  <span className="block text-white/40 text-xs font-body">{item.label}</span>
                  <span className="text-white/85 text-sm font-body">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Share on WhatsApp */}
        <a
          href="https://wa.me/?text=Acabei%20de%20me%20inscrever%20no%20Retiro%20ADESSÊNCIA%202026!%20🙏%20Dia%205%20de%20Abril%2C%20um%20dia%20inteiro%20de%20adoração%20e%20comunhão."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-sm font-semibold font-body text-white transition-all duration-200 hover:scale-105 mb-4"
          style={{ background: '#25d366' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Compartilhar no WhatsApp
        </a>

        <div className="mt-2">
          <Link
            href="/"
            className="font-body text-white/40 text-sm hover:text-white/60 transition-colors"
          >
            ← Voltar ao início
          </Link>
        </div>
      </div>
    </main>
  );
}
