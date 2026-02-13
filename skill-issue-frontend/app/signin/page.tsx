"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSignInMutation } from "@/lib/__generated__/apollo-hooks"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const signInSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
})

type SignInValues = z.infer<typeof signInSchema>

export default function SignInPage() {
  const router = useRouter()
  const { isAuthenticated, isHydrating, setSession } = useAuth()
  const [signInMutation, { loading }] = useSignInMutation()
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const [showCreatedMessage, setShowCreatedMessage] = useState(false)
  const [submitError, setSubmitError] = useState("")

  useEffect(() => {
    const created =
      new URLSearchParams(window.location.search).get("created") === "1"
    setShowCreatedMessage(created)
  }, [])

  useEffect(() => {
    if (!isHydrating && isAuthenticated) {
      router.replace("/dashboard")
    }
  }, [isAuthenticated, isHydrating, router])

  const onSubmit = async (values: SignInValues) => {
    setSubmitError("")

    try {
      const result = await signInMutation({
        variables: {
          input: values,
        },
      })
      const payload = result.data?.signIn
      if (!payload) {
        throw new Error("No sign-in payload returned")
      }
      setSession(payload)
      router.push("/dashboard")
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "Failed to sign in. Please try again."
      setSubmitError(message)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-border/60 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          {showCreatedMessage ? (
            <p className="mb-4 rounded-md border border-emerald-600/30 bg-emerald-600/10 p-3 text-sm text-emerald-400">
              Account created. Sign in to continue.
            </p>
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
              {submitError ? (
                <p className="text-sm text-destructive">{submitError}</p>
              ) : null}
              <Button
                className="w-full"
                type="submit"
                disabled={form.formState.isSubmitting || loading}
              >
                {form.formState.isSubmitting || loading
                  ? "Signing in..."
                  : "Sign in"}
              </Button>
            </form>
          </Form>

          <p className="mt-4 text-sm text-muted-foreground">
            Need an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
