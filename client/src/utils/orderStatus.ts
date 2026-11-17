export const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Preparing",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PIPELINE: OrderStatus[] = [
  "Pending",
  "Processing",
  "Preparing",
  "Shipped",
  "Delivered",
];

export const STATUS_LABEL_KA: Record<string, string> = {
  Pending: "მიღებულია",
  Processing: "მუშავდება",
  Preparing: "მზადდება",
  Shipped: "კურიერს გადაეცა",
  Delivered: "ჩაბარდა",
  Cancelled: "გაუქმდა",
};

export const STATUS_COLOR: Record<string, string> = {
  Pending: "#38bdf8",
  Processing: "#a78bfa",
  Preparing: "#fbbf24",
  Shipped: "#fb923c",
  Delivered: "#34d399",
  Cancelled: "#f87171",
};

export function statusLabel(status?: string) {
  return STATUS_LABEL_KA[status || ""] || status || "მიღებულია";
}

export function canCustomerCancel(status?: string) {
  return ["Pending", "Processing", "Preparing"].includes(status || "");
}
