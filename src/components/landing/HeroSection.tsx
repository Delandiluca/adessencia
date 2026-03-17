'use client';

import ChurchLogo from '@/components/ui/ChurchLogo';

export default function HeroSection() {
  const scrollToForm = () => {
    document.getElementById('inscricao')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#04080f' }}
    >
      {/* ── Ambient glow orbs (Momentum-style) ───────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Gold/amber orb — upper-left */}
        <div
          className="absolute rounded-full animate-orb-slow"
          style={{
            width: 700, height: 700,
            top: '-15%', left: '-15%',
            background: 'radial-gradient(circle, rgba(201,151,58,0.18) 0%, rgba(201,151,58,0.06) 40%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        {/* Blue orb — lower-right */}
        <div
          className="absolute rounded-full animate-orb-slow"
          style={{
            width: 600, height: 600,
            bottom: '-10%', right: '-10%',
            background: 'radial-gradient(circle, rgba(30,58,95,0.5) 0%, rgba(45,106,159,0.2) 40%, transparent 70%)',
            filter: 'blur(50px)',
            animationDelay: '3s',
          }}
        />
        {/* Center glow — faint gold */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 900, height: 500,
            background: 'radial-gradient(ellipse, rgba(201,151,58,0.07) 0%, transparent 65%)',
            filter: 'blur(30px)',
          }}
        />

        {/* Fine grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating cross — top left */}
        <svg
          className="absolute top-20 left-16 opacity-10 animate-cross-float"
          width="40" height="40" viewBox="0 0 40 40" fill="none"
        >
          <rect x="17" y="0" width="6" height="40" fill="#c9973a" />
          <rect x="0" y="15" width="40" height="6" fill="#c9973a" />
        </svg>

        {/* Floating cross — bottom right */}
        <svg
          className="absolute bottom-24 right-20 opacity-10 animate-cross-float"
          style={{ animationDelay: '4s' }}
          width="28" height="28" viewBox="0 0 28 28" fill="none"
        >
          <rect x="12" y="0" width="4" height="28" fill="#c9973a" />
          <rect x="0" y="11" width="28" height="4" fill="#c9973a" />
        </svg>

        {/* Scattered star dots */}
        {[
          { top: '12%', left: '7%',  size: 2, op: 0.35 },
          { top: '22%', right: '9%', size: 1.5, op: 0.25 },
          { top: '65%', left: '4%',  size: 2, op: 0.3  },
          { bottom: '18%', right: '6%', size: 1.5, op: 0.2 },
          { top: '40%', left: '2%',  size: 1, op: 0.4  },
          { top: '52%', right: '2%', size: 1, op: 0.3  },
          { top: '78%', left: '18%', size: 1.5, op: 0.2 },
          { top: '8%', right: '25%', size: 1, op: 0.25 },
        ].map((d, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              ...d,
              width: d.size, height: d.size,
              background: '#c9973a',
              opacity: d.op,
            }}
          />
        ))}
      </div>

      {/* Gold top border */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] z-10"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #c9973a 25%, #e0b460 50%, #c9973a 75%, transparent 100%)' }}
      />

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">

        {/* Logo + Church name */}
        <div
          className="flex flex-col items-center gap-4 mb-8 animate-fade-in"
          style={{ opacity: 0, animationDelay: '0.1s' }}
        >
          <ChurchLogo variant="icon-red" size={80} />
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border"
            style={{
              borderColor: 'rgba(204,26,26,0.3)',
              background: 'rgba(204,26,26,0.06)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span className="text-xs font-body font-medium tracking-[0.15em] uppercase" style={{ color: 'rgba(255,100,100,0.85)' }}>
              Assembleia de Deus Essência da Adoração
            </span>
          </div>
        </div>

        {/* ADESSÊNCIA — massive hero title */}
        <h1
          className="animate-fade-in-up"
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(4rem, 13vw, 10rem)',
            fontWeight: 300,
            letterSpacing: '0.1em',
            lineHeight: 0.95,
            opacity: 0,
            animationDelay: '0.25s',
          }}
        >
          <span className="gold-shimmer">ADESSÊNCIA</span>
        </h1>

        {/* Ornamental divider */}
        <div
          className="flex items-center justify-center gap-3 my-7 animate-fade-in"
          style={{ opacity: 0, animationDelay: '0.45s' }}
        >
          <div className="h-px w-20" style={{ background: 'linear-gradient(to right, transparent, rgba(201,151,58,0.5))' }} />
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="7" y="0" width="2" height="16" fill="#c9973a" opacity="0.7" />
            <rect x="0" y="7" width="16" height="2" fill="#c9973a" opacity="0.7" />
          </svg>
          <div className="h-px w-20" style={{ background: 'linear-gradient(to left, transparent, rgba(201,151,58,0.5))' }} />
        </div>

        {/* Subtitle */}
        <h2
          className="font-display text-white/90 italic animate-fade-in-up"
          style={{
            fontSize: 'clamp(1.3rem, 3.5vw, 2.2rem)',
            fontWeight: 300,
            opacity: 0,
            animationDelay: '0.55s',
            letterSpacing: '0.02em',
          }}
        >
          Retiro de Adoração e Comunhão
        </h2>

        {/* Badges row */}
        <div
          className="flex flex-wrap items-center justify-center gap-3 mt-7 animate-fade-in"
          style={{ opacity: 0, animationDelay: '0.7s' }}
        >
          {/* Date */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ background: 'rgba(201,151,58,0.1)', border: '1px solid rgba(201,151,58,0.3)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c9973a" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="text-sm font-body font-semibold tracking-wide" style={{ color: '#e0b460' }}>
              5 de Abril de 2026
            </span>
          </div>

          {/* Location */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-sm font-body" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Cachoeiro de Itapemirim, ES
            </span>
          </div>

          {/* Meals */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <span className="text-sm">🍽️</span>
            <span className="text-sm font-body" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Todas as refeições incluídas
            </span>
          </div>
        </div>

        {/* Schedule card */}
        <div
          className="mt-10 animate-fade-in"
          style={{ opacity: 0, animationDelay: '0.9s' }}
        >
          <div
            className="inline-flex flex-wrap items-stretch justify-center rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {[
              { icon: '☕', time: '7h30',  label: 'Café da Manhã' },
              { icon: '🎵', time: '8h30',  label: 'Louvor' },
              { icon: '🍽️', time: '12h',   label: 'Almoço' },
              { icon: '✨', time: '14h',   label: 'Tarde' },
              { icon: '🌙', time: '19h30', label: 'Jantar' },
            ].map((item, i, arr) => (
              <div key={i} className="flex items-stretch">
                <div className="flex flex-col items-center justify-center px-5 py-3.5 min-w-[88px]">
                  <span className="text-base mb-1">{item.icon}</span>
                  <span className="font-body font-bold text-xs tracking-wide" style={{ color: '#e0b460' }}>
                    {item.time}
                  </span>
                  <span className="font-body text-[10px] mt-0.5 text-center leading-tight" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {item.label}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div className="w-px self-stretch my-2" style={{ background: 'rgba(255,255,255,0.08)' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className="mt-12 animate-fade-in-up"
          style={{ opacity: 0, animationDelay: '1.1s' }}
        >
          <button
            onClick={scrollToForm}
            className="group relative inline-flex items-center gap-3 rounded-full px-10 py-4 font-body font-semibold text-white text-base transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #c9973a 0%, #e0b460 50%, #c9973a 100%)',
              backgroundSize: '200% auto',
              boxShadow: '0 8px 32px rgba(201,151,58,0.4), 0 0 0 0 rgba(201,151,58,0.3)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.backgroundPosition = 'right center';
              el.style.boxShadow = '0 12px 48px rgba(201,151,58,0.55), 0 0 0 8px rgba(201,151,58,0.12)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.backgroundPosition = 'left center';
              el.style.boxShadow = '0 8px 32px rgba(201,151,58,0.4), 0 0 0 0 rgba(201,151,58,0.3)';
            }}
          >
            <span>Garantir minha Vaga</span>
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <p className="mt-4 text-xs font-body" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Vagas limitadas · Confirmação automática após o pagamento
          </p>
        </div>

        {/* Scroll indicator */}
        <div
          className="mt-10 animate-fade-in"
          style={{ opacity: 0, animationDelay: '1.5s' }}
        >
          <div
            className="w-5 h-8 rounded-full border mx-auto flex items-start justify-center pt-1.5"
            style={{ borderColor: 'rgba(255,255,255,0.15)' }}
          >
            <div
              className="w-1 h-2 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.3)',
                animation: 'scrollBob 1.8s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom section blend */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #04080f)' }}
      />
    </section>
  );
}
