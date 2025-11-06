"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import Image from "next/image";
import { useTheme } from "@/lib/theme-provider";
import { Header } from "@/components/shared/header";

type AddressSuggestion = {
  address_id: string;
  main_text: string;
  secondary_text: string;
  is_complete: boolean;
};

const registerSchema = z
  .object({
    email: z.string().email("Ugyldig e-post"),
    name: z.string().min(2, "Minst 2 tegn").optional(),
    phone: z
      .string()
      .min(8, "Oppgi et gyldig telefonnummer")
      .regex(
        /^[0-9+\s()-]+$/,
        "Telefonnummer kan bare inneholde tall, mellomrom og +()-"
      ),
    address: z
      .string()
      .min(5, "Velg en adresse fra listen eller søk etter adressen din"),
    addressId: z.string().min(1, "Velg en adresse fra listen"),
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
  const isDarkMode = useTheme().theme === "dark";
  const [addressQuery, setAddressQuery] = useState("");
  const [addressResults, setAddressResults] = useState<AddressSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addressFetchError, setAddressFetchError] = useState<string | null>(
    null
  );

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "",
      phone: "",
      address: "",
      addressId: "",
      password: "",
      confirm: "",
    },
  });

  const addressValue = form.watch("address");
  const addressId = form.watch("addressId");

  useEffect(() => {
    setAddressQuery(addressValue);
  }, [addressValue]);

  async function handleAddressSearch(query: string) {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setAddressResults([]);
      setAddressFetchError("Skriv minst to tegn for å søke etter adresse");
      return;
    }

    setIsSearching(true);
    setAddressFetchError(null);

    try {
      const response = await fetch(
        `/api/address-search?query=${encodeURIComponent(trimmed)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch addresses");
      }
      const data = (await response.json()) as {
        data?: AddressSuggestion[];
        error?: string;
      };

      if (data.error) {
        throw new Error(data.error);
      }

      setAddressResults(data.data ?? []);
      if (!data.data || data.data.length === 0) {
        setAddressFetchError("Fant ingen adresser for søket ditt");
      }
    } catch (fetchError) {
      console.error(fetchError);
      setAddressResults([]);
      setAddressFetchError("Kunne ikke hente adresser. Prøv igjen senere.");
    } finally {
      setIsSearching(false);
    }
  }

  function handleAddressSelect(address: AddressSuggestion) {
    const label = `${address.main_text}, ${address.secondary_text}`;
    form.setValue("address", label, { shouldValidate: true });
    form.setValue("addressId", address.address_id, { shouldValidate: true });
    setAddressResults([]);
    setAddressFetchError(null);
  }

  function resetAddressSelection() {
    form.setValue("address", "", { shouldValidate: true });
    form.setValue("addressId", "", { shouldValidate: true });
    setAddressQuery("");
    setAddressResults([]);
    setAddressFetchError(null);
  }

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setError(null);
    const { confirm, addressId: _addressId, ...rest } = values;

    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: rest.email.toLowerCase(),
        name: rest.name?.trim() || undefined,
        phone: rest.phone.trim(),
        address: rest.address.trim(),
        password: rest.password,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data?.error || "Noe gikk galt");
      return;
    }

    router.push("/login");
  }

  return (
    <>
      <Header />
      <div className="min-h-[80dvh] flex items-center justify-center bg-[--background]">
        <div className="grid max-w-5xl w-full grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <div className="hidden md:block" aria-hidden>
            <Image
              src={
                isDarkMode
                  ? "/images/login-image-light.svg"
                  : "/images/login-image-dark.svg"
              }
              alt="Oda login image"
              width={385}
              height={278}
              className="fill-white h-full w-full"
              priority
            />
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
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefonnummer</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="+47 123 45 678"
                              inputMode="tel"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <input type="hidden" {...form.register("addressId")} />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresse</FormLabel>
                          <div className="space-y-2">
                            <FormControl>
                              <div className="flex gap-2">
                                <Input
                                  {...field}
                                  value={addressQuery}
                                  onChange={(event) => {
                                    const value = event.target.value;
                                    field.onChange(value);
                                    setAddressQuery(value);
                                    if (addressId) {
                                      form.setValue("addressId", "", {
                                        shouldValidate: true,
                                      });
                                    }
                                    setAddressFetchError(null);
                                  }}
                                  placeholder="Søk etter adressen din"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() =>
                                    handleAddressSearch(addressQuery)
                                  }
                                  disabled={isSearching}
                                >
                                  {isSearching ? "Søker..." : "Søk"}
                                </Button>
                              </div>
                            </FormControl>
                            {addressId ? (
                              <p className="text-xs text-muted-foreground">
                                Valgt adresse: {addressValue}{" "}
                                <button
                                  type="button"
                                  className="text-xs underline ml-1"
                                  onClick={resetAddressSelection}
                                >
                                  Endre
                                </button>
                              </p>
                            ) : null}
                            {addressFetchError ? (
                              <p className="text-xs text-destructive">
                                {addressFetchError}
                              </p>
                            ) : null}
                            {addressResults.length > 0 ? (
                              <div className="rounded-md border border-border divide-y divide-border bg-background max-h-48 overflow-y-auto">
                                {addressResults.map((item) => (
                                  <button
                                    key={item.address_id}
                                    type="button"
                                    className="w-full text-left px-3 py-2 hover:bg-secondary transition-colors"
                                    onClick={() => handleAddressSelect(item)}
                                  >
                                    <div className="text-sm font-medium">
                                      {item.main_text}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {item.secondary_text}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            ) : null}
                          </div>
                          <FormMessage />
                          {form.formState.errors.addressId ? (
                            <p className="text-xs text-destructive mt-1">
                              {form.formState.errors.addressId.message}
                            </p>
                          ) : null}
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
    </>
  );
}
