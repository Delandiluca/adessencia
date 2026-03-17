'use client';

import { useEffect, useRef } from 'react';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';

interface PaymentBrickProps {
  amount: number;
  payerEmail: string;
  onPaymentSubmit: (formData: unknown) => Promise<void>;
}

let mpInitialized = false;

export default function PaymentBrick({ amount, payerEmail, onPaymentSubmit }: PaymentBrickProps) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && !mpInitialized) {
      const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
      if (publicKey) {
        initMercadoPago(publicKey, { locale: 'pt-BR' });
        mpInitialized = true;
      }
      initialized.current = true;
    }
  }, []);

  if (!process.env.NEXT_PUBLIC_MP_PUBLIC_KEY) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 font-body">
        ⚠️ Chave pública do Mercado Pago não configurada. Defina{' '}
        <code className="font-mono text-xs">NEXT_PUBLIC_MP_PUBLIC_KEY</code> no <code>.env.local</code>.
      </div>
    );
  }

  return (
    <div className="w-full">
      <Payment
        initialization={{
          amount,
          payer: { email: payerEmail },
        }}
        customization={{
          paymentMethods: {
            bankTransfer: 'all',   // PIX
            ticket: 'all',         // Boleto
            creditCard: 'all',
            debitCard: 'all',
            mercadoPago: 'none' as never, // Disable MP wallet
          },
          visual: {
            style: {
              theme: 'default' as const,
              customVariables: {
                baseColor: '#1e3a5f',
                baseColorFirstVariant: '#2d6a9f',
                baseColorSecondVariant: '#0f1f35',
              },
            },
          },
        }}
        onSubmit={onPaymentSubmit}
        onError={(error) => {
          console.error('MP Brick error:', error);
        }}
      />
    </div>
  );
}
