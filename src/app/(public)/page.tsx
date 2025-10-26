import { Button } from "@/components/ui/button";
import { getServerSession } from "@/lib/get-session";
import { CarIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();
  const user = session?.user;
  const userRole = user?.role;

  // if (user) {
  //   redirect(user.role === "ADMIN" ? "/admin" : user.role === "MANAGER" ? "/manager" : "/driver");
  // }

  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-8 flex items-center justify-center gap-4">
          <CarIcon className="size-24 border-muted rounded-full border text-primary" />
          <span className="text-muted-foreground text-2xl font-bold">Amigo - TVDE</span>
        </div>
        <div className="mx-auto mt-6 flex max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href={userRole === "ADMIN" ? "/admin" : userRole === "MANAGER" ? "/manager" : "/driver"}>
              Ir para o Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/sign-in">Entrar</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
