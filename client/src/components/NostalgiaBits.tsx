import {
  playCassetteClick,
  playCoin,
  playGameBoyBlip,
  playVhsWhir,
} from "../utils/arcadeBeep";

export function HolidayLights() {
  return (
    <div className="ny-header-lights" aria-hidden>
      {Array.from({ length: 22 }, (_, i) => (
        <i key={i} className={`ny-bulb c${i % 4}`} />
      ))}
    </div>
  );
}

function Bit({
  src,
  title,
  pos,
  sound,
}: {
  src: string;
  title: string;
  pos: "left" | "right";
  sound: () => void;
}) {
  return (
    <button
      type="button"
      className={`nbit nbit-pos-${pos}`}
      title={title}
      onMouseEnter={sound}
      onClick={sound}
    >
      <img src={src} alt="" />
    </button>
  );
}

export function SantaHat() {
  return (
    <span className="ny-hat" aria-hidden>
      <img src="/decor/santa-hat.svg" alt="" />
    </span>
  );
}

export const Tamagotchi = () => (
  <Bit src="/decor/tamagotchi.svg" title="Tamagotchi" pos="left" sound={playGameBoyBlip} />
);
export const FloppyDisk = () => (
  <Bit src="/decor/floppy.svg" title="3.5″ Floppy" pos="right" sound={playCassetteClick} />
);
export const Polaroid = () => (
  <Bit src="/decor/polaroid.svg" title="Polaroid" pos="right" sound={playVhsWhir} />
);
export const Boombox = () => (
  <Bit src="/decor/boombox.svg" title="Boombox" pos="left" sound={playCassetteClick} />
);
export const Discman = () => (
  <Bit src="/decor/discman.svg" title="Discman" pos="right" sound={playCassetteClick} />
);
export const Rubik = () => (
  <Bit src="/decor/rubik.svg" title="Rubik" pos="left" sound={playCoin} />
);
export const VhsTape = () => (
  <Bit src="/decor/vhs.svg" title="VHS" pos="right" sound={playVhsWhir} />
);

export function InsertCoin() {
  return (
    <button
      type="button"
      className="nbit nbit-coin nbit-pos-right"
      title="INSERT COIN"
      onMouseEnter={playCoin}
      onClick={playCoin}
    >
      INSERT COIN
    </button>
  );
}

export function GiftStack() {
  return (
    <div className="ny-gift-stack" aria-hidden>
      <img src="/decor/gifts.svg" alt="" />
    </div>
  );
}
