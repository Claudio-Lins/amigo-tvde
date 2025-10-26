"use client";

import { createRefueling } from "@/actions/refueling";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Car } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { CreateRefuelingSchema } from "@/zod-schema/refueling-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Fuel, Loader2, Plus, Zap } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type AddRefuelingFormProps = {
  cars: Pick<Car, "id" | "brand" | "model" | "type" | "tag">[];
};

export function AddRefuelingForm({ cars }: AddRefuelingFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof CreateRefuelingSchema>>({
    resolver: zodResolver(CreateRefuelingSchema) as any,
    defaultValues: {
      carId: "",
      locale: "",
      energyType: "DIESEL",
      timestamp: new Date(),
      totalCost: 0,
      paymentMethod: null,
      kWhCharged: null,
      pricePerKWh: null,
      chargingTime: null,
      liters: null,
      pricePerLiter: null,
      batteryBefore: null,
      batteryAfter: null,
      fuelBefore: null,
      fuelAfter: null,
    },
  });

  const selectedCarId = form.watch("carId");
  const energyType = form.watch("energyType");
  const selectedCar = cars.find((c) => c.id === selectedCarId);

  const isElectric = energyType === "ELECTRIC";
  const isCombustion = energyType === "DIESEL" || energyType === "GPL";
  const isHybrid = energyType === "HYBRID";

  async function onSubmit(values: z.infer<typeof CreateRefuelingSchema>) {
    setIsLoading(true);
    try {
      await createRefueling(values);

      toast.success("Abastecimento registrado com sucesso!", {
        description: `€${values.totalCost.toFixed(2)} no ${values.locale}`,
      });

      setIsOpen(false);
      form.reset();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      console.error("Erro ao criar abastecimento:", JSON.stringify(error, null, 2));
      toast.error("Erro ao registrar abastecimento", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Abastecimento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5" />
            Registrar Abastecimento
          </DialogTitle>
          <DialogDescription>Registre um novo abastecimento ou carregamento</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Seleção de Veículo */}
            <FormField
              control={form.control}
              name="carId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Veículo *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um veículo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cars.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">Nenhum veículo atribuído</div>
                      ) : (
                        cars.map((car) => (
                          <SelectItem key={car.id} value={car.id}>
                            {car.brand} {car.model} {car.tag ? `- ${car.tag}` : ""}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {selectedCar && (
                    <FormDescription>
                      Tipo:{" "}
                      {selectedCar.type === "ELECTRIC"
                        ? "⚡ Elétrico"
                        : selectedCar.type === "DIESEL"
                          ? "⛽ Diesel"
                          : selectedCar.type === "GPL"
                            ? "🔵 GPL"
                            : "🔋⛽ Híbrido"}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              {/* Local */}
              <FormField
                control={form.control}
                name="locale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Galp, Tesla Supercharger" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tipo de Energia */}
              <FormField
                control={form.control}
                name="energyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Energia *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ELECTRIC">⚡ Elétrico</SelectItem>
                        <SelectItem value="DIESEL">⛽ Diesel</SelectItem>
                        <SelectItem value="GPL">🔵 GPL</SelectItem>
                        <SelectItem value="HYBRID">🔋 Híbrido</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Data e Hora */}
              <FormField
                control={form.control}
                name="timestamp"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data e Hora *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP HH:mm", { locale: ptBR }) : "Selecione"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Custo Total */}
              <FormField
                control={form.control}
                name="totalCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custo Total *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
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

            {/* Método de Pagamento */}
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método de Pagamento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Cartão, MB Way, Dinheiro" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campos para Elétrico */}
            {(isElectric || isHybrid) && (
              <div className="space-y-4 rounded-lg border border-green-200 bg-green-50/50 p-4 dark:border-green-900 dark:bg-green-950/20">
                <div className="flex items-center gap-2 font-medium">
                  <Zap className="h-4 w-4 text-green-600" />
                  <span>Carregamento Elétrico</span>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="kWhCharged"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>kWh Carregados</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              step="0.1"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                              className="pr-12"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">kWh</span>
                          </div>
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
                        <FormLabel>Preço/kWh</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                              className="pl-7"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="chargingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tempo (min)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                              className="pr-12"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">min</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="batteryBefore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bateria Antes (%)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                              className="pr-8"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="batteryAfter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bateria Depois (%)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                              className="pr-8"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Campos para Combustão */}
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
                          <div className="relative">
                            <Input
                              type="number"
                              step="0.1"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                              className="pr-8"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">L</span>
                          </div>
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
                        <FormLabel>Preço/Litro</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                              className="pl-7"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fuelBefore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tanque Antes (%)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                              className="pr-8"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fuelAfter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tanque Depois (%)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                              className="pr-8"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                          </div>
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
                    Registrando...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Registrar
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
