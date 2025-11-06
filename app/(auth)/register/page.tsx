"use client";

import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
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
import { Loader2 } from "lucide-react";
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
    name: z.string().min(2, "Navn må bestå av minst 2 tegn").optional(),
    phone: z
      .string()
      .min(8, "Oppgi et gyldig telefonnummer")
      .regex(
        /^[0-9+\s()-]+$/,
        "Telefonnummer kan bare inneholde tall, mellomrom og tegnene +()-"
      ),
    address: z.string().min(5, "Velg en adresse fra listen"),
    addressId: z.string().min(1, "Velg en adresse fra listen"),
    password: z.string().min(8, "Passordet må være minst 8 tegn"),
    confirm: z.string().min(8, "Bekreft passordet med minst 8 tegn"),
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
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const addressInputRef = useRef<HTMLInputElement | null>(null);
  const manualCloseRef = useRef(false);

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

  const trimmedAddressQuery = addressQuery.trim();

  useEffect(() => {
    if (trimmedAddressQuery.length === 0) {
      setAddressResults([]);
      setAddressFetchError(null);
      setIsSearching(false);
      setIsPopoverOpen(false);
      manualCloseRef.current = false;
      return;
    }

    if (trimmedAddressQuery.length < 2) {
      setAddressResults([]);
      setAddressFetchError(null);
      setIsSearching(false);
      setIsPopoverOpen(false);
      manualCloseRef.current = false;
      return;
    }

    if (manualCloseRef.current) {
      return;
    }

    setIsPopoverOpen(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsSearching(true);
      setAddressFetchError(null);
      try {
        const response = await fetch(
          `/api/address-search?query=${encodeURIComponent(
            trimmedAddressQuery
          )}`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error("Klarte ikke å hente adresser");
        }
        const data = (await response.json()) as {
          data?: AddressSuggestion[];
          error?: string;
        };

        if (data.error) {
          throw new Error(data.error);
        }

        const results = data.data ?? [];
        setAddressResults(results);
        if (results.length === 0) {
          setAddressFetchError("Fant ingen adresser for søket ditt");
        }
      } catch (fetchError) {
        if ((fetchError as Error).name === "AbortError") return;
        console.error(fetchError);
        setAddressResults([]);
        setAddressFetchError("Kunne ikke hente adresser. Prøv igjen senere.");
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [trimmedAddressQuery]);

  function handleAddressSelect(address: AddressSuggestion) {
    const label = `${address.main_text}, ${address.secondary_text}`;
    form.setValue("address", label, { shouldValidate: true });
    form.setValue("addressId", address.address_id, { shouldValidate: true });
    setAddressQuery(label);
    manualCloseRef.current = true;
    setAddressResults([]);
    setAddressFetchError(null);
    setIsPopoverOpen(false);
    addressInputRef.current?.focus();
  }

  function resetAddressSelection() {
    form.setValue("address", "", { shouldValidate: true });
    form.setValue("addressId", "", { shouldValidate: true });
    setAddressQuery("");
    setAddressResults([]);
    setAddressFetchError(null);
    setIsPopoverOpen(false);
    manualCloseRef.current = false;
    addressInputRef.current?.focus();
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
              alt="Register illustration"
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
                          <FormLabel>E-post</FormLabel>
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
                          <FormLabel>Address</FormLabel>
                          <div className="space-y-2">
                            <Popover
                              modal={false}
                              open={isPopoverOpen}
                              onOpenChange={(open) => {
                                setIsPopoverOpen(open);
                                if (!open) {
                                  manualCloseRef.current = true;
                                  setAddressResults([]);
                                  setAddressFetchError(null);
                                  setIsSearching(false);
                                } else {
                                  manualCloseRef.current = false;
                                }
                              }}
                            >
                              <PopoverAnchor asChild>
                                <FormControl>
                                  <Input
                                    {...field}
                                    ref={(node) => {
                                      field.ref(node);
                                      addressInputRef.current = node;
                                    }}
                                    value={addressQuery}
                                    onChange={(event) => {
                                      const value = event.target.value;
                                      field.onChange(value);
                                      setAddressQuery(value);
                                      manualCloseRef.current = false;
                                      if (addressId) {
                                        form.setValue("addressId", "", {
                                          shouldValidate: true,
                                        });
                                      }
                                      setAddressFetchError(null);
                                    }}
                                    placeholder="Søk etter adressen din"
                                  />
                                </FormControl>
                              </PopoverAnchor>
                              <PopoverContent
                                align="start"
                                className="p-0 w-[min(320px,calc(100vw-4rem))]"
                                side="bottom"
                                onOpenAutoFocus={(event) =>
                                  event.preventDefault()
                                }
                                onCloseAutoFocus={(event) =>
                                  event.preventDefault()
                                }
                              >
                                <div className="py-2">
                                  {isSearching ? (
                                    <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                      Søker etter adresser ...
                                    </div>
                                  ) : null}
                                  {!isSearching && addressResults.length > 0 ? (
                                    <div className="max-h-60 overflow-y-auto">
                                      {addressResults.map((item) => (
                                        <button
                                          key={item.address_id}
                                          type="button"
                                          className="w-full text-left px-3 py-2 hover:bg-secondary transition-colors"
                                          onClick={() =>
                                            handleAddressSelect(item)
                                          }
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
                                  {!isSearching &&
                                  addressResults.length === 0 &&
                                  addressFetchError ? (
                                    <p className="px-3 py-2 text-xs text-destructive">
                                      {addressFetchError}
                                    </p>
                                  ) : null}
                                </div>
                              </PopoverContent>
                            </Popover>
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
                            <FormLabel>Bekreft passord</FormLabel>
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
