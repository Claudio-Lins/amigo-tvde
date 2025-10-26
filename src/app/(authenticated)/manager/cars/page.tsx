import { getCars, getCarsStats } from "@/actions/cars";
import { getDriverProfiles } from "@/actions/drivers";
import { AddCarForm } from "@/components/forms/add-car-form";
import { DeleteCarForm } from "@/components/forms/delete-car-form";
import { EditCarForm } from "@/components/forms/edit-car-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Fuel, Plus, User, UserX, Zap } from "lucide-react";
import Image from "next/image";

interface CarsProps {}

export default async function Cars({}: CarsProps) {
  const [cars, stats, drivers] = await Promise.all([getCars(), getCarsStats(), getDriverProfiles()]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Car className="h-8 w-8" />
              Gestão de Veículos
            </h1>
            <p className="text-muted-foreground">Gerencie todos os veículos da sua frota TVDE</p>
          </div>
          <AddCarForm drivers={drivers} />
        </div>

        <Separator />

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Veículos</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Veículos cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Elétricos</CardTitle>
              <Zap className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.electric}</div>
              <p className="text-xs text-muted-foreground">Veículos elétricos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Combustão</CardTitle>
              <Fuel className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.combustion}</div>
              <p className="text-xs text-muted-foreground">Diesel + GPL</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Híbridos</CardTitle>
              <div className="flex gap-1">
                <Zap className="h-3 w-3 text-green-500" />
                <Fuel className="h-3 w-3 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.hybrid}</div>
              <p className="text-xs text-muted-foreground">Veículos híbridos</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="electric">Elétricos</TabsTrigger>
          <TabsTrigger value="diesel">Diesel</TabsTrigger>
          <TabsTrigger value="gpl">GPL</TabsTrigger>
          <TabsTrigger value="hybrid">Híbridos</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {cars.length === 0 ? (
            <div className="rounded-md border border-dashed p-8 text-center">
              <Car className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Nenhum veículo cadastrado</h3>
              <p className="mt-2 text-sm text-muted-foreground">Comece adicionando o primeiro veículo à sua frota.</p>
              <AddCarForm
                drivers={drivers}
                triggerButton={
                  <Button className="mt-4 gap-2">
                    <Plus className="h-4 w-4" />
                    Adicionar Primeiro Veículo
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cars.map((car) => (
                <Card key={car.id} className="overflow-hidden">
                  {/* Imagem do Carro */}
                  <div className="relative h-48 w-full bg-muted">
                    {car.image ? (
                      <Image
                        src={car.image}
                        alt={`${car.brand} ${car.model}`}
                        className="h-full w-full object-cover"
                        width={100}
                        height={100}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Car className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                    {/* Badge do Tipo de Energia */}
                    <div className="absolute top-2 right-2 rounded-full bg-background/90 p-2 backdrop-blur-sm">
                      {car.type === "ELECTRIC" && <Zap className="h-4 w-4 text-green-500" />}
                      {car.type === "DIESEL" && <Fuel className="h-4 w-4 text-orange-500" />}
                      {car.type === "GPL" && <Fuel className="h-4 w-4 text-blue-500" />}
                      {car.type === "HYBRID" && (
                        <div className="flex gap-1">
                          <Zap className="h-3 w-3 text-green-500" />
                          <Fuel className="h-3 w-3 text-orange-500" />
                        </div>
                      )}
                    </div>
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-lg">
                          {car.brand} {car.model}
                        </CardTitle>
                        {car.year && <p className="text-sm text-muted-foreground">Ano {car.year}</p>}
                      </div>
                      {car.driver ? (
                        <Badge variant="default" className="gap-1">
                          <User className="h-3 w-3" />
                          {car.driver.firstName} {car.driver.lastName}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <UserX className="h-3 w-3" />
                          Sem motorista
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    {car.tag && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Matrícula:</span>{" "}
                        <span className="font-medium">{car.tag}</span>
                      </p>
                    )}
                    {car.rentPrice && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Aluguel:</span>{" "}
                        <span className="font-medium">€{Number(car.rentPrice).toFixed(2)}/semana</span>
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 border-t pt-4">
                    <EditCarForm car={car} drivers={drivers} />
                    <DeleteCarForm car={car} />
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="electric" className="space-y-4">
          {cars.filter((car) => car.type === "ELECTRIC").length === 0 ? (
            <div className="rounded-md border border-dashed p-8 text-center">
              <Zap className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="mt-4 text-lg font-semibold">Nenhum veículo elétrico</h3>
              <p className="mt-2 text-sm text-muted-foreground">Adicione veículos elétricos à sua frota.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cars
                .filter((car) => car.type === "ELECTRIC")
                .map((car) => (
                  <Card key={car.id} className="overflow-hidden">
                    <div className="relative h-48 w-full bg-muted">
                      {car.image ? (
                        <Image
                          src={car.image}
                          alt={`${car.brand} ${car.model}`}
                          className="h-full w-full object-cover"
                          width={400}
                          height={200}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Car className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 rounded-full bg-background/90 p-2 backdrop-blur-sm">
                        <Zap className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-lg">
                            {car.brand} {car.model}
                          </CardTitle>
                          {car.year && <p className="text-sm text-muted-foreground">Ano {car.year}</p>}
                        </div>
                        {car.driver ? (
                          <Badge variant="default" className="gap-1">
                            <User className="h-3 w-3" />
                            {car.driver.firstName} {car.driver.lastName}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <UserX className="h-3 w-3" />
                            Sem motorista
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {car.tag && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Matrícula:</span>{" "}
                          <span className="font-medium">{car.tag}</span>
                        </p>
                      )}
                      {car.driver && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Motorista:</span>{" "}
                          <span className="font-medium">
                            {car.driver.firstName} {car.driver.lastName}
                          </span>
                        </p>
                      )}
                      {car.rentPrice && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Aluguel:</span>{" "}
                          <span className="font-medium">€{Number(car.rentPrice).toFixed(2)}/mês</span>
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t pt-4">
                      <EditCarForm car={car} drivers={drivers} />
                      <DeleteCarForm car={car} />
                    </CardFooter>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="diesel" className="space-y-4">
          {cars.filter((car) => car.type === "DIESEL").length === 0 ? (
            <div className="rounded-md border border-dashed p-8 text-center">
              <Fuel className="mx-auto h-12 w-12 text-orange-500" />
              <h3 className="mt-4 text-lg font-semibold">Nenhum veículo a diesel</h3>
              <p className="mt-2 text-sm text-muted-foreground">Adicione veículos a diesel à sua frota.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cars
                .filter((car) => car.type === "DIESEL")
                .map((car) => (
                  <Card key={car.id} className="overflow-hidden">
                    <div className="relative h-48 w-full bg-muted">
                      {car.image ? (
                        <Image
                          src={car.image}
                          alt={`${car.brand} ${car.model}`}
                          className="h-full w-full object-cover"
                          width={400}
                          height={200}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Car className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 rounded-full bg-background/90 p-2 backdrop-blur-sm">
                        <Fuel className="h-4 w-4 text-orange-500" />
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-lg">
                            {car.brand} {car.model}
                          </CardTitle>
                          {car.year && <p className="text-sm text-muted-foreground">Ano {car.year}</p>}
                        </div>
                        {car.driver ? (
                          <Badge variant="default" className="gap-1">
                            <User className="h-3 w-3" />
                            {car.driver.firstName} {car.driver.lastName}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <UserX className="h-3 w-3" />
                            Sem motorista
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {car.tag && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Matrícula:</span>{" "}
                          <span className="font-medium">{car.tag}</span>
                        </p>
                      )}
                      {car.driver && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Motorista:</span>{" "}
                          <span className="font-medium">
                            {car.driver.firstName} {car.driver.lastName}
                          </span>
                        </p>
                      )}
                      {car.rentPrice && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Aluguel:</span>{" "}
                          <span className="font-medium">€{Number(car.rentPrice).toFixed(2)}/mês</span>
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t pt-4">
                      <EditCarForm car={car} drivers={drivers} />
                      <DeleteCarForm car={car} />
                    </CardFooter>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="gpl" className="space-y-4">
          {cars.filter((car) => car.type === "GPL").length === 0 ? (
            <div className="rounded-md border border-dashed p-8 text-center">
              <Fuel className="mx-auto h-12 w-12 text-blue-500" />
              <h3 className="mt-4 text-lg font-semibold">Nenhum veículo GPL</h3>
              <p className="mt-2 text-sm text-muted-foreground">Adicione veículos GPL à sua frota.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cars
                .filter((car) => car.type === "GPL")
                .map((car) => (
                  <Card key={car.id} className="overflow-hidden">
                    <div className="relative h-48 w-full bg-muted">
                      {car.image ? (
                        <Image
                          src={car.image}
                          alt={`${car.brand} ${car.model}`}
                          className="h-full w-full object-cover"
                          width={400}
                          height={200}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Car className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 rounded-full bg-background/90 p-2 backdrop-blur-sm">
                        <Fuel className="h-4 w-4 text-blue-500" />
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-lg">
                            {car.brand} {car.model}
                          </CardTitle>
                          {car.year && <p className="text-sm text-muted-foreground">Ano {car.year}</p>}
                        </div>
                        {car.driver ? (
                          <Badge variant="default" className="gap-1">
                            <User className="h-3 w-3" />
                            {car.driver.firstName} {car.driver.lastName}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <UserX className="h-3 w-3" />
                            Sem motorista
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {car.tag && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Matrícula:</span>{" "}
                          <span className="font-medium">{car.tag}</span>
                        </p>
                      )}
                      {car.driver && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Motorista:</span>{" "}
                          <span className="font-medium">
                            {car.driver.firstName} {car.driver.lastName}
                          </span>
                        </p>
                      )}
                      {car.rentPrice && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Aluguel:</span>{" "}
                          <span className="font-medium">€{Number(car.rentPrice).toFixed(2)}/mês</span>
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t pt-4">
                      <EditCarForm car={car} drivers={drivers} />
                      <DeleteCarForm car={car} />
                    </CardFooter>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="hybrid" className="space-y-4">
          {cars.filter((car) => car.type === "HYBRID").length === 0 ? (
            <div className="rounded-md border border-dashed p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center">
                <Zap className="h-8 w-8 text-green-500" />
                <Fuel className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Nenhum veículo híbrido</h3>
              <p className="mt-2 text-sm text-muted-foreground">Adicione veículos híbridos à sua frota.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cars
                .filter((car) => car.type === "HYBRID")
                .map((car) => (
                  <Card key={car.id} className="overflow-hidden">
                    <div className="relative h-48 w-full bg-muted">
                      {car.image ? (
                        <Image
                          src={car.image}
                          alt={`${car.brand} ${car.model}`}
                          className="h-full w-full object-cover"
                          width={400}
                          height={200}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Car className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 rounded-full bg-background/90 p-2 backdrop-blur-sm">
                        <div className="flex gap-1">
                          <Zap className="h-3 w-3 text-green-500" />
                          <Fuel className="h-3 w-3 text-orange-500" />
                        </div>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-lg">
                            {car.brand} {car.model}
                          </CardTitle>
                          {car.year && <p className="text-sm text-muted-foreground">Ano {car.year}</p>}
                        </div>
                        {car.driver ? (
                          <Badge variant="default" className="gap-1">
                            <User className="h-3 w-3" />
                            {car.driver.firstName} {car.driver.lastName}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <UserX className="h-3 w-3" />
                            Sem motorista
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {car.tag && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Matrícula:</span>{" "}
                          <span className="font-medium">{car.tag}</span>
                        </p>
                      )}
                      {car.driver && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Motorista:</span>{" "}
                          <span className="font-medium">
                            {car.driver.firstName} {car.driver.lastName}
                          </span>
                        </p>
                      )}
                      {car.rentPrice && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Aluguel:</span>{" "}
                          <span className="font-medium">€{Number(car.rentPrice).toFixed(2)}/mês</span>
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t pt-4">
                      <EditCarForm car={car} drivers={drivers} />
                      <DeleteCarForm car={car} />
                    </CardFooter>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
