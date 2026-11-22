import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProductById, getProducts } from "../services/productService";
import { useCart } from "../context/CartContext";
import type { IProduct } from "../types";
import { trackRecentlyViewed } from "../utils/recentlyViewed";
import { formatGel, getSalePrice } from "../utils/pricing";
import { useLang } from "../i18n/LanguageContext";
import { suggestAddons } from "../utils/shopAddons";
import PaymentMarks from "../components/PaymentMarks";
import SeoHead from "../components/SeoHead";
import { productImageAlt } from "../utils/imageAlt";
import {
  SITE_URL,
  absUrl,
  breadcrumbGraph,
  jsonLdGraph,
} from "../seo/site";
import { productKeywords } from "../utils/tags";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cart, addToCart, closeCartDrawer } = useCart();
  const { t } = useLang();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [addons, setAddons] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!id) return;
    setPhoto(0);
    setQty(1);
    getProductById(id)
      .then((data) => {
        setProduct(data);
        trackRecentlyViewed(data);
        setLoading(false);
        getProducts()
          .then((list) => setAddons(suggestAddons(data, list, 8)))
          .catch(() => setAddons([]));
      })
      .catch(() => {
        setError("პროდუქტი ვერ მოიძებნა.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="pd-status">{t("loading")}</div>;
  }

  if (error || !product) {
    return (
      <div className="pd-status">
        <SeoHead
          title="პროდუქტი ვერ მოიძებნა"
          description="ეს პროდუქტი აღარ არის RetroBit-ზე."
          path={`/product/${id || ""}`}
          noindex
        />
        <h1>{error || "პროდუქტი არ არსებობს"}</h1>
        <button type="button" className="pd-ghost" onClick={() => navigate("/")}>
          მთავარ გვერდზე დაბრუნება
        </button>
      </div>
    );
  }

  const sale = getSalePrice(product);
  const stock = product.stock ?? 0;
  const inCart = cart.find((item) => item._id === product._id)?.quantity ?? 0;
  const maxQty = Math.max(1, stock);

  const add = (goCheckout: boolean) => {
    addToCart(product, qty, { drawer: !goCheckout });
    if (goCheckout) {
      closeCartDrawer();
      navigate("/checkout");
    }
  };

  const path = `/product/${product._id}`;
  const description = String(product.description || product.title).slice(0, 300);
  const keywords = productKeywords(product);
  const jsonLd = jsonLdGraph([
    breadcrumbGraph([
      { name: "მთავარი", path: "/" },
      {
        name: product.category || "კატეგორია",
        path: `/category/${encodeURIComponent(product.category || "Nintendo")}`,
      },
      { name: product.title, path },
    ]),
    {
      "@type": "Product",
      name: product.title,
      description,
      image: [
        absUrl(product.imageUrl),
        ...(product.images || []).map((url) => absUrl(url)),
      ],
      brand: {
        "@type": "Brand",
        name: product.platform || product.category || "RetroBit",
      },
      category: product.category,
      keywords,
      offers: {
        "@type": "Offer",
        url: `${SITE_URL}${path}`,
        priceCurrency: "GEL",
        price: sale.final.toFixed(2),
        availability:
          stock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/UsedCondition",
        seller: { "@id": `${SITE_URL}/#organization` },
      },
    },
  ]);

  return (
    <div className="pd-page nbit-slot">
      <SeoHead
        title={product.title}
        description={description}
        path={path}
        image={product.imageUrl}
        type="product"
        jsonLd={jsonLd}
        keywords={keywords}
      />
      <button type="button" className="pd-ghost" onClick={() => navigate(-1)}>
        ← უკან
      </button>

      <div className="pd-layout">
        <ProductPhotos
          title={product.title}
          photos={productPhotos(product)}
          active={photo}
          onSelect={setPhoto}
        />

        <div className="pd-buy">
          <p className="pd-kicker">{product.platform || product.category}</p>
          <h1>{product.title}</h1>
          {stock > 0 && <p className="pd-ok">შემოწმებული და მუშა</p>}

          <div className="pd-price">
            <strong>{formatGel(sale.final)}</strong>
            {sale.discount > 0 && (
              <>
                <s>{formatGel(sale.original)}</s>
                <em>-{sale.discount}%</em>
              </>
            )}
          </div>

          <p className="pd-desc">{product.description}</p>
          {!!product.tags?.length && (
            <div className="pd-tags">
              {product.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/?search=${encodeURIComponent(tag)}`}
                  className="pd-tag"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {stock <= 0 ? (
            <button type="button" className="pd-sold" disabled>
              {t("sold")}
            </button>
          ) : (
            <>
              <div className="pd-stepper">
                <button
                  type="button"
                  onClick={() => setQty((n) => Math.max(1, n - 1))}
                >
                  −
                </button>
                <span>{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((n) => Math.min(maxQty, n + 1))}
                >
                  +
                </button>
              </div>

              <div className="pd-cta">
                <button
                  type="button"
                  className="pd-buy-now"
                  onClick={() => add(true)}
                >
                  ახლავე ყიდვა
                </button>
                <button
                  type="button"
                  className="pd-add-cart"
                  onClick={() => add(false)}
                >
                  {t("addToCart")} +
                </button>
              </div>
              {inCart > 0 && (
                <p className="pd-incart">
                  {t("inCart")}: {inCart} {t("pieces")}
                </p>
              )}
              {stock <= 3 && (
                <p className="pd-low">
                  {t("left")} {stock}
                </p>
              )}
            </>
          )}

          <PaymentMarks />
          <p className="cart-ship-note">
            მიწოდება: პირობები მალე დაემატება. გარანტია ამ ეტაპზე არ არის.
          </p>
        </div>
      </div>

      {addons.length > 0 && (
        <section className="pd-addons">
          <h2>დაამატე აქსესუარი ან თამაში</h2>
          <p>შეარჩიე კონტროლერი, კაბელი ან თამაში ამ კონსოლისთვის.</p>
          <div className="pd-addon-grid">
            {addons.map((item) => {
              const itemSale = getSalePrice(item);
              const added = cart.some((c) => c._id === item._id);
              return (
                <article key={item._id} className="pd-addon">
                  <Link to={`/product/${item._id}`}>
                    <img
                      src={item.imageUrl || ""}
                      alt={productImageAlt(item)}
                    />
                    <h3>{item.title}</h3>
                  </Link>
                  <div className="pd-addon-row">
                    <strong>{formatGel(itemSale.final)}</strong>
                    <button
                      type="button"
                      disabled={added || (item.stock ?? 0) <= 0}
                      onClick={() => addToCart(item)}
                    >
                      {added ? "კალათაშია" : "დამატება"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function productPhotos(product: IProduct): string[] {
  const urls = [product.imageUrl, ...(product.images || [])];
  const unique: string[] = [];
  for (const url of urls) {
    const clean = String(url || "").trim();
    if (clean && !unique.includes(clean)) unique.push(clean);
  }
  return unique;
}

function ProductPhotos({
  title,
  photos,
  active,
  onSelect,
}: {
  title: string;
  photos: string[];
  active: number;
  onSelect: (index: number) => void;
}) {
  const index = photos.length === 0 ? 0 : Math.min(active, photos.length - 1);
  const current = photos[index];

  return (
    <div className="pd-gallery">
      <div className="pd-photo">
        {current ? (
          <img src={current} alt={productImageAlt({ title })} />
        ) : (
          <span style={{ fontSize: "3rem" }}>🕹️</span>
        )}
      </div>
      {photos.length > 1 && (
        <div className="pd-thumbs">
          {photos.map((url, item) => (
            <button
              key={url}
              type="button"
              className={item === index ? "is-on" : ""}
              onClick={() => onSelect(item)}
              aria-label={`${title} — ფოტო ${item + 1}`}
            >
              <img src={url} alt={`${title} — ფოტო ${item + 1} | RetroBit`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
