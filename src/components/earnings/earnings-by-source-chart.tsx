"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart } from "lucide-react";

type EarningsBySourceChartProps = {
  earningsBySource: Record<string, number>;
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
  UBER: "bg-blue-500",
  BOLT: "bg-green-500",
  TOUR: "bg-purple-500",
  OTHER: "bg-gray-500",
};

export function EarningsBySourceChart({ earningsBySource }: EarningsBySourceChartProps) {
  const total = Object.values(earningsBySource).reduce((acc, val) => acc + val, 0);

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Ganhos por Fonte
          </CardTitle>
          <CardDescription>Distribuição dos seus ganhos por plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <PieChart className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum ganho registrado ainda.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Ganhos por Fonte
        </CardTitle>
        <CardDescription>Distribuição dos seus ganhos por plataforma</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(earningsBySource)
            .sort(([, a], [, b]) => b - a)
            .map(([source, amount]) => {
              const percentage = (amount / total) * 100;
              return (
                <div key={source} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{sourceIcons[source]}</span>
                      <span className="font-medium">{sourceLabels[source]}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">€{amount.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  <Progress value={percentage} className={`h-2 ${sourceColors[source]}`} />
                </div>
              );
            })}
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total</span>
            <span className="text-2xl font-bold">€{total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
