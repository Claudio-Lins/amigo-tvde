import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Permitir acesso às rotas públicas e arquivos estáticos
  const publicRoutes = [
    "/",
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
    "/auth/callback",
    "/unauthorized",
    "/forbidden",
    "/api",
    "/_next",
    "/favicon.ico",
  ];

  // Verificar se é uma rota pública
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Verificar se há cookie de sessão (better-auth usa 'better-auth.session_token' por padrão)
  const sessionToken = request.cookies.get("better-auth.session_token");

  // Se não há token de sessão, redirecionar para login
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Para rotas protegidas, deixar a verificação de role para o server-side das páginas
  // O middleware apenas verifica se há autenticação básica

  // Rotas que requerem verificação adicional serão tratadas pelas próprias páginas
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
