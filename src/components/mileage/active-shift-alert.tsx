"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Mileage } from "@/generated/prisma";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";

type ActiveShiftAlertProps = {
  mileage: Mileage;
};

export function ActiveShiftAlert({ mileage }: ActiveShiftAlertProps) {
  const [timeElapsed, setTimeElapsed] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  useEffect(
    function updateTimer() {
      function calculateElapsed() {
        const elapsed = formatDistanceToNow(new Date(mileage.createdAt), {
          locale: ptBR,
          addSuffix: false,
        });
        setTimeElapsed(elapsed);

        // Mostrar aviso se passou mais de 8 horas
        const hoursElapsed = (Date.now() - new Date(mileage.createdAt).getTime()) / (1000 * 60 * 60);
        setShowWarning(hoursElapsed >= 8);
      }

      calculateElapsed();
      const interval = setInterval(calculateElapsed, 60000); // Atualizar a cada minuto

      return () => clearInterval(interval);
    },
    [mileage.createdAt],
  );

  return (
    <Alert variant={showWarning ? "destructive" : "default"} className="border-2">
      <div className="flex items-start gap-4">
        {showWarning ? <AlertCircle className="h-5 w-5 mt-0.5" /> : <Clock className="h-5 w-5 mt-0.5" />}
        <div className="flex-1 space-y-1">
          <AlertTitle className="text-lg font-semibold">
            {showWarning ? "⚠️ Atenção: Turno Prolongado!" : "🚗 Turno em Andamento"}
          </AlertTitle>
          <AlertDescription className="space-y-2">
            <div className="flex flex-col gap-1">
              <p>
                <strong>Quilometragem Inicial:</strong> {mileage.kmInitialDaily?.toLocaleString()} km
              </p>
              <p>
                <strong>Tempo decorrido:</strong> {timeElapsed}
              </p>
              {showWarning && (
                <p className="text-sm mt-2 font-medium">
                  Não se esqueça de registrar a quilometragem final ao terminar seu turno!
                </p>
              )}
            </div>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
}
