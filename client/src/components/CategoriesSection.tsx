import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";
import { getPageMedia } from "../services/contentService";
import type { MessageKey } from "../i18n/messages";
import type { IPageMedia } from "../types";
import HoloCard from "./HoloCard";
import { onPageMediaError, pageMediaUrl } from "../utils/pageMedia";

const CATEGORIES: {
  title: MessageKey;
  desc: MessageKey;
  path: string;
  background: string;
  mediaKey: string;
  gridSpan: string;
  wide: boolean;
}[] = [
  {
    title: "catHome",
    desc: "catHomeDesc",
    path: "/category/playstation",
    background: "#2563eb",
    mediaKey: "home_consoles",
    gridSpan: "span 6",
    wide: true,
  },
  {
    title: "catHand",
    desc: "catHandDesc",
    path: "/category/nintendo",
    background: "#7c3aed",
    mediaKey: "home_handhelds",
    gridSpan: "span 3",
    wide: false,
  },
  {
    title: "catGames",
    desc: "catGamesDesc",
    path: "/category/games",
    background: "#059669",
    mediaKey: "home_games",
    gridSpan: "span 3",
    wide: false,
  },
  {
    title: "catAcc",
    desc: "catAccDesc",
    path: "/category/accessories",
    background: "#dc2626",
    mediaKey: "home_accessories",
    gridSpan: "span 12",
    wide: true,
  },
];

export default function CategoriesSection() {
  const navigate = useNavigate();
  const { t } = useLang();
  const [media, setMedia] = useState<IPageMedia[]>([]);

  useEffect(() => {
    getPageMedia()
      .then(setMedia)
      .catch(() => setMedia([]));
  }, []);

  return (
    <div className="cats-wrap">
      <h2 className="section-title cats-title">{t("shopByCategory")}</h2>
      <div className="category-mosaic">
        {CATEGORIES.map((cat) => (
          <HoloCard
            key={cat.title}
            className={`category-card crt-frame ${cat.wide ? "is-wide" : ""}`}
            onClick={() => navigate(cat.path)}
            style={{ background: cat.background, gridColumn: cat.gridSpan }}
          >
            <div className="cat-copy">
              <h3>{t(cat.title)}</h3>
              <p>{t(cat.desc)}</p>
            </div>
            <img
              className="cat-art"
              src={pageMediaUrl(media, cat.mediaKey)}
              alt={t(cat.title)}
              onError={(event) => onPageMediaError(event.currentTarget, cat.mediaKey)}
            />
          </HoloCard>
        ))}
      </div>
    </div>
  );
}
