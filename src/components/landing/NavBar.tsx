'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { label: 'Início', href: '#' },
  { label: 'Programação', href: '#programacao' },
  { label: 'Inscrição', href: '#inscricao' },
  { label: 'Como Chegar', href: '#localizacao' },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    if (href === '#') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(16px)',
        boxShadow: scrolled ? '0 2px 24px rgba(30,58,95,0.10)' : '0 1px 0 rgba(0,0,0,0.04)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <button onClick={() => scrollTo('#')} className="flex items-center gap-3 flex-shrink-0">
          <Image src="/IMG_9077.png" alt="Logo" width={36} height={36} style={{ objectFit: 'contain' }} />
          <span className="font-body font-semibold text-xs tracking-[0.15em] uppercase hidden sm:block" style={{ color: '#1e3a5f' }}>
            Essência da Adoração
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <button
              key={l.label}
              onClick={() => scrollTo(l.href)}
              className="font-body text-sm font-medium transition-colors duration-200 hover:opacity-60"
              style={{ color: '#1e3a5f' }}
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <button
          onClick={() => scrollTo('#inscricao')}
          className="hidden md:inline-flex items-center gap-2 px-5 py-2 rounded-full font-body font-semibold text-sm text-white flex-shrink-0 transition-all duration-200 hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #C8860A, #D4991A)', boxShadow: '0 4px 16px rgba(201,151,58,0.35)' }}
        >
          Quero Me Inscrever
        </button>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="2">
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className="md:hidden px-6 pb-4 flex flex-col gap-3"
          style={{ borderTop: '1px solid rgba(30,58,95,0.06)' }}
        >
          {NAV_LINKS.map((l) => (
            <button
              key={l.label}
              onClick={() => scrollTo(l.href)}
              className="font-body text-sm font-medium text-left py-2"
              style={{ color: '#1e3a5f' }}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo('#inscricao')}
            className="w-full py-2.5 rounded-full font-body font-semibold text-sm text-white mt-1"
            style={{ background: 'linear-gradient(135deg, #C8860A, #D4991A)' }}
          >
            Quero Me Inscrever
          </button>
        </div>
      )}
    </header>
  );
}
