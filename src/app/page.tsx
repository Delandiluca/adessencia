'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import HeroSection from '@/components/landing/HeroSection';
import PricingCards from '@/components/landing/PricingCards';
import RegistrationForm from '@/components/landing/RegistrationForm';
import LocationSection from '@/components/landing/LocationSection';
import { TicketType } from '@/types/registration';

const SCHEDULE = [
  { time: '06:00', label: 'Consagração da Manhã',           icon: '🙏', desc: 'Início do dia dedicado a Deus' },
  { time: '08:00', label: 'Escola Bíblica Dominical (EBD)', icon: '📖', desc: 'Ensinamento e estudo da Palavra' },
  { time: '09:30', label: 'Louvor e Adoração',              icon: '🎵', desc: 'Momento contínuo de louvor ao longo do dia' },
  { time: '12:00', label: 'Pausa para Alimentação',         icon: '🍽️', desc: 'Momento de descanso e comunhão' },
  { time: '14:00', label: 'Continuação de Louvor e Adoração', icon: '✨', desc: 'Edificação e buscando a face de Deus' },
  { time: '17:00', label: 'Pausa com Café da Tarde',        icon: '☕', desc: 'Descanso e comunhão entre irmãos' },
  { time: '19:00', label: 'Encerramento com Jantar',        icon: '🌙', desc: 'Encerramento do dia em adoração' },
];

const INCLUDED = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
      </svg>
    ),
    title: '4 Refeições Completas',
    desc: 'Café da manhã, almoço, café da tarde e jantar — tudo incluído no ingresso.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
    title: 'Pausas com Café',
    desc: 'Momentos de descanso e conexão entre os períodos do dia.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
    title: 'Louvor e Adoração',
    desc: 'Blocos de louvor e ministração da Palavra de Deus com unção.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Comunhão',
    desc: 'Um dia inteiro ao lado da família da fé — edificação e amor fraternal.',
  },
];

export default function LandingPage() {
  const [selectedTier, setSelectedTier] = useState<TicketType | null>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);

  const handleTierSelect = (tier: TicketType) => {
    setSelectedTier(tier);
    setTimeout(() => {
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <main style={{ background: '#ffffff' }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── A Programação do Dia ─────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: '#ffffff' }}>
        <div className="max-w-4xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-16">
            <p className="text-xs font-body font-semibold tracking-[0.35em] uppercase mb-3" style={{ color: '#c9973a' }}>
              5 de Abril de 2026
            </p>
            <h2
              className="font-display text-navy"
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300, lineHeight: 1.1 }}
            >
              A Programação do Dia
            </h2>
            <div className="flex justify-center mt-5">
              <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, #c9973a, transparent)' }} />
            </div>
          </div>

          {/* Timeline */}
          <div className="relative max-w-2xl mx-auto">
            {/* Vertical line */}
            <div
              className="absolute left-[2.25rem] top-0 bottom-0 w-px"
              style={{ background: 'linear-gradient(to bottom, transparent, #e5e7eb 5%, #e5e7eb 95%, transparent)' }}
            />

            <div className="space-y-2">
              {SCHEDULE.map((item, i) => (
                <div key={i} className="flex items-start gap-6 group">
                  {/* Dot */}
                  <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width: '4.5rem', paddingTop: '1.1rem' }}>
                    <div
                      className="w-3.5 h-3.5 rounded-full border-2 border-white transition-all duration-300 group-hover:scale-125"
                      style={{
                        background: i === 0 || i === 5 ? '#c9973a' : '#1e3a5f',
                        boxShadow: `0 0 0 3px ${i === 0 || i === 5 ? 'rgba(201,151,58,0.2)' : 'rgba(30,58,95,0.15)'}`,
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div
                    className="flex-1 flex items-start gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group-hover:shadow-md mb-1"
                    style={{
                      background: '#faf9f7',
                      border: '1px solid #f0ede8',
                    }}
                  >
                    <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <span className="font-body font-bold text-xs tracking-wider" style={{ color: '#c9973a' }}>
                          {item.time}
                        </span>
                        <span className="font-display font-semibold text-navy" style={{ fontSize: '1.1rem' }}>
                          {item.label}
                        </span>
                      </div>
                      <p className="font-body text-sm mt-0.5" style={{ color: '#6b7280' }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-xs font-body mt-10" style={{ color: '#9ca3af' }}>
            * Programação sujeita a pequenos ajustes
          </p>
        </div>
      </section>

      {/* ── O que está incluso ───────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: '#faf9f7', borderTop: '1px solid #f0ede8', borderBottom: '1px solid #f0ede8' }}>
        <div className="max-w-5xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-5">
            <p className="text-xs font-body font-semibold tracking-[0.35em] uppercase mb-3" style={{ color: '#c9973a' }}>
              Incluso no ingresso
            </p>
            <h2
              className="font-display text-navy"
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300, lineHeight: 1.1 }}
            >
              Tudo incluído no seu ingresso
            </h2>
            <p className="font-body text-base mt-4 max-w-md mx-auto" style={{ color: '#6b7280' }}>
              R$&nbsp;50 por pessoa cobre um dia inteiro de experiências
            </p>
            <div className="flex justify-center mt-5">
              <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, #c9973a, transparent)' }} />
            </div>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {INCLUDED.map((item, i) => (
              <div
                key={i}
                className="group flex flex-col items-start p-6 rounded-2xl bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  boxShadow: '0 2px 12px rgba(30,58,95,0.06)',
                  border: '1px solid #f0ede8',
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, rgba(30,58,95,0.06), rgba(201,151,58,0.08))',
                    color: '#1e3a5f',
                    border: '1px solid rgba(30,58,95,0.08)',
                  }}
                >
                  {item.icon}
                </div>
                <h3 className="font-display font-semibold text-navy mb-2" style={{ fontSize: '1.2rem' }}>
                  {item.title}
                </h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: '#6b7280' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Children note */}
          <div className="flex justify-center mt-10">
            <div
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full"
              style={{
                background: 'rgba(16,185,129,0.07)',
                border: '1px solid rgba(16,185,129,0.2)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span className="text-sm font-body font-medium" style={{ color: '#059669' }}>
                Crianças até 12 anos entram gratuitamente em todos os ingressos
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Inscrição e Ingressos ───────────────────────────────────── */}
      <section
        id="inscricao"
        className="py-24 px-6"
        style={{ background: '#ffffff' }}
      >
        <div className="max-w-5xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-14">
            <p className="text-xs font-body font-semibold tracking-[0.35em] uppercase mb-3" style={{ color: '#c9973a' }}>
              Inscrição
            </p>
            <h2
              className="font-display text-navy"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 300, lineHeight: 1.1 }}
            >
              Escolha seu ingresso
            </h2>
            <div className="flex justify-center mt-5 mb-5">
              <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, #c9973a, transparent)' }} />
            </div>
            <p className="font-body text-sm max-w-md mx-auto" style={{ color: '#6b7280' }}>
              Todas as refeições do dia estão incluídas. Crianças até 12 anos entram gratuitamente.
            </p>
          </div>

          {/* Pricing cards */}
          <PricingCards selectedTier={selectedTier} onSelect={handleTierSelect} />

          {/* Registration form */}
          <div ref={formSectionRef} className="mt-16 scroll-mt-8">
            {selectedTier ? (
              <>
                <div className="text-center mb-10">
                  <p className="text-xs font-body font-semibold tracking-[0.35em] uppercase mb-3" style={{ color: '#c9973a' }}>
                    Quase lá!
                  </p>
                  <h3 className="font-display text-navy font-light" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)' }}>
                    Complete sua inscrição
                  </h3>
                </div>
                <RegistrationForm selectedTier={selectedTier} onTierChange={setSelectedTier} />
              </>
            ) : (
              <div className="text-center py-12 font-body text-sm" style={{ color: '#9ca3af' }}>
                ↑ Selecione um ingresso acima para continuar
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Location Section ────────────────────────────────────── */}
      <LocationSection />

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer
        className="py-16 px-6"
        style={{
          background: '#faf9f7',
          borderTop: '1px solid #e5e7eb',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">

            {/* Brand */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <Image
                src="/IMG_9077.png"
                alt="Essência da Adoração — Assembleia de Deus"
                width={64}
                height={64}
                style={{ objectFit: 'contain', opacity: 0.9 }}
              />
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center md:text-left">
              <div>
                <p className="font-body font-semibold text-xs tracking-widest uppercase mb-2" style={{ color: '#c9973a' }}>
                  Evento
                </p>
                <p className="font-body text-sm text-navy">Um Dia com Deus</p>
                <p className="font-body text-sm mt-1" style={{ color: '#9ca3af' }}>5 de Abril de 2026</p>
              </div>
              <div>
                <p className="font-body font-semibold text-xs tracking-widest uppercase mb-2" style={{ color: '#c9973a' }}>
                  Local
                </p>
                <p className="font-body text-sm text-navy">Rua Samuel Levi, 145</p>
                <p className="font-body text-sm mt-1" style={{ color: '#9ca3af' }}>Cachoeiro de Itapemirim, ES</p>
              </div>
              <div>
                <p className="font-body font-semibold text-xs tracking-widest uppercase mb-2" style={{ color: '#c9973a' }}>
                  Liderança
                </p>
                <p className="font-body text-sm text-navy">Pastor Jessé Batista</p>
                <p className="font-body text-sm mt-1" style={{ color: '#9ca3af' }}>Pastor Presidente</p>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{ borderTop: '1px solid #e5e7eb' }}
          >
            <p className="font-body text-xs" style={{ color: '#9ca3af' }}>
              © 2026 Assembleia de Deus Essência da Adoração. Todos os direitos reservados.
            </p>
            <p className="font-body text-xs" style={{ color: '#9ca3af' }}>
              Dúvidas? Fale com nossa equipe pelo WhatsApp da igreja.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
