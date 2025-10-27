import { getDailyEarnings, getDailyEarningsStats } from "@/actions/daily-earnings";
import { getCurrentDriverEarningBatches, getEarningsStats } from "@/actions/earnings";
import { AddDailyEarningForm } from "@/components/earnings/add-daily-earning-form";
import { AddEarningBatchForm } from "@/components/earnings/add-earning-batch-form";
import { DailyEarningsHistory } from "@/components/earnings/daily-earnings-history";
import { EarningBatchHistory } from "@/components/earnings/earning-batch-history";
import { EarningsBySourceChart } from "@/components/earnings/earnings-by-source-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, DollarSign, TrendingUp, Wallet } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EarningsPage() {
  const [batches, stats, dailyEarnings, dailyStats] = await Promise.all([
    getCurrentDriverEarningBatches(),
    getEarningsStats(),
    getDailyEarnings(),
    getDailyEarningsStats(),
  ]);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="space-y-3">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
              <Wallet className="h-6 w-6 md:h-8 md:w-8" />
              Ganhos e Rendimentos
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Registre e acompanhe todos os seus ganhos semanais e diários
            </p>
          </div>

          {/* Botões no topo para Mobile */}
          <div className="flex flex-col sm:flex-row gap-2 md:hidden">
            <AddDailyEarningForm />
            <AddEarningBatchForm />
          </div>
        </div>

        <Separator />

        {/* Stats Cards */}
        <div className="grid gap-3 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Total Lotes</CardTitle>
              <Wallet className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">{stats.totalBatches}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Pagamentos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Total</CardTitle>
              <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">€{stats.totalAmount.toFixed(2)}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Todos períodos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Média</CardTitle>
              <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">€{stats.averagePerBatch.toFixed(2)}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Por lote</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Este Mês</CardTitle>
              <Calendar className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">€{stats.monthlyAmount.toFixed(2)}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">{stats.monthlyBatches} lotes</p>
            </CardContent>
          </Card>
        </div>

        {/* Earnings by Source */}
        <EarningsBySourceChart earningsBySource={stats.earningsBySource} />

        {/* Daily Stats Card */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-green-950/20 dark:to-emerald-950/20 dark:border-green-900">
          <CardContent className="p-4 md:pt-6 md:p-6">
            <div className="grid gap-3 grid-cols-3 md:gap-4">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Hoje</p>
                <p className="text-xl md:text-3xl font-bold">€{dailyStats.todayAmount.toFixed(2)}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground mt-0.5 md:mt-1">
                  {dailyStats.todayEarnings} ganhos
                </p>
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Esta Semana</p>
                <p className="text-xl md:text-3xl font-bold">€{dailyStats.weeklyAmount.toFixed(2)}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground mt-0.5 md:mt-1">
                  {dailyStats.weeklyEarnings} ganhos
                </p>
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Média</p>
                <p className="text-xl md:text-3xl font-bold">€{dailyStats.averagePerEarning.toFixed(2)}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground mt-0.5 md:mt-1">Por ganho</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History with Tabs */}
      <Tabs defaultValue="batches" className="w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 mb-4">
          <TabsList className="grid w-full md:max-w-md grid-cols-2">
            <TabsTrigger value="batches" className="text-xs md:text-sm">
              Lotes Semanais
            </TabsTrigger>
            <TabsTrigger value="daily" className="text-xs md:text-sm">
              Ganhos Diários
            </TabsTrigger>
          </TabsList>
          {/* Botões para Desktop */}
          <div className="hidden md:flex gap-2">
            <AddDailyEarningForm />
            <AddEarningBatchForm />
          </div>
        </div>

        <TabsContent value="batches" className="mt-0">
          <EarningBatchHistory batches={batches} />
        </TabsContent>

        <TabsContent value="daily" className="mt-0">
          <DailyEarningsHistory earnings={dailyEarnings} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
