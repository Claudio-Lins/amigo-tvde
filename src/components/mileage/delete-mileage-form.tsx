"use client";

import { deleteMileage } from "@/actions/mileage";
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
import type { Mileage } from "@/generated/prisma";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type DeleteMileageFormProps = {
  mileage: Mileage;
};

export function DeleteMileageForm({ mileage }: DeleteMileageFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const kmDifference =
    mileage.kmInitialDaily && mileage.kmFinalDaily ? mileage.kmFinalDaily - mileage.kmInitialDaily : 0;

  async function handleDelete() {
    setIsLoading(true);
    try {
      await deleteMileage(mileage.id);

      toast.success("Registro deletado com sucesso!", {
        description: "O registro de quilometragem foi removido.",
      });

      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao deletar registro:", JSON.stringify(error, null, 2));
      toast.error("Erro ao deletar registro", {
        description: "Ocorreu um erro ao tentar deletar o registro. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
          <Trash2 className="h-3 w-3" />
          Deletar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>Tem certeza que deseja deletar este registro de quilometragem?</p>
            <div className="rounded-lg bg-muted p-3 space-y-1 text-sm">
              <p>
                <strong>KM Inicial:</strong> {mileage.kmInitialDaily?.toLocaleString()} km
              </p>
              <p>
                <strong>KM Final:</strong> {mileage.kmFinalDaily?.toLocaleString()} km
              </p>
              <p>
                <strong>Percorrido:</strong> {kmDifference.toLocaleString()} km
              </p>
            </div>
            <p className="text-destructive font-medium">Esta ação não pode ser desfeita.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Deletando...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Deletar Registro
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
