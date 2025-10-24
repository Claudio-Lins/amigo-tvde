// Este arquivo é apenas para demonstração e testes dos templates de email
// Você pode executar este código para ver como os templates ficam

import {
  createEmailChangeTemplate,
  createEmailVerificationTemplate,
  createMagicLinkTemplate,
  createPasswordResetTemplate,
} from "./email-templates";

// Função para testar os templates
export function testEmailTemplates() {
  const testData = {
    userName: "João Silva",
    url: "https://example.com/verify?token=abc123",
    newEmail: "joao.novo@example.com",
    appName: "Better Auth",
  };

  console.log("=== TEMPLATE: Email Verification ===");
  console.log(createEmailVerificationTemplate(testData));

  console.log("\n=== TEMPLATE: Password Reset ===");
  console.log(createPasswordResetTemplate(testData));

  console.log("\n=== TEMPLATE: Magic Link ===");
  console.log(createMagicLinkTemplate(testData));

  console.log("\n=== TEMPLATE: Email Change ===");
  console.log(createEmailChangeTemplate(testData));
}

// Função para criar um template customizado para outras necessidades
export function createCustomEmailTemplate({
  title,
  message,
  buttonText,
  buttonUrl,
  userName,
  appName = "Better Auth",
}: {
  title: string;
  message: string;
  buttonText: string;
  buttonUrl: string;
  userName?: string;
  appName?: string;
}): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - ${appName}</title>
      <style>
        /* Mesmo CSS dos outros templates */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; background-color: #f9fafb; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; }
        .logo { font-size: 28px; font-weight: 700; color: #ffffff; margin: 0; }
        .content { padding: 40px 30px; }
        .title { font-size: 24px; font-weight: 600; color: #111827; margin: 0 0 16px 0; text-align: center; }
        .message { font-size: 16px; color: #6b7280; margin: 0 0 32px 0; text-align: center; line-height: 1.7; }
        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff !important; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; }
        .button-container { text-align: center; margin: 32px 0; }
        .footer { background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer-text { font-size: 14px; color: #9ca3af; margin: 0; }
      </style>
    </head>
    <body>
      <div style="padding: 20px;">
        <div class="email-container">
          <div class="header">
            <h1 class="logo">${appName}</h1>
          </div>
          
          <div class="content">
            <h2 class="title">${title}</h2>
            <p class="message">
              ${userName ? `Olá ${userName}!<br><br>` : "Olá!<br><br>"}
              ${message}
            </p>
            
            <div class="button-container">
              <a href="${buttonUrl}" class="button">${buttonText}</a>
            </div>
          </div>
          
          <div class="footer">
            <p class="footer-text">
              © ${new Date().getFullYear()} ${appName}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Exemplo de uso do template customizado
export function createWelcomeEmailTemplate(userName: string, appName = "Better Auth"): string {
  return createCustomEmailTemplate({
    title: "🎉 Bem-vindo ao Better Auth!",
    message: `Sua conta foi criada com sucesso! Estamos muito felizes em tê-lo conosco. 
              Agora você pode aproveitar todos os recursos da nossa plataforma.`,
    buttonText: "Começar Agora",
    buttonUrl: "https://example.com/dashboard",
    userName,
    appName,
  });
}
