"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/lib/auth-client";

export function RoleDemo() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status da Sessão</CardTitle>
          <CardDescription>Informações sobre sua autenticação</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Não autenticado</p>
        </CardContent>
      </Card>
    );
  }

  const user = session.user;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status da Sessão</CardTitle>
        <CardDescription>Informações sobre sua autenticação e permissões</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Nome:</span>
            <span className="text-sm">{user.fullName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Email:</span>
            <span className="text-sm">{user.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Papel:</span>
            <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>{user.role}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Email verificado:</span>
            <Badge variant={user.emailVerified ? "default" : "destructive"}>{user.emailVerified ? "Sim" : "Não"}</Badge>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Permissões de Acesso:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Área de administração:</span>
              <Badge variant={user.role === "ADMIN" ? "default" : "destructive"}>
                {user.role === "ADMIN" ? "Permitido" : "Negado"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Área de motorista:</span>
              <Badge variant={user.role === "DRIVER" || user.role === "ADMIN" ? "default" : "destructive"}>
                {user.role === "DRIVER" || user.role === "ADMIN" ? "Permitido" : "Negado"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Verificação de email:</span>
              <Badge variant="default">Permitido</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
