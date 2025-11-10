"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { SerializedOrder } from "@/lib/serializers";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<SerializedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("Fant ikke ordre-ID.");
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    fetch(`/api/orders/${orderId}`, { cache: "no-store", signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          const payload = await res.json().catch(() => null);
          throw new Error(payload?.error ?? "Kunne ikke hente ordren.");
        }
        return res.json() as Promise<{ data: SerializedOrder }>;
      })
      .then((json) => {
        setOrder(json.data);
        setError(null);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Kunne ikke hente ordren.");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Laster ordredetaljer ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-xl font-semibold">Noe gikk galt</p>
        <p className="text-muted-foreground">{error}</p>
        <Button asChild>
          <Link href="/produkter">Tilbake til produkter</Link>
        </Button>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="container mx-auto px-4 py-10 space-y-6">
      <div className="text-center space-y-3">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          Ordre mottatt
        </p>
        <h1 className="text-3xl font-bold">Takk for bestillingen!</h1>
        <p className="text-muted-foreground">
          Ordre-ID <span className="font-mono text-sm">{order.id}</span>
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Produkter</CardTitle>
            <CardDescription>Oversikt over bestilte varer.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.items.map((item) => {
              const unitPrice = item.unitPrice ?? 0;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify_between rounded-lg border border-border/60 p-3"
                >
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} stk · {formatCurrency(unitPrice, item.currency)}
                    </p>
                  </div>
                  <span className="font-semibold">
                    {formatCurrency(unitPrice * item.quantity, item.currency)}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Oppsummering</CardTitle>
              <CardDescription>Beløp og leveringsopplysninger.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Varer</span>
                <span>{formatCurrency(order.subtotal, order.currency)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Frakt</span>
                <span>{formatCurrency(order.shippingTotal, order.currency)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Rabatt</span>
                <span>{formatCurrency(order.discountTotal, order.currency)}</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold border-t border-border/60 pt-3">
                <span>Totalt</span>
                <span>{formatCurrency(order.total, order.currency)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Levering</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">Adresse</p>
              <p>{order.shippingAddress ?? "Ikke oppgitt"}</p>
            </CardContent>
          </Card>

          <Button asChild className="w-full">
            <Link href="/produkter">Fortsett å handle</Link>
          </Button>
        </div>
      </div>
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
