import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { getProductById, getProducts } from "../services/productService";
import { useCart } from "../context/CartContext";
import type { IProduct } from "../types";
import { trackRecentlyViewed } from "../utils/recentlyViewed";
import { bundleTogether, formatGel, getSalePrice } from "../utils/pricing";
import { useLang } from "../i18n/LanguageContext";
import { suggestAddons, suggestSimilar } from "../utils/shopAddons";
import PaymentMarks from "../components/PaymentMarks";
import ProductCard from "../components/ProductCard";
import SeoHead from "../components/SeoHead";
import { productImageAlt } from "../utils/imageAlt";
import {
  productJsonLd,
  productPath,
  productSeoDescription,
  productSeoTitle,
} from "../seo/product";
import { shortProductId } from "../seo/productUrl";
import { productKeywords } from "../utils/tags";
import {
  availableStock,
  cartLineKey,
  colorStock,
  pickColor,
  productColors,
  productPhotos,
  totalStock,
  withSelectedColor,
} from "../utils/productColors";
import { specGroups, splitProductCopy } from "../utils/productSpecs";
import {
  conditionLabel,
  productCondition,
} from "../utils/productCondition";

type ShopTab = "accessories" | "similar" | "specs";

export default function ProductDetail() {
  const { slugId = "" } = useParams<{ slugId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, addToCart, closeCartDrawer } = useCart();
  const { t } = useLang();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [addons, setAddons] = useState<IProduct[]>([]);
  const [similar, setSimilar] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState(0);
  const [qty, setQty] = useState(1);
  const [colorName, setColorName] = useState("");
  const [sticky, setSticky] = useState(false);
  const [bundleOn, setBundleOn] = useState(true);
  const [tab, setTab] = useState<ShopTab>("accessories");
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slugId) {
      setProduct(null);
      setError("პროდუქტი ვერ მოიძებნა.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    setPhoto(0);
    setQty(1);
    setColorName("");
    setSticky(false);
    setBundleOn(true);
    setTab("accessories");
    getProductById(slugId)
      .then((data) => {
        setProduct(data);
        setColorName(productColors(data)[0]?.name || "");
        trackRecentlyViewed(data);
        setLoading(false);
        getProducts()
          .then((list) => {
            setAddons(suggestAddons(data, list, 8));
            setSimilar(suggestSimilar(data, list, 8));
          })
          .catch(() => {
            setAddons([]);
            setSimilar([]);
          });
      })
      .catch(() => {
        setProduct(null);
        setError("პროდუქტი ვერ მოიძებნა.");
        setLoading(false);
      });
  }, [slugId]);

  useEffect(() => {
    if (!product) return;
    const canonical = productPath(product);
    if (location.pathname !== canonical) {
      navigate(canonical, { replace: true });
    }
  }, [product, location.pathname, navigate]);

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

  const copy = useMemo(
    () => splitProductCopy(product?.description || ""),
    [product?.description],
  );
  const facts = useMemo(() => {
    if (!product) return [];
    const extra = [
      product.platform ? { label: "პლატფორმა", value: product.platform } : null,
      product.category ? { label: "კატეგორია", value: product.category } : null,
      product.genre ? { label: "ჟანრი", value: product.genre } : null,
      { label: "მდგომარეობა", value: conditionLabel(productCondition(product)) },
    ].filter(Boolean) as { label: string; value: string }[];
    const merged = [...copy.specs];
    for (const row of extra) {
      const idx = merged.findIndex((item) => item.label === row.label);
      if (row.label === "მდგომარეობა" && idx >= 0) {
        merged[idx] = row;
      } else if (idx < 0) {
        merged.push(row);
      }
    }
    return merged;
  }, [copy.specs, product]);
  const groups = useMemo(() => specGroups(facts), [facts]);

  if (loading) {
    return <div className="pd-status">{t("loading")}</div>;
  }

  if (error || !product) {
    return (
      <div className="pd-status">
        <SeoHead
          title="პროდუქტი ვერ მოიძებნა"
          description="ეს პროდუქტი აღარ არის RetroBit-ზე."
          path={slugId ? `/product/${slugId}` : "/"}
          noindex
        />
        <h1>{error || "პროდუქტი არ არსებობს"}</h1>
        <button type="button" className="pd-ghost" onClick={() => navigate("/")}>
          მთავარ გვერდზე დაბრუნება
        </button>
      </div>
    );
  }

  const colors = productColors(product);
  const selected = pickColor(product, colorName);
  const stock = availableStock(product, colorName);
  const anyLeft = totalStock(product) > 0;
  const line = withSelectedColor(product, colorName);
  const sale = getSalePrice(line);
  const inCart =
    cart.find((item) => cartLineKey(item) === cartLineKey(line))?.quantity ?? 0;
  const maxQty = Math.max(1, stock);
  const photos = productPhotos(product, colorName);
  const categoryPath = `/category/${encodeURIComponent(product.category || "Nintendo")}`;
  const bundleMate = addons[0] || null;
  const bundleSale = bundleMate ? getSalePrice(bundleMate) : null;
  const bundleDeal =
    bundleSale && bundleOn
      ? bundleTogether(sale.final, bundleSale.final)
      : { separate: sale.final, together: sale.final, extraPct: 0 };
  const bundleTotal = bundleDeal.together;
  const bundleWas = bundleOn && bundleSale ? bundleDeal.separate : 0;
  const path = productPath(product);
  const description = productSeoDescription(product, sale.final);
  const keywords = productKeywords(product);
  const jsonLd = productJsonLd(product);
  const notifyHref = `mailto:retrobit.support@gmail.com?subject=${encodeURIComponent(
    `შემატყობინე: ${product.title}`,
  )}`;

  const add = (goCheckout: boolean, withBundle = false) => {
    addToCart(line, qty, { drawer: !goCheckout });
    if (withBundle && bundleMate && totalStock(bundleMate) > 0) {
      addToCart(bundleMate, 1, { drawer: !goCheckout });
    }
    if (goCheckout) {
      closeCartDrawer();
      navigate("/checkout");
    }
  };

  return (
    <div className={`pd-page nbit-slot${sticky && stock > 0 ? " has-sticky" : ""}`}>
      <SeoHead
        title={productSeoTitle(product, sale.final)}
        description={description}
        path={path}
        image={photos[0] || product.imageUrl}
        type="product"
        jsonLd={jsonLd}
        keywords={keywords}
      />

      <nav className="pd-crumbs" aria-label="გზა">
        <Link to="/">მთავარი</Link>
        <span>/</span>
        <Link to={categoryPath}>{product.category || "კატეგორია"}</Link>
      </nav>

      <div className="pd-heading">
        <div>
          <p className="pd-kicker">{product.platform || product.category}</p>
          <h1>{product.title}</h1>
        </div>
        <p className="pd-sku">#{shortProductId(product._id)}</p>
      </div>

      <div className="pd-layout">
        <ProductPhotos
          title={product.title}
          photos={photos}
          active={photo}
          onSelect={setPhoto}
        />

        <div className="pd-facts">
          {facts.length > 0 ? (
            <dl className="pd-spec-table">
              {facts.slice(0, 7).map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {copy.intro ? <p className="pd-desc">{copy.intro}</p> : null}
          {!facts.length && !copy.intro ? (
            <p className="pd-desc">{product.description}</p>
          ) : null}
        </div>

        <aside className="pd-buy">
          <div className="pd-price">
            <strong>{formatGel(sale.final)}</strong>
            {sale.discount > 0 && (
              <>
                <s>{formatGel(sale.original)}</s>
                <em>-{sale.discount}%</em>
              </>
            )}
          </div>
          {anyLeft && stock > 0 ? (
            <p className="pd-ok">შემოწმებული და მუშა</p>
          ) : (
            <p className="pd-out">ამოიწურა</p>
          )}

          <div className="pd-trust">
            <span>{stock > 0 ? "მარაგშია" : "ამოიწურა"}</span>
            <span>თბილისი</span>
          </div>

          {colors.length > 0 && (
            <div className="pd-colors">
              <p>
                ფერი: <strong>{selected?.name}</strong>
                {selected ? ` · ${colorStock(selected)} ცალი` : ""}
              </p>
              <div className="pd-dots" role="listbox" aria-label="ფერი">
                {colors.map((item) => {
                  const left = colorStock(item);
                  return (
                    <button
                      key={item.name}
                      type="button"
                      role="option"
                      aria-selected={item.name === selected?.name}
                      className={`pd-dot${item.name === selected?.name ? " is-on" : ""}${left <= 0 ? " is-sold" : ""}`}
                      style={{ background: item.hex }}
                      title={`${item.name} · ${left <= 0 ? "ამოიწურა" : `${left} ცალი`}`}
                      onClick={() => {
                        setColorName(item.name);
                        setPhoto(0);
                        setQty(1);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {stock <= 0 ? (
            <>
              <button type="button" className="pd-sold" disabled>
                {anyLeft && selected
                  ? `${selected.name} ამოიწურა — აირჩიე სხვა ფერი`
                  : t("sold")}
              </button>
              <a className="pd-notify" href={notifyHref}>
                შემატყობინე
              </a>
            </>
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
                  ყიდვა
                </button>
                <button
                  type="button"
                  className="pd-add-cart"
                  onClick={() => add(false)}
                >
                  დამატება
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
                  {selected ? ` · ${selected.name}` : ""}
                </p>
              )}
            </>
          )}

          <PaymentMarks />
          <p className="cart-ship-note">
            მიწოდება: პირობები მალე დაემატება. გარანტია ამ ეტაპზე არ არის.
          </p>
        </aside>
      </div>

      {bundleMate && bundleSale && (
        <section className="pd-together" aria-label="ერთად იაფია">
          <div className="pd-together-head">
            <h2>ერთად იაფია</h2>
            <label>
              <input
                type="checkbox"
                checked={bundleOn}
                onChange={(e) => setBundleOn(e.target.checked)}
              />
              დაამატე ნაკრები
            </label>
          </div>
          <div className="pd-together-row">
            <article>
              <img src={photos[0] || product.imageUrl} alt={productImageAlt(product)} />
              <div>
                <h3>{product.title}</h3>
                <strong>{formatGel(sale.final)}</strong>
              </div>
            </article>
            <span className="pd-plus">+</span>
            <article className={!bundleOn ? "is-off" : ""}>
              <img
                src={bundleMate.imageUrl || ""}
                alt={productImageAlt(bundleMate)}
              />
              <div>
                <h3>{bundleMate.title}</h3>
                <strong>{formatGel(bundleSale.final)}</strong>
                {bundleSale.discount > 0 && <s>{formatGel(bundleSale.original)}</s>}
              </div>
            </article>
            <div className="pd-together-sum">
              <span>ჯამი ({bundleOn ? 2 : 1})</span>
              <strong>{formatGel(bundleTotal)}</strong>
              {bundleOn && bundleWas > bundleTotal && <s>{formatGel(bundleWas)}</s>}
              {bundleOn && bundleDeal.extraPct > 0 && bundleWas > bundleTotal ? (
                <em className="pd-together-off">ნაკრები −{bundleDeal.extraPct}%</em>
              ) : null}
              {stock > 0 && (
                <button
                  type="button"
                  className="pd-buy-now"
                  onClick={() => add(true, bundleOn)}
                >
                  ყიდვა
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="pd-tabs">
        <div className="pd-tab-bar" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "accessories"}
            className={tab === "accessories" ? "is-on" : ""}
            onClick={() => setTab("accessories")}
          >
            აქსესუარები
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "similar"}
            className={tab === "similar" ? "is-on" : ""}
            onClick={() => setTab("similar")}
          >
            მსგავსი
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "specs"}
            className={tab === "specs" ? "is-on" : ""}
            onClick={() => setTab("specs")}
          >
            მახასიათებლები
          </button>
        </div>

        {tab === "accessories" && (
          <div className="pd-addons">
            <div className="pd-section-head">
              <h2>აქსესუარები</h2>
              <Link to="/category/accessories">მეტის ნახვა</Link>
            </div>
            {addons.length === 0 ? (
              <p className="pd-empty">აქსესუარი ჯერ არ არის.</p>
            ) : (
              <div className="pd-addon-grid">
                {addons.map((item) => {
                  const itemSale = getSalePrice(item);
                  const added = cart.some((row) => row._id === item._id);
                  return (
                    <article key={item._id} className="pd-addon">
                      <Link to={productPath(item)}>
                        <img src={item.imageUrl || ""} alt={productImageAlt(item)} />
                        <h3>{item.title}</h3>
                      </Link>
                      <div className="pd-addon-row">
                        <strong>{formatGel(itemSale.final)}</strong>
                        <button
                          type="button"
                          disabled={added || totalStock(item) <= 0}
                          onClick={() => addToCart(item)}
                        >
                          {added ? "კალათაშია" : "დამატება"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab === "similar" && (
          <div className="pd-similar">
            <div className="pd-section-head">
              <h2>მსგავსი პროდუქტები</h2>
              <Link to={categoryPath}>მეტის ნახვა</Link>
            </div>
            {similar.length === 0 ? (
              <p className="pd-empty">მსგავსი პროდუქტი ჯერ არ არის.</p>
            ) : (
              <div className="pd-similar-grid">
                {similar.map((item) => (
                  <ProductCard key={item._id} product={item} />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "specs" && (
          <div className="pd-accordion">
            {groups.length === 0 && copy.intro ? (
              <p className="pd-desc">{copy.intro}</p>
            ) : null}
            {groups.map((group, index) => (
              <AccordionItem key={group.title} title={group.title} startOpen={index === 0}>
                <dl className="pd-spec-table">
                  {group.items.map((row) => (
                    <div key={row.label}>
                      <dt>{row.label}</dt>
                      <dd>{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </AccordionItem>
            ))}
            <AccordionItem title="მიწოდება">
              <p className="pd-desc">
                მიწოდების პირობები მალე დაემატება. ამ ეტაპზე გარანტია არ არის.
              </p>
            </AccordionItem>
          </div>
        )}
      </section>

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
              ყიდვა
            </button>
            <button type="button" className="pd-add-cart" onClick={() => add(false)}>
              დამატება
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AccordionItem({
  title,
  startOpen = false,
  children,
}: {
  title: string;
  startOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(startOpen);
  return (
    <details
      open={open}
      onToggle={(event) => {
        const next = (event.currentTarget as HTMLDetailsElement).open;
        if (next !== open) setOpen(next);
      }}
    >
      <summary>{title}</summary>
      {children}
    </details>
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
  const drag = useRef({ x: 0, moved: false, down: false });
  const [open, setOpen] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [grabbing, setGrabbing] = useState(false);
  const index = photos.length === 0 ? 0 : Math.min(active, photos.length - 1);
  const current = photos[index];

  const go = (dir: number) => {
    if (photos.length < 2) return;
    onSelect((index + dir + photos.length) % photos.length);
  };

  const slideThumbs = (dir: number) => {
    scroller.current?.scrollBy({ left: dir * 140, behavior: "smooth" });
  };

  const endDrag = (clientX: number) => {
    if (!drag.current.down) return;
    const dx = clientX - drag.current.x;
    const moved = drag.current.moved;
    drag.current.down = false;
    drag.current.moved = false;
    setGrabbing(false);
    setDragX(0);
    if (moved && Math.abs(dx) > 42 && photos.length > 1) {
      go(dx < 0 ? 1 : -1);
      return;
    }
    if (!moved && current) setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, index, photos.length]);

  return (
    <div className="pd-gallery">
      <div
        className={`pd-photo${grabbing ? " is-grabbing" : ""}`}
        role="button"
        tabIndex={0}
        aria-label="სურათის გადიდება. გადაადგილე ან გაიყვანე სხვა ფოტოზე."
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (current) setOpen(true);
          }
        }}
        onPointerDown={(event) => {
          if (event.button !== 0 || (event.target as HTMLElement).closest(".pd-photo-nav")) {
            return;
          }
          drag.current = { x: event.clientX, moved: false, down: true };
          setGrabbing(true);
        }}
        onPointerMove={(event) => {
          if (!drag.current.down) return;
          const dx = event.clientX - drag.current.x;
          if (!drag.current.moved && Math.abs(dx) > 8) {
            drag.current.moved = true;
            event.currentTarget.setPointerCapture(event.pointerId);
          }
          if (drag.current.moved) setDragX(dx);
        }}
        onPointerUp={(event) => endDrag(event.clientX)}
        onPointerCancel={(event) => endDrag(event.clientX)}
      >
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
          <img
            src={current}
            alt={productImageAlt({ title })}
            draggable={false}
            style={{
              transform: dragX ? `translateX(${Math.round(dragX * 0.35)}px)` : undefined,
            }}
          />
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
                onMouseEnter={() => onSelect(item)}
                onFocus={() => onSelect(item)}
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

      {open &&
        current &&
        createPortal(
          <div className="pd-lightbox" role="dialog" aria-modal="true" aria-label="გადიდებული სურათი">
            <button
              type="button"
              className="pd-lightbox-dim"
              aria-label="დახურვა"
              onClick={() => setOpen(false)}
            />
            <button
              type="button"
              className="pd-lightbox-close"
              onClick={() => setOpen(false)}
              aria-label="დახურვა"
            >
              ×
            </button>
            {photos.length > 1 && (
              <button
                type="button"
                className="pd-lightbox-nav prev"
                onClick={() => go(-1)}
                aria-label="წინა სურათი"
              >
                ‹
              </button>
            )}
            <img src={current} alt={productImageAlt({ title })} />
            {photos.length > 1 && (
              <button
                type="button"
                className="pd-lightbox-nav next"
                onClick={() => go(1)}
                aria-label="შემდეგი სურათი"
              >
                ›
              </button>
            )}
            {photos.length > 1 && (
              <div className="pd-lightbox-thumbs">
                {photos.map((url, item) => (
                  <button
                    key={url}
                    type="button"
                    className={item === index ? "is-on" : ""}
                    onMouseEnter={() => onSelect(item)}
                    onClick={() => onSelect(item)}
                  >
                    <img src={url} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
