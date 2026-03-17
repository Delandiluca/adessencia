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
    'Acesso completo ao retiro',
  ],
  casal: [
    'Todas as refeições incluídas',
    'Crianças até 12 anos grátis',
    'Louvor e atividades do dia',
    'Acesso completo ao retiro',
  ],
  familia: [
    'Até 4 adultos incluídos',
    'Crianças até 12 anos grátis',
    '+R$ 50 por adulto extra (5º, 6º...)',
    'Todas as refeições incluídas',
    'Acesso completo ao retiro',
  ],
};

function CheckIcon({ highlight }: { highlight: boolean }) {
  return (
    <div
      className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
      style={{
        background: highlight ? 'rgba(201,151,58,0.2)' : 'rgba(255,255,255,0.08)',
      }}
    >
      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
        <path
          d="M1 3l2 2 4-4"
          stroke={highlight ? '#e0b460' : 'rgba(255,255,255,0.5)'}
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
        const isActive = isSelected || isHighlighted;

        return (
          <div
            key={key}
            className="relative flex flex-col rounded-2xl transition-all duration-300 cursor-pointer"
            style={{
              background: isActive
                ? 'linear-gradient(160deg, rgba(30,58,95,0.9) 0%, rgba(15,31,53,0.95) 100%)'
                : 'rgba(255,255,255,0.03)',
              border: isSelected
                ? '1px solid rgba(201,151,58,0.6)'
                : isHighlighted
                ? '1px solid rgba(45,106,159,0.5)'
                : '1px solid rgba(255,255,255,0.07)',
              boxShadow: isSelected
                ? '0 0 0 1px rgba(201,151,58,0.3), 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)'
                : isHighlighted
                ? '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
                : '0 4px 20px rgba(0,0,0,0.2)',
              transform: isHighlighted ? 'scale(1.03)' : 'scale(1)',
              backdropFilter: 'blur(12px)',
            }}
            onClick={() => onSelect(key)}
          >
            {/* Popular badge */}
            {isHighlighted && (
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
                  style={{ fontSize: '1.5rem', color: 'white' }}
                >
                  {tier.label}
                </h3>
                <p className="text-sm font-body" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {tier.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-5">
                <div className="flex items-end gap-1 mb-2">
                  <span className="font-body text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    R$
                  </span>
                  <span
                    className="font-display font-light leading-none"
                    style={{
                      fontSize: '3.2rem',
                      color: isActive ? '#e0b460' : 'rgba(255,255,255,0.85)',
                    }}
                  >
                    {tier.price / 100}
                  </span>
                  <span className="font-body text-sm mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    ,00
                  </span>
                </div>

                {tier.savings && (
                  <span
                    className="inline-block text-xs font-body font-medium px-2.5 py-0.5 rounded-full"
                    style={{
                      background: 'rgba(201,151,58,0.15)',
                      color: '#e0b460',
                      border: '1px solid rgba(201,151,58,0.25)',
                    }}
                  >
                    {tier.savings}
                  </span>
                )}
              </div>

              {/* Divider */}
              <div
                className="mb-5 h-px"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              />

              {/* Features */}
              <ul className="space-y-2.5 flex-1 mb-6">
                {TIER_FEATURES[key].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <CheckIcon highlight={isActive} />
                    <span
                      className="text-sm font-body"
                      style={{ color: isActive ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.4)' }}
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
                  isSelected
                    ? {
                        background: 'linear-gradient(135deg, #c9973a, #e0b460)',
                        color: 'white',
                        boxShadow: '0 4px 20px rgba(201,151,58,0.4)',
                      }
                    : isHighlighted
                    ? {
                        background: 'linear-gradient(135deg, #c9973a, #e0b460)',
                        color: 'white',
                        boxShadow: '0 4px 20px rgba(201,151,58,0.3)',
                      }
                    : {
                        background: 'rgba(255,255,255,0.06)',
                        color: 'rgba(255,255,255,0.7)',
                        border: '1px solid rgba(255,255,255,0.1)',
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
