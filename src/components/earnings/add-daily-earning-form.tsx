"use client";

import { createDailyEarning } from "@/actions/daily-earnings";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CreateDailyEarningSchema, type EarningSource } from "@/zod-schema/earning-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

export function AddDailyEarningForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof CreateDailyEarningSchema>>({
    resolver: zodResolver(CreateDailyEarningSchema),
    defaultValues: {
      date: new Date(),
      source: "UBER" as EarningSource,
      description: "",
      amount: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof CreateDailyEarningSchema>) {
    setIsLoading(true);
    try {
      await createDailyEarning(values);

      toast.success("Ganho registrado com sucesso!", {
        description: `€${values.amount.toFixed(2)}`,
      });

      setIsOpen(false);
      form.reset();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      console.error("Erro ao criar ganho:", JSON.stringify(error, null, 2));
      toast.error("Erro ao registrar ganho", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 text-xs sm:text-sm w-full sm:w-auto">
          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Novo Ganho Diário</span>
          <span className="xs:hidden">Ganho Diário</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-2 sm:space-y-3">
          <DialogTitle className="text-lg sm:text-xl">Registrar Ganho Diário</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Registre os ganhos consolidados do dia por plataforma
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
            {/* Plataforma */}
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Plataforma *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-9 sm:h-10">
                        <SelectValue placeholder="Selecione a plataforma" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="UBER">🚗 Uber</SelectItem>
                      <SelectItem value="BOLT">⚡ Bolt</SelectItem>
                      <SelectItem value="TOUR">🏛️ Tour</SelectItem>
                      <SelectItem value="OTHER">📱 Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs">Plataforma onde realizou os ganhos</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Data */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-sm">Data *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal h-9 sm:h-10 text-sm",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? format(field.value, "PPP", { locale: ptBR }) : "Selecione"}
                          <CalendarIcon className="ml-auto h-3 w-3 sm:h-4 sm:w-4 opacity-50" />
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

            {/* Valor */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Valor *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                        className="pl-7 h-9 sm:h-10 text-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs">Valor recebido na corrida ou ganho</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descrição */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Descrição (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Dia calmo, muito movimento, eventos especiais..."
                      {...field}
                      rows={3}
                      className="text-sm resize-none"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">Observações sobre o dia de trabalho (opcional)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dicas */}
            <div className="rounded-lg bg-muted p-3 sm:p-4 space-y-1.5 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium">💡 Dicas:</p>
              <ul className="text-xs sm:text-sm text-muted-foreground space-y-0.5 sm:space-y-1 list-disc list-inside">
                <li>Registre o total de ganhos do dia por plataforma</li>
                <li>Registre ganhos de cada plataforma separadamente</li>
                <li>Facilita o acompanhamento diário e comparações</li>
              </ul>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="w-full sm:w-auto h-9 sm:h-10 text-sm"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-2 w-full sm:w-auto h-9 sm:h-10 text-sm">
                {isLoading ? (
                  <>
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
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
