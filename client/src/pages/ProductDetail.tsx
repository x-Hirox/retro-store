import { useEffect, useRef, useState } from "react";
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
import {
  cartLineKey,
  pickColor,
  productColors,
  productPhotos,
  withSelectedColor,
} from "../utils/productColors";

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
  const [colorName, setColorName] = useState("");
  const [sticky, setSticky] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    setPhoto(0);
    setQty(1);
    setColorName("");
    setSticky(false);
    getProductById(id)
      .then((data) => {
        setProduct(data);
        setColorName(productColors(data)[0]?.name || "");
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

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setSticky(!entry.isIntersecting),
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [product?._id, product?.stock]);

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
  const colors = productColors(product);
  const selected = pickColor(product, colorName);
  const line = withSelectedColor(product, colorName);
  const inCart =
    cart.find((item) => cartLineKey(item) === cartLineKey(line))?.quantity ?? 0;
  const maxQty = Math.max(1, stock);
  const photos = productPhotos(product, colorName);

  const add = (goCheckout: boolean) => {
    addToCart(line, qty, { drawer: !goCheckout });
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
      image: photos.map((url) => absUrl(url)),
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
    <div className={`pd-page nbit-slot${sticky && stock > 0 ? " has-sticky" : ""}`}>
      <SeoHead
        title={product.title}
        description={description}
        path={path}
        image={photos[0] || product.imageUrl}
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
          photos={photos}
          active={photo}
          onSelect={(index) => {
            setPhoto(index);
            const url = photos[index];
            const match = colors.find((item) => item.imageUrl === url);
            if (match) setColorName(match.name);
          }}
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

          {colors.length > 0 && (
            <div className="pd-colors">
              <p>
                ფერი: <strong>{selected?.name}</strong>
              </p>
              <div className="pd-swatches">
                {colors.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    className={item.name === selected?.name ? "is-on" : ""}
                    style={{ background: item.hex }}
                    aria-label={item.name}
                    title={item.name}
                    onClick={() => {
                      setColorName(item.name);
                      setPhoto(0);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

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

              <div className="pd-cta" ref={ctaRef}>
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
                  {selected ? ` · ${selected.name}` : ""}
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

      {stock > 0 && (
        <div className={`pd-sticky${sticky ? " is-on" : ""}`} aria-hidden={!sticky}>
          <div className="pd-sticky-info">
            <strong>{product.title}</strong>
            <span>
              {formatGel(sale.final)}
              {selected ? ` · ${selected.name}` : ""}
            </span>
          </div>
          <div className="pd-sticky-cta">
            <button type="button" className="pd-buy-now" onClick={() => add(true)}>
              ახლავე ყიდვა
            </button>
            <button type="button" className="pd-add-cart" onClick={() => add(false)}>
              {t("addToCart")} +
            </button>
          </div>
        </div>
      )}
    </div>
  );
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
  const scroller = useRef<HTMLDivElement>(null);
  const index = photos.length === 0 ? 0 : Math.min(active, photos.length - 1);
  const current = photos[index];

  const go = (dir: number) => {
    if (photos.length < 2) return;
    onSelect((index + dir + photos.length) % photos.length);
  };

  const slideThumbs = (dir: number) => {
    scroller.current?.scrollBy({ left: dir * 168, behavior: "smooth" });
  };

  return (
    <div className="pd-gallery">
      <div className="pd-photo">
        {photos.length > 1 && (
          <button
            type="button"
            className="pd-photo-nav prev"
            onClick={() => go(-1)}
            aria-label="წინა სურათი"
          >
            ‹
          </button>
        )}
        {current ? (
          <img src={current} alt={productImageAlt({ title })} />
        ) : (
          <span style={{ fontSize: "3rem" }}>🕹️</span>
        )}
        {photos.length > 1 && (
          <button
            type="button"
            className="pd-photo-nav next"
            onClick={() => go(1)}
            aria-label="შემდეგი სურათი"
          >
            ›
          </button>
        )}
      </div>
      {photos.length > 1 && (
        <div className="pd-thumbs-row">
          <button
            type="button"
            className="pd-thumbs-nav"
            onClick={() => slideThumbs(-1)}
            aria-label="სურათები მარცხნივ"
          >
            ‹
          </button>
          <div className="pd-thumbs" ref={scroller}>
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
          <button
            type="button"
            className="pd-thumbs-nav"
            onClick={() => slideThumbs(1)}
            aria-label="სურათები მარჯვნივ"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
