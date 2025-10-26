"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { FoodExpense } from "@/generated/prisma";
import { format, isSameMonth, isSameWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, History } from "lucide-react";
import { DeleteFoodExpenseForm } from "./delete-food-expense-form";
import { EditFoodExpenseForm } from "./edit-food-expense-form";

type SerializedFoodExpense = Omit<FoodExpense, "amount"> & {
  amount: number;
};

type FoodExpenseHistoryProps = {
  expenses: SerializedFoodExpense[];
};

export function FoodExpenseHistory({ expenses }: FoodExpenseHistoryProps) {
  const hasHistory = expenses.length > 0;

  // Agrupar por período
  const now = new Date();
  const thisWeekExpenses = expenses.filter((e) => isSameWeek(new Date(e.date), now, { weekStartsOn: 0 }));
  const thisMonthExpenses = expenses.filter((e) => isSameMonth(new Date(e.date), now));

  const thisWeekTotal = thisWeekExpenses.reduce((sum, e) => sum + e.amount, 0);
  const thisMonthTotal = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Histórico de Despesas
        </CardTitle>
        <CardDescription>
          {hasHistory
            ? `${expenses.length} ${expenses.length === 1 ? "registro" : "registros"}`
            : "Nenhum registro ainda"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasHistory ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <History className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Você ainda não possui despesas registradas.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Clique em "Nova Despesa" para começar a rastrear seus gastos.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Resumo Rápido */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-blue-50/50 border border-blue-200 p-4 dark:bg-blue-950/20 dark:border-blue-900">
                <p className="text-sm text-muted-foreground">Esta Semana</p>
                <p className="text-2xl font-bold">€{thisWeekTotal.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">{thisWeekExpenses.length} refeições</p>
              </div>
              <div className="rounded-lg bg-purple-50/50 border border-purple-200 p-4 dark:bg-purple-950/20 dark:border-purple-900">
                <p className="text-sm text-muted-foreground">Este Mês</p>
                <p className="text-2xl font-bold">€{thisMonthTotal.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">{thisMonthExpenses.length} refeições</p>
              </div>
            </div>

            {/* Lista de Despesas */}
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-3">
                {expenses.map((expense) => (
                  <Card key={expense.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-sm">
                                {format(new Date(expense.date), "dd/MM/yyyy", { locale: ptBR })}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(expense.date), "EEEE", { locale: ptBR })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-primary">€{expense.amount.toFixed(2)}</p>
                          </div>
                        </div>

                        {/* Local */}
                        <div className="rounded-lg bg-muted/50 p-3">
                          <p className="text-sm text-muted-foreground">Local</p>
                          <p className="font-medium">{expense.locale}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2 pt-3 border-t">
                          <EditFoodExpenseForm expense={expense} />
                          <DeleteFoodExpenseForm expense={expense} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
