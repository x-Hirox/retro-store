export type InvoiceOrder = {
  _id: string;
  createdAt?: string;
  totalPrice?: number;
  status?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  paymentProvider?: string;
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

const PAY: Record<string, string> = {
  card: "ბარათი (Visa / Mastercard)",
  apple_pay: "Apple Pay",
  google_pay: "Google Pay",
  cash: "კურიერთან გადახდა",
};

export function payLabel(method?: string) {
  return PAY[method || ""] || method || "ბარათი";
}

export function payStatusLabel(status?: string) {
  if (status === "paid") return "გადახდილია";
  if (status === "pending") return "ბანკში მოლოდინში";
  if (status === "failed") return "გადახდა ვერ მოხერხდა";
  return "გადაუხდელი / კურიერი";
}

export function itemTitle(item: NonNullable<InvoiceOrder["orderItems"]>[number]) {
  return item.title || item.product?.title || "პროდუქტი";
}

export function itemPrice(item: NonNullable<InvoiceOrder["orderItems"]>[number]) {
  return Number(item.price ?? item.product?.price ?? 0);
}

export function invoiceHtml(order: InvoiceOrder) {
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

  return `<!DOCTYPE html>
<html lang="ka">
<head>
  <meta charset="utf-8" />
  <title>ინვოისი ${order._id}</title>
  <style>
    body { font-family: "Noto Sans Georgian", Arial, sans-serif; margin: 0; background: #f4f1ea; color: #1a1208; }
    .sheet { max-width: 720px; margin: 24px auto; background: #fff; padding: 36px 40px; border: 1px solid #d6c3a3; box-shadow: 0 8px 24px #0002; }
    .head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #7c3aed; padding-bottom: 16px; }
    .brand { font-size: 28px; font-weight: 900; letter-spacing: 0.04em; color: #7c3aed; }
    .meta { text-align: right; font-size: 13px; color: #444; }
    h1 { font-size: 22px; margin: 22px 0 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th { text-align: left; background: #111827; color: #fff; padding: 10px; font-size: 13px; }
    td { border-bottom: 1px solid #eee; padding: 10px; font-size: 14px; }
    .total { margin-top: 20px; text-align: right; font-size: 20px; font-weight: 800; }
    .foot { margin-top: 28px; font-size: 12px; color: #666; }
    @media print { body { background: #fff; } .sheet { box-shadow: none; border: 0; margin: 0; } }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="head">
      <div>
        <div class="brand">RETROBIT</div>
        <div>retrobit.ge · retrobit.support@gmail.com</div>
        <div>+995 595 95 00 39</div>
      </div>
      <div class="meta">
        <div>ინვოისი</div>
        <div>#${String(order._id).slice(-8).toUpperCase()}</div>
        <div>${order.createdAt ? new Date(order.createdAt).toLocaleString("ka-GE") : ""}</div>
      </div>
    </div>
    <h1>შეკვეთის ინვოისი</h1>
    <p>მყიდველი: <strong>${order.shippingAddress?.fullName || ""}</strong></p>
    <p>მისამართი: ${order.shippingAddress?.city || ""}, ${order.shippingAddress?.address || ""}</p>
    <p>ტელეფონი: ${order.shippingAddress?.phone || ""}</p>
    <p>გადახდა: ${payLabel(order.paymentMethod)}${order.paymentProvider ? ` · ${String(order.paymentProvider).toUpperCase()}` : ""}</p>
    <p>გადახდის სტატუსი: ${payStatusLabel(order.paymentStatus)}</p>
    <p>სტატუსი: ${
      (
        {
          Pending: "მიღებულია",
          Processing: "მუშავდება",
          Preparing: "მზადდება",
          Shipped: "კურიერს გადაეცა",
          Delivered: "ჩაბარდა",
          Cancelled: "გაუქმდა",
        } as Record<string, string>
      )[order.status || "Pending"] || order.status
    }</p>
    <table>
      <thead><tr><th>პროდუქტი</th><th>რაოდენობა</th><th>ფასი</th><th>ჯამი</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="total">სულ: ${Number(order.totalPrice || 0).toFixed(2)} ₾</p>
    <p class="foot">მიწოდების პირობები მალე დაემატება. გმადლობთ RetroBit-ის არჩევისთვის.</p>
  </div>
</body>
</html>`;
}

export function downloadInvoice(order: InvoiceOrder) {
  const blob = new Blob([invoiceHtml(order)], {
    type: "text/html;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `retrobit-invoice-${order._id}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

export function printInvoice(order: InvoiceOrder) {
  const frame = window.open("", "_blank", "noopener,width=820,height=900");
  if (!frame) {
    downloadInvoice(order);
    return;
  }
  frame.document.write(invoiceHtml(order));
  frame.document.close();
  frame.focus();
  frame.print();
}
