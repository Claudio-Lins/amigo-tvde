import { getActiveMileage, getCurrentDriverMileages, getMileageStats } from "@/actions/mileage";
import { ActiveShiftAlert } from "@/components/mileage/active-shift-alert";
import { FinishMileageForm } from "@/components/mileage/finish-mileage-form";
import { MileageHistory } from "@/components/mileage/mileage-history";
import { StartMileageForm } from "@/components/mileage/start-mileage-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Route, TrendingUp } from "lucide-react";
import { IoMdSpeedometer } from "react-icons/io";

export const dynamic = "force-dynamic";

export default async function MileagePage() {
  const [activeMileage, mileages, stats] = await Promise.all([
    getActiveMileage(),
    getCurrentDriverMileages(),
    getMileageStats(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <IoMdSpeedometer className="h-8 w-8" />
              Controle de Quilometragem
            </h1>
            <p className="text-muted-foreground">Registre sua quilometragem diária e acompanhe seu desempenho</p>
          </div>
        </div>

        <Separator />

        {/* Active Shift Alert */}
        {activeMileage && <ActiveShiftAlert mileage={activeMileage} />}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Turnos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRecords}</div>
              <p className="text-xs text-muted-foreground">Turnos registrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">KM Total</CardTitle>
              <Route className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalKm.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Quilômetros percorridos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média por Turno</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageKm.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">KM em média</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.monthlyKm.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{stats.monthlyRecords} turnos</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Start/Finish Mileage Form */}
        {activeMileage ? <FinishMileageForm mileage={activeMileage} /> : <StartMileageForm />}

        {/* Mileage History */}
        <MileageHistory mileages={mileages} />
      </div>
    </div>
  );
}
