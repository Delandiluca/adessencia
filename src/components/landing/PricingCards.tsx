'use client';

import { TicketType } from '@/types/registration';
import { TICKET_TIERS } from '@/lib/utils/pricing';

interface PricingCardsProps {
  selectedTier: TicketType | null;
  onSelect: (tier: TicketType) => void;
}

const TIER_ORDER: TicketType[] = ['individual', 'casal', 'familia'];

const TIER_FEATURES = {
  individual: [
    'Todas as refeições incluídas',
    'Crianças até 12 anos grátis',
    'Louvor e atividades do dia',
    'Acesso completo ao Domingo Essencial',
  ],
  casal: [
    'Todas as refeições incluídas',
    'Crianças até 12 anos grátis',
    'Louvor e atividades do dia',
    'Acesso completo ao Domingo Essencial',
  ],
  familia: [
    'Até 4 adultos incluídos',
    'Crianças até 12 anos grátis',
    '+R$ 50 por adulto extra (5º, 6º...)',
    'Todas as refeições incluídas',
    'Acesso completo ao Domingo Essencial',
  ],
};

function CheckIcon({ dark }: { dark: boolean }) {
  return (
    <div
      className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
      style={{
        background: dark ? 'rgba(201,151,58,0.25)' : 'rgba(30,58,95,0.08)',
      }}
    >
      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
        <path
          d="M1 3l2 2 4-4"
          stroke={dark ? '#e0b460' : '#1e3a5f'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function PricingCards({ selectedTier, onSelect }: PricingCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto px-4">
      {TIER_ORDER.map((key) => {
        const tier = TICKET_TIERS[key];
        const isSelected = selectedTier === key;
        const isHighlighted = tier.highlight;
        const isDark = isSelected || isHighlighted;

        return (
          <div
            key={key}
            className="relative flex flex-col rounded-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
            style={{
              background: isDark
                ? 'linear-gradient(160deg, #1e3a5f 0%, #0f1f35 100%)'
                : '#ffffff',
              border: isSelected
                ? '1px solid rgba(201,151,58,0.6)'
                : isHighlighted
                ? '1px solid rgba(30,58,95,0.4)'
                : '1px solid #e5e7eb',
              boxShadow: isSelected
                ? '0 0 0 2px rgba(201,151,58,0.25), 0 20px 48px rgba(30,58,95,0.2)'
                : isHighlighted
                ? '0 20px 48px rgba(30,58,95,0.18)'
                : '0 2px 12px rgba(30,58,95,0.06)',
              transform: isHighlighted ? 'scale(1.03)' : 'scale(1)',
            }}
            onClick={() => onSelect(key)}
          >
            {/* Popular badge */}
            {isHighlighted && !isSelected && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                <span
                  className="inline-block px-4 py-1 rounded-full text-xs font-semibold font-body tracking-wide text-white"
                  style={{ background: 'linear-gradient(90deg, #c9973a, #e0b460)' }}
                >
                  ⭐ Mais popular
                </span>
              </div>
            )}

            {/* Selected badge */}
            {isSelected && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                <span
                  className="inline-block px-4 py-1 rounded-full text-xs font-semibold font-body tracking-wide text-white"
                  style={{ background: 'linear-gradient(90deg, #c9973a, #e0b460)' }}
                >
                  ✓ Selecionado
                </span>
              </div>
            )}

            <div className="p-7 flex flex-col flex-1">
              {/* Header */}
              <div className="mb-5">
                <h3
                  className="font-display font-semibold mb-1"
                  style={{ fontSize: '1.5rem', color: isDark ? '#ffffff' : '#1e3a5f' }}
                >
                  {tier.label}
                </h3>
                <p
                  className="text-sm font-body"
                  style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#6b7280' }}
                >
                  {tier.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-5">
                <div className="flex items-end gap-1 mb-2">
                  <span
                    className="font-body text-sm"
                    style={{ color: isDark ? 'rgba(255,255,255,0.4)' : '#9ca3af' }}
                  >
                    R$
                  </span>
                  <span
                    className="font-display font-light leading-none"
                    style={{
                      fontSize: '3.2rem',
                      color: isDark ? '#e0b460' : '#1e3a5f',
                    }}
                  >
                    {tier.price / 100}
                  </span>
                  <span
                    className="font-body text-sm mb-1"
                    style={{ color: isDark ? 'rgba(255,255,255,0.4)' : '#9ca3af' }}
                  >
                    ,00
                  </span>
                </div>

                {tier.savings && (
                  <span
                    className="inline-block text-xs font-body font-medium px-2.5 py-0.5 rounded-full"
                    style={{
                      background: 'rgba(201,151,58,0.15)',
                      color: '#c9973a',
                      border: '1px solid rgba(201,151,58,0.3)',
                    }}
                  >
                    {tier.savings}
                  </span>
                )}
              </div>

              {/* Divider */}
              <div
                className="mb-5 h-px"
                style={{ background: isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6' }}
              />

              {/* Features */}
              <ul className="space-y-2.5 flex-1 mb-6">
                {TIER_FEATURES[key].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <CheckIcon dark={isDark} />
                    <span
                      className="text-sm font-body"
                      style={{ color: isDark ? 'rgba(255,255,255,0.75)' : '#4b5563' }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={(e) => { e.stopPropagation(); onSelect(key); }}
                className="w-full rounded-xl py-3 text-sm font-semibold font-body transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={
                  isDark
                    ? {
                        background: 'linear-gradient(135deg, #c9973a, #e0b460)',
                        color: 'white',
                        boxShadow: '0 4px 20px rgba(201,151,58,0.4)',
                      }
                    : {
                        background: '#f8f7f5',
                        color: '#1e3a5f',
                        border: '1px solid #e5e7eb',
                        fontWeight: 600,
                      }
                }
              >
                {isSelected ? '✓ Selecionado' : 'Selecionar'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
