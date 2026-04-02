'use client';

import { useRef } from 'react';
import Image from 'next/image';
import NavBar from '@/components/landing/NavBar';
import HeroSection from '@/components/landing/HeroSection';
import IncludedSection from '@/components/landing/IncludedSection';
import PricingCards from '@/components/landing/PricingCards';
import LocationSection from '@/components/landing/LocationSection';

const SCHEDULE = [
  {
    time: '06:00', period: 'Manhã', label: 'Consagração',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>,
  },
  {
    time: '07:00', period: 'Manhã', label: 'Café',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  },
  {
    time: '08:00', period: 'Manhã', label: 'Escola Bíblica Dominical',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  },
  {
    time: '10:00', period: 'Manhã', label: 'Interação de Equipes',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
  {
    time: '11:30', period: 'Manhã', label: 'Almoço',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>,
  },
  {
    time: '13:00', period: 'Tarde', label: 'Conexões',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  },
  {
    time: '14:00', period: 'Tarde', label: 'Celebração Ministerial',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
  },
  {
    time: '16:00', period: 'Tarde', label: 'Café',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  },
  {
    time: '17:00', period: 'Noite', label: 'Culto da Família',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    time: '20:00', period: 'Noite', label: 'Jantar',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>,
  },
  {
    time: '21:00', period: 'Noite', label: 'Encerramento',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  },
];


const NAV_FOOTER = [
  { label: 'Início', href: '#' },
  { label: 'Programação', href: '#programacao' },
  { label: 'Inscrição', href: '#inscricao' },
  { label: 'Como Chegar', href: '#localizacao' },
];

export default function LandingPage() {
  const contactCardRef = useRef<HTMLDivElement>(null);

  const handleTierSelect = () => {
    setTimeout(() => {
      contactCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  };

  return (
    <>
      <NavBar />
      <main style={{ background: '#ffffff' }} className="pt-16">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <HeroSection />

        {/* ── A Programação do Dia ─────────────────────────────────────── */}
        <section
          id="programacao"
          className="py-28 px-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #0b1829 0%, #0f2240 55%, #0b1829 100%)' }}
        >
          {/* Crimson top accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, #B83235 25%, #c93d40 50%, #B83235 75%, transparent)', zIndex: 2 }} />
          {/* Decorative radial glows */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(ellipse at 15% 40%, rgba(201,151,58,0.06) 0%, transparent 55%), radial-gradient(ellipse at 85% 70%, rgba(30,58,95,0.25) 0%, transparent 55%)',
          }} />

          <div className="max-w-3xl mx-auto relative">

            {/* ── Header ── */}
            <div className="text-center mb-16">
              <p className="font-body font-semibold tracking-[0.35em] uppercase text-xs mb-3" style={{ color: '#C8860A' }}>
                5 de Abril de 2026
              </p>
              <h2
                className="font-display text-white"
                style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, lineHeight: 1.1 }}
              >
                Programação do Dia
              </h2>
              <div className="flex items-center justify-center gap-3 mt-5">
                <div className="h-px flex-1 max-w-[60px]" style={{ background: 'linear-gradient(to right, transparent, rgba(201,151,58,0.5))' }} />
                <svg width="10" height="10" viewBox="0 0 10 10"><polygon points="5,0 10,10 0,10" fill="#C8860A" /></svg>
                <div className="h-px flex-1 max-w-[60px]" style={{ background: 'linear-gradient(to left, transparent, rgba(201,151,58,0.5))' }} />
              </div>
            </div>

            {/* ── Timeline ── */}
            <div className="relative">

              {/* Vertical connecting line */}
              <div
                className="absolute top-5 bottom-5 w-px hidden sm:block"
                style={{
                  left: '8.5rem',
                  background: 'linear-gradient(to bottom, transparent, rgba(201,151,58,0.35) 8%, rgba(201,151,58,0.35) 92%, transparent)',
                }}
              />

              {/* Period separators + items */}
              {(['Manhã', 'Tarde', 'Noite'] as const).map((period) => {
                const items = SCHEDULE.filter((s) => s.period === period);
                const periodMeta: Record<string, { label: string; color: string; bg: string }> = {
                  Manhã:  { label: 'MANHÃ',  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
                  Tarde:  { label: 'TARDE',  color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
                  Noite:  { label: 'NOITE',  color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
                };
                const meta = periodMeta[period];
                return (
                  <div key={period} className="mb-8 last:mb-0">

                    {/* Period label */}
                    <div className="flex items-center gap-3 mb-4 sm:pl-[9.5rem]">
                      <span
                        className="font-body font-bold text-[10px] tracking-[0.3em] px-3 py-1 rounded-full"
                        style={{ color: meta.color, background: meta.bg, border: `1px solid ${meta.color}30` }}
                      >
                        {meta.label}
                      </span>
                      <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${meta.color}20, transparent)` }} />
                    </div>

                    {/* Items in this period */}
                    <div className="space-y-3">
                      {items.map((item, i) => (
                        <div key={i} className="flex items-stretch gap-0">

                          {/* Time column */}
                          <div className="hidden sm:flex flex-col items-end justify-center w-20 flex-shrink-0 pr-4">
                            <span className="font-body font-bold text-xs leading-tight tabular-nums" style={{ color: '#D4991A' }}>
                              {item.time}
                            </span>
                          </div>

                          {/* Dot */}
                          <div className="hidden sm:flex flex-col items-center justify-center flex-shrink-0 w-8">
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{
                                background: '#0f2240',
                                border: '2px solid #C8860A',
                                boxShadow: '0 0 10px rgba(201,151,58,0.45)',
                              }}
                            />
                          </div>

                          {/* Card */}
                          <div
                            className="flex-1 flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 hover:scale-[1.01] group"
                            style={{
                              background: 'rgba(255,255,255,0.04)',
                              border: '1px solid rgba(255,255,255,0.07)',
                              backdropFilter: 'blur(8px)',
                            }}
                          >
                            {/* Icon bubble */}
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                              style={{ background: 'rgba(201,151,58,0.12)', color: '#D4991A' }}
                            >
                              {item.icon}
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                              {/* Mobile time */}
                              <span className="sm:hidden inline-block font-body font-bold text-[10px] tracking-wide mb-1 px-2 py-0.5 rounded-full" style={{ color: '#D4991A', background: 'rgba(224,180,96,0.1)', border: '1px solid rgba(224,180,96,0.2)' }}>
                                {item.time}
                              </span>
                              <p className="font-body font-semibold text-white text-sm md:text-base leading-snug">
                                {item.label}
                              </p>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-center font-body text-xs mt-10" style={{ color: 'rgba(255,255,255,0.25)' }}>
              * Programação sujeita a pequenos ajustes
            </p>
          </div>
        </section>

        {/* ── O que está incluso ───────────────────────────────────────── */}
        <IncludedSection />

        {/* ── Inscrição e Ingressos ───────────────────────────────────── */}
        <section
          id="inscricao"
          className="py-24 px-6"
          style={{ background: '#ffffff' }}
        >
          <div className="max-w-5xl mx-auto">

            {/* Heading */}
            <div className="text-center mb-14">
              <p className="text-xs font-body font-semibold tracking-[0.35em] uppercase mb-3" style={{ color: '#C8860A' }}>
                Inscrição
              </p>
              <h2 className="font-display text-navy" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 600, lineHeight: 1.15 }}>
                Escolha seu ingresso
              </h2>
              <div className="flex justify-center mt-4 mb-5">
                <div className="h-[2px] w-12 rounded-full" style={{ background: 'linear-gradient(to right, transparent, #C8860A, transparent)' }} />
              </div>
              <p className="font-body text-sm max-w-md mx-auto" style={{ color: '#6b7280' }}>
                Todas as refeições do dia estão incluídas. Crianças até 12 anos entram gratuitamente.
              </p>
            </div>

            {/* Pricing cards */}
            <PricingCards selectedTier={null} onSelect={handleTierSelect} />

            {/* Card de contato com a tesouraria */}
            <div ref={contactCardRef} className="max-w-xl mx-auto mt-4 scroll-mt-8">
              <div
                className="rounded-2xl px-8 py-10 text-center"
                style={{ background: '#f9f7ff', border: '1.5px solid rgba(200,134,10,0.18)' }}
              >
                {/* Ícone */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'rgba(200,134,10,0.10)' }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C8860A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>

                <h3 className="font-display text-navy font-semibold mb-2" style={{ fontSize: '1.25rem' }}>
                  Inscrições pelo WhatsApp
                </h3>
                <p className="font-body text-sm mb-7" style={{ color: '#6b7280', lineHeight: 1.7 }}>
                  No momento, as inscrições estão sendo realizadas diretamente pela nossa tesouraria.
                  Entre em contato pelo WhatsApp ou compareça pessoalmente ao local do evento.
                </p>

                {/* Botão WhatsApp */}
                <a
                  href="https://wa.me/5528999081083?text=Olá!%20Gostaria%20de%20me%20inscrever%20no%20Domingo%20Essencial%202026."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-body font-semibold text-sm text-white transition-opacity hover:opacity-90"
                  style={{ background: '#25D366' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                  </svg>
                  Falar com a Tesouraria
                </a>

                <p className="font-body text-xs mt-5" style={{ color: '#9ca3af' }}>
                  Ou compareça ao local — veja o endereço na seção abaixo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Location Section ────────────────────────────────────── */}
        <LocationSection />

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <footer className="py-16 px-6 relative" style={{ background: '#f4f3fa' }}>
          {/* Crimson top accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, #B83235 25%, #c93d40 50%, #B83235 75%, transparent)' }} />
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">

              {/* Brand */}
              <div className="flex flex-col items-center md:items-start gap-3">
                <div className="flex items-center gap-3">
                  <Image
                    src="/IMG_9077.png"
                    alt="Essência da Adoração"
                    width={44}
                    height={44}
                    style={{ objectFit: 'contain', opacity: 0.9 }}
                  />
                  <div>
                    <p className="font-body font-semibold text-sm" style={{ color: '#B83235' }}>Essência da Adoração</p>
                    <p className="font-body text-xs" style={{ color: '#9ca3af' }}>Assembleia de Deus</p>
                  </div>
                </div>
                {/* Social icons */}
                <div className="flex items-center gap-3 mt-2">
                  {[
                    { label: 'Facebook', href: 'https://www.facebook.com/adessencia.oficial', path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
                    { label: 'Instagram', href: 'https://www.instagram.com/adessencia.oficial/', svgContent: (
                      <>
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </>
                    )},
                    { label: 'YouTube', href: 'https://www.youtube.com/@ADESSENCIA.OFICIAL', svgContent: (
                      <><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" stroke="none" /></>
                    )},
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                      style={{ background: 'rgba(30,58,95,0.08)', color: '#1e3a5f' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {social.path ? <path d={social.path} /> : social.svgContent}
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              {/* Nav links + event info */}
              <div className="flex flex-col sm:flex-row gap-10 text-center md:text-left">
                {/* Nav */}
                <div>
                  <p className="font-body font-semibold text-xs tracking-widest uppercase mb-3" style={{ color: '#C8860A' }}>Navegação</p>
                  <div className="flex flex-col gap-2">
                    {NAV_FOOTER.map((l) => (
                      <a key={l.label} href={l.href} className="font-body text-sm transition-colors hover:opacity-60" style={{ color: '#1e3a5f' }}>
                        {l.label}
                      </a>
                    ))}
                  </div>
                </div>
                {/* Event info */}
                <div>
                  <p className="font-body font-semibold text-xs tracking-widest uppercase mb-3" style={{ color: '#C8860A' }}>Evento</p>
                  <p className="font-body text-sm text-navy">Domingo Essencial</p>
                  <p className="font-body text-xs mt-1" style={{ color: '#9ca3af' }}>5 de Abril de 2026</p>
                  <p className="font-body text-xs mt-2 text-navy">Pastor Jessé Batista</p>
                  <p className="font-body text-xs mt-0.5" style={{ color: '#9ca3af' }}>Pastor Presidente</p>
                </div>
              </div>
            </div>

            <div
              className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
              style={{ borderTop: '1px solid rgba(30,58,95,0.08)' }}
            >
              <p className="font-body text-xs" style={{ color: '#9ca3af' }}>
                © 2026 Assembleia de Deus Essência da Adoração. Todos os direitos reservados.
              </p>
              <p className="font-body text-xs" style={{ color: '#9ca3af' }}>
                Dúvidas? Fale conosco pelo WhatsApp.
              </p>
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}
