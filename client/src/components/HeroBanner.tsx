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
      className="hero-banner"
      onClick={() => navigate("/category/playstation")}
    >
      <img src={heroBanner.imageUrl} alt={heroBanner.title || "Banner"} />
    </div>
  );
}
