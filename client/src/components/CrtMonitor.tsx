import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playCrtBoot } from "../utils/arcadeBeep";

type Props = {
  onPower?: (on: boolean) => void;
  variant?: "overlay" | "inline";
};

export default function CrtMonitor({ onPower, variant = "inline" }: Props) {
  const [on, setOn] = useState(false);

  const powerOn = () => {
    setOn((was) => {
      if (!was) playCrtBoot();
      return true;
    });
    onPower?.(true);
  };

  const powerOff = () => {
    setOn(false);
    onPower?.(false);
  };

  useEffect(() => {
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    const turnOn = window.setTimeout(powerOn, 800);
    const turnOff = window.setTimeout(powerOff, 2600);
    return () => {
      window.clearTimeout(turnOn);
      window.clearTimeout(turnOff);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.button
      type="button"
      className={`crt-tv crt-tv--${variant}${on ? " is-on" : ""}`}
      aria-pressed={on}
      aria-label="რეტრო CRT ტელევიზორი"
      onMouseEnter={powerOn}
      onMouseLeave={powerOff}
      onClick={() => (on ? powerOff() : powerOn())}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
    >
      <span className="crt-antennas" aria-hidden>
        <i />
        <i />
      </span>
      <span className="crt-shell">
        <span className="crt-bezel">
          <span className="crt-glass">
            <span className="crt-scan" />
            <AnimatePresence>
              {on && (
                <motion.span
                  key="sweep"
                  className="crt-sweep"
                  initial={{ scaleY: 0.04, opacity: 1 }}
                  animate={{ scaleY: 1, opacity: [1, 0.35, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.32, 1] }}
                />
              )}
            </AnimatePresence>
            <span className={`crt-boot${on ? " show" : ""}`}>
              <svg viewBox="0 0 120 72" className="crt-logo" aria-hidden>
                <text
                  x="60"
                  y="28"
                  textAnchor="middle"
                  fill="#ffe9a3"
                  fontFamily="Audiowide, sans-serif"
                  fontSize="16"
                >
                  RETRO
                </text>
                <text
                  x="60"
                  y="48"
                  textAnchor="middle"
                  fill="#00f3ff"
                  fontFamily="Audiowide, sans-serif"
                  fontSize="14"
                >
                  BIT
                </text>
              </svg>
              <span className="crt-caption">PRESS START</span>
            </span>
          </span>
        </span>
        <span className="crt-panel">
          <span className="crt-knob" />
          <span className="crt-knob" />
          <span className="crt-led" />
        </span>
      </span>
    </motion.button>
  );
}
