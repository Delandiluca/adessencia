'use client';

export default function LocationSection() {
  return (
    <section id="localizacao" className="py-24 px-6" style={{ background: '#ffffff' }}>
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="font-display text-navy" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 600 }}>
            Como Chegar
          </h2>
          <div className="flex justify-center mt-4">
            <div className="h-[2px] w-12 rounded-full" style={{ background: 'linear-gradient(to right, transparent, #C8860A, transparent)' }} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          {/* Map — 3 cols */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden" style={{ height: 420, boxShadow: '0 4px 24px rgba(30,58,95,0.10)' }}>
            <iframe
              src="https://maps.google.com/maps?q=-20.842889,-41.121250&output=embed&z=17"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Info — 2 cols */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Address */}
            <div>
              <p className="font-body font-semibold text-xs tracking-widest uppercase mb-3" style={{ color: '#C8860A' }}>
                Local do Evento
              </p>
              <h3 className="font-display font-semibold text-navy mb-1" style={{ fontSize: '1.15rem' }}>
                Assembleia de Deus Essência da Adoração
              </h3>
              <p className="font-body text-sm leading-relaxed" style={{ color: '#6b7280' }}>
                Rua Samuel Levi, 145<br />
                Aquidaban, Cachoeiro de Itapemirim, ES<br />
                <span style={{ color: '#9ca3af' }}>CEP: 29308-183</span>
              </p>
            </div>

            {/* Divider */}
            <div className="h-px" style={{ background: '#f0ede8' }} />

            {/* Contacts */}
            <div>
              <p className="font-body font-semibold text-xs tracking-widest uppercase mb-3" style={{ color: '#C8860A' }}>
                Contato
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="https://wa.me/5528999500145"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-gray-50"
                  style={{ background: '#faf9f7' }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(201,151,58,0.1)', color: '#C8860A' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-body text-xs" style={{ color: '#9ca3af' }}>Secretaria</p>
                    <p className="font-body font-semibold text-sm" style={{ color: '#1e3a5f' }}>(28) 99950-0145</p>
                  </div>
                </a>

                <a
                  href="https://wa.me/5528999081083"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-gray-50"
                  style={{ background: '#faf9f7' }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(201,151,58,0.1)', color: '#C8860A' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-body text-xs" style={{ color: '#9ca3af' }}>Tesouraria</p>
                    <p className="font-body font-semibold text-sm" style={{ color: '#1e3a5f' }}>(28) 99908-1083</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Event date reminder */}
            <div
              className="rounded-xl p-4 text-center"
              style={{ background: 'rgba(201,151,58,0.06)', border: '1px solid rgba(201,151,58,0.15)' }}
            >
              <p className="font-display font-semibold text-navy" style={{ fontSize: '1.1rem' }}>Domingo Essencial</p>
              <p className="font-body text-sm mt-1" style={{ color: '#C8860A' }}>5 de Abril de 2026 · A partir das 06:00</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
