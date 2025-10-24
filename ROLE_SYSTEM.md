# Sistema de Controle de Acesso por Roles

Este documento descreve o sistema de controle de acesso baseado em roles implementado na aplicação Better Authenticate.

## Configuração

### 1. Better Auth Configuration

O sistema utiliza o plugin `admin` do Better Auth configurado em `src/lib/auth.ts`:

```typescript
import { admin } from "better-auth/plugins/admin";

export const auth = betterAuth({
  // ... outras configurações
  user: {
    additionalFields: {
      role: {
        type: ["USER", "ADMIN"],
        input: false,
      },
    },
  },
  plugins: [
    admin({
      defaultRole: "USER",
      adminRoles: ["ADMIN"],
    }),
  ],
});
```

### 2. Client Configuration

O cliente de autenticação foi configurado com o plugin admin em `src/lib/auth-client.ts`:

```typescript
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(), 
    nextCookies(), 
    magicLinkClient(), 
    adminClient()
  ],
});
```

## Middleware de Controle de Acesso

O middleware em `src/middleware.ts` implementa verificação básica de autenticação usando cookies de sessão. A verificação detalhada de roles é feita no server-side de cada página para evitar problemas com o Edge Runtime do Next.js.

### Rotas Públicas (sem autenticação necessária)
- `/` - Página inicial
- `/sign-in` - Login
- `/sign-up` - Registro
- `/forgot-password` - Esqueci a senha
- `/reset-password` - Redefinir senha
- `/api/auth` - Endpoints de autenticação

### Verificação de Autenticação

O middleware verifica apenas se o usuário possui um token de sessão válido (`better-auth.session_token`). Se não houver token, o usuário é redirecionado para `/sign-in`.

### Rotas Protegidas por Role (Server-Side)

A verificação detalhada de roles é implementada no server-side de cada página:

#### Área Admin (`/admin`)
- **Verificação**: Server-side na página
- **Acesso**: Apenas usuários com role `ADMIN`
- **Redirecionamento**: `redirect("/unauthorized")` se não for ADMIN

#### Área User (`/user`)
- **Verificação**: Server-side na página  
- **Acesso**: Usuários autenticados (qualquer role)
- **Redirecionamento**: `redirect("/sign-in")` se não autenticado

#### Verificação de Email (`/verify-email`, `/email-verified`)
- **Verificação**: Server-side na página
- **Acesso**: Qualquer usuário autenticado (independente da role)
- **Redirecionamento**: `redirect("/sign-in")` se não autenticado

## Estrutura de Roles

### USER (Padrão)
- Acesso à área `/user`
- Acesso às funcionalidades de verificação de email
- Redirecionamento automático para `/user` após login

### ADMIN
- Acesso à área `/admin`
- Acesso à área `/user` (herda permissões de USER)
- Acesso às funcionalidades de verificação de email
- Redirecionamento automático para `/admin` após login
- Funcionalidades administrativas (gerenciamento de aplicação, etc.)

## Páginas Implementadas

### `/admin` - Área Administrativa
- Verificação server-side da role ADMIN
- Interface para administradores
- Componente de demonstração de roles
- Funcionalidades de gerenciamento

### `/user` - Área do Usuário
- Verificação server-side de autenticação
- Interface personalizada para usuários
- Componente de demonstração de roles
- Cards informativos sobre funcionalidades

### `/unauthorized` - Página de Acesso Negado
- Exibida quando usuário tenta acessar área sem permissão
- Opções para voltar ao dashboard ou fazer login
- Mensagem em português

### `/verify-email` - Verificação de Email
- Acessível por qualquer usuário autenticado
- Interface para reenvio de email de verificação
- Redirecionamento automático se email já verificado

### `/email-verified` - Email Verificado
- Confirmação de verificação bem-sucedida
- Link para retornar ao dashboard

## Componente de Demonstração

O componente `RoleDemo` (`src/components/role-demo.tsx`) exibe:

- Informações da sessão atual
- Role do usuário
- Status de verificação de email
- Permissões de acesso para cada área
- Badges visuais para facilitar identificação

## Segurança

### Server-Side Validation
Todas as páginas protegidas implementam validação server-side:

```typescript
const session = await getServerSession();
const user = session?.user;

if (!user) {
  redirect("/sign-in");
}

if (user.role !== "ADMIN") {
  redirect("/unauthorized"); // Para páginas admin
}
```

### Middleware Protection
O middleware intercepta todas as requisições antes da renderização, garantindo:

- Verificação de autenticação
- Validação de roles
- Redirecionamentos apropriados
- Proteção contra acesso não autorizado

## Como Testar

1. **Criar usuário comum**: Registre-se normalmente (role padrão: USER)
2. **Testar acesso USER**: Acesse `/user` - deve funcionar
3. **Testar bloqueio ADMIN**: Acesse `/admin` - deve redirecionar para `/unauthorized`
4. **Alterar role no banco**: Mude a role para "ADMIN" no banco de dados
5. **Testar acesso ADMIN**: Acesse `/admin` - deve funcionar
6. **Verificar redirecionamentos**: Acesse `/` - deve redirecionar baseado na role

## Próximos Passos

- Implementar interface para administradores gerenciarem roles de outros usuários
- Adicionar mais granularidade nas permissões
- Implementar logs de acesso e auditoria
- Criar testes automatizados para o sistema de roles
