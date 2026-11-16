import { useState } from "react";
import { motion } from "framer-motion";

export default function SkateRider() {
  const [ride, setRide] = useState(false);

  return (
    <div className="skate-track" aria-hidden>
      <motion.button
        type="button"
        className="skate-rider"
        onHoverStart={() => setRide(true)}
        onHoverEnd={() => setRide(false)}
        onClick={() => setRide((v) => !v)}
        animate={
          ride
            ? { x: "72vw", y: [0, -22, 0, -10, 0] }
            : { x: 0, y: 0 }
        }
        transition={{ type: "spring", stiffness: 64, damping: 14, mass: 0.9 }}
      >
        <svg viewBox="0 0 64 72" className="skate-svg">
          <ellipse cx="32" cy="68" rx="18" ry="3" fill="#00000044" />
          <rect x="10" y="58" width="44" height="5" rx="2" fill="#7c3aed" />
          <circle cx="18" cy="64" r="4" fill="#111" />
          <circle cx="46" cy="64" r="4" fill="#111" />
          <circle cx="18" cy="64" r="1.5" fill="#00f3ff" />
          <circle cx="46" cy="64" r="1.5" fill="#ff007f" />
          <path d="M24 28h16l4 18H22z" fill="#7c3aed" />
          <rect x="26" y="46" width="5" height="14" fill="#1e1b4b" />
          <rect x="35" y="46" width="5" height="14" fill="#1e1b4b" />
          <circle cx="32" cy="18" r="8" fill="#f5d0fe" />
          <path d="M24 16c4-10 16-10 20 0" fill="#ff007f" />
          <rect x="24" y="16" width="16" height="3" fill="#00f3ff" />
          <ellipse cx="29" cy="19" rx="1.2" ry="1.6" fill="#111" />
          <ellipse cx="35" cy="19" rx="1.2" ry="1.6" fill="#111" />
        </svg>
      </motion.button>
    </div>
  );
}
