import { TicketType } from '@/types/registration';

export const EXTRA_ADULT_PRICE_CENTS = 5000; // R$50 por adulto extra (acima de 4 no familia)

export const TICKET_TIERS = {
  individual: {
    label: 'Individual',
    description: '1 adulto',
    price: 5000, // centavos
    priceDisplay: 'R$ 50,00',
    maxParticipants: 1,
    highlight: false,
    savings: null,
  },
  casal: {
    label: 'Casal',
    description: '2 adultos',
    price: 9000,
    priceDisplay: 'R$ 90,00',
    maxParticipants: 2,
    highlight: true,
    savings: 'Economia de R$ 10',
  },
  familia: {
    label: 'Família',
    description: 'Até 4 adultos',
    price: 16000,
    priceDisplay: 'R$ 160,00',
    maxParticipants: 4,
    highlight: false,
    savings: 'Crianças até 12 anos grátis',
  },
} as const satisfies Record<TicketType, {
  label: string;
  description: string;
  price: number;
  priceDisplay: string;
  maxParticipants: number;
  highlight: boolean;
  savings: string | null;
}>;

/**
 * Calcula o total em centavos.
 * - individual / casal: preço fixo, sem extras
 * - familia: R$160 base + R$50 por cada adulto acima de 4
 * Crianças até 12 anos nunca contam no preço.
 */
export function calculateTotalCents(type: TicketType, extraAdults = 0): number {
  const base = TICKET_TIERS[type].price;
  if (type === 'familia' && extraAdults > 0) {
    return base + extraAdults * EXTRA_ADULT_PRICE_CENTS;
  }
  return base;
}

export function getTicketPrice(type: TicketType, extraAdults = 0): number {
  return calculateTotalCents(type, extraAdults);
}

export function getPriceInReais(type: TicketType, extraAdults = 0): number {
  return calculateTotalCents(type, extraAdults) / 100;
}

export function formatReais(cents: number): string {
  return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;
}
