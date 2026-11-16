import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CartProvider } from "./context/CartContext";
import { LanguageProvider } from "./i18n/LanguageContext";

// 🟢 გლობალურად ვთიშავთ ბრაუზერის სტანდარტულ alert-ფანჯრებს
window.alert = (message?: string) => {
  console.log("Alert suppressed:", message);
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LanguageProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </LanguageProvider>
  </React.StrictMode>,
);
