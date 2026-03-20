export type TicketType = 'individual' | 'casal' | 'familia';
export type PaymentStatus = 'pending' | 'confirmed' | 'failed' | 'cancelled';
export type PaymentMethod = 'pix' | 'credit_card' | 'boleto';

export interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  ticket_type: TicketType;
  amount_cents: number;
  participant_names: string[];
  children_count: number;       // crianças até 12 anos (grátis, não cobradas)
  status: PaymentStatus;
  mp_payment_id: string | null;
  mp_payment_method: PaymentMethod | null;
  mp_status: string | null;
  mp_status_detail: string | null;
  created_at: string;
  confirmed_at: string | null;
  updated_at: string;
}

export interface RegistrationFormData {
  name: string;
  email: string;
  phone: string;
  ticket_type: TicketType;
  participant_names: string[];   // adultos (13+) — tamanho varia para familia com extras
  children_count: number;        // crianças até 12 anos (grátis)
}

export interface CheckoutPayload extends RegistrationFormData {
  // Mercado Pago Payment Brick formData (forwarded as-is)
  payment_method_id: string;
  transaction_amount: number;
  token?: string;
  installments?: number;
  issuer_id?: string;
  payer: {
    email: string;
    first_name?: string;
    last_name?: string;
    identification?: {
      type: string;
      number: string;
    };
  };
}

export interface CheckoutResponse {
  success: boolean;
  registrationId?: string;
  paymentId: string;
  status: string;
  statusDetail: string;
  // PIX
  pixQrCode?: string;
  pixQrCodeBase64?: string;
  // Boleto
  boletoUrl?: string;
  barcode?: string;
  // Credit card redirect
  redirectTo?: string;
  error?: string;
}

export interface AdminStats {
  totalConfirmed: number;
  totalPending: number;
  totalFailed: number;
  revenueConfirmedCents: number;
  revenuePendingCents: number;
}
