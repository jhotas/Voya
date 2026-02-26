"use server"
import nodemailer from 'nodemailer';

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
  // 1. Check for missing environment variables
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('SERVER ERROR: EMAIL_USER or EMAIL_PASSWORD is not set in environment variables.');
    return {
      success: false,
      error: 'Serviço de e-mail não configurado no servidor. Verifique as variáveis de ambiente no Vercel.'
    };
  }

  try {
    // 2. Configure the transporter inside the function for stability on Vercel
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false // Helps with certificate issues in some hosting environments
      }
    });

    const mailOptions = {
      from: `"Voya" <${process.env.EMAIL_USER}>`,
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
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    // CRITICAL: Only return serializable data.
    // Do not return the full 'info' object from nodemailer as it contains non-serializable data.
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error: any) {
    // Log the full error to Vercel console
    console.error('SMTP ERROR:', error);

    return {
      success: false,
      error: `Falha no envio: ${error.message || 'Erro desconhecido'}`
    };
  }
}
