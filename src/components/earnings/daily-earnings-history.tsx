"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Earning, EarningBatch } from "@/generated/prisma";
import { format, isSameMonth, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, History, TrendingUp } from "lucide-react";
import { DeleteDailyEarningForm } from "./delete-daily-earning-form";
import { EditDailyEarningForm } from "./edit-daily-earning-form";

type SerializedEarning = Omit<Earning, "amount"> & {
  amount: number;
  batch?: (Omit<EarningBatch, "totalAmount"> & { totalAmount: number }) | null;
};

type DailyEarningsHistoryProps = {
  earnings: SerializedEarning[];
};

const sourceIcons: Record<string, string> = {
  UBER: "🚗",
  BOLT: "⚡",
  TOUR: "🏛️",
  OTHER: "📱",
};

const sourceLabels: Record<string, string> = {
  UBER: "Uber",
  BOLT: "Bolt",
  TOUR: "Tour",
  OTHER: "Outro",
};

const sourceColors: Record<string, string> = {
  UBER: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  BOLT: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  TOUR: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
  OTHER: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100",
};

export function DailyEarningsHistory({ earnings }: DailyEarningsHistoryProps) {
  const hasHistory = earnings.length > 0;

  // Agrupar por período
  const now = new Date();
  const todayEarnings = earnings.filter((e) => isToday(new Date(e.date)));
  const thisMonthEarnings = earnings.filter((e) => isSameMonth(new Date(e.date), now));

  const todayTotal = todayEarnings.reduce((sum, e) => sum + e.amount, 0);
  const thisMonthTotal = thisMonthEarnings.reduce((sum, e) => sum + e.amount, 0);

  // Agrupar por data
  const earningsByDate = earnings.reduce(
    (acc, earning) => {
      const dateKey = format(new Date(earning.date), "yyyy-MM-dd");
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(earning);
      return acc;
    },
    {} as Record<string, SerializedEarning[]>,
  );

  const sortedDates = Object.keys(earningsByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Histórico de Ganhos Diários
        </CardTitle>
        <CardDescription>
          {hasHistory ? `${earnings.length} ${earnings.length === 1 ? "ganho" : "ganhos"}` : "Nenhum ganho ainda"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasHistory ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Você ainda não possui ganhos diários registrados.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Clique em "Novo Ganho Diário" para começar a rastrear suas corridas.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Resumo Rápido */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-green-50/50 border border-green-200 p-4 dark:bg-green-950/20 dark:border-green-900">
                <p className="text-sm text-muted-foreground">Hoje</p>
                <p className="text-2xl font-bold">€{todayTotal.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">{todayEarnings.length} ganhos</p>
              </div>
              <div className="rounded-lg bg-blue-50/50 border border-blue-200 p-4 dark:bg-blue-950/20 dark:border-blue-900">
                <p className="text-sm text-muted-foreground">Este Mês</p>
                <p className="text-2xl font-bold">€{thisMonthTotal.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">{thisMonthEarnings.length} ganhos</p>
              </div>
            </div>

            {/* Lista Agrupada por Data */}
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {sortedDates.map((dateKey) => {
                  const dayEarnings = earningsByDate[dateKey];
                  const date = new Date(dateKey);
                  const dayTotal = dayEarnings.reduce((sum, e) => sum + e.amount, 0);

                  return (
                    <div key={dateKey} className="space-y-3">
                      {/* Header do Dia */}
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{format(date, "EEEE, dd 'de' MMMM", { locale: ptBR })}</p>
                            <p className="text-xs text-muted-foreground">{dayEarnings.length} ganhos</p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-primary">€{dayTotal.toFixed(2)}</p>
                      </div>

                      {/* Ganhos do Dia */}
                      <div className="space-y-2 pl-4">
                        {dayEarnings.map((earning) => {
                          const source = earning.batch?.source || "OTHER";
                          return (
                            <Card key={earning.id} className="border-l-4 border-l-primary">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1 space-y-2">
                                    <div className="flex items-start justify-between">
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                          <p className="font-bold text-lg text-primary">€{earning.amount.toFixed(2)}</p>
                                          <Badge className={sourceColors[source]}>
                                            {sourceIcons[source]} {sourceLabels[source]}
                                          </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                          {format(new Date(earning.date), "HH:mm", { locale: ptBR })}
                                        </p>
                                      </div>
                                    </div>

                                    {earning.description && (
                                      <div className="rounded-lg bg-muted/30 p-2">
                                        <p className="text-sm">{earning.description}</p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Actions */}
                                  <div className="flex gap-2">
                                    <EditDailyEarningForm earning={earning} />
                                    <DeleteDailyEarningForm earning={earning} />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
