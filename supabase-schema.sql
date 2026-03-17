-- ╔══════════════════════════════════════════════════════╗
-- ║   ADESSÊNCIA — Schema do Banco de Dados (Supabase)   ║
-- ║   Execute este script no SQL Editor do Supabase       ║
-- ╚══════════════════════════════════════════════════════╝

-- Tipos enumerados
CREATE TYPE ticket_type    AS ENUM ('individual', 'casal', 'familia');
CREATE TYPE payment_status AS ENUM ('pending', 'confirmed', 'failed', 'cancelled');

-- Tabela principal de inscrições
CREATE TABLE registrations (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Contato principal (quem preencheu o formulário)
  name                  TEXT NOT NULL,
  email                 TEXT NOT NULL,
  phone                 TEXT NOT NULL,

  -- Ingresso
  ticket_type           ticket_type NOT NULL,
  amount_cents          INTEGER NOT NULL,        -- R$50=5000 | R$90=9000 | R$160=16000
  participant_names     TEXT[] NOT NULL DEFAULT '{}',

  -- Pagamento
  status                payment_status NOT NULL DEFAULT 'pending',
  mp_payment_id         TEXT,                    -- ID do pagamento no Mercado Pago
  mp_payment_method     TEXT,                    -- 'pix' | 'credit_card' | 'boleto'
  mp_status             TEXT,                    -- Status bruto do MP
  mp_status_detail      TEXT,                    -- Detalhe do status do MP

  -- Timestamps
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at          TIMESTAMPTZ,             -- Preenchido quando webhook confirma
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_registrations_mp_payment_id ON registrations(mp_payment_id);
CREATE INDEX idx_registrations_status        ON registrations(status);
CREATE INDEX idx_registrations_created_at    ON registrations(created_at DESC);
CREATE INDEX idx_registrations_email         ON registrations(email);

-- Trigger: atualiza updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER registrations_updated_at
  BEFORE UPDATE ON registrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security: todo acesso passa pelo service role (server-side)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Sem policies públicas — o frontend não acessa o banco diretamente
-- O Next.js usa a SUPABASE_SERVICE_ROLE_KEY nas API routes (server-side only)
