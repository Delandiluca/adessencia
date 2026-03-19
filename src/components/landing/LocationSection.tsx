'use client';

export default function LocationSection() {
  return (
    <section className="py-28 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-light text-gray-900 mb-4">
            Como Chegar
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Nos encontre neste endereço. Estaremos juntos o dia todo em adoração e comunhão.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Map Embed */}
          <div className="rounded-2xl overflow-hidden shadow-xl h-[400px] lg:h-[500px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3740.8640589623!2d-41.1108730!3d-20.8370210!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0:0x0!2zMjDCsDUwJzEyLjMiUyA0McKAwwowJzM0LjciVw!5e0!3m2!1spt-BR!2sbr!4v1710925200000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>

          {/* Address Info */}
          <div className="space-y-6">
            {/* Address Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-amber-500 rounded-full p-3 flex-shrink-0 mt-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Local do Evento
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    <span className="font-semibold block mb-1">Assembleia de Deus Essência da Adoração — Matriz</span>
                    Rua Samuel Levi, 145
                    <br />
                    Aquidaban, Cachoeiro de Itapemirim, ES
                    <br />
                    <span className="text-xs text-gray-600 block mt-2">CEP: 29308-183</span>
                  </p>
                </div>
              </div>
              
              {/* Contact Buttons */}
              <div className="space-y-3">
                {/* Secretaria */}
                <a 
                  href="https://wa.me/5528999500145"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white rounded-lg p-3 border border-amber-100 hover:bg-amber-50 transition-colors text-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-amber-600 flex-shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.869 1.171c-1.519.761-2.823 1.993-3.56 3.574-1.347 2.921-.65 6.496 1.71 8.654 1.216 1.118 2.846 1.798 4.719 1.798 1.88 0 3.538-.685 4.75-1.807 2.393-2.174 3.156-5.766 1.881-8.67-.7-1.604-1.996-2.858-3.516-3.612-1.49-.735-3.124-.904-4.715-.104zm10.906-1.48c-.673-.673-1.77-1.065-2.857-1.065-2.172 0-4.16 1.29-5.45 3.27-.877 1.407-1.384 3.084-1.384 4.821 0 1.127.206 2.212.59 3.237l.53 1.308c.073.181.196.267.348.267.15 0 .274-.086.348-.267l.53-1.308c.383-1.025.589-2.11.589-3.237 0-1.737-.507-3.414-1.384-4.821-1.29-1.98-3.278-3.27-5.45-3.27-1.087 0-2.184.392-2.857 1.065z"/>
                  </svg>
                  <div>
                    <span className="text-xs text-gray-500 block">Secretaria</span>
                    <span className="font-semibold text-amber-700">(28) 99950-0145</span>
                  </div>
                </a>

                {/* Tesouraria */}
                <a 
                  href="https://wa.me/5528999081083"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white rounded-lg p-3 border border-amber-100 hover:bg-amber-50 transition-colors text-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-amber-600 flex-shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.869 1.171c-1.519.761-2.823 1.993-3.56 3.574-1.347 2.921-.65 6.496 1.71 8.654 1.216 1.118 2.846 1.798 4.719 1.798 1.88 0 3.538-.685 4.75-1.807 2.393-2.174 3.156-5.766 1.881-8.67-.7-1.604-1.996-2.858-3.516-3.612-1.49-.735-3.124-.904-4.715-.104zm10.906-1.48c-.673-.673-1.77-1.065-2.857-1.065-2.172 0-4.16 1.29-5.45 3.27-.877 1.407-1.384 3.084-1.384 4.821 0 1.127.206 2.212.59 3.237l.53 1.308c.073.181.196.267.348.267.15 0 .274-.086.348-.267l.53-1.308c.383-1.025.589-2.11.589-3.237 0-1.737-.507-3.414-1.384-4.821-1.29-1.98-3.278-3.27-5.45-3.27-1.087 0-2.184.392-2.857 1.065z"/>
                  </svg>
                  <div>
                    <span className="text-xs text-gray-500 block">Tesouraria</span>
                    <span className="font-semibold text-amber-700">(28) 99908-1083</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2 text-sm">🕒 Horário Administrativo</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                Matriz: <span className="font-semibold">9:00 às 18:00</span> (horário comercial)
              </p>
            </div>

            {/* Day Info */}
            <div className="bg-amber-100 rounded-lg p-6 border border-amber-300">
              <p className="text-center">
                <span className="block text-2xl font-bold text-amber-900 mb-1">
                  Domingo Essencial
                </span>
                <span className="text-sm text-amber-700 leading-relaxed">
                  5 de Abril — Comece cedo com a consagração às 06:00
                </span>
              </p>
            </div>

            {/* Navigation Tip */}
            <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2 text-sm">📍 Dica de Navegação</h4>
              <p className="text-gray-700 text-sm">
                Use o mapa acima para obter direções de sua localização. Estacionamento disponível no local.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
