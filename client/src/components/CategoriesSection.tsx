import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";
import { getSiteSettings } from "../services/contentService";
import type { MessageKey } from "../i18n/messages";
import type { ISiteSettings } from "../types";
import HoloCard from "./HoloCard";

const DEFAULTS = {
  catImageHome: "/images/console-home.png",
  catImageHand: "/images/handhelds.png",
  catImageGames: "/images/games.png",
  catImageAcc: "/images/accessories.png",
  catImageBundles: "/images/bundles.jpg",
};

export default function CategoriesSection() {
  const navigate = useNavigate();
  const { t } = useLang();
  const [settings, setSettings] = useState<Partial<ISiteSettings>>({});

  useEffect(() => {
    getSiteSettings()
      .then(setSettings)
      .catch(() => setSettings({}));
  }, []);

  const img = (key: keyof typeof DEFAULTS) =>
    settings[key] || DEFAULTS[key];

  const categories: {
    title: MessageKey;
    desc: MessageKey;
    path: string;
    background: string;
    imageKey: keyof typeof DEFAULTS;
    gridSpan: string;
    wide: boolean;
  }[] = [
    {
      title: "catHome",
      desc: "catHomeDesc",
      path: "/category/playstation",
      background: "#2563eb",
      imageKey: "catImageHome",
      gridSpan: "span 6",
      wide: true,
    },
    {
      title: "catHand",
      desc: "catHandDesc",
      path: "/category/nintendo",
      background: "#7c3aed",
      imageKey: "catImageHand",
      gridSpan: "span 3",
      wide: false,
    },
    {
      title: "catGames",
      desc: "catGamesDesc",
      path: "/category/sega",
      background: "#059669",
      imageKey: "catImageGames",
      gridSpan: "span 3",
      wide: false,
    },
    {
      title: "catAcc",
      desc: "catAccDesc",
      path: "/category/accessories",
      background: "#dc2626",
      imageKey: "catImageAcc",
      gridSpan: "span 4",
      wide: false,
    },
    {
      title: "catBundles",
      desc: "catBundlesDesc",
      path: "/category/bundles",
      background: "#b45309",
      imageKey: "catImageBundles",
      gridSpan: "span 8",
      wide: true,
    },
  ];

  return (
    <div className="cats-wrap">
      <h2 className="section-title cats-title ny-title">{t("shopByCategory")}</h2>
      <div className="category-mosaic">
        {categories.map((cat) => (
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
            <img className="cat-art" src={img(cat.imageKey)} alt="" />
          </HoloCard>
        ))}
      </div>
    </div>
  );
}
