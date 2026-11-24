import { useEffect, useMemo, useState } from "react";
import { getProducts } from "../services/productService";
import type { IProduct } from "../types";
import ProductCard from "../components/ProductCard";
import SeoHead from "../components/SeoHead";
import { isBannerProduct } from "../utils/pricing";
import { breadcrumbGraph, jsonLdGraph } from "../seo/site";
import { useLang } from "../i18n/LanguageContext";

function isGiftProduct(product: IProduct) {
  if (isBannerProduct(product)) return false;
  const cat = String(product.category || "").toLowerCase();
  const genre = String(product.genre || "").toLowerCase();
  const tags = (product.tags || []).join(" ").toLowerCase();
  const hay = `${cat} ${genre} ${tags}`;
  return /gift|საჩუქარ|bundle|ბუნდლ|ნაკრებ/.test(hay);
}

export default function Gifts() {
  const { t } = useLang();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const gifts = useMemo(() => products.filter(isGiftProduct), [products]);

  const title = t("gifts");
  const description = t("giftsDesc");

  return (
    <div className="shop-page" style={{ padding: "28px 16px 48px" }}>
      <SeoHead
        title={title}
        description={description}
        path="/gifts"
        jsonLd={jsonLdGraph([
          breadcrumbGraph([
            { name: t("home"), path: "/" },
            { name: title, path: "/gifts" },
          ]),
        ])}
      />
      <h1 className="collection-title" style={{ color: "#c41e3a" }}>
        {title}
      </h1>
      <p style={{ textAlign: "center", marginBottom: 28 }}>{t("giftsLead")}</p>
      {loading ? (
        <p style={{ textAlign: "center" }}>{t("loading")}</p>
      ) : gifts.length === 0 ? (
        <p style={{ textAlign: "center" }}>{t("noProducts")}</p>
      ) : (
        <div className="arcade-grid">
          {gifts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
