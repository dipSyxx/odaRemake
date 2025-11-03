"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";

const registerSchema = z
  .object({
    email: z.string().email("Ugyldig e-post"),
    name: z.string().min(2, "Minst 2 tegn").optional(),
    password: z.string().min(8, "Minst 8 tegn"),
    confirm: z.string().min(8, "Minst 8 tegn"),
  })
  .refine((vals) => vals.password === vals.confirm, {
    message: "Passordene må være like",
    path: ["confirm"],
  });

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", name: "", password: "", confirm: "" },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setError(null);
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: values.email.toLowerCase(),
        name: values.name || undefined,
        password: values.password,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error || "Noe gikk galt");
      return;
    }
    router.push("/login");
  }

  return (
    <div className="min-h-[80dvh] flex items-center justify-center bg-[--background]">
      <div className="grid max-w-5xl w-full grid-cols-1 md:grid-cols-2 gap-8 p-6">
        <div className="hidden md:block" aria-hidden>
          <div className="h-full w-full rounded-xl bg-muted/10" />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-2">Opprett konto</h1>
          <p className="text-muted-foreground mb-8">
            Bli klar for å handle hos oss.
          </p>
          <Card className="bg-transparent border-0 shadow-none p-0">
            <CardContent className="p-0">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Din e-post</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="navn@epost.no"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Navn (valgfritt)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ola Nordmann" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passord</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gjenta passord</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {error ? (
                    <p className="text-sm text-destructive">{error}</p>
                  ) : null}
                  <Button
                    type="submit"
                    className="inline-flex items-center gap-2"
                  >
                    Opprett konto
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
