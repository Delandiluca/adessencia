'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      setError('Senha incorreta. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#f0ede8' }}
    >
      {/* Decorative gold line top */}
      <div className="fixed top-0 left-0 right-0 h-[3px]"
        style={{ background: 'linear-gradient(90deg, transparent, #C8860A 30%, #D4991A 50%, #C8860A 70%, transparent)' }} />

      <div className="w-full max-w-sm">

        {/* Card */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{ boxShadow: '0 8px 48px rgba(30,58,95,0.12), 0 2px 8px rgba(30,58,95,0.06)' }}
        >
          {/* Navy top band */}
          <div
            className="px-8 pt-8 pb-6 flex flex-col items-center text-center"
            style={{ background: 'linear-gradient(160deg, #1e3a5f 0%, #0f2240 100%)' }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <Image src="/IMG_9077.png" alt="Logo" width={36} height={36} style={{ objectFit: 'contain' }} />
            </div>
            <h1 className="font-display text-white text-2xl font-semibold tracking-wider">
              ADESSÊNCIA
            </h1>
            <p className="font-body text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Painel Administrativo
            </p>
            <div className="mt-3 px-3 py-1 rounded-full text-[10px] font-body font-semibold tracking-wider uppercase"
              style={{ background: 'rgba(201,151,58,0.2)', color: '#D4991A', border: '1px solid rgba(201,151,58,0.3)' }}>
              Domingo Essencial · 2026
            </div>
          </div>

          {/* Form area */}
          <div className="bg-white px-8 py-7">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold font-body mb-1.5 tracking-[0.12em] uppercase"
                  style={{ color: '#6b7280' }}>
                  Senha de Acesso
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                    className="input-field pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-80"
                    style={{ color: '#9ca3af' }}
                  >
                    {showPass ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-body"
                  style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !password}
                className="w-full rounded-xl py-3.5 text-sm font-semibold font-body transition-all duration-200 hover:opacity-90 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #C8860A, #D4991A)', color: '#1a0e00' }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Verificando...
                  </>
                ) : (
                  <>
                    Acessar Painel
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            <p className="text-center mt-5 font-body text-[11px]" style={{ color: '#9ca3af' }}>
              Acesso restrito · ADESSÊNCIA © 2026
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
