import { getCurrentDriverProfile } from "@/actions/driver-profile";
import { EditDriverProfileForm } from "@/components/forms/edit-driver-profile-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Car, MapPin, Route, User } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DriverProfile() {
  const driverProfile = await getCurrentDriverProfile();

  if (!driverProfile) {
    redirect("/driver");
  }

  const initials = `${driverProfile.firstName?.[0] || ""}${driverProfile.lastName?.[0] || ""}`.toUpperCase() || "??";

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <User className="h-8 w-8" />
              Meu Perfil
            </h1>
            <p className="text-muted-foreground">Gerencie suas informações pessoais e profissionais</p>
          </div>
        </div>

        <Separator />

        {/* Profile Header Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={driverProfile.photo || driverProfile.user.image || undefined}
                  alt={driverProfile.user.name || ""}
                />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-2xl font-bold">{driverProfile.user.name || ""}</h2>
                  <p className="text-muted-foreground">{driverProfile.user.email || ""}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <User className="h-3 w-3" />
                    Motorista
                  </Badge>
                  {driverProfile.nationality && (
                    <Badge variant="outline" className="gap-1">
                      <MapPin className="h-3 w-3" />
                      {driverProfile.nationality}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Veículos</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{driverProfile._count.cars || 0}</div>
              <p className="text-xs text-muted-foreground">Veículos atribuídos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quilometragem</CardTitle>
              <Route className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{driverProfile._count.mileage || 0}</div>
              <p className="text-xs text-muted-foreground">Registros de KM</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alimentação</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{driverProfile._count.foodExpenses || 0}</div>
              <p className="text-xs text-muted-foreground">Despesas registradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Abastecimentos</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{driverProfile._count.energyLogs || 0}</div>
              <p className="text-xs text-muted-foreground">Registros de energia</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Profile Form */}
      <EditDriverProfileForm profile={driverProfile} />

      {/* Vehicles Section */}
      {driverProfile.cars && driverProfile.cars.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Meus Veículos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {driverProfile.cars.map((car) => (
                <Card key={car.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">
                            {car.brand} {car.model}
                          </p>
                          {car.year && <p className="text-sm text-muted-foreground">Ano {car.year}</p>}
                        </div>
                        <Badge variant="secondary">{car.type}</Badge>
                      </div>
                      {car.tag && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Matrícula:</span>{" "}
                          <span className="font-medium">{car.tag}</span>
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
