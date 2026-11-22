import type { IProduct } from "../types";
import { matchesBrand } from "./brandMatch";
import { isBannerProduct } from "./pricing";
import { totalStock } from "./productColors";

function hay(product: IProduct) {
  return `${product.category} ${product.title} ${product.platform} ${product.description} ${product.genre}`.toLowerCase();
}

export function isAccessoryProduct(product: IProduct) {
  return /accessor|აქსესუარ|controller|ჯოისტიკ|charger|დამტენ|cable|კაბელ|hdmi|memory|memory card/.test(
    hay(product),
  );
}

export function isGameProduct(product: IProduct) {
  return (
    /game|თამაშ|cartridge|კარტრიჯ|disc|დისკ/.test(hay(product)) &&
    !isAccessoryProduct(product)
  );
}

export function suggestAddons(
  current: IProduct | null,
  all: IProduct[],
  limit = 8,
): IProduct[] {
  const rest = all.filter(
    (item) =>
      (!current || item._id !== current._id) &&
      totalStock(item) > 0 &&
      !isBannerProduct(item),
  );
  const brand = current?.platform || current?.category;
  const related = brand
    ? rest.filter(
        (item) =>
          matchesBrand(item, brand) ||
          matchesBrand(current || {}, item.platform || item.category),
      )
    : rest;
  const ranked = [
    ...related.filter(isAccessoryProduct),
    ...related.filter(isGameProduct),
    ...rest.filter(isAccessoryProduct),
    ...rest.filter(isGameProduct),
  ];
  const unique: IProduct[] = [];
  for (const item of ranked) {
    if (!unique.some((u) => u._id === item._id)) unique.push(item);
    if (unique.length >= limit) break;
  }
  return unique;
}
