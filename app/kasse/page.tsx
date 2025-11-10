"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { useUserStore } from "@/hooks/use-user-store";
import { useCartActions } from "@/hooks/use-cart-actions";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, user } = useUserStore();
  const {
    updateItemQuantity,
    removeItem,
    checkout,
    action,
    cartSubtotal,
  } = useCartActions();

  const [shippingMethod, setShippingMethod] = useState<"home" | "pickup">(
    "home",
  );
  const [shippingAddress, setShippingAddress] = useState(
    user?.address ?? "",
  );
  const [billingAddress, setBillingAddress] = useState(
    user?.address ?? "",
  );
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const shippingCost = shippingMethod === "home" ? 49 : 0;
  const total = useMemo(
    () => cartSubtotal + shippingCost,
    [cartSubtotal, shippingCost],
  );

  const handleQuantityChange = (id: string, next: number) => {
    if (!cart) return;
    if (next < 1) {
      removeItem(id);
      return;
    }
    updateItemQuantity(id, next);
  };

  const handleCheckout = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!cart || cart.items.length === 0) {
      setError("Handlekurven er tom.");
      return;
    }
    if (!shippingAddress.trim()) {
      setError("Oppgi en leveringsadresse.");
      return;
    }
    setError(null);
    try {
      const order = await checkout({
        shippingAddress: `${shippingAddress}${notes ? `\n${notes}` : ""}`,
        billingAddress: billingAddress || shippingAddress,
        shippingTotal: shippingCost,
      });
      router.push(`/kasse/suksess?orderId=${order.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Noe gikk galt med bestillingen.",
      );
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-xl font-semibold">Handlekurven er tom</p>
        <p className="text-muted-foreground">
          Finn produkter i kategoriene våre og legg dem i handlekurven for å
          starte en bestilling.
        </p>
        <Button asChild>
          <Link href="/produkter">Gå til produkter</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div>
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          Kasse
        </p>
        <h1 className="text-3xl font-bold">Fullfør bestilling</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Kontroller innholdet i handlekurven din, fyll inn leveringsdetaljer
          og send bestillingen når du er klar.
        </p>
      </div>

      <form
        onSubmit={handleCheckout}
        className="grid gap-6 lg:grid-cols-[2fr,1fr]"
      >
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Produkter</CardTitle>
              <CardDescription>Juster mengder før utsjekk.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.items.map((item) => {
                const price = item.unitPrice ?? 0;
                const lineTotal = price * item.quantity;
                const disabled =
                  action === `update-${item.id}` || action === `remove-${item.id}`;
                const image =
                  item.product?.images?.[0]?.thumbnail?.url ??
                  item.product?.images?.[0]?.large?.url;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-xl border border-border/60 p-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-secondary/40">
                        {image ? (
                          <img
                            src={image}
                            alt={item.product?.name ?? "Produkt"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                            Ingen bilde
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">
                          {item.product?.name ?? `Produkt #${item.productId}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(price, item.currency)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={disabled}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={disabled}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold">
                          {formatCurrency(lineTotal, item.currency)}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => removeItem(item.id)}
                          disabled={disabled}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Levering</CardTitle>
              <CardDescription>
                Velg leveringsmetode og adresse for bestillingen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={shippingMethod}
                onValueChange={(value: "home" | "pickup") => setShippingMethod(value)}
                className="grid gap-3 sm:grid-cols-2"
              >
                <label className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                  <div>
                    <p className="font-medium">Hjemlevering</p>
                    <p className="text-xs text-muted-foreground">Leveres på døren</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">49 kr</span>
                    <RadioGroupItem value="home" />
                  </div>
                </label>
                <label className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                  <div>
                    <p className="font-medium">Hent i HUB</p>
                    <p className="text-xs text-muted-foreground">Gratis henting</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">0 kr</span>
                    <RadioGroupItem value="pickup" />
                  </div>
                </label>
              </RadioGroup>

              <div className="space-y-3">
                <label className="text-sm font-medium">Leveringsadresse</label>
                <Textarea
                  value={shippingAddress}
                  onChange={(event) => setShippingAddress(event.target.value)}
                  placeholder="Gateadresse og postnummer"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Fakturaadresse</label>
                <Textarea
                  value={billingAddress}
                  onChange={(event) => setBillingAddress(event.target.value)}
                  placeholder="Brukes også til kvittering"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Tilleggsinfo</label>
                <Textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Portkode, ønsket leveringstid osv."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Oppsummering</CardTitle>
              <CardDescription>Kostnader før bestilling sendes inn.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Varer</span>
                <span>{formatCurrency(cartSubtotal, cart.currency ?? "NOK")}</span>
              </div>
              <div className="flex items-center justify_between text-sm">
                <span>Levering</span>
                <span>{formatCurrency(shippingCost, cart.currency ?? "NOK")}</span>
              </div>
              <div className="border-t border-border/60 pt-3 flex items-center justify-between font-semibold">
                <span>Totalt</span>
                <span>{formatCurrency(total, cart.currency ?? "NOK")}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dine detaljer</CardTitle>
              <CardDescription>Brukes for kvittering og kontakt.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                value={user?.name ?? ""}
                placeholder="Navn"
                readOnly
                disabled
              />
              <Input
                value={user?.email ?? ""}
                placeholder="E-post"
                type="email"
                readOnly
                disabled
              />
            </CardContent>
          </Card>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button
            type="submit"
            className="w-full bg-[#ff9500] hover:bg-[#e68600] text-black"
            disabled={action === "checkout"}
          >
            {action === "checkout" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Sender bestilling...
              </>
            ) : (
              "Fullfør bestilling"
            )}
          </Button>
          <Button type="button" variant="ghost" className="w-full" asChild>
            <Link href="/produkter">Fortsett å handle</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}

function formatCurrency(value: number | null | undefined, currency = "NOK") {
  if (value === null || value === undefined) return "kr 0,00";
  return new Intl.NumberFormat("no-NO", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}
