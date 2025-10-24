import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailValues {
  to: string;
  subject: string;
  body: string;
}

interface SendTemplatedEmailValues {
  to: string;
  subject: string;
  template: "email-verification" | "password-reset" | "magic-link" | "email-change";
  userName?: string;
  url: string;
  newEmail?: string;
  appName?: string;
}

export async function sendEmail({ to, subject, body }: SendEmailValues) {
  try {
    const result = await resend.emails.send({
      from: "Better Auth <no-reply@claudiolins.dev>",
      to,
      subject,
      html: body,
      headers: {
        "X-Entity-Ref-ID": Date.now().toString(),
      },
    });

    console.log("Email enviado com sucesso:", JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error("Erro ao enviar email:", JSON.stringify(error, null, 2));
    throw error;
  }
}

export async function sendTemplatedEmail({
  to,
  subject,
  template,
  userName,
  url,
  newEmail,
  appName = "Better Auth",
}: SendTemplatedEmailValues) {
  // Importação dinâmica para evitar problemas de bundle
  const templates = await import("./email-templates");

  let htmlContent: string;

  switch (template) {
    case "email-verification":
      htmlContent = templates.createEmailVerificationTemplate({ userName, url, appName });
      break;
    case "password-reset":
      htmlContent = templates.createPasswordResetTemplate({ userName, url, appName });
      break;
    case "magic-link":
      htmlContent = templates.createMagicLinkTemplate({ userName, url, appName });
      break;
    case "email-change":
      htmlContent = templates.createEmailChangeTemplate({ userName, url, newEmail, appName });
      break;
    default:
      throw new Error(`Template não encontrado: ${template}`);
  }

  return await sendEmail({ to, subject, body: htmlContent });
}
