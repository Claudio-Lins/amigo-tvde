interface EmailTemplateProps {
  userName?: string;
  url: string;
  newEmail?: string;
  appName?: string;
}

const baseStyles = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #374151;
      background-color: #f9fafb;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 30px;
      text-align: center;
    }
    
    .logo {
      font-size: 28px;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
      letter-spacing: -0.5px;
    }
    
    .content {
      padding: 40px 30px;
    }
    
    .title {
      font-size: 24px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 16px 0;
      text-align: center;
    }
    
    .message {
      font-size: 16px;
      color: #6b7280;
      margin: 0 0 32px 0;
      text-align: center;
      line-height: 1.7;
    }
    
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff !important;
      padding: 16px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      text-align: center;
      transition: all 0.2s;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
    
    .button:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
    }
    
    .button-container {
      text-align: center;
      margin: 32px 0;
    }
    
    .footer {
      background-color: #f9fafb;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    
    .footer-text {
      font-size: 14px;
      color: #9ca3af;
      margin: 0;
    }
    
    .security-note {
      background-color: #fef3c7;
      border: 1px solid #fbbf24;
      border-radius: 8px;
      padding: 16px;
      margin: 24px 0;
    }
    
    .security-text {
      font-size: 14px;
      color: #92400e;
      margin: 0;
    }
    
    .link-text {
      font-size: 12px;
      color: #9ca3af;
      margin: 16px 0 0 0;
      word-break: break-all;
    }
    
    @media only screen and (max-width: 600px) {
      .email-container {
        margin: 0;
        border-radius: 0;
      }
      
      .header, .content, .footer {
        padding: 30px 20px;
      }
      
      .title {
        font-size: 20px;
      }
      
      .button {
        display: block;
        width: 100%;
        box-sizing: border-box;
      }
    }
  </style>
`;

export function createEmailVerificationTemplate({
  userName,
  url,
  appName = "Better Auth",
}: EmailTemplateProps): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verificar Email - ${appName}</title>
      ${baseStyles}
    </head>
    <body>
      <div style="padding: 20px;">
        <div class="email-container">
          <div class="header">
            <h1 class="logo">${appName}</h1>
          </div>
          
          <div class="content">
            <h2 class="title">Verificar seu email</h2>
            <p class="message">
              ${userName ? `Olá ${userName}!` : "Olá!"}<br><br>
              Obrigado por se cadastrar! Para completar seu registro e começar a usar sua conta, 
              precisamos verificar seu endereço de email.
            </p>
            
            <div class="button-container">
              <a href="${url}" class="button">Verificar Email</a>
            </div>
            
            <div class="security-note">
              <p class="security-text">
                🔒 <strong>Nota de segurança:</strong> Este link é válido por 24 horas e pode ser usado apenas uma vez.
              </p>
            </div>
            
            <p class="link-text">
              Se o botão não funcionar, copie e cole este link no seu navegador:<br>
              ${url}
            </p>
          </div>
          
          <div class="footer">
            <p class="footer-text">
              Se você não criou uma conta conosco, pode ignorar este email com segurança.<br>
              © ${new Date().getFullYear()} ${appName}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function createPasswordResetTemplate({ userName, url, appName = "Better Auth" }: EmailTemplateProps): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Redefinir Senha - ${appName}</title>
      ${baseStyles}
    </head>
    <body>
      <div style="padding: 20px;">
        <div class="email-container">
          <div class="header">
            <h1 class="logo">${appName}</h1>
          </div>
          
          <div class="content">
            <h2 class="title">Redefinir sua senha</h2>
            <p class="message">
              ${userName ? `Olá ${userName}!` : "Olá!"}<br><br>
              Recebemos uma solicitação para redefinir a senha da sua conta. 
              Clique no botão abaixo para criar uma nova senha.
            </p>
            
            <div class="button-container">
              <a href="${url}" class="button">Redefinir Senha</a>
            </div>
            
            <div class="security-note">
              <p class="security-text">
                🔒 <strong>Importante:</strong> Este link é válido por 1 hora. Se você não solicitou esta alteração, 
                ignore este email - sua senha permanecerá inalterada.
              </p>
            </div>
            
            <p class="link-text">
              Se o botão não funcionar, copie e cole este link no seu navegador:<br>
              ${url}
            </p>
          </div>
          
          <div class="footer">
            <p class="footer-text">
              Se você não solicitou a redefinição de senha, pode ignorar este email com segurança.<br>
              © ${new Date().getFullYear()} ${appName}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function createMagicLinkTemplate({ userName, url, appName = "Better Auth" }: EmailTemplateProps): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Link Mágico - ${appName}</title>
      ${baseStyles}
    </head>
    <body>
      <div style="padding: 20px;">
        <div class="email-container">
          <div class="header">
            <h1 class="logo">${appName}</h1>
          </div>
          
          <div class="content">
            <h2 class="title">🎯 Seu link mágico chegou!</h2>
            <p class="message">
              ${userName ? `Olá ${userName}!` : "Olá!"}<br><br>
              Clique no botão abaixo para fazer login instantaneamente na sua conta. 
              Sem senha necessária - é mágica! ✨
            </p>
            
            <div class="button-container">
              <a href="${url}" class="button">🚀 Entrar Agora</a>
            </div>
            
            <div class="security-note">
              <p class="security-text">
                🔒 <strong>Segurança em primeiro lugar:</strong> Este link é válido por 15 minutos e funciona apenas uma vez.
              </p>
            </div>
            
            <p class="link-text">
              Se o botão não funcionar, copie e cole este link no seu navegador:<br>
              ${url}
            </p>
          </div>
          
          <div class="footer">
            <p class="footer-text">
              Se você não solicitou este login, pode ignorar este email com segurança.<br>
              © ${new Date().getFullYear()} ${appName}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function createEmailChangeTemplate({
  userName,
  url,
  newEmail,
  appName = "Better Auth",
}: EmailTemplateProps): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmar Mudança de Email - ${appName}</title>
      ${baseStyles}
    </head>
    <body>
      <div style="padding: 20px;">
        <div class="email-container">
          <div class="header">
            <h1 class="logo">${appName}</h1>
          </div>
          
          <div class="content">
            <h2 class="title">Confirmar mudança de email</h2>
            <p class="message">
              ${userName ? `Olá ${userName}!` : "Olá!"}<br><br>
              Você solicitou a alteração do seu email para: <strong>${newEmail}</strong><br><br>
              Para confirmar esta mudança, clique no botão abaixo.
            </p>
            
            <div class="button-container">
              <a href="${url}" class="button">Confirmar Mudança</a>
            </div>
            
            <div class="security-note">
              <p class="security-text">
                🔒 <strong>Importante:</strong> Este link é válido por 24 horas. Se você não solicitou esta alteração, 
                ignore este email e seu email permanecerá inalterado.
              </p>
            </div>
            
            <p class="link-text">
              Se o botão não funcionar, copie e cole este link no seu navegador:<br>
              ${url}
            </p>
          </div>
          
          <div class="footer">
            <p class="footer-text">
              Se você não solicitou esta mudança de email, pode ignorar este email com segurança.<br>
              © ${new Date().getFullYear()} ${appName}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
