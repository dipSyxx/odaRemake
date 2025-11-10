"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useUserStore } from "./use-user-store";
import type { SerializedProduct } from "@/lib/serializers";
import { toast } from "@/components/ui/use-toast";

const CART_STORAGE_KEY = "oda_cart_id";

function readStoredCartId() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(CART_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredCartId(id: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (id) {
      window.localStorage.setItem(CART_STORAGE_KEY, id);
    } else {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

async function parseJson<T>(response: Response): Promise<T> {
  let payload: any = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }
  if (!response.ok) {
    const message = payload?.error ?? "Noe gikk galt. Prøv igjen.";
    throw new Error(message);
  }
  return payload as T;
}

export function useCartActions() {
  const { cart, setCart, user } = useUserStore();
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const syncCart = useCallback(
    (incoming: any | null) => {
      setCart(incoming ?? null);
      writeStoredCartId(incoming?.id ?? null);
      return incoming ?? null;
    },
    [setCart],
  );

  const cartSubtotal = useMemo(() => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => {
      const price = item.unitPrice ?? 0;
      return sum + price * item.quantity;
    }, 0);
  }, [cart]);

  useEffect(() => {
    if (hydrated || cart) return;
    const storedId = readStoredCartId();
    if (!storedId) {
      setHydrated(true);
      return;
    }
    setCurrentAction("hydrate");
    fetch(`/api/carts/${storedId}`, { cache: "no-store" })
      .then((res) => parseJson<{ data?: any }>(res))
      .then((json) => {
        if (json?.data) {
          syncCart(json.data);
        } else {
          writeStoredCartId(null);
        }
      })
      .catch(() => {
        writeStoredCartId(null);
      })
      .finally(() => {
        setCurrentAction(null);
        setHydrated(true);
      });
  }, [cart, hydrated, syncCart]);

  const ensureCart = useCallback(async () => {
    if (cart) return cart;
    const storedId = readStoredCartId();
    if (storedId) {
      try {
        const res = await fetch(`/api/carts/${storedId}`, { cache: "no-store" });
        const json = await parseJson<{ data?: any }>(res);
        if (json?.data) {
          return syncCart(json.data);
        }
      } catch {
        writeStoredCartId(null);
      }
    }

    setCurrentAction("create-cart");
    try {
      const res = await fetch("/api/carts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id ?? null,
          status: "DRAFT",
          currency: "NOK",
        }),
      });
      const json = await parseJson<{ data: any }>(res);
      return syncCart(json.data);
    } finally {
      setCurrentAction(null);
    }
  }, [cart, syncCart, user?.id]);

  const refreshCart = useCallback(async () => {
    if (!cart) return null;
    setCurrentAction("refresh-cart");
    try {
      const res = await fetch(`/api/carts/${cart.id}`, { cache: "no-store" });
      const json = await parseJson<{ data: any }>(res);
      return syncCart(json.data);
    } finally {
      setCurrentAction(null);
    }
  }, [cart, syncCart]);

  const addItem = useCallback(
    async (product: SerializedProduct, quantity = 1) => {
      if (quantity <= 0) return;
      const activeCart = await ensureCart();
      if (!activeCart) {
        throw new Error("Kunne ikke opprette handlekurv.");
      }
      setCurrentAction(`add-${product.id}`);
      try {
        const res = await fetch(`/api/carts/${activeCart.id}/items`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product.id,
            quantity,
            unitPrice: product.grossPrice ?? 0,
            currency: product.currency ?? activeCart.currency ?? "NOK",
          }),
        });
        const json = await parseJson<{ data: any }>(res);
        syncCart(json.data);
        toast({
          title: "Lagt i handlekurven",
          description: `${product.name} x${quantity}`,
        });
        return json.data;
      } finally {
        setCurrentAction(null);
      }
    },
    [ensureCart, syncCart],
  );

  const updateItemQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (!cart) return null;
      setCurrentAction(`update-${itemId}`);
      try {
        const res = await fetch(`/api/carts/${cart.id}/items/${itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
        });
        const json = await parseJson<{ data: any }>(res);
        return syncCart(json.data);
      } finally {
        setCurrentAction(null);
      }
    },
    [cart, syncCart],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      if (!cart) return null;
      setCurrentAction(`remove-${itemId}`);
      try {
        const res = await fetch(`/api/carts/${cart.id}/items/${itemId}`, {
          method: "DELETE",
        });
        const json = await parseJson<{ data: any }>(res);
        return syncCart(json.data);
      } finally {
        setCurrentAction(null);
      }
    },
    [cart, syncCart],
  );

  const clearCart = useCallback(
    (removeRemote = false) => {
      if (removeRemote && cart) {
        fetch(`/api/carts/${cart.id}`, { method: "DELETE" }).catch(() => {
          // swallow errors
        });
      }
      syncCart(null);
    },
    [cart, syncCart],
  );

  const checkout = useCallback(
    async ({
      shippingAddress,
      billingAddress,
      shippingTotal,
      discountTotal = 0,
    }: {
      shippingAddress: string;
      billingAddress?: string | null;
      shippingTotal: number;
      discountTotal?: number;
    }) => {
      if (!cart || cart.items.length === 0) {
        throw new Error("Handlekurven er tom.");
      }
      const subtotal = cart.items.reduce((sum, item) => {
        const price = item.unitPrice ?? 0;
        return sum + price * item.quantity;
      }, 0);
      const total = subtotal + shippingTotal - discountTotal;

      setCurrentAction("checkout");
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: cart.userId ?? user?.id ?? null,
            cartId: cart.id,
            currency: cart.currency ?? "NOK",
            subtotal,
            discountTotal,
            shippingTotal,
            total,
            shippingAddress,
            billingAddress,
          }),
        });
        const json = await parseJson<{ data: any }>(res);
        toast({
          title: "Bestilling fullført",
          description: "Takk for handelen!",
        });
        syncCart(null);
        return json.data;
      } finally {
        setCurrentAction(null);
      }
    },
    [cart, syncCart, user?.id],
  );

  return {
    action: currentAction,
    isProcessing: currentAction !== null,
    cartSubtotal,
    hydrated,
    addItem,
    updateItemQuantity,
    removeItem,
    refreshCart,
    clearCart,
    checkout,
  };
}
