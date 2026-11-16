import { useEffect, useState } from "react";

export function useDesktopGL() {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const wide = window.matchMedia("(min-width: 900px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = Boolean(
      (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData,
    );
    let gl = false;
    try {
      const c = document.createElement("canvas");
      gl = Boolean(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      gl = false;
    }
    setOk(fine && wide && !reduce && !saveData && gl);
  }, []);

  return ok;
}
