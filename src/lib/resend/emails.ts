import { Resend } from 'resend';
import { Registration } from '@/types/registration';
import { TICKET_TIERS } from '@/lib/utils/pricing';

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('Missing RESEND_API_KEY');
  return new Resend(key);
}

export async function sendConfirmationEmail(registration: Registration): Promise<void> {
  const tier = TICKET_TIERS[registration.ticket_type];
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'noreply@adessencia.com.br';

  const participantsHtml =
    registration.participant_names.length > 0
      ? `<ul style="margin:8px 0;padding-left:20px;">${registration.participant_names.map((n) => `<li>${n}</li>`).join('')}</ul>`
      : `<p style="margin:4px 0;">${registration.name}</p>`;

  await getResend().emails.send({
    from: fromEmail,
    to: registration.email,
    subject: '✅ Inscrição Confirmada — Retiro ADESSENCIA 2026',
    html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family:Arial,sans-serif;background:#f5f5f5;margin:0;padding:20px;">
  <div style="max-width:580px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">

    <div style="background:linear-gradient(135deg,#1e3a5f,#2d6a9f);padding:32px 24px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;">ADESSÊNCIA</h1>
      <p style="color:#a8d4f5;margin:8px 0 0;font-size:14px;">Retiro de Adoração e Comunhão</p>
    </div>

    <div style="padding:32px 24px;">
      <div style="text-align:center;margin-bottom:24px;">
        <div style="display:inline-block;background:#d4edda;border-radius:50%;width:56px;height:56px;line-height:56px;font-size:28px;">✅</div>
        <h2 style="color:#1a1a1a;margin:12px 0 4px;font-size:20px;">Inscrição Confirmada!</h2>
        <p style="color:#666;margin:0;font-size:14px;">Pagamento recebido com sucesso</p>
      </div>

      <p style="color:#333;font-size:15px;">Olá, <strong>${registration.name}</strong>!</p>
      <p style="color:#555;font-size:14px;line-height:1.6;">
        Ficamos muito felizes em confirmar sua presença no nosso retiro. Prepare seu coração para um dia especial de adoração, comunhão e encontro com Deus!
      </p>

      <div style="background:#f8f9fa;border-radius:8px;padding:20px;margin:20px 0;border-left:4px solid #2d6a9f;">
        <h3 style="color:#1e3a5f;margin:0 0 16px;font-size:16px;">📋 Detalhes da Inscrição</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:6px 0;color:#666;font-size:13px;width:40%;">Data do Evento</td><td style="padding:6px 0;color:#333;font-size:13px;font-weight:600;">5 de Abril de 2026</td></tr>
          <tr><td style="padding:6px 0;color:#666;font-size:13px;">Tipo de Ingresso</td><td style="padding:6px 0;color:#333;font-size:13px;font-weight:600;">${tier.label}</td></tr>
          <tr><td style="padding:6px 0;color:#666;font-size:13px;">Valor Pago</td><td style="padding:6px 0;color:#333;font-size:13px;font-weight:600;">${tier.priceDisplay}</td></tr>
          <tr><td style="padding:6px 0;color:#666;font-size:13px;vertical-align:top;">Participantes</td><td style="padding:6px 0;color:#333;font-size:13px;">${participantsHtml}</td></tr>
        </table>
      </div>

      <div style="background:#fff3cd;border-radius:8px;padding:16px;margin:20px 0;">
        <h3 style="color:#856404;margin:0 0 8px;font-size:14px;">☕ Programação do Dia</h3>
        <p style="color:#856404;font-size:13px;margin:0;line-height:1.8;">
          07:30 — Café da Manhã<br>
          08:30 — Louvor &amp; Adoração<br>
          12:00 — Almoço<br>
          14:00 — Sessão da Tarde<br>
          16:30 — Café da Tarde<br>
          18:00 — Culto de Encerramento<br>
          19:30 — Jantar
        </p>
      </div>

      <p style="color:#555;font-size:13px;text-align:center;margin-top:24px;">
        Dúvidas? Responda este e-mail ou entre em contato com a organização.
      </p>
    </div>

    <div style="background:#f8f9fa;padding:16px 24px;text-align:center;border-top:1px solid #eee;">
      <p style="color:#999;font-size:12px;margin:0;">ADESSÊNCIA — Retiro 2026 &bull; ID da Inscrição: ${registration.id.slice(0, 8).toUpperCase()}</p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  });
}
