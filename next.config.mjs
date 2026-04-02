/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.mercadopago.com' },
      { protocol: 'https', hostname: '*.mercadopago.com.br' },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',           value: 'DENY' },
          { key: 'X-Content-Type-Options',     value: 'nosniff' },
          { key: 'Referrer-Policy',            value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',         value: 'camera=(), microphone=(), geolocation=(), payment=()' },
          {
            key: 'Content-Security-Policy',
            // script-src: permite 'self' + SDK do PagSeguro + inline scripts do Next.js
            // style-src: 'unsafe-inline' necessário para Tailwind/Next.js
            // img-src: 'self' + data URIs (QR code base64)
            // connect-src: 'self' + PagBank APIs (chamadas fetch do browser)
            // frame-ancestors: 'none' (reforça X-Frame-Options)
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://assets.pagseguro.com.br",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self'",
              "connect-src 'self' https://api.pagseguro.com https://sandbox.api.pagseguro.com",
              "frame-src https://www.google.com https://maps.google.com",
              "frame-ancestors 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
        ],
      },
    ];
  },
};

export default nextConfig;
