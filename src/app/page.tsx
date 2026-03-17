'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import HeroSection from '@/components/landing/HeroSection';
import PricingCards from '@/components/landing/PricingCards';
import RegistrationForm from '@/components/landing/RegistrationForm';
import { TicketType } from '@/types/registration';

const PILLARS = [
  {
    number: '01',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
    title: 'Adoração',
    description:
      'Um dia inteiramente voltado para o louvor. Momentos profundos de adoração coletiva que renovam a alma e fortalecem a fé de cada participante.',
    accent: '#c9973a',
  },
  {
    number: '02',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Comunhão',
    description:
      'Encontro genuíno entre irmãos na fé. Um ambiente de acolhimento, partilha e edificação mútua — exatamente como a igreja foi chamada a ser.',
    accent: '#2d6a9f',
  },
  {
    number: '03',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Palavra',
    description:
      'Ministrações que falam ao coração. Sob a liderança do Pastor Jessé Batista, a Palavra de Deus será partilhada com profundidade e unção.',
    accent: '#1e3a5f',
  },
  {
    number: '04',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
    title: 'Refeições',
    description:
      'Café da manhã, almoço, café da tarde e jantar — tudo incluído. Para que você possa estar 100% presente, sem preocupações.',
    accent: '#c9973a',
  },
];

const SCHEDULE = [
  { time: '7h30',  label: 'Café da Manhã',        icon: '☕' },
  { time: '8h30',  label: 'Louvor e Adoração',     icon: '🎵' },
  { time: '10h',   label: 'Ministração da Palavra', icon: '📖' },
  { time: '12h',   label: 'Almoço',                icon: '🍽️' },
  { time: '14h',   label: 'Momento de Comunhão',   icon: '🤝' },
  { time: '16h',   label: 'Café da Tarde',         icon: '🫖' },
  { time: '17h',   label: 'Louvor Espontâneo',     icon: '✨' },
  { time: '19h30', label: 'Jantar de Encerramento',icon: '🌙' },
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
    <main style={{ background: '#04080f' }}>
      {/* Hero */}
      <HeroSection />

      {/* ── Os 4 Pilares ───────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: '#04080f' }}>
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-16">
            <p
              className="text-xs font-body font-semibold tracking-[0.35em] uppercase mb-4"
              style={{ color: '#c9973a' }}
            >
              O que nos espera
            </p>
            <h2
              className="font-display text-white"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 300, lineHeight: 1.1 }}
            >
              Um dia que{' '}
              <span className="gold-shimmer italic">transforma</span>
            </h2>
            <div className="flex justify-center mt-5">
              <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, #c9973a, transparent)' }} />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PILLARS.map((p) => (
              <div
                key={p.number}
                className="group relative flex flex-col p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {/* Number */}
                <span
                  className="font-body font-bold text-xs tracking-widest mb-4"
                  style={{ color: `${p.accent}60` }}
                >
                  {p.number}
                </span>

                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300"
                  style={{
                    background: `${p.accent}15`,
                    color: p.accent,
                    border: `1px solid ${p.accent}30`,
                  }}
                >
                  {p.icon}
                </div>

                <h3
                  className="font-display font-semibold text-xl text-white mb-2"
                >
                  {p.title}
                </h3>
                <p
                  className="font-body text-sm leading-relaxed flex-1"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                >
                  {p.description}
                </p>

                {/* Hover bottom line */}
                <div
                  className="absolute bottom-0 left-6 right-6 h-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(to right, transparent, ${p.accent}, transparent)` }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Programação do Dia ──────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p
              className="text-xs font-body font-semibold tracking-[0.35em] uppercase mb-4"
              style={{ color: '#c9973a' }}
            >
              5 de Abril de 2026
            </p>
            <h2
              className="font-display text-white"
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300 }}
            >
              Programação do Dia
            </h2>
            <div className="flex justify-center mt-5">
              <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, #c9973a, transparent)' }} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {SCHEDULE.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-5 py-3.5 rounded-xl"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="font-body font-bold text-xs tracking-wider" style={{ color: '#e0b460' }}>
                    {item.time}
                  </p>
                  <p className="font-body text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs font-body mt-8" style={{ color: 'rgba(255,255,255,0.25)' }}>
            * Programação sujeita a pequenos ajustes
          </p>
        </div>
      </section>

      {/* ── Palavra do Pastor ───────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: '#04080f' }}>
        <div className="max-w-3xl mx-auto text-center">
          {/* Decorative quote mark */}
          <div
            className="font-display text-8xl leading-none mb-2"
            style={{ color: 'rgba(201,151,58,0.15)', fontStyle: 'italic' }}
          >
            &ldquo;
          </div>
          <blockquote
            className="font-display italic text-white/80 leading-relaxed mb-8"
            style={{ fontSize: 'clamp(1.2rem, 3vw, 1.7rem)', fontWeight: 300 }}
          >
            Convidamos cada membro e família da ADESSÊNCIA para um dia especial de pausa, adoração e
            comunhão. Um momento de renovar as forças, ouvir a voz de Deus e fortalecer os laços que
            nos unem como corpo de Cristo.
          </blockquote>

          {/* Pastor signature */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full flex items-center justify-center font-display text-lg font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #1e3a5f, #2d6a9f)', border: '2px solid rgba(201,151,58,0.3)' }}>
              JB
            </div>
            <div>
              <p className="font-display font-semibold text-white tracking-wide">
                Pastor Jessé Batista
              </p>
              <p className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Pastor Presidente · Assembleia de Deus Essência da Adoração
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Inscrição e Ingressos ───────────────────────────────────── */}
      <section
        id="inscricao"
        className="py-24 px-6"
        style={{
          background: 'linear-gradient(180deg, #04080f 0%, #07111f 100%)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-14">
            <p
              className="text-xs font-body font-semibold tracking-[0.35em] uppercase mb-4"
              style={{ color: '#c9973a' }}
            >
              Inscrição
            </p>
            <h2
              className="font-display text-white"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 300, lineHeight: 1.1 }}
            >
              Escolha seu ingresso
            </h2>
            <div className="flex justify-center mt-5 mb-5">
              <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, #c9973a, transparent)' }} />
            </div>
            <p className="font-body text-sm max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
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
                  <p
                    className="text-xs font-body font-semibold tracking-[0.35em] uppercase mb-3"
                    style={{ color: '#c9973a' }}
                  >
                    Quase lá!
                  </p>
                  <h3
                    className="font-display text-white font-light"
                    style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)' }}
                  >
                    Complete sua inscrição
                  </h3>
                </div>
                <RegistrationForm selectedTier={selectedTier} onTierChange={setSelectedTier} />
              </>
            ) : (
              <div
                className="text-center py-12 font-body text-sm"
                style={{ color: 'rgba(255,255,255,0.25)' }}
              >
                ↑ Selecione um ingresso acima para continuar
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer
        className="py-16 px-6"
        style={{
          background: '#020509',
          borderTop: '1px solid rgba(201,151,58,0.12)',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
            {/* Brand */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <Image
                src="/IMG_9069.png"
                alt="Essência da Adoração — Assembleia de Deus"
                width={140}
                height={190}
                style={{ objectFit: 'contain', filter: 'invert(1)', opacity: 0.85 }}
              />
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center md:text-left">
              <div>
                <p className="font-body font-semibold text-xs tracking-widest uppercase mb-2" style={{ color: '#c9973a' }}>
                  Evento
                </p>
                <p className="font-body text-sm text-white/60">Retiro de Adoração e Comunhão</p>
                <p className="font-body text-sm text-white/40 mt-1">5 de Abril de 2026</p>
              </div>
              <div>
                <p className="font-body font-semibold text-xs tracking-widest uppercase mb-2" style={{ color: '#c9973a' }}>
                  Local
                </p>
                <p className="font-body text-sm text-white/60">Rua Samuel Levi, 145</p>
                <p className="font-body text-sm text-white/40 mt-1">Cachoeiro de Itapemirim, ES</p>
              </div>
              <div>
                <p className="font-body font-semibold text-xs tracking-widest uppercase mb-2" style={{ color: '#c9973a' }}>
                  Liderança
                </p>
                <p className="font-body text-sm text-white/60">Pastor Jessé Batista</p>
                <p className="font-body text-sm text-white/40 mt-1">Pastor Presidente</p>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
              © 2026 Assembleia de Deus Essência da Adoração. Todos os direitos reservados.
            </p>
            <p className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Dúvidas? Fale com nossa equipe pelo WhatsApp da igreja.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
