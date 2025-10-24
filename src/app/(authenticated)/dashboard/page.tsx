"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(
    function redirectBasedOnRole() {
      async function checkRoleAndRedirect() {
        try {
          console.log("Dashboard - Verificando role do usuário...");

          const sessionData = await authClient.getSession();
          console.log("Dashboard - Session data:", JSON.stringify(sessionData, null, 2));

          if (sessionData?.data?.user) {
            const userRole = sessionData.data.user.role;
            console.log("Dashboard - User role detectado:", userRole);

            if (userRole === "ADMIN") {
              console.log("Dashboard - Redirecionando ADMIN para /admin");
              window.location.href = "/admin";
            } else {
              console.log("Dashboard - Redirecionando USER para /user");
              window.location.href = "/user";
            }
          } else {
            console.log("Dashboard - Sem sessão, redirecionando para login");
            router.push("/sign-in");
          }
        } catch (error) {
          console.error("Dashboard - Erro ao verificar role:", JSON.stringify(error, null, 2));
          router.push("/sign-in");
        }
      }

      checkRoleAndRedirect();
    },
    [router],
  );

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Redirecionando para área apropriada...</p>
      </div>
    </div>
  );
}
