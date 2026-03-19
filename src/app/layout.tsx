import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Domingo Essencial 2026 — Essência da Adoração',
  description:
    'Um dia inteiro dedicado à adoração, comunhão e encontro com Deus. 5 de Abril de 2026 — Assembleia de Deus Essência da Adoração, Cachoeiro de Itapemirim. Todas as refeições incluídas. Garanta sua vaga!',
  openGraph: {
    title: 'Domingo Essencial 2026 — Essência da Adoração',
    description:
      'Um dia inteiro de adoração, comunhão e Palavra. 5 de Abril · Cachoeiro de Itapemirim · Todas as refeições incluídas.',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Domingo Essencial 2026 — Essência da Adoração',
    description: 'Um dia inteiro de adoração, comunhão e Palavra. 5 de Abril · Cachoeiro de Itapemirim.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
