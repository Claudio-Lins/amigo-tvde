"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Home, Lock, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-orange-950/20 dark:via-background dark:to-red-950/20 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
              <Lock className="h-10 w-10 text-orange-600 dark:text-orange-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-orange-600 dark:text-orange-400">Área Restrita</CardTitle>
            <CardDescription className="text-base">Esta área possui acesso limitado</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="rounded-lg bg-orange-50 dark:bg-orange-900/10 p-4 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="secondary"
                  className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200"
                >
                  Erro 403
                </Badge>
                <span className="text-sm font-medium text-orange-800 dark:text-orange-200">Acesso Proibido</span>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Você não possui as credenciais necessárias para acessar esta área.
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <strong>Possíveis soluções:</strong>
                <ul className="mt-2 space-y-1 list-disc list-inside text-xs">
                  <li>Faça login com uma conta que tenha as permissões adequadas</li>
                  <li>Solicite acesso ao administrador do sistema</li>
                  <li>Verifique se você está na área correta</li>
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
                Para solicitar acesso, entre em contato com o administrador.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
