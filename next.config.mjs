/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow MP SDK images (QR codes come from MP's CDN)
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
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        // Disable caching for webhook endpoint
        source: '/api/webhooks/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache' },
        ],
      },
    ];
  },
};

export default nextConfig;
