'use client';

import { useEffect, useRef, useState } from 'react';

const ITEMS = [
  {
    number: '4',
    unit: 'refeições',
    title: 'Refeições Completas',
    desc: 'Café da manhã das famílias, almoço comunitário, café da tarde e jantar de encerramento.',
    color: '#c9973a',
    glow: 'rgba(201,151,58,0.18)',
    gradientBg: 'linear-gradient(135deg, rgba(201,151,58,0.12) 0%, rgba(201,151,58,0.03) 100%)',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/>
        <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
      </svg>
    ),
  },
  {
    number: '3',
    unit: 'momentos',
    title: 'Louvor & Adoração',
    desc: 'Três momentos distintos de adoração: celebração interativa, culto da tarde e Santa Ceia.',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.18)',
    gradientBg: 'linear-gradient(135deg, rgba(167,139,250,0.12) 0%, rgba(167,139,250,0.03) 100%)',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13"/>
        <circle cx="6" cy="18" r="3"/>
        <circle cx="18" cy="16" r="3"/>
      </svg>
    ),
  },
  {
    number: '1',
    unit: 'EBD especial',
    title: 'Escola Bíblica',
    desc: 'Ensinamento aprofundado da Palavra com EBD Especial e painel interativo da manhã.',
    color: '#60a5fa',
    glow: 'rgba(96,165,250,0.18)',
    gradientBg: 'linear-gradient(135deg, rgba(96,165,250,0.12) 0%, rgba(96,165,250,0.03) 100%)',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
  },
  {
    number: '1',
    unit: 'dia inteiro',
    title: 'Comunhão em Família',
    desc: 'Um dia completo reunindo toda a família da fé em harmonia, amor e edificação mútua.',
    color: '#34d399',
    glow: 'rgba(52,211,153,0.18)',
    gradientBg: 'linear-gradient(135deg, rgba(52,211,153,0.12) 0%, rgba(52,211,153,0.03) 100%)',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
];

export default function IncludedSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: '#ffffff' }}
    >
      {/* Dot-grid background texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(201,151,58,0.1) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)',
        }}
      />

      {/* Ambient glow blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(201,151,58,0.06) 0%, transparent 70%)' }} />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)' }} />

      <div className="max-w-5xl mx-auto relative">

        {/* ── Header ── */}
        <div
          className="text-center mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <p className="font-body font-semibold tracking-[0.35em] uppercase text-xs mb-3" style={{ color: '#c9973a' }}>
            Domingo Essencial
          </p>
          <h2
            className="font-display"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, lineHeight: 1.1, color: '#1e3a5f' }}
          >
            Tudo incluído no seu ingresso
          </h2>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-px flex-1 max-w-[60px]" style={{ background: 'linear-gradient(to right, transparent, rgba(201,151,58,0.4))' }} />
            <svg width="10" height="10" viewBox="0 0 10 10"><polygon points="5,0 10,10 0,10" fill="#c9973a" /></svg>
            <div className="h-px flex-1 max-w-[60px]" style={{ background: 'linear-gradient(to left, transparent, rgba(201,151,58,0.4))' }} />
          </div>
          <p className="font-body text-sm mt-5 max-w-xl mx-auto leading-relaxed" style={{ color: '#6b7280' }}>
            Um dia completo pensado em cada detalhe — da primeira oração ao jantar de encerramento.
          </p>
        </div>

        {/* ── Cards Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ITEMS.map((item, i) => (
            <div
              key={i}
              className="group relative rounded-3xl p-6 overflow-hidden cursor-default"
              style={{
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.07)',
                boxShadow: '0 2px 20px rgba(0,0,0,0.04)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(40px)',
                transition: `opacity 0.65s ease ${0.1 + i * 0.1}s, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.1}s, box-shadow 0.3s ease`,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 16px 48px ${item.glow}, 0 4px 16px rgba(0,0,0,0.06)`;
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 20px rgba(0,0,0,0.04)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              }}
            >
              {/* Hover background fill */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 rounded-3xl pointer-events-none"
                style={{ background: item.gradientBg, transition: 'opacity 0.4s ease' }}
              />

              {/* Top border that slides in on hover */}
              <div
                className="absolute top-0 left-0 right-0 h-[2.5px] rounded-t-3xl origin-left pointer-events-none"
                style={{
                  background: `linear-gradient(to right, ${item.color}, ${item.color}40)`,
                  transform: 'scaleX(0)',
                  transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
                }}
                ref={el => {
                  if (!el) return;
                  const parent = el.closest('.group');
                  parent?.addEventListener('mouseenter', () => { el.style.transform = 'scaleX(1)'; });
                  parent?.addEventListener('mouseleave', () => { el.style.transform = 'scaleX(0)'; });
                }}
              />

              <div className="relative">
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110"
                  style={{
                    background: item.gradientBg,
                    color: item.color,
                    border: `1px solid ${item.color}22`,
                    animation: visible ? `iconFloat ${5 + i * 0.7}s ease-in-out infinite ${i * 0.4}s` : 'none',
                  }}
                >
                  {item.icon}
                </div>

                {/* Number + unit */}
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span
                    className="font-display font-bold leading-none"
                    style={{
                      fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                      color: item.color,
                      animation: visible ? `countUp 0.6s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.1}s both` : 'none',
                    }}
                  >
                    {item.number}
                  </span>
                  <span
                    className="font-body font-semibold text-[10px] tracking-[0.2em] uppercase pb-1"
                    style={{ color: `${item.color}90` }}
                  >
                    {item.unit}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="font-body font-bold text-base leading-snug mb-2"
                  style={{ color: '#1e3a5f' }}
                >
                  {item.title}
                </h3>

                {/* Desc */}
                <p
                  className="font-body text-sm leading-relaxed"
                  style={{ color: '#6b7280' }}
                >
                  {item.desc}
                </p>

                {/* Bottom accent line */}
                <div
                  className="mt-5 h-px w-0 group-hover:w-full rounded-full"
                  style={{
                    background: `linear-gradient(to right, ${item.color}60, transparent)`,
                    transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── Children banner ── */}
        <div
          className="mt-10 rounded-2xl flex flex-col sm:flex-row items-center justify-center gap-3 px-6 py-5 text-center sm:text-left"
          style={{
            background: 'linear-gradient(135deg, rgba(52,211,153,0.06) 0%, rgba(52,211,153,0.02) 100%)',
            border: '1px solid rgba(52,211,153,0.2)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.7s ease 0.55s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.55s',
          }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(52,211,153,0.12)', color: '#10b981' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <div>
            <p className="font-body font-bold text-sm" style={{ color: '#065f46' }}>
              Crianças até 12 anos entram gratuitamente
            </p>
            <p className="font-body text-xs mt-0.5" style={{ color: '#059669' }}>
              O evento é para toda a família — traga seus filhos!
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
