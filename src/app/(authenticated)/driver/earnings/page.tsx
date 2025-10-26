import { getCurrentDriverEarningBatches, getEarningsStats } from "@/actions/earnings";
import { AddEarningBatchForm } from "@/components/earnings/add-earning-batch-form";
import { EarningBatchHistory } from "@/components/earnings/earning-batch-history";
import { EarningsBySourceChart } from "@/components/earnings/earnings-by-source-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, DollarSign, TrendingUp, Wallet } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EarningsPage() {
  const [batches, stats] = await Promise.all([getCurrentDriverEarningBatches(), getEarningsStats()]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Wallet className="h-8 w-8" />
              Ganhos e Rendimentos
            </h1>
            <p className="text-muted-foreground">Registre e acompanhe todos os seus ganhos semanais</p>
          </div>
          <AddEarningBatchForm />
        </div>

        <Separator />

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Lotes</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBatches}</div>
              <p className="text-xs text-muted-foreground">Pagamentos registrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Ganhos</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{stats.totalAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Todos os períodos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média por Lote</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{stats.averagePerBatch.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Valor médio semanal</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{stats.monthlyAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{stats.monthlyBatches} lotes</p>
            </CardContent>
          </Card>
        </div>

        {/* Earnings by Source */}
        <EarningsBySourceChart earningsBySource={stats.earningsBySource} />
      </div>

      {/* History */}
      <EarningBatchHistory batches={batches} />
    </div>
  );
}
