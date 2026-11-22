import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { IPlatformCard } from "../types";
import { nextPlatformArtUrl, platformArtUrl } from "../utils/platformArt";

const VISIBLE = 3;
const AUTO_MS = 4500;

function normalize(value?: string) {
  return decodeURIComponent(value || "")
    .toLowerCase()
    .trim();
}

function pagesOf(cards: IPlatformCard[]) {
  const pages: IPlatformCard[][] = [];
  for (let i = 0; i < cards.length; i += VISIBLE) {
    pages.push(cards.slice(i, i + VISIBLE));
  }
  return pages.length ? pages : [[]];
}

export default function PlatformCarousel({
  cards,
  brandPath,
  activeSub,
}: {
  cards: IPlatformCard[];
  brandPath: string;
  activeSub?: string;
}) {
  const pages = pagesOf(cards);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const drag = useRef({ x: 0, moved: false, down: false });

  useEffect(() => {
    setPage(0);
  }, [brandPath, cards.length]);

  useEffect(() => {
    if (paused || pages.length <= 1) return;
    const id = window.setInterval(() => {
      setPage((current) => (current + 1) % pages.length);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, pages.length]);

  const go = (next: number) => {
    const count = pages.length;
    setPage(((next % count) + count) % count);
  };

  return (
    <div
      className="collection-strip"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="collection-strip-viewport"
        onPointerDown={(event) => {
          drag.current = { x: event.clientX, moved: false, down: true };
        }}
        onPointerMove={(event) => {
          if (!drag.current.down) return;
          if (Math.abs(event.clientX - drag.current.x) > 12) {
            drag.current.moved = true;
          }
        }}
        onPointerUp={(event) => {
          if (!drag.current.down) return;
          const dx = event.clientX - drag.current.x;
          drag.current.down = false;
          if (Math.abs(dx) > 50) go(page + (dx < 0 ? 1 : -1));
        }}
        onPointerCancel={() => {
          drag.current.down = false;
        }}
      >
        <div
          className="collection-strip-track"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {pages.map((group, pageIndex) => (
            <div className="collection-strip-page" key={pageIndex}>
              {group.map((item) => {
                const active =
                  normalize(activeSub) === normalize(item.slug) ||
                  normalize(activeSub) === normalize(item.name);
                return (
                  <Link
                    key={item._id || item.slug}
                    to={`/category/${encodeURIComponent(brandPath)}/${encodeURIComponent(item.slug)}`}
                    className={`collection-console arcade-tab ${active ? "is-active" : ""}`}
                    draggable={false}
                    onClick={(event) => {
                      if (drag.current.moved) {
                        event.preventDefault();
                      }
                    }}
                  >
                    <img
                      src={item.imageUrl || platformArtUrl(item.slug)}
                      alt={item.name}
                      draggable={false}
                      onError={(event) => {
                        const img = event.currentTarget;
                        if (/^https?:/i.test(img.src) && !img.dataset.local) {
                          img.dataset.local = "1";
                          img.src = platformArtUrl(item.slug);
                          return;
                        }
                        const next = nextPlatformArtUrl(item.slug, img.src);
                        if (next) img.src = next;
                      }}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {pages.length > 1 && (
        <div className="collection-strip-nav">
          <button
            type="button"
            className="collection-strip-arrow"
            aria-label="წინა"
            onClick={() => go(page - 1)}
          >
            &lt;
          </button>
          {pages.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`collection-strip-dot ${index === page ? "is-on" : ""}`}
              aria-label={`გვერდი ${index + 1}`}
              onClick={() => setPage(index)}
            />
          ))}
          <button
            type="button"
            className="collection-strip-arrow"
            aria-label="შემდეგი"
            onClick={() => go(page + 1)}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}
