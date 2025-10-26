"use client";

import { deleteFoodExpense } from "@/actions/food-expense";
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
import type { FoodExpense } from "@/generated/prisma";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type SerializedFoodExpense = Omit<FoodExpense, "amount"> & {
  amount: number;
};

type DeleteFoodExpenseFormProps = {
  expense: SerializedFoodExpense;
};

export function DeleteFoodExpenseForm({ expense }: DeleteFoodExpenseFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    setIsLoading(true);
    try {
      await deleteFoodExpense(expense.id);
      toast.success("Despesa deletada!", {
        description: "A despesa foi removida.",
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao deletar:", JSON.stringify(error, null, 2));
      toast.error("Erro ao deletar", {
        description: "Ocorreu um erro. Tente novamente.",
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
            <p>Tem certeza que deseja deletar esta despesa?</p>
            <div className="rounded-lg bg-muted p-3 space-y-1 text-sm">
              <p>
                <strong>Data:</strong> {format(new Date(expense.date), "dd/MM/yyyy", { locale: ptBR })}
              </p>
              <p>
                <strong>Local:</strong> {expense.locale}
              </p>
              <p>
                <strong>Valor:</strong> €{expense.amount.toFixed(2)}
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
                Deletar
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
