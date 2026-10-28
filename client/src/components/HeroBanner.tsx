import { useNavigate } from "react-router-dom";
import type { IProduct } from "../types";

interface Props {
  heroBanner?: IProduct;
  searchQuery: string;
}

export default function HeroBanner({ heroBanner, searchQuery }: Props) {
  const navigate = useNavigate();

  if (!heroBanner || !heroBanner.imageUrl || searchQuery) return null;

  return (
    <div
      onClick={() => navigate("/category/playstation")}
      style={{
        width: "100%",
        cursor: "pointer",
        overflow: "hidden",
        marginTop: "15px", // მცირე დაშორება ჰედერიდან
      }}
    >
      <img
        src={heroBanner.imageUrl}
        alt={heroBanner.title || "Banner"}
        style={{
          width: "100%",
          maxHeight: "480px",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
}
