"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Mileage } from "@/generated/prisma";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, History, Route } from "lucide-react";

type MileageHistoryProps = {
  mileages: Mileage[];
};

export function MileageHistory({ mileages }: MileageHistoryProps) {
  const completedMileages = mileages.filter((m) => m.kmFinalDaily !== null);
  const hasHistory = completedMileages.length > 0;

  return (
    <Card className="lg:row-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Histórico de Turnos
        </CardTitle>
        <CardDescription>
          {hasHistory
            ? `${completedMileages.length} ${completedMileages.length === 1 ? "turno registrado" : "turnos registrados"}`
            : "Nenhum turno registrado ainda"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasHistory ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <History className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Você ainda não possui turnos finalizados.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Inicie um turno para começar a rastrear sua quilometragem.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-3">
              {completedMileages.map((mileage) => {
                const kmDiff =
                  mileage.kmFinalDaily && mileage.kmInitialDaily ? mileage.kmFinalDaily - mileage.kmInitialDaily : 0;

                return (
                  <Card key={mileage.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Header with Date */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-sm">
                                {format(new Date(mileage.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(mileage.createdAt), "HH:mm", { locale: ptBR })} -{" "}
                                {format(new Date(mileage.updatedAt), "HH:mm", { locale: ptBR })}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="gap-1">
                            <Route className="h-3 w-3" />
                            {kmDiff.toLocaleString()} km
                          </Badge>
                        </div>

                        {/* Mileage Details */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="space-y-1">
                            <p className="text-muted-foreground text-xs">KM Inicial</p>
                            <p className="font-medium">{mileage.kmInitialDaily?.toLocaleString()} km</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-muted-foreground text-xs">KM Final</p>
                            <p className="font-medium">{mileage.kmFinalDaily?.toLocaleString()} km</p>
                          </div>
                        </div>

                        {/* Weekly Mileage if available */}
                        {(mileage.kmInitialWeekly || mileage.kmFinalWeekly) && (
                          <div className="pt-3 border-t">
                            <p className="text-xs text-muted-foreground mb-2">Quilometragem Semanal:</p>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              {mileage.kmInitialWeekly && (
                                <div className="space-y-1">
                                  <p className="text-muted-foreground text-xs">Inicial</p>
                                  <p className="font-medium">{mileage.kmInitialWeekly.toLocaleString()} km</p>
                                </div>
                              )}
                              {mileage.kmFinalWeekly && (
                                <div className="space-y-1">
                                  <p className="text-muted-foreground text-xs">Final</p>
                                  <p className="font-medium">{mileage.kmFinalWeekly.toLocaleString()} km</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
