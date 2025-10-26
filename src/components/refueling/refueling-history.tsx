"use client";

import { DeleteRefuelingForm } from "@/components/refueling/delete-refueling-form";
import { EditRefuelingForm } from "@/components/refueling/edit-refueling-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Car, EnergyLog } from "@/generated/prisma";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Battery, Calendar, Fuel, History, Zap } from "lucide-react";

type SerializedRefueling = Omit<EnergyLog, "totalCost" | "pricePerKWh" | "pricePerLiter"> & {
  totalCost: number;
  pricePerKWh: number | null;
  pricePerLiter: number | null;
  car?: Pick<Car, "id" | "brand" | "model" | "type"> | null;
};

type RefuelingHistoryProps = {
  refuelings: SerializedRefueling[];
  cars: Pick<Car, "id" | "brand" | "model" | "type" | "tag">[];
};

export function RefuelingHistory({ refuelings, cars }: RefuelingHistoryProps) {
  const hasHistory = refuelings.length > 0;

  const electricRefuelings = refuelings.filter((r) => r.energyType === "ELECTRIC");
  const dieselRefuelings = refuelings.filter((r) => r.energyType === "DIESEL");
  const gplRefuelings = refuelings.filter((r) => r.energyType === "GPL");
  const hybridRefuelings = refuelings.filter((r) => r.energyType === "HYBRID");

  function renderRefuelingCard(refueling: SerializedRefueling) {
    return (
      <Card key={refueling.id} className="overflow-hidden">
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">
                    {format(new Date(refueling.timestamp), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                  <p className="text-xs text-muted-foreground">{refueling.locale}</p>
                </div>
              </div>
              <Badge variant="secondary" className="gap-1">
                {refueling.energyType === "ELECTRIC" && <Zap className="h-3 w-3 text-green-500" />}
                {refueling.energyType === "DIESEL" && <Fuel className="h-3 w-3 text-orange-500" />}
                {refueling.energyType === "GPL" && <Fuel className="h-3 w-3 text-blue-500" />}
                {refueling.energyType === "HYBRID" && <Battery className="h-3 w-3" />}€{refueling.totalCost.toFixed(2)}
              </Badge>
            </div>

            {/* Veículo */}
            {refueling.car && (
              <div className="text-sm">
                <span className="text-muted-foreground">Veículo:</span>{" "}
                <span className="font-medium">
                  {refueling.car.brand} {refueling.car.model}
                </span>
              </div>
            )}

            {/* Detalhes por tipo */}
            {refueling.energyType === "ELECTRIC" && (
              <div className="rounded-lg bg-green-50/50 p-3 space-y-1 text-sm dark:bg-green-950/20">
                {refueling.kWhCharged && (
                  <p>
                    <span className="text-muted-foreground">⚡ Carregado:</span>{" "}
                    <span className="font-medium">{refueling.kWhCharged} kWh</span>
                  </p>
                )}
                {refueling.pricePerKWh && (
                  <p>
                    <span className="text-muted-foreground">💰 Preço/kWh:</span>{" "}
                    <span className="font-medium">€{refueling.pricePerKWh.toFixed(3)}</span>
                  </p>
                )}
                {refueling.chargingTime && (
                  <p>
                    <span className="text-muted-foreground">⏱️ Tempo:</span>{" "}
                    <span className="font-medium">{refueling.chargingTime} min</span>
                  </p>
                )}
                {(refueling.batteryBefore !== null || refueling.batteryAfter !== null) && (
                  <p>
                    <span className="text-muted-foreground">🔋 Bateria:</span>{" "}
                    <span className="font-medium">
                      {refueling.batteryBefore}% → {refueling.batteryAfter}%
                    </span>
                  </p>
                )}
              </div>
            )}

            {(refueling.energyType === "DIESEL" || refueling.energyType === "GPL") && (
              <div className="rounded-lg bg-orange-50/50 p-3 space-y-1 text-sm dark:bg-orange-950/20">
                {refueling.liters && (
                  <p>
                    <span className="text-muted-foreground">⛽ Litros:</span>{" "}
                    <span className="font-medium">{refueling.liters} L</span>
                  </p>
                )}
                {refueling.pricePerLiter && (
                  <p>
                    <span className="text-muted-foreground">💰 Preço/L:</span>{" "}
                    <span className="font-medium">€{refueling.pricePerLiter.toFixed(3)}</span>
                  </p>
                )}
                {(refueling.fuelBefore !== null || refueling.fuelAfter !== null) && (
                  <p>
                    <span className="text-muted-foreground">📊 Tanque:</span>{" "}
                    <span className="font-medium">
                      {refueling.fuelBefore}% → {refueling.fuelAfter}%
                    </span>
                  </p>
                )}
              </div>
            )}

            {refueling.paymentMethod && (
              <div className="text-sm">
                <span className="text-muted-foreground">Pagamento:</span>{" "}
                <span className="font-medium">{refueling.paymentMethod}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-3 border-t">
              <EditRefuelingForm refueling={refueling} cars={cars} />
              <DeleteRefuelingForm refueling={refueling} />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Histórico de Abastecimentos
        </CardTitle>
        <CardDescription>
          {hasHistory ? `${refuelings.length} registros encontrados` : "Nenhum registro ainda"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasHistory ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <History className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Você ainda não possui abastecimentos registrados.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Clique em "Novo Abastecimento" para começar a rastrear seus gastos.
            </p>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="electric">Elétrico</TabsTrigger>
              <TabsTrigger value="diesel">Diesel</TabsTrigger>
              <TabsTrigger value="gpl">GPL</TabsTrigger>
              <TabsTrigger value="hybrid">Híbrido</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-3">{refuelings.map(renderRefuelingCard)}</div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="electric">
              <ScrollArea className="h-[600px] pr-4">
                {electricRefuelings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Zap className="h-10 w-10 text-green-500 mb-2" />
                    <p className="text-muted-foreground">Nenhum carregamento elétrico registrado</p>
                  </div>
                ) : (
                  <div className="space-y-3">{electricRefuelings.map(renderRefuelingCard)}</div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="diesel">
              <ScrollArea className="h-[600px] pr-4">
                {dieselRefuelings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Fuel className="h-10 w-10 text-orange-500 mb-2" />
                    <p className="text-muted-foreground">Nenhum abastecimento diesel registrado</p>
                  </div>
                ) : (
                  <div className="space-y-3">{dieselRefuelings.map(renderRefuelingCard)}</div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="gpl">
              <ScrollArea className="h-[600px] pr-4">
                {gplRefuelings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Fuel className="h-10 w-10 text-blue-500 mb-2" />
                    <p className="text-muted-foreground">Nenhum abastecimento GPL registrado</p>
                  </div>
                ) : (
                  <div className="space-y-3">{gplRefuelings.map(renderRefuelingCard)}</div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="hybrid">
              <ScrollArea className="h-[600px] pr-4">
                {hybridRefuelings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Battery className="h-10 w-10 mb-2" />
                    <p className="text-muted-foreground">Nenhum abastecimento híbrido registrado</p>
                  </div>
                ) : (
                  <div className="space-y-3">{hybridRefuelings.map(renderRefuelingCard)}</div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
