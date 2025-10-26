"use client";

import { updateCar } from "@/actions/cars";
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { Car } from "@/generated/prisma";
import { UpdateCarSchema } from "@/zod-schema/car-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Car as CarIcon, Fuel, Loader2, Pencil, Zap } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

// Tipo serializado para evitar problemas com Decimal
type SerializedCar = Omit<Car, "rentPrice"> & { rentPrice: number | null };

type EditCarFormProps = {
  car: SerializedCar & { driver?: { id: string; firstName: string; lastName: string } | null };
  drivers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    user: { email: string } | null;
  }>;
};

export function EditCarForm({ car, drivers }: EditCarFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof UpdateCarSchema>>({
    resolver: zodResolver(UpdateCarSchema),
    defaultValues: {
      id: car.id,
      driverId: car.driverId ?? null,
      brand: car.brand,
      model: car.model,
      type: car.type,
      year: car.year ?? null,
      tag: car.tag ?? null,
      image: car.image ?? null,
      rentPrice: car.rentPrice ? Number(car.rentPrice) : null,
    },
  });

  async function onSubmit(values: z.infer<typeof UpdateCarSchema>) {
    setIsLoading(true);
    try {
      console.log(JSON.stringify(values, null, 2));

      await updateCar(car.id, {
        driverId: values.driverId === "none" ? null : values.driverId,
        brand: values.brand,
        model: values.model,
        type: values.type,
        year: values.year,
        tag: values.tag,
        image: values.image,
        rentPrice: values.rentPrice,
      });

      toast.success("Veículo atualizado com sucesso!", {
        description: `${values.brand} ${values.model} foi atualizado.`,
      });

      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar veículo:", error);
      toast.error("Erro ao atualizar veículo", {
        description: "Ocorreu um erro ao tentar atualizar o veículo. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CarIcon className="h-5 w-5" />
            Editar Veículo
          </DialogTitle>
          <DialogDescription>
            Atualize as informações do veículo {car.brand} {car.model}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Motorista */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Motorista Responsável (Opcional)</h3>

              <FormField
                control={form.control}
                name="driverId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motorista</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um motorista (opcional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {drivers.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground">Nenhum motorista cadastrado</div>
                        ) : (
                          <>
                            <SelectItem value="none">
                              <span className="text-muted-foreground">Sem motorista</span>
                            </SelectItem>
                            {drivers.map((driver) => (
                              <SelectItem key={driver.id} value={driver.id}>
                                {driver.firstName} {driver.lastName}
                                {driver.user?.email && (
                                  <span className="text-xs text-muted-foreground ml-2">({driver.user.email})</span>
                                )}
                              </SelectItem>
                            ))}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Você pode associar este veículo a um motorista agora ou deixar para depois.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Informações do Veículo */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Informações do Veículo</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marca *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Tesla, BMW, Toyota" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Model 3, i3, Prius" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Energia *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ELECTRIC">
                            <div className="flex items-center gap-2">
                              <Zap className="h-4 w-4 text-green-500" />
                              Elétrico
                            </div>
                          </SelectItem>
                          <SelectItem value="DIESEL">
                            <div className="flex items-center gap-2">
                              <Fuel className="h-4 w-4 text-orange-500" />
                              Diesel
                            </div>
                          </SelectItem>
                          <SelectItem value="GPL">
                            <div className="flex items-center gap-2">
                              <Fuel className="h-4 w-4 text-blue-500" />
                              GPL
                            </div>
                          </SelectItem>
                          <SelectItem value="HYBRID">
                            <div className="flex items-center gap-2">
                              <Zap className="h-3 w-3 text-green-500" />
                              <Fuel className="h-3 w-3 text-orange-500" />
                              Híbrido
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ano</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ex: 2023"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matrícula</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: AA-00-BB" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormDescription>Placa do veículo</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rentPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor do Aluguel</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Ex: 350.00"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                        />
                      </FormControl>
                      <FormDescription>Valor mensal em €</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Imagem</FormLabel>
                    <FormControl>
                      <Input placeholder="https://exemplo.com/imagem.jpg" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormDescription>Link para uma foto do veículo (opcional)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  <>
                    <Pencil className="mr-2 h-4 w-4" />
                    Atualizar Veículo
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
