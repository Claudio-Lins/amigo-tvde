"use client";

import { finishMileage } from "@/actions/mileage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Mileage } from "@/generated/prisma";
import { FinishMileageSchema } from "@/zod-schema/mileage-update-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type FinishMileageFormProps = {
  mileage: Mileage;
};

export function FinishMileageForm({ mileage }: FinishMileageFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FinishMileageSchema>>({
    resolver: zodResolver(FinishMileageSchema) as any,
    defaultValues: {
      mileageId: mileage.id,
      kmFinalDaily: 0,
      kmFinalWeekly: null,
    },
  });

  const kmFinalDaily = form.watch("kmFinalDaily");
  const kmDifference = kmFinalDaily && mileage.kmInitialDaily ? kmFinalDaily - mileage.kmInitialDaily : 0;

  async function onSubmit(values: z.infer<typeof FinishMileageSchema>) {
    setIsLoading(true);
    try {
      await finishMileage(values);

      toast.success("Turno finalizado com sucesso!", {
        description: `Você percorreu ${kmDifference} km neste turno.`,
      });

      form.reset();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      console.error("Erro ao finalizar turno:", JSON.stringify(error, null, 2));
      toast.error("Erro ao finalizar turno", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-2 border-green-500/20 bg-green-50/5 dark:bg-green-950/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          Finalizar Turno
        </CardTitle>
        <CardDescription>Registre a quilometragem final ao concluir seu turno de trabalho</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Turno Info */}
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <p className="text-sm font-medium">📊 Informações do Turno:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Início:</span>
                  <p className="font-medium">
                    {format(new Date(mileage.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">KM Inicial:</span>
                  <p className="font-medium">{mileage.kmInitialDaily?.toLocaleString()} km</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="kmFinalDaily"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quilometragem Final (Diária) *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="Digite a quilometragem final"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                          className="pr-12 text-lg"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">km</span>
                      </div>
                    </FormControl>
                    <FormDescription>Quilometragem mostrada no painel do veículo ao finalizar o turno</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="kmFinalWeekly"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quilometragem Semanal (Opcional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="Digite a quilometragem semanal"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                          className="pr-12"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">km</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* KM Difference Display */}
            {kmDifference > 0 && (
              <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4">
                <p className="text-sm text-muted-foreground">Quilometragem percorrida neste turno:</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {kmDifference.toLocaleString()} km
                </p>
              </div>
            )}

            <Button type="submit" disabled={isLoading} size="lg" className="w-full gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Finalizando Turno...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Finalizar Turno
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
