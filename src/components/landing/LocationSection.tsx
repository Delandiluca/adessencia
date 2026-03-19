'use client';

export default function LocationSection() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Como Chegar
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nos encontre no endereço abaixo. Estaremos juntos o dia todo em adoração e comunhão.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Map Embed */}
          <div className="rounded-2xl overflow-hidden shadow-xl h-[400px] lg:h-[500px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3740.7640589623!2d-41.109873!3d-20.837421!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0:0x0!2zMjDCsDUwJzE2LjMiUyA0McKAwwowJzM1LjkiVw!5e0!3m2!1spt-BR!2sbr!4v1710756000000"
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
          <div className="space-y-8">
            {/* Address Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-amber-500 rounded-full p-3 flex-shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Local do Evento
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-semibold">Assembleia de Deus Essência da Adoração</span>
                    <br />
                    Rua Samuel Levi, 145
                    <br />
                    Cachoeiro de Itapemirim, ES
                    <br />
                    <span className="text-sm text-gray-600">CEP: 29300-000</span>
                  </p>
                </div>
              </div>
              
              {/* Contact */}
              <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-amber-100">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 flex-shrink-0">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <a 
                  href="https://wa.me/5528999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-700 font-semibold hover:text-amber-900 transition-colors"
                >
                  Fale conosco via WhatsApp
                </a>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">📍 Dica de navegação</h4>
              <p className="text-gray-700 text-sm">
                Use o mapa acima para obter direções e tempo de deslocamento de sua localização. O estacionamento está disponível no local.
              </p>
            </div>

            {/* Day Info */}
            <div className="bg-amber-100 rounded-lg p-6 border border-amber-300">
              <p className="text-center">
                <span className="block text-2xl font-bold text-amber-900 mb-1">
                  Um Dia com Deus
                </span>
                <span className="text-sm text-amber-700">
                  Comece cedo — consagração às 06:00 da manhã
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
