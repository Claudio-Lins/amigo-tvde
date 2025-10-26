"use client";

import { startMileage } from "@/actions/mileage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { StartMileageSchema } from "@/zod-schema/mileage-update-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Play } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

export function StartMileageForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof StartMileageSchema>>({
    resolver: zodResolver(StartMileageSchema) as any,
    defaultValues: {
      kmInitialDaily: 0,
      kmInitialWeekly: null,
    },
  });

  async function onSubmit(values: z.infer<typeof StartMileageSchema>) {
    setIsLoading(true);
    try {
      await startMileage(values);

      toast.success("Turno iniciado com sucesso!", {
        description: `Quilometragem inicial: ${values.kmInitialDaily} km`,
      });

      form.reset();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      console.error("Erro ao iniciar turno:", JSON.stringify(error, null, 2));
      toast.error("Erro ao iniciar turno", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5 text-primary" />
          Iniciar Turno
        </CardTitle>
        <CardDescription>Registre a quilometragem do veículo ao iniciar seu turno de trabalho</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="kmInitialDaily"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quilometragem Inicial (Diária) *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="Digite a quilometragem"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                          className="pr-12 text-lg"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">km</span>
                      </div>
                    </FormControl>
                    <FormDescription>Quilometragem mostrada no painel do veículo ao iniciar o turno</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="kmInitialWeekly"
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
                    <FormDescription>Se aplicável, registre a quilometragem semanal acumulada</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="rounded-lg bg-muted p-4 space-y-2">
              <p className="text-sm font-medium">💡 Dicas Importantes:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Verifique o hodômetro do veículo cuidadosamente</li>
                <li>Registre a quilometragem assim que iniciar o turno</li>
                <li>Você receberá lembretes para registrar a quilometragem final</li>
                <li>Turnos típicos: 8, 10 ou 12 horas</li>
              </ul>
            </div>

            <Button type="submit" disabled={isLoading} size="lg" className="w-full gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Iniciando Turno...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Iniciar Turno
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
