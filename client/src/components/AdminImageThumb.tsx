import type { CSSProperties } from "react";
import {
  PLATFORM_PLACEHOLDER,
  setPlatformImageFallback,
} from "../utils/platformPlaceholder";

const thumbStyle: CSSProperties = {
  width: 44,
  height: 44,
  objectFit: "contain",
  borderRadius: 6,
  background: "#f1f5f9",
  border: "1px solid #334155",
  flexShrink: 0,
  display: "block",
};

export default function AdminImageThumb({ src }: { src?: string | null }) {
  const url = src?.trim();
  return (
    <img
      src={url || PLATFORM_PLACEHOLDER}
      alt=""
      width={44}
      height={44}
      style={thumbStyle}
      onError={(event) => setPlatformImageFallback(event.currentTarget)}
    />
  );
}
