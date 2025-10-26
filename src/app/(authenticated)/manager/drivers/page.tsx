import { getDriverProfiles, getDriverStats, getUsersWithoutDriverProfile } from "@/actions/drivers";
import { AddDriverForm } from "@/components/forms/add-driver-form";
import { DeleteDriverForm } from "@/components/forms/delete-driver-form";
import { EditDriverForm } from "@/components/forms/edit-driver-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Car, Mail, UserCheck, Users, UserX } from "lucide-react";

interface DriversProps {}

export default async function Drivers({}: DriversProps) {
  const [drivers, stats, usersWithoutProfile] = await Promise.all([
    getDriverProfiles(),
    getDriverStats(),
    getUsersWithoutDriverProfile(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Users className="h-8 w-8" />
              Gestão de Motoristas
            </h1>
            <p className="text-muted-foreground">Gerencie todos os motoristas da sua frota TVDE</p>
          </div>
          <AddDriverForm users={usersWithoutProfile} />
        </div>

        <Separator />

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Motoristas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Motoristas cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Com Veículo</CardTitle>
              <UserCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.withCars}</div>
              <p className="text-xs text-muted-foreground">Motoristas com veículos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sem Veículo</CardTitle>
              <UserX className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.withoutCars}</div>
              <p className="text-xs text-muted-foreground">Motoristas sem veículos</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Drivers List */}
      <div className="space-y-4">
        {drivers.length === 0 ? (
          <div className="rounded-md border border-dashed p-8 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Nenhum motorista cadastrado</h3>
            <p className="mt-2 text-sm text-muted-foreground">Comece adicionando o primeiro motorista à sua frota.</p>
            <div className="mt-4">
              <AddDriverForm users={usersWithoutProfile} />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {drivers.map((driver) => (
              <Card key={driver.id} className="overflow-hidden">
                {/* Header com Avatar */}
                <CardHeader className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={driver.photo ?? undefined} alt={`${driver.firstName} ${driver.lastName}`} />
                      <AvatarFallback className="text-lg">
                        {driver.firstName.charAt(0)}
                        {driver.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {driver.firstName} {driver.lastName}
                      </CardTitle>
                      {driver.user && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{driver.user.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {driver._count.cars > 0 ? (
                      <Badge variant="default" className="gap-1">
                        <Car className="h-3 w-3" />
                        {driver._count.cars} {driver._count.cars === 1 ? "Veículo" : "Veículos"}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Sem veículo</Badge>
                    )}
                    {driver.gender && (
                      <Badge variant="outline">
                        {driver.gender === "MALE" ? "Masculino" : driver.gender === "FEMALE" ? "Feminino" : "Outro"}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-2">
                  {driver.nationality && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Nacionalidade:</span>{" "}
                      <span className="font-medium">{driver.nationality}</span>
                    </p>
                  )}
                  {driver.city && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Cidade:</span>{" "}
                      <span className="font-medium">{driver.city}</span>
                    </p>
                  )}
                  {driver.bankName && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Banco:</span>{" "}
                      <span className="font-medium">{driver.bankName}</span>
                    </p>
                  )}

                  {/* Veículos associados */}
                  {driver.cars && driver.cars.length > 0 && (
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground mb-1">Veículos:</p>
                      <div className="space-y-1">
                        {driver.cars.map((car) => (
                          <div key={car.id} className="text-sm flex items-center gap-2">
                            <Car className="h-3 w-3 text-muted-foreground" />
                            <span>
                              {car.brand} {car.model}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {car.type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex justify-end gap-2 border-t pt-4">
                  <EditDriverForm driver={driver} />
                  <DeleteDriverForm driver={driver} />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
