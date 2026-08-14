import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { CartProvider } from "./context/CartContext";

import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/global.css";

if (localStorage.getItem("mineiro-theme") === "light") {
  document.body.classList.add("theme-light");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CartProvider>
      <App />
    </CartProvider>

  </StrictMode>,
);
