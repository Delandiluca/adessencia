export type TicketType = 'individual' | 'casal' | 'familia';
export type PaymentStatus = 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'failed';
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
  gateway_payment_id: string | null;
  gateway_method: PaymentMethod | null;
  gateway_status: string | null;
  gateway_status_detail: string | null;
  installments: number | null;   // número de parcelas (cartão); null = à vista / PIX
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

// Payload enviado ao /api/checkout (PagBank)
export interface CheckoutPayload extends RegistrationFormData {
  payment_method: 'PIX' | 'CREDIT_CARD';
  cpf: string;
  encrypted_card?: string;
  card_holder?: string;
  card_security_code?: string;
  installments?: number;
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
