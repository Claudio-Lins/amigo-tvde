"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Home, LogIn, ShieldX } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-red-950/20 dark:via-background dark:to-orange-950/20 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <ShieldX className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400">Acesso Negado</CardTitle>
            <CardDescription className="text-base">Você não tem permissão para acessar esta página</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="rounded-lg bg-red-50 dark:bg-red-900/10 p-4 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="destructive" className="text-xs">
                  Erro 403
                </Badge>
                <span className="text-sm font-medium text-red-800 dark:text-red-200">Permissão Insuficiente</span>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300">
                Esta área requer privilégios especiais que sua conta atual não possui.
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <strong>Página solicitada:</strong>
                <code className="ml-2 px-2 py-1 bg-muted rounded text-xs">{pathname}</code>
              </div>

              <div className="text-sm text-muted-foreground">
                <strong>Sugestões:</strong>
                <ul className="mt-2 space-y-1 list-disc list-inside text-xs">
                  <li>Verifique se você está logado com a conta correta</li>
                  <li>Entre em contato com o administrador se precisar de acesso</li>
                  <li>Retorne à página anterior ou ao dashboard</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={() => router.back()} variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard">
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>

                <Button asChild size="sm">
                  <Link href="/sign-in">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-center text-muted-foreground">
                Se você acredita que isso é um erro, entre em contato com o suporte técnico.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
