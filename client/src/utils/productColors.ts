import type { IProduct, IProductColor } from "../types";

export function productColors(product: IProduct): IProductColor[] {
  return (product.colors || []).filter((item) => String(item?.name || "").trim());
}

export function pickColor(
  product: IProduct,
  colorName?: string,
): IProductColor | undefined {
  const colors = productColors(product);
  if (colors.length === 0) return undefined;
  return colors.find((item) => item.name === colorName) || colors[0];
}

export function productPhotos(product: IProduct, colorName?: string): string[] {
  const colors = productColors(product);
  const selected = pickColor(product, colorName);
  const urls = [
    selected?.imageUrl,
    product.imageUrl,
    ...(product.images || []),
    ...colors.map((item) => item.imageUrl),
  ];
  const unique: string[] = [];
  for (const url of urls) {
    const clean = String(url || "").trim();
    if (clean && !unique.includes(clean)) unique.push(clean);
  }
  return unique;
}

export function cartLineKey(item: { _id: string; selectedColor?: string }) {
  return item.selectedColor
    ? `${item._id}::${item.selectedColor}`
    : String(item._id);
}

export function withSelectedColor(product: IProduct, colorName?: string) {
  const selected = pickColor(product, colorName);
  if (!selected) {
    return { ...product, selectedColor: undefined, selectedColorHex: undefined };
  }
  return {
    ...product,
    imageUrl: selected.imageUrl || product.imageUrl,
    selectedColor: selected.name,
    selectedColorHex: selected.hex,
  };
}
