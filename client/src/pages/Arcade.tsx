import GameCovers from "../components/GameCovers";
import { InsertCoin } from "../components/NostalgiaBits";
import SoundToggle from "../components/SoundToggle";
import SeoHead from "../components/SeoHead";
import { breadcrumbGraph, jsonLdGraph } from "../seo/site";

export default function Arcade() {
  return (
    <div className="arcade-page">
      <SeoHead
        title="რეტრო არკადა"
        description="ითამაშე ლეგალური homebrew და HTML5 რეტრო თამაშები ბრაუზერში — RetroBit Arcade."
        path="/play"
        jsonLd={jsonLdGraph([
          breadcrumbGraph([
            { name: "მთავარი", path: "/" },
            { name: "არკადა", path: "/play" },
          ]),
        ])}
      />
      <div className="arcade-cabinet">
        <div className="arcade-marquee" aria-hidden>
          <span>RETROBIT ARCADE</span>
          <span>FREE PLAY</span>
          <span>INSERT COIN</span>
          <span>1P START</span>
        </div>
        <div className="arcade-bezel">
          <div className="arcade-wrap nbit-slot">
            <InsertCoin />
            <GameCovers mode="play" />
          </div>
        </div>
        <div className="arcade-controls-hint">
          <span className="arcade-badge">LEGAL HOMEBREW</span>
          <span className="arcade-badge">CRT FOCUS</span>
          <SoundToggle />
          <p>
            <b>←↑↓→ / WASD</b> მოძრაობა · <b>Z / X / Space</b> მოქმედება ·{" "}
            <b>Enter</b> start · მობილურზე — თაჩი
          </p>
        </div>
      </div>
    </div>
  );
}
