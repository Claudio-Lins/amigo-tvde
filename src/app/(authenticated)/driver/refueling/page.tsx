import { getCurrentDriverRefuelings, getDriverCars, getRefuelingStats } from "@/actions/refueling";
import { AddRefuelingForm } from "@/components/refueling/add-refueling-form";
import { RefuelingHistory } from "@/components/refueling/refueling-history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DollarSign, Fuel, TrendingUp, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RefuelingPage() {
  const [refuelings, stats, cars] = await Promise.all([
    getCurrentDriverRefuelings(),
    getRefuelingStats(),
    getDriverCars(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Fuel className="h-8 w-8" />
              Controle de Abastecimento
            </h1>
            <p className="text-muted-foreground">Registre e acompanhe todos os abastecimentos e carregamentos</p>
          </div>
          <AddRefuelingForm cars={cars} />
        </div>

        <Separator />

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Registros</CardTitle>
              <Fuel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRecords}</div>
              <p className="text-xs text-muted-foreground">Abastecimentos registrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Custo Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{stats.totalCost.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Total gasto</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média por Abastecimento</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{stats.averageCost.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Custo médio</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{stats.monthlyCost.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{stats.monthlyRecords} registros</p>
            </CardContent>
          </Card>
        </div>

        {/* Stats by Type */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Elétrico</CardTitle>
              <Zap className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.byType.electric}</div>
              <p className="text-xs text-muted-foreground">{stats.totalKWh.toFixed(0)} kWh</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Diesel</CardTitle>
              <Fuel className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.byType.diesel}</div>
              <p className="text-xs text-muted-foreground">{stats.totalLiters.toFixed(0)} litros</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">GPL</CardTitle>
              <Fuel className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.byType.gpl}</div>
              <p className="text-xs text-muted-foreground">Abastecimentos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Híbrido</CardTitle>
              <div className="flex gap-1">
                <Zap className="h-3 w-3 text-green-500" />
                <Fuel className="h-3 w-3 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.byType.hybrid}</div>
              <p className="text-xs text-muted-foreground">Abastecimentos</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* History */}
      <RefuelingHistory refuelings={refuelings} cars={cars} />
    </div>
  );
}
