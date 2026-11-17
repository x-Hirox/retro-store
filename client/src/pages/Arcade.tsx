import GameCovers from "../components/GameCovers";
import { InsertCoin } from "../components/NostalgiaBits";

export default function Arcade() {
  return (
    <div className="arcade-page">
      <div className="arcade-wrap nbit-slot">
        <InsertCoin />
        <GameCovers mode="play" />
      </div>
    </div>
  );
}
