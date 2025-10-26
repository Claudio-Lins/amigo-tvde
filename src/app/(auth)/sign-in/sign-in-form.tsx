"use client";

import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { LoadingButton } from "@/components/loading-button";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FacebookIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const signInSchema = z.object({
  email: z.email({ message: "Please enter a valid email" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
  acceptedTerms: z.boolean().refine((value) => value === true, {
    message: "Você deve aceitar os termos de uso para continuar",
  }),
});

type SignInValues = z.infer<typeof signInSchema>;

export function SignInForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
      acceptedTerms: true,
    },
  });

  async function onSubmit({ email, password, rememberMe, acceptedTerms }: SignInValues) {
    setError(null);
    setLoading(true);

    const { data, error } = await authClient.signIn.email(
      {
        email,
        password,
        rememberMe,
        ...(acceptedTerms && { acceptedTermsAt: new Date() }),
      },
      {
        onRequest: () => {
          console.log("Iniciando sign-in...");
        },
        onSuccess: async (ctx) => {
          console.log("Sign-in bem sucedido! Context:", JSON.stringify(ctx, null, 2));

          // Prevenir redirecionamento automático
          // Aguardar um pouco para garantir que a sessão foi estabelecida
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Obter a sessão atualizada
          const sessionData = await authClient.getSession();
          console.log("Session data após login:", JSON.stringify(sessionData, null, 2));

          if (sessionData?.data?.user) {
            const userRole = sessionData.data.user.role;
            console.log("User role:", userRole);

            toast.success(`Bem-vindo, ${sessionData.data.user.name}!`);

            // Redirecionar baseado na role
            if (redirect) {
              window.location.href = redirect;
            } else {
              if (userRole === "ADMIN") {
                console.log("Redirecionando ADMIN para /admin");
                window.location.href = "/admin";
              }
              if (userRole === "MANAGER") {
                console.log("Redirecionando MANAGER para /manager");
                window.location.href = "/manager";
              } else if (userRole === "DRIVER") {
                console.log("Redirecionando DRIVER para /driver");
                window.location.href = "/driver";
              } else {
                console.log("Redirecionando para /unauthorized");
                window.location.href = "/unauthorized";
              }
            }
          } else {
            console.log("Sem dados de usuário, usando fallback");
            router.push(redirect ?? "/unauthorized");
          }
        },
        onError: (ctx) => {
          console.error("Erro no sign-in:", JSON.stringify(ctx.error, null, 2));
          setError(ctx.error.message || "Erro ao fazer login");
          setLoading(false);
        },
      },
    );

    if (error) {
      setLoading(false);
      setError(error.message || "Something went wrong");
      return;
    }
  }

  async function handleSocialSignIn(provider: "google" | "github" | "facebook") {
    setError(null);
    setLoading(true);

    // Para login social, o redirecionamento será tratado pelo callback
    // Vamos definir uma URL de callback personalizada que irá redirecionar baseado na role
    const callbackURL = redirect || "/auth/callback";

    const { error } = await authClient.signIn.social({
      provider,
      callbackURL,
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Something went wrong");
    }

    // Para login social, o redirecionamento acontece via callback
    // A lógica de redirecionamento baseada em role será tratada no middleware ou callback
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>Password</FormLabel>
                    <Link href="/forgot-password" className="ml-auto inline-block text-sm underline">
                      Forgot your password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput autoComplete="current-password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel>Remember me</FormLabel>
                </FormItem>
              )}
            />

            {error && (
              <div role="alert" className="text-sm text-red-600">
                {error}
              </div>
            )}

            <LoadingButton type="submit" className="w-full" loading={loading}>
              Login
            </LoadingButton>

            <div className="flex w-full flex-col items-center justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                disabled={loading}
                onClick={() => handleSocialSignIn("google")}
              >
                <GoogleIcon width="0.98em" height="1em" />
                Sign in with Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                disabled={loading}
                onClick={() => handleSocialSignIn("github")}
              >
                <GitHubIcon />
                Sign in with Github
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                disabled={loading}
                onClick={() => handleSocialSignIn("facebook")}
              >
                <FacebookIcon />
                Sign in with Facebook
              </Button>
              <FormField
                control={form.control}
                name="acceptedTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-normal">
                        Aceito os{" "}
                        <Link href="/terms" className="underline text-primary hover:text-primary/80">
                          termos de uso
                        </Link>{" "}
                        e{" "}
                        <Link href="/privacy" className="underline text-primary hover:text-primary/80">
                          política de privacidade
                        </Link>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-center border-t pt-4">
          <p className="text-muted-foreground text-center text-xs">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline">
              Sign up
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
