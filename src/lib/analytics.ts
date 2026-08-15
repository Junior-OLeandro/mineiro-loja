import type { CartItem } from "../types";

type AnalyticsParameters = Record<string, unknown>;

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      parameters?: AnalyticsParameters,
    ) => void;
  }
}

export function trackEvent(
  eventName: string,
  parameters?: AnalyticsParameters,
) {
  window.gtag?.("event", eventName, parameters);
}

export function toAnalyticsItems(items: CartItem[]) {
  return items.map((item) => ({
    item_id: item.productId,
    item_name: item.name,
    item_variant: item.variant,
    price:
      item.unitPrice +
      item.extras.reduce((total, extra) => total + extra.price, 0),
    quantity: item.quantity,
  }));
}
