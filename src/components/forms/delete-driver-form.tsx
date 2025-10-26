"use client";

import { deleteDriverProfile } from "@/actions/drivers";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteDriverFormProps {
  driver: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export function DeleteDriverForm({ driver }: DeleteDriverFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    setIsLoading(true);

    try {
      await deleteDriverProfile(driver.id);
      toast.success("Motorista deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar motorista:", JSON.stringify(error, null, 2));
      toast.error("Erro ao deletar motorista. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Deletar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza que deseja deletar este motorista?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. O motorista{" "}
            <strong>
              {driver.firstName} {driver.lastName}
            </strong>{" "}
            será permanentemente removido do sistema, incluindo todos os seus dados relacionados (carros, quilometragem,
            despesas, etc).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Deletando..." : "Deletar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
