import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CartProvider } from "./context/CartContext";

// 🟢 გლობალურად ვთიშავთ ბრაუზერის სტანდარტულ alert-ფანჯრებს
window.alert = (message?: string) => {
  console.log("Alert suppressed:", message);
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>,
);
