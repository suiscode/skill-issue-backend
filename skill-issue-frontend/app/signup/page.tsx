"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUpMutation } from "@/lib/__generated__/apollo-hooks";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const signUpSchema = z
  .object({
    email: z.string().email("Enter a valid email address."),
    username: z.string().min(3, "Username must be at least 3 characters."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(6, "Confirm your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const { isAuthenticated, isHydrating } = useAuth();
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [signUpMutation, { loading }] = useSignUpMutation();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!isHydrating && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isHydrating, router]);

  const onSubmit = async (values: SignUpValues) => {
    setSubmitError("");

    try {
      await signUpMutation({
        variables: {
          input: {
            email: values.email,
            username: values.username,
            password: values.password,
          },
        },
      });
      setAwaitingVerification(true);
      form.reset();
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "Failed to sign up. Please try again.";
      setSubmitError(message);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-border/60 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Create your account</CardTitle>
        </CardHeader>
        <CardContent>
          {awaitingVerification ? (
            <div className="space-y-4 rounded-md border border-emerald-600/30 bg-emerald-600/10 p-4">
              <p className="text-sm text-emerald-300">
                Check your email to verify your account before signing in.
              </p>
              <p className="text-xs text-emerald-400/80">
                We sent a verification link to your inbox (and possibly spam).
              </p>
              <Button asChild className="w-full">
                <Link href="/signin?created=1">Go to Sign in</Link>
              </Button>
            </div>
          ) : null}
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {submitError ? (
                <p className="text-sm text-destructive">{submitError}</p>
              ) : null}
              <Button
                className="w-full"
                type="submit"
                disabled={
                  awaitingVerification || form.formState.isSubmitting || loading
                }
              >
                {form.formState.isSubmitting || loading
                  ? "Creating account..."
                  : "Sign up"}
              </Button>
            </form>
          </Form>

          <p className="mt-4 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
