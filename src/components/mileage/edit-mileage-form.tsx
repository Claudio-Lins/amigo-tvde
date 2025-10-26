"use client";

import { updateMileage } from "@/actions/mileage";
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
import type { Mileage } from "@/generated/prisma";
import { EditMileageSchema } from "@/zod-schema/mileage-update-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type EditMileageFormProps = {
  mileage: Mileage;
};

export function EditMileageForm({ mileage }: EditMileageFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof EditMileageSchema>>({
    resolver: zodResolver(EditMileageSchema) as any,
    defaultValues: {
      mileageId: mileage.id,
      kmInitialDaily: mileage.kmInitialDaily || 0,
      kmFinalDaily: mileage.kmFinalDaily || 0,
      kmInitialWeekly: mileage.kmInitialWeekly || null,
      kmFinalWeekly: mileage.kmFinalWeekly || null,
    },
  });

  const kmFinalDaily = form.watch("kmFinalDaily");
  const kmInitialDaily = form.watch("kmInitialDaily");
  const kmDifference = kmFinalDaily && kmInitialDaily ? kmFinalDaily - kmInitialDaily : 0;

  async function onSubmit(values: z.infer<typeof EditMileageSchema>) {
    setIsLoading(true);
    try {
      await updateMileage(values);

      toast.success("Registro atualizado com sucesso!", {
        description: `Quilometragem percorrida: ${kmDifference} km`,
      });

      setIsOpen(false);
      form.reset();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      console.error("Erro ao atualizar registro:", JSON.stringify(error, null, 2));
      toast.error("Erro ao atualizar registro", {
        description: errorMessage,
      });
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            Editar Registro de Quilometragem
          </DialogTitle>
          <DialogDescription>Atualize as informações do turno de trabalho</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="kmInitialDaily"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>KM Inicial (Diária) *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                            className="pr-12"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">km</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="kmFinalDaily"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>KM Final (Diária) *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
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

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="kmInitialWeekly"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>KM Inicial (Semanal)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
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

                <FormField
                  control={form.control}
                  name="kmFinalWeekly"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>KM Final (Semanal)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
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
            </div>

            {/* KM Difference Display */}
            {kmDifference > 0 && (
              <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3">
                <p className="text-xs text-muted-foreground">Quilometragem percorrida:</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {kmDifference.toLocaleString()} km
                </p>
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
                    Salvar Alterações
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
