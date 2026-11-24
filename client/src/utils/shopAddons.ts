import type { IProduct } from "../types";
import { matchesBrand } from "./brandMatch";
import { isBannerProduct } from "./pricing";
import {
  isAccessoryProduct,
  isConsoleProduct,
  isGameProduct,
  productKind,
} from "./productKind";
import { totalStock } from "./productColors";

export { isAccessoryProduct, isConsoleProduct, isGameProduct } from "./productKind";

function samePlatform(current: IProduct, item: IProduct) {
  const a = String(current.platform || "").trim().toLowerCase();
  const b = String(item.platform || "").trim().toLowerCase();
  if (a && b && a === b) return true;
  return (
    matchesBrand(item, current.platform || current.category) ||
    matchesBrand(current, item.platform || item.category)
  );
}

export function suggestAddons(
  current: IProduct | null,
  all: IProduct[],
  limit = 8,
  opts?: { includeGames?: boolean },
): IProduct[] {
  const includeGames = opts?.includeGames === true;
  const rest = all.filter(
    (item) =>
      (!current || item._id !== current._id) &&
      totalStock(item) > 0 &&
      !isBannerProduct(item),
  );
  const related = current ? rest.filter((item) => samePlatform(current, item)) : rest;
  const accessoriesOf = (list: IProduct[]) =>
    list.filter((item) => isAccessoryProduct(item) && !isConsoleProduct(item));
  const ranked = [
    ...accessoriesOf(related),
    ...(includeGames ? related.filter(isGameProduct) : []),
    ...(includeGames ? accessoriesOf(rest) : []),
    ...(includeGames ? rest.filter(isGameProduct) : []),
  ];
  const unique: IProduct[] = [];
  for (const item of ranked) {
    if (!unique.some((u) => u._id === item._id)) unique.push(item);
    if (unique.length >= limit) break;
  }
  return unique;
}

export function suggestSimilar(
  current: IProduct | null,
  all: IProduct[],
  limit = 8,
): IProduct[] {
  const rest = all.filter(
    (item) =>
      (!current || item._id !== current._id) &&
      !isBannerProduct(item) &&
      (!current || productKind(item) === productKind(current)),
  );
  const same = rest.filter(
    (item) =>
      current &&
      (item.platform === current.platform ||
        item.category === current.category),
  );
  const unique: IProduct[] = [];
  for (const item of [...same, ...rest]) {
    if (!unique.some((row) => row._id === item._id)) unique.push(item);
    if (unique.length >= limit) break;
  }
  return unique;
}
