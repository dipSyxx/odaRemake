"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, PackageCheck, ReceiptText, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/hooks/use-user-store";
import type { SerializedOrder } from "@/lib/serializers";

type FetchState = {
  orders: SerializedOrder[];
  loading: boolean;
  error: string | null;
};

export default function OrderHistoryPage() {
  const { user } = useUserStore();
  const [{ orders, loading, error }, setState] = useState<FetchState>({
    orders: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;

    async function load() {
      if (!user?.id) {
        setState((prev) => ({ ...prev, loading: false, orders: [] }));
        return;
      }

      setState({ orders: [], loading: true, error: null });
      try {
        const res = await fetch(`/api/orders?userId=${user.id}`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json?.error ?? "Kunne ikke hente bestillinger.");
        }
        if (!active) return;
        setState({ orders: json.data ?? [], loading: false, error: null });
      } catch (err) {
        if (!active) return;
        setState({
          orders: [],
          loading: false,
          error:
            err instanceof Error
              ? err.message
              : "Kunne ikke hente bestillinger.",
        });
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [user?.id]);

  const hasOrders = orders.length > 0;

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div className="space-y-2 text-center">
        <Badge variant="secondary" className="gap-2 mx-auto w-fit">
          <ReceiptText className="h-4 w-4" />
          Bestillinger
        </Badge>
        <h1 className="text-3xl font-bold">Ordrehistorikk</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Her finner du dine tidligere bestillinger, status og totalsum. Klikk
          på en bestilling for å se detaljene.
        </p>
      </div>

      {!user ? (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Logg inn for å se ordrene dine</CardTitle>
            <CardDescription>
              Vi må vite hvem du er før vi kan vise ordrehistorikk.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button asChild className="flex-1">
              <Link href="/login">Logg inn</Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/register">Opprett konto</Link>
            </Button>
          </CardContent>
        </Card>
      ) : loading ? (
        <div className="flex flex-col items-center gap-3 py-10 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Laster bestillingene dine …
        </div>
      ) : error ? (
        <Card className="max-w-2xl mx-auto border-destructive/40 bg-destructive/5">
          <CardHeader>
            <CardTitle>Kunne ikke hente bestillinger</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => location.reload()}>Prøv igjen</Button>
          </CardContent>
        </Card>
      ) : hasOrders ? (
        <div className="grid gap-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Ingen tidligere bestillinger</CardTitle>
            <CardDescription>
              Når du har fullført en bestilling vil den vises her.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1">
              <Link href="/produkter">Finn produkter</Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/kategorier/20-frukt-og-gront">Utforsk kategorier</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function OrderCard({ order }: { order: SerializedOrder }) {
  const itemCount = useMemo(
    () => order.items.reduce((sum, item) => sum + item.quantity, 0),
    [order.items],
  );

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <PackageCheck className="h-5 w-5 text-primary" />
            Ordre #{order.id.slice(0, 8).toUpperCase()}
          </CardTitle>
          <CardDescription>
            Bestilt{" "}
            {new Date(order.createdAt).toLocaleString("no-NO", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </CardDescription>
        </div>
        <Badge className="capitalize">{order.status.toLowerCase()}</Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-2 font-medium text-foreground">
            <ShoppingBag className="h-4 w-4" />
            {itemCount} produkter
          </span>
          <span>
            Betalingsstatus:{" "}
            <strong className="capitalize">
              {order.paymentStatus.toLowerCase()}
            </strong>
          </span>
          <span className="font-semibold text-foreground">
            {formatCurrency(order.total, order.currency)}
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Produkter
          </p>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm"
              >
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} stk ·{" "}
                    {formatCurrency(item.unitPrice ?? 0, item.currency)}
                  </p>
                </div>
                <span className="font-semibold">
                  {formatCurrency((item.unitPrice ?? 0) * item.quantity, item.currency)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {order.shippingAddress ? (
          <div className="text-sm text-muted-foreground">
            <p className="text-xs uppercase tracking-wide">Leveringsadresse</p>
            <p>{order.shippingAddress}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function formatCurrency(
  value: number | null | undefined,
  currency = "NOK",
) {
  if (value === null || value === undefined) return "kr 0,00";
  return new Intl.NumberFormat("no-NO", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}
