"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(
    function handleAuthCallback() {
      async function processCallback() {
        try {
          // Aguardar um pouco para garantir que a sessão foi estabelecida
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Usar o authClient para obter a sessão
          const sessionData = await authClient.getSession();

          console.log("Callback - Session data:", JSON.stringify(sessionData, null, 2));

          if (sessionData?.data?.user) {
            const userRole = sessionData.data.user.role;

            console.log("Callback - User role:", userRole);

            toast.success(`Bem-vindo, ${sessionData.data.user.name}!`);

            // Redirecionar baseado na role usando window.location para reload completo
            if (userRole === "ADMIN") {
              console.log("Callback - Redirecionando para /admin");
              window.location.href = "/admin";
            } else {
              console.log("Callback - Redirecionando para /user");
              window.location.href = "/user";
            }
          } else {
            console.log("Callback - Sem dados de usuário na sessão");
            // Se não há sessão, redirecionar para login
            toast.error("Erro na autenticação");
            router.push("/sign-in");
          }
        } catch (error) {
          console.error("Erro no callback de autenticação:", JSON.stringify(error, null, 2));
          toast.error("Erro na autenticação");
          router.push("/sign-in");
        }
      }

      processCallback();
    },
    [router],
  );

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Processando autenticação...</p>
      </div>
    </div>
  );
}
