"use client";

import { LoadingButton } from "@/components/loading-button";
import { PasswordInput } from "@/components/password-input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { passwordSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const signUpSchema = z
  .object({
    fullName: z.string().min(1, { message: "Name is required" }),
    email: z.email({ message: "Please enter a valid email" }),
    password: passwordSchema,
    passwordConfirmation: z.string().min(1, { message: "Please confirm password" }),
    acceptedTerms: z.boolean().refine((value) => value === true, {
      message: "Você deve aceitar os termos de uso para continuar",
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

type SignUpValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      acceptedTerms: true,
    },
  });

  async function onSubmit({ email, password, fullName, acceptedTerms }: SignUpValues) {
    setError(null);

    const { error } = await authClient.signUp.email(
      {
        email,
        password,
        fullName,
        acceptedTerms,
        callbackURL: "/email-verified",
        ...(acceptedTerms && { acceptedTermsAt: new Date() }),
      },
      {
        onSuccess: () => {
          toast.success("Account created successfully");
          router.push("/");
        },
      },
    );
    if (error) {
      setError(error.message || "Something went wrong");
    }
  }

  const loading = form.formState.isSubmitting;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
        <CardDescription className="text-xs md:text-sm">Enter your information to create an account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete="new-password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete="new-password" placeholder="Confirm password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            {error && (
              <div role="alert" className="text-sm text-red-600">
                {error}
              </div>
            )}

            <LoadingButton type="submit" className="w-full" loading={loading}>
              Create an account
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-center border-t pt-4">
          <p className="text-muted-foreground text-center text-xs">
            Already have an account?{" "}
            <Link href="/sign-in" className="underline">
              Sign in
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
