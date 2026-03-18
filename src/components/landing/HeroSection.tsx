'use client';

import Image from 'next/image';

export default function HeroSection() {
  const scrollToForm = () => {
    document.getElementById('inscricao')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background: photo-ready, falls back to deep navy gradient */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#0a1628',
        }}
      />

      {/* Dark overlay — slightly lighter at center to feel like light source */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(160deg, rgba(8,18,36,0.9) 0%, rgba(20,46,85,0.78) 50%, rgba(8,18,36,0.92) 100%)',
        }}
      />

      {/* Gold top border */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] z-10"
        style={{
          background:
            'linear-gradient(90deg, transparent, #c9973a 25%, #e0b460 50%, #c9973a 75%, transparent)',
        }}
      />

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto w-full">

        {/* Logo + church tag */}
        <div
          className="flex flex-col items-center gap-4 mb-10 animate-fade-in"
          style={{ opacity: 0, animationDelay: '0.1s' }}
        >
          <div
            className="rounded-full bg-white flex items-center justify-center"
            style={{
              width: 72,
              height: 72,
              boxShadow: '0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.15)',
            }}
          >
            <Image
              src="/IMG_9077.png"
              alt="Essência da Adoração"
              width={52}
              height={52}
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>

          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span className="text-xs font-body font-medium tracking-[0.15em] uppercase text-white/80">
              Assembleia de Deus Essência da Adoração
            </span>
          </div>
        </div>

        {/* H1 — Event title */}
        <h1
          className="font-display text-white animate-fade-in-up"
          style={{
            fontSize: 'clamp(2.8rem, 8vw, 6rem)',
            fontWeight: 300,
            letterSpacing: '0.02em',
            lineHeight: 1.08,
            opacity: 0,
            animationDelay: '0.3s',
          }}
        >
          Dia de Adoração
          <br />
          <em style={{ fontStyle: 'italic' }}>&amp; Comunhão</em>
        </h1>

        {/* Date + Location badges */}
        <div
          className="flex flex-wrap items-center justify-center gap-3 mt-8 animate-fade-in"
          style={{ opacity: 0, animationDelay: '0.55s' }}
        >
          {/* Date — gold pill */}
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #c9973a, #e0b460)',
              boxShadow: '0 4px 20px rgba(201,151,58,0.45)',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="text-sm font-body font-bold text-white tracking-wide">
              5 de Abril de 2026
            </span>
          </div>

          {/* Location */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-sm font-body text-white/75">
              Rua Samuel Levi, 145 — Cachoeiro de Itapemirim, ES
            </span>
          </div>
        </div>

        {/* CTA button */}
        <div
          className="mt-12 animate-fade-in-up"
          style={{ opacity: 0, animationDelay: '0.8s' }}
        >
          <button
            onClick={scrollToForm}
            className="group inline-flex items-center gap-3 rounded-full px-10 py-4 font-body font-semibold text-white text-base transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #c9973a 0%, #e0b460 100%)',
              boxShadow: '0 8px 32px rgba(201,151,58,0.5), 0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            Quero Me Inscrever
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          <p className="mt-4 text-xs font-body text-white/40">
            Vagas limitadas · Confirmação automática após o pagamento
          </p>
        </div>

        {/* Scroll indicator */}
        <div
          className="mt-14 animate-fade-in"
          style={{ opacity: 0, animationDelay: '1.3s' }}
        >
          <div
            className="w-5 h-8 rounded-full border border-white/20 mx-auto flex items-start justify-center pt-1.5"
          >
            <div
              className="w-1 h-2 rounded-full bg-white/40"
              style={{ animation: 'scrollBob 1.8s ease-in-out infinite' }}
            />
          </div>
        </div>
      </div>

      {/* Bottom blend into white page */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #ffffff)' }}
      />
    </section>
  );
}
