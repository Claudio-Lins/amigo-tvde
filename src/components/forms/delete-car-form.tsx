"use client";

import { deleteCar } from "@/actions/cars";
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
import type { Car } from "@/generated/prisma";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Tipo serializado para evitar problemas com Decimal
type SerializedCar = Omit<Car, "rentPrice"> & { rentPrice: number | null };

type DeleteCarFormProps = {
  car: SerializedCar;
};

export function DeleteCarForm({ car }: DeleteCarFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    setIsLoading(true);
    try {
      await deleteCar(car.id);

      toast.success("Veículo deletado com sucesso!", {
        description: `${car.brand} ${car.model} foi removido da frota.`,
      });

      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao deletar veículo:", error);
      toast.error("Erro ao deletar veículo", {
        description: "Ocorreu um erro ao tentar deletar o veículo. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Deletar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza que deseja deletar este veículo?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. O veículo{" "}
            <strong>
              {car.brand} {car.model}
            </strong>
            {car.tag && (
              <>
                {" "}
                (Matrícula: <strong>{car.tag}</strong>)
              </>
            )}{" "}
            será permanentemente removido da sua frota.
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deletando...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Deletar Veículo
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
