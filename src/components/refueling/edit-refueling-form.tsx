"use client";

import { updateRefueling } from "@/actions/refueling";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Car, EnergyLog } from "@/generated/prisma";
import { EditRefuelingSchema } from "@/zod-schema/refueling-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fuel, Loader2, Pencil, Zap } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type SerializedRefueling = Omit<EnergyLog, "totalCost" | "pricePerKWh" | "pricePerLiter"> & {
  totalCost: number;
  pricePerKWh: number | null;
  pricePerLiter: number | null;
};

type EditRefuelingFormProps = {
  refueling: SerializedRefueling;
  cars: Pick<Car, "id" | "brand" | "model" | "type" | "tag">[];
};

export function EditRefuelingForm({ refueling, cars }: EditRefuelingFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof EditRefuelingSchema>>({
    resolver: zodResolver(EditRefuelingSchema) as any,
    defaultValues: {
      refuelingId: refueling.id,
      carId: refueling.carId || "",
      locale: refueling.locale,
      energyType: refueling.energyType,
      timestamp: new Date(refueling.timestamp),
      totalCost: refueling.totalCost,
      paymentMethod: refueling.paymentMethod,
      kWhCharged: refueling.kWhCharged,
      pricePerKWh: refueling.pricePerKWh,
      chargingTime: refueling.chargingTime,
      liters: refueling.liters,
      pricePerLiter: refueling.pricePerLiter,
      batteryBefore: refueling.batteryBefore,
      batteryAfter: refueling.batteryAfter,
      fuelBefore: refueling.fuelBefore,
      fuelAfter: refueling.fuelAfter,
    },
  });

  const energyType = form.watch("energyType");
  const isElectric = energyType === "ELECTRIC";
  const isCombustion = energyType === "DIESEL" || energyType === "GPL";
  const isHybrid = energyType === "HYBRID";

  async function onSubmit(values: z.infer<typeof EditRefuelingSchema>) {
    setIsLoading(true);
    try {
      await updateRefueling(values);
      toast.success("Abastecimento atualizado!", {
        description: `€${values.totalCost?.toFixed(2)}`,
      });
      setIsOpen(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      console.error("Erro ao atualizar:", JSON.stringify(error, null, 2));
      toast.error("Erro ao atualizar", { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Pencil className="h-3 w-3" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Abastecimento</DialogTitle>
          <DialogDescription>Atualize as informações do registro</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="locale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custo Total</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                          className="pl-7"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Campos dinâmicos por tipo */}
            {(isElectric || isHybrid) && (
              <div className="space-y-4 rounded-lg border border-green-200 bg-green-50/50 p-4 dark:border-green-900 dark:bg-green-950/20">
                <div className="flex items-center gap-2 font-medium">
                  <Zap className="h-4 w-4 text-green-600" />
                  <span>Elétrico</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="kWhCharged"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>kWh</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pricePerKWh"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>€/kWh</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {(isCombustion || isHybrid) && (
              <div className="space-y-4 rounded-lg border border-orange-200 bg-orange-50/50 p-4 dark:border-orange-900 dark:bg-orange-950/20">
                <div className="flex items-center gap-2 font-medium">
                  <Fuel className="h-4 w-4 text-orange-600" />
                  <span>Combustível</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="liters"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Litros</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pricePerLiter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>€/L</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4" />
                    Salvar
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
