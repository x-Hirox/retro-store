export type InvoiceOrder = {
  _id: string;
  createdAt?: string;
  totalPrice?: number;
  status?: string;
  shippingAddress?: {
    fullName?: string;
    address?: string;
    city?: string;
    phone?: string;
  };
  orderItems?: Array<{
    title?: string;
    quantity?: number;
    price?: number;
    product?: { title?: string; price?: number };
  }>;
};

export function itemTitle(item: NonNullable<InvoiceOrder["orderItems"]>[number]) {
  return item.title || item.product?.title || "პროდუქტი";
}

export function itemPrice(item: NonNullable<InvoiceOrder["orderItems"]>[number]) {
  return Number(item.price ?? item.product?.price ?? 0);
}

export function downloadInvoice(order: InvoiceOrder) {
  const rows = (order.orderItems || [])
    .map((item) => {
      const qty = Number(item.quantity || 1);
      const price = itemPrice(item);
      return `<tr>
        <td>${itemTitle(item)}</td>
        <td>${qty}</td>
        <td>${price.toFixed(2)} ₾</td>
        <td>${(price * qty).toFixed(2)} ₾</td>
      </tr>`;
    })
    .join("");

  const html = `<!DOCTYPE html>
<html lang="ka">
<head>
  <meta charset="utf-8" />
  <title>ინვოისი ${order._id}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 32px; color: #111; }
    h1 { margin-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border-bottom: 1px solid #ddd; text-align: left; padding: 8px; }
    .total { font-size: 18px; font-weight: bold; margin-top: 20px; }
  </style>
</head>
<body>
  <h1>RetroBit — ინვოისი</h1>
  <p>შეკვეთა: ${order._id}</p>
  <p>თარიღი: ${order.createdAt ? new Date(order.createdAt).toLocaleString("ka-GE") : ""}</p>
  <p>სტატუსი: ${order.status || ""}</p>
  <p>მყიდველი: ${order.shippingAddress?.fullName || ""}</p>
  <p>მისამართი: ${order.shippingAddress?.city || ""}, ${order.shippingAddress?.address || ""}</p>
  <p>ტელეფონი: ${order.shippingAddress?.phone || ""}</p>
  <table>
    <thead><tr><th>პროდუქტი</th><th>რაოდენობა</th><th>ფასი</th><th>ჯამი</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <p class="total">სულ: ${Number(order.totalPrice || 0).toFixed(2)} ₾</p>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `retrobit-invoice-${order._id}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
