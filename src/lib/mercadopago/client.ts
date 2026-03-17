import MercadoPagoConfig, { Payment } from 'mercadopago';

let mpClient: MercadoPagoConfig | null = null;

function getMPClient(): MercadoPagoConfig {
  if (!mpClient) {
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) throw new Error('Missing MP_ACCESS_TOKEN');
    mpClient = new MercadoPagoConfig({ accessToken });
  }
  return mpClient;
}

export function getMPPayment(): Payment {
  return new Payment(getMPClient());
}
