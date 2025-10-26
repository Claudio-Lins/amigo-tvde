import { getUsers } from "@/actions/users";
import DeleteUserForms from "@/components/forms/delete-user-form";
import { EditUserForm } from "@/components/forms/edit-user-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { User } from "@/generated/prisma";
import { cn } from "@/lib/utils";

interface UsersProps {}

export default async function Users({}: UsersProps) {
  const users = await getUsers();

  async function deleteUser(id: string) {
    await deleteUser(id);
  }

  return (
    <div className={cn("")}>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Utilizadores</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div key={user.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{user.name || user.fullName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-muted-foreground">
                    Email: <span className="font-semibold">{user.email}</span>
                  </p>
                  <p className="text-base text-muted-foreground">
                    Papel: <span className="font-semibold">{user.role}</span>
                  </p>
                  <p className="text-base text-muted-foreground">
                    Email verificado: <span className="font-semibold">{user.emailVerified ? "Sim" : "Não"}</span>
                  </p>
                  <p className="text-base text-muted-foreground">
                    Criado em: <span className="font-semibold">{user.createdAt?.toLocaleDateString()}</span>
                  </p>
                  <p className="text-base text-muted-foreground">
                    Atualizado em: <span className="font-semibold">{user.updatedAt?.toLocaleDateString()}</span>
                  </p>
                  {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
                </CardContent>
                <CardFooter className="flex w-full justify-between gap-2 border-t">
                  <DeleteUserForms user={user ?? undefined} />
                  <EditUserForm user={user ?? undefined} />
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
