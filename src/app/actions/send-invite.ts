"use server"
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendInviteEmailProps {
  email: string;
  name?: string;
  tripDestination: string;
  confirmationLink: string;
}

export async function sendInviteEmail({
  email,
  name,
  tripDestination,
  confirmationLink
}: SendInviteEmailProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Voya <onboarding@resend.dev>',
      to: email,
      subject: `Convite para viajar para ${tripDestination}! ✈️`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #111; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #000;">Olá, ${name || 'viajante'}!</h2>
          <p>Você foi convidado para participar de uma viagem para <strong>${tripDestination}</strong> no Voya.</p>
          <p>O Voya ajuda você e seus amigos a planejarem roteiros, atividades e links importantes em um só lugar.</p>

          <div style="margin: 30px 0; text-align: center;">
            <a href="${confirmationLink}" style="background-color: #bef264; color: #1a2e05; padding: 14px 24px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px;">
              Confirmar presença na viagem
            </a>
          </div>

          <p style="font-size: 14px; color: #666;">Se você não esperava este convite, pode ignorar este e-mail.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999; text-align: center;">Voya - Seu próximo destino começa aqui.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Server error sending email:', error);
    return { success: false, error: error.message };
  }
}
