export const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Preparing",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABEL_KA: Record<OrderStatus, string> = {
  Pending: "მიღებულია",
  Processing: "მუშავდება",
  Preparing: "მზადდება",
  Shipped: "კურიერს გადაეცა",
  Delivered: "ჩაბარდა",
  Cancelled: "გაუქმდა",
};

export const CUSTOMER_CANCELABLE: OrderStatus[] = [
  "Pending",
  "Processing",
  "Preparing",
];

export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}
