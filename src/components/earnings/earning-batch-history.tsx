"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { EarningBatch } from "@/generated/prisma";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, History, Wallet } from "lucide-react";
import { DeleteEarningBatchForm } from "./delete-earning-batch-form";
import { EditEarningBatchForm } from "./edit-earning-batch-form";

type SerializedEarningBatch = Omit<EarningBatch, "totalAmount"> & {
  totalAmount: number;
  earnings: Array<
    Omit<{ id: string; batchId: string | null; date: Date; description: string | null; amount: unknown }, "amount"> & {
      amount: number;
    }
  >;
};

type EarningBatchHistoryProps = {
  batches: SerializedEarningBatch[];
};

const sourceLabels: Record<string, string> = {
  UBER: "Uber",
  BOLT: "Bolt",
  TOUR: "Tour",
  OTHER: "Outro",
};

const sourceIcons: Record<string, string> = {
  UBER: "🚗",
  BOLT: "⚡",
  TOUR: "🏛️",
  OTHER: "📱",
};

const paymentLabels: Record<string, string> = {
  BANK_TRANSFER: "Transferência Bancária",
  MBWAY: "MB Way",
  CASH: "Dinheiro",
  OTHER: "Outro",
};

export function EarningBatchHistory({ batches }: EarningBatchHistoryProps) {
  const hasHistory = batches.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Histórico de Lotes
        </CardTitle>
        <CardDescription>
          {hasHistory ? `${batches.length} ${batches.length === 1 ? "lote" : "lotes"}` : "Nenhum lote ainda"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasHistory ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Você ainda não possui lotes de ganhos registrados.</p>
            <p className="text-sm text-muted-foreground mt-2">Clique em "Novo Lote de Ganhos" para começar.</p>
          </div>
        ) : (
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {batches.map((batch) => (
                <Card key={batch.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{sourceIcons[batch.source]}</span>
                            <div>
                              <h3 className="font-semibold text-lg">{sourceLabels[batch.source]}</h3>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(batch.weekStart), "dd MMM", { locale: ptBR })} -{" "}
                                {format(new Date(batch.weekEnd), "dd MMM yyyy", { locale: ptBR })}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">€{batch.totalAmount.toFixed(2)}</p>
                          <Badge variant="outline" className="mt-1">
                            {paymentLabels[batch.paymentType]}
                          </Badge>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-lg bg-muted/50 p-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <Calendar className="h-4 w-4" />
                            Data do Pagamento
                          </div>
                          <p className="font-medium">
                            {format(new Date(batch.paymentDate), "dd/MM/yyyy", { locale: ptBR })}
                          </p>
                        </div>

                        {batch.referenceId && (
                          <div className="rounded-lg bg-muted/50 p-3">
                            <p className="text-sm text-muted-foreground mb-1">Referência</p>
                            <p className="font-medium truncate">{batch.referenceId}</p>
                          </div>
                        )}
                      </div>

                      {/* Earnings count if available */}
                      {batch.earnings && batch.earnings.length > 0 && (
                        <div className="rounded-lg bg-blue-50/50 border border-blue-200 p-3 dark:bg-blue-950/20 dark:border-blue-900">
                          <p className="text-sm font-medium">
                            📊 {batch.earnings.length} {batch.earnings.length === 1 ? "corrida" : "corridas"}{" "}
                            registradas
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex justify-end gap-2 pt-3 border-t">
                        <EditEarningBatchForm batch={batch} />
                        <DeleteEarningBatchForm batch={batch} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
