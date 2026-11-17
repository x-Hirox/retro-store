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
}: {
  src: string;
  title: string;
  pos: "left" | "right";
}) {
  return (
    <span className={`nbit nbit-pos-${pos}`} title={title} aria-hidden>
      <img src={src} alt="" />
    </span>
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
  <Bit src="/decor/tamagotchi.svg" title="Tamagotchi" pos="left" />
);
export const FloppyDisk = () => (
  <Bit src="/decor/floppy.svg" title="3.5″ Floppy" pos="right" />
);
export const Polaroid = () => (
  <Bit src="/decor/polaroid.svg" title="Polaroid" pos="right" />
);
export const Boombox = () => (
  <Bit src="/decor/boombox.svg" title="Boombox" pos="left" />
);
export const Discman = () => (
  <Bit src="/decor/discman.svg" title="Discman" pos="right" />
);
export const Rubik = () => (
  <Bit src="/decor/rubik.svg" title="Rubik" pos="left" />
);
export const VhsTape = () => (
  <Bit src="/decor/vhs.svg" title="VHS" pos="right" />
);

export function InsertCoin() {
  return (
    <span className="nbit nbit-coin nbit-pos-right" aria-hidden>
      INSERT COIN
    </span>
  );
}

export function GiftStack() {
  return (
    <div className="ny-gift-stack" aria-hidden>
      <img src="/decor/gifts.svg" alt="" />
    </div>
  );
}
