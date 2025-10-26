import { getCurrentDriverFoodExpenses, getFoodExpenseStats } from "@/actions/food-expense";
import { AddFoodExpenseForm } from "@/components/food-expense/add-food-expense-form";
import { FoodExpenseHistory } from "@/components/food-expense/food-expense-history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, DollarSign, Receipt, TrendingUp } from "lucide-react";
import { GiMeal } from "react-icons/gi";

export const dynamic = "force-dynamic";

export default async function FoodExpensePage() {
  const [expenses, stats] = await Promise.all([getCurrentDriverFoodExpenses(), getFoodExpenseStats()]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <GiMeal className="h-8 w-8" />
              Despesas com Alimentação
            </h1>
            <p className="text-muted-foreground">Registre e acompanhe todos os seus gastos com refeições</p>
          </div>
          <AddFoodExpenseForm />
        </div>

        <Separator />

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Registros</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRecords}</div>
              <p className="text-xs text-muted-foreground">Despesas registradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{stats.totalAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Gasto total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média por Refeição</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{stats.averageAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Valor médio</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{stats.monthlyAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{stats.monthlyRecords} registros</p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Stats */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Esta Semana</p>
                <p className="text-3xl font-bold">€{stats.weeklyAmount.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground mt-1">{stats.weeklyRecords} refeições</p>
              </div>
              <Calendar className="h-16 w-16 text-primary/40" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History */}
      <FoodExpenseHistory expenses={expenses} />
    </div>
  );
}
